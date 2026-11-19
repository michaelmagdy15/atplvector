#!/usr/bin/env python3
"""
ATPLVector High-Speed Vox/Fern Continuous-Camera Reels Engine (1080x1920 @ 30fps).

Key optimizations over v1 prototype:
1. Object Render Cache: renders each physical desk paper/photo only when quantized progress changes (~25x fewer PIL draws).
2. Direct Viewport Affine Composition: computes M_cam @ M_obj and warps each visible object + shadow straight into the
   1080x1920 viewport ROI (eliminating 82 MB 4400x6200 full-world array copies on every frame).
3. Hardware NVENC H.264 Encoding on RTX 4080 (with automatic CPU libx264 fallback).
"""

import asyncio
import json
import math
import os
import subprocess
import time
from pathlib import Path

import cv2
import edge_tts
import numpy as np
from PIL import Image, ImageDraw, ImageFont

VOICE = "en-GB-RyanNeural"
W, H = 1080, 1920
FPS = 30
WORLD_W, WORLD_H = 4400, 6200

OBJ1_POS = (1180.0, 1280.0)
OBJ2_POS = (3080.0, 1880.0)
OBJ3_POS = (1380.0, 4050.0)
OBJ4_POS = (3120.0, 4880.0)


def clamp(x: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, x))


def smoothstep(t: float) -> float:
    t = clamp(t)
    return t * t * (3.0 - 2.0 * t)


def smootherstep(t: float) -> float:
    t = clamp(t)
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)


def ease_out_cubic(t: float) -> float:
    t = clamp(t)
    return 1.0 - (1.0 - t) ** 3


def ease_out_back(t: float) -> float:
    t = clamp(t)
    c1 = 1.70158
    c3 = c1 + 1.0
    return 1.0 + c3 * ((t - 1.0) ** 3) + c1 * ((t - 1.0) ** 2)


_FONT_CACHE: dict[tuple[int, bool, bool], ImageFont.FreeTypeFont] = {}


def get_font(size: int, bold: bool = False, mono: bool = False):
    key = (size, bold, mono)
    if key in _FONT_CACHE:
        return _FONT_CACHE[key]
    if mono:
        cands = [r"C:\Windows\Fonts\consolab.ttf" if bold else r"C:\Windows\Fonts\consola.ttf"]
    else:
        cands = [
            r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
            r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        ]
    font = ImageFont.load_default()
    for p in cands:
        if os.path.exists(p):
            font = ImageFont.truetype(p, size)
            break
    _FONT_CACHE[key] = font
    return font


def draw_centered_text(draw: ImageDraw.ImageDraw, cx: float, y: float, text: str, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text((cx - tw / 2.0, y), text, font=font, fill=fill)


def draw_pill_text(
    draw: ImageDraw.ImageDraw,
    x: float,
    y: float,
    text: str,
    font,
    text_fill,
    bg_fill=(244, 242, 236, 235),
    pad_x: int = 18,
    pad_y: int = 8,
    centered: bool = False,
):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (x - tw / 2.0) if centered else x
    rx0 = tx - pad_x
    ry0 = y + bbox[1] - pad_y
    rx1 = tx + tw + pad_x
    ry1 = y + bbox[1] + th + pad_y
    draw.rounded_rectangle([rx0, ry0, rx1, ry1], radius=14, fill=bg_fill)
    draw.text((tx, y), text, font=font, fill=text_fill)


def get_audio_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        text=True,
    ).strip()
    return float(out)


async def build_word_synced_audio(spec: dict, work_dir: Path) -> dict:
    meta_path = work_dir / "timing.json"
    wav_path = work_dir / "narration.wav"
    if meta_path.exists() and wav_path.exists():
        return json.loads(meta_path.read_text(encoding="utf-8"))

    pause_s = 0.36
    lead_in_s = 0.30
    tail_s = 1.25

    def make_silence(dur: float, name: str) -> Path:
        p = work_dir / name
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-f",
                "lavfi",
                "-i",
                "anullsrc=r=48000:cl=mono",
                "-t",
                f"{dur:.3f}",
                "-c:a",
                "pcm_s16le",
                str(p),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return p

    seg_wavs = [make_silence(lead_in_s, "sil_lead.wav")]
    beat_timings = []
    cur_t = lead_in_s

    for b in spec["beats"]:
        mp3_p = work_dir / f"beat_{b['id']}.mp3"
        wav_p = work_dir / f"beat_{b['id']}.wav"
        comm = edge_tts.Communicate(b["text"], VOICE, rate="+3%", boundary="WordBoundary")
        words = []
        with open(mp3_p, "wb") as f:
            async for chunk in comm.stream():
                if chunk["type"] == "audio":
                    f.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    words.append(
                        {
                            "word": chunk["text"],
                            "start": chunk["offset"] / 1e7,
                            "dur": chunk["duration"] / 1e7,
                        }
                    )
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(mp3_p), "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", str(wav_p)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        dur = get_audio_duration(wav_p)

        def find_word_time(target: str | None, fallback_frac: float = 0.45) -> float:
            if not target:
                return cur_t + dur * fallback_frac
            tl = target.lower()
            for w in words:
                if tl in w["word"].lower():
                    return cur_t + w["start"]
            return cur_t + dur * fallback_frac

        info = {
            "id": b["id"],
            "text": b["text"],
            "start": round(cur_t, 3),
            "end": round(cur_t + dur, 3),
            "dur": round(dur, 3),
            "cue1": round(find_word_time(b.get("cue_word"), 0.45), 3),
            "cue2": round(find_word_time(b.get("cue_word_2"), 0.72), 3) if b.get("cue_word_2") else None,
            "cue3": round(find_word_time(b.get("cue_word_3"), 0.85), 3) if b.get("cue_word_3") else None,
        }
        beat_timings.append(info)
        seg_wavs.append(wav_p)
        cur_t += dur
        if b["id"] < len(spec["beats"]):
            seg_wavs.append(make_silence(pause_s, f"sil_{b['id']}.wav"))
            cur_t += pause_s

    seg_wavs.append(make_silence(tail_s, "sil_tail.wav"))
    total_dur = cur_t + tail_s

    concat_list = work_dir / "audio_concat.txt"
    concat_list.write_text("\n".join(f"file '{p.as_posix()}'" for p in seg_wavs), encoding="utf-8")
    subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list), "-c:a", "pcm_s16le", str(wav_path)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    meta = {"total_duration": round(total_dur, 3), "beats": beat_timings}
    meta_path.write_text(json.dumps(meta, indent=2), encoding="utf-8")
    return meta


# ═══════════════════════════════════════════════════════════════════════════
# DESK SURFACE & PRECOMPUTED OVERLAYS
# ═══════════════════════════════════════════════════════════════════════════

_BASE_DESK_CACHE: np.ndarray | None = None


def build_desk_surface() -> np.ndarray:
    global _BASE_DESK_CACHE
    if _BASE_DESK_CACHE is not None:
        return _BASE_DESK_CACHE

    rng = np.random.default_rng(42)
    sw, sh = WORLD_W // 4, WORLD_H // 4
    yy, xx = np.mgrid[0:sh, 0:sw].astype(np.float32)
    dist = np.hypot((xx - sw * 0.42) / (sw * 0.75), (yy - sh * 0.35) / (sh * 0.75))
    light = np.clip(1.0 - 0.55 * (dist ** 1.4), 0.32, 1.0)

    b = (26.0 * light + rng.normal(0, 1.8, (sh, sw))).clip(0, 255)
    g = (20.0 * light + rng.normal(0, 1.6, (sh, sw))).clip(0, 255)
    r = (16.0 * light + rng.normal(0, 1.5, (sh, sw))).clip(0, 255)
    small = np.stack([b, g, r], axis=-1).astype(np.uint8)
    desk = cv2.resize(small, (WORLD_W, WORLD_H), interpolation=cv2.INTER_CUBIC)

    for x in range(0, WORLD_W, 120):
        col = (38, 32, 26) if x % 600 == 0 else (26, 22, 18)
        thick = 2 if x % 600 == 0 else 1
        cv2.line(desk, (x, 0), (x, WORLD_H), col, thick)
    for y in range(0, WORLD_H, 120):
        col = (38, 32, 26) if y % 600 == 0 else (26, 22, 18)
        thick = 2 if y % 600 == 0 else 1
        cv2.line(desk, (0, y), (WORLD_W, y), col, thick)

    _BASE_DESK_CACHE = desk
    return desk


def _make_vignette_u8() -> np.ndarray:
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    nx = (xx - W / 2.0) / (W * 0.56)
    ny = (yy - H / 2.0) / (H * 0.56)
    r2 = nx * nx + ny * ny
    vig = (np.clip(1.0 - 0.35 * (r2 ** 1.35), 0.54, 1.0) * 255.0).clip(0, 255).astype(np.uint8)
    return np.repeat(vig[:, :, None], 3, axis=2)


VIGNETTE_U8 = _make_vignette_u8()
_GRAIN_BANK_U8: list[tuple[np.ndarray, np.ndarray]] = []


def _get_grain_pair(idx: int) -> tuple[np.ndarray, np.ndarray]:
    if not _GRAIN_BANK_U8:
        rng = np.random.default_rng(777)
        for _ in range(24):
            g_small = rng.normal(0.0, 2.6, (H // 2, W // 2)).astype(np.float32)
            pos_s = np.clip(g_small, 0.0, 12.0).astype(np.uint8)
            neg_s = np.clip(-g_small, 0.0, 12.0).astype(np.uint8)
            pos = cv2.cvtColor(cv2.resize(pos_s, (W, H), interpolation=cv2.INTER_LINEAR), cv2.COLOR_GRAY2BGR)
            neg = cv2.cvtColor(cv2.resize(neg_s, (W, H), interpolation=cv2.INTER_LINEAR), cv2.COLOR_GRAY2BGR)
            _GRAIN_BANK_U8.append((pos, neg))
    return _GRAIN_BANK_U8[idx % len(_GRAIN_BANK_U8)]


# ═══════════════════════════════════════════════════════════════════════════
# OBJECT 1: PHYSICAL AVIATION PHOTO PRINT (1180 x 1420)
# ═══════════════════════════════════════════════════════════════════════════

def render_photo_print(photo_spec: dict, stamp_prog: float) -> Image.Image:
    pw, ph = 1180, 1420
    img = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=14, fill=(238, 235, 228, 255))

    pad, bot_pad = 54, 195
    iw, ih = pw - 2 * pad, ph - pad - bot_pad
    y_norm = np.linspace(0, 1, ih)[:, None]
    theme = photo_spec.get("theme", "stratosphere_wing")

    p_arr = np.zeros((ih, iw, 4), dtype=np.uint8)
    if theme in ("runway_perspective", "approach_glide"):
        # Twilight dusk warm horizon gradient
        r = (14 + 95 * np.exp(-((y_norm - 0.48) / 0.14) ** 2) + 18 * y_norm).clip(0, 255)
        g = (18 + 75 * np.exp(-((y_norm - 0.48) / 0.16) ** 2) + 22 * y_norm).clip(0, 255)
        b = (38 + 85 * np.exp(-((y_norm - 0.46) / 0.22) ** 2) + 35 * (1 - y_norm)).clip(0, 255)
        below = y_norm > 0.50
        r = np.where(below, 20, r)
        g = np.where(below, 24, g)
        b = np.where(below, 30, b)
    else:
        # High-altitude stratosphere gradient
        r = (6 + 38 * (y_norm ** 2.1) + 115 * np.exp(-((y_norm - 0.72) / 0.08) ** 2)).clip(0, 255)
        g = (12 + 88 * (y_norm ** 1.8) + 140 * np.exp(-((y_norm - 0.72) / 0.09) ** 2)).clip(0, 255)
        b = (28 + 145 * (y_norm ** 1.3) + 125 * np.exp(-((y_norm - 0.72) / 0.11) ** 2)).clip(0, 255)
        below = y_norm > 0.73
        r = np.where(below, 18 + 30 * np.exp(-((y_norm - 0.73) / 0.09) ** 2), r)
        g = np.where(below, 26 + 44 * np.exp(-((y_norm - 0.73) / 0.09) ** 2), g)
        b = np.where(below, 42 + 62 * np.exp(-((y_norm - 0.73) / 0.09) ** 2), b)

    p_arr[:, :, 0] = r.astype(np.uint8)
    p_arr[:, :, 1] = g.astype(np.uint8)
    p_arr[:, :, 2] = b.astype(np.uint8)
    p_arr[:, :, 3] = 255
    photo = Image.fromarray(p_arr, "RGBA")
    pdraw = ImageDraw.Draw(photo)

    if theme in ("runway_perspective", "approach_glide"):
        hy = int(ih * 0.50)
        # Paved runway trapezoid converging to horizon
        rwy_poly = [(iw // 2 - 42, hy), (iw // 2 + 42, hy), (iw - 60, ih), (60, ih)]
        pdraw.polygon(rwy_poly, fill=(36, 40, 48, 255))
        # White centerline dashes
        for step in range(9):
            f0 = step / 9.0
            f1 = (step + 0.52) / 9.0
            yy0 = hy + int((ih - hy) * (f0 ** 1.6))
            yy1 = hy + int((ih - hy) * (f1 ** 1.6))
            ww = max(3, int(3 + 14 * f0))
            pdraw.line([(iw // 2, yy0), (iw // 2, yy1)], fill=(245, 248, 252, 235), width=ww)
        # Runway edge amber/white glow lights
        for step in range(10):
            f0 = (step + 0.4) / 10.0
            yy = hy + int((ih - hy) * (f0 ** 1.6))
            spread = 42 + (iw // 2 - 60 - 42) * (f0 ** 1.6)
            rad = max(3, int(3 + 6 * f0))
            pdraw.ellipse([iw // 2 - spread - rad, yy - rad, iw // 2 - spread + rad, yy + rad], fill=(253, 224, 71, 240))
            pdraw.ellipse([iw // 2 + spread - rad, yy - rad, iw // 2 + spread + rad, yy + rad], fill=(253, 224, 71, 240))
        if theme == "approach_glide":
            # 4 crisp PAPI lights on left of threshold: 2 white, 2 red (on-glideslope)
            for pi in range(4):
                px = int(iw * 0.14) + pi * 36
                py = hy + int(ih * 0.24)
                col = (248, 250, 252, 255) if pi < 2 else (244, 63, 94, 255)
                pdraw.ellipse([px - 11, py - 11, px + 11, py + 11], fill=col)
    elif theme == "climb_horizon":
        pdraw.arc([-400, int(ih * 0.65), iw + 400, int(ih * 1.40)], start=195, end=345, fill=(165, 228, 255, 190), width=6)
        # Clean synthetic PFD pitch ladder at +15 deg climb attitude
        cx_p, cy_p = iw // 2, int(ih * 0.44)
        for deg_off, lbl in [(-140, "20"), (-70, "10"), (0, "")]:
            yy = cy_p + deg_off
            pdraw.line([(cx_p - 120, yy), (cx_p - 40, yy)], fill=(56, 189, 248, 220), width=6)
            pdraw.line([(cx_p + 40, yy), (cx_p + 120, yy)], fill=(56, 189, 248, 220), width=6)
            pdraw.line([(cx_p - 40, yy), (cx_p - 40, yy + 18)], fill=(56, 189, 248, 220), width=5)
            pdraw.line([(cx_p + 40, yy), (cx_p + 40, yy + 18)], fill=(56, 189, 248, 220), width=5)
        # Aircraft nose delta symbol
        pdraw.line([(cx_p - 90, cy_p + 20), (cx_p - 26, cy_p + 20), (cx_p, cy_p - 8), (cx_p + 26, cy_p + 20), (cx_p + 90, cy_p + 20)],
                   fill=(251, 191, 36, 255), width=8)
    else:
        # Stratosphere wing & horizon (supports stratosphere_wing, wing_vortex, cockpit_cruise)
        pdraw.arc([-400, int(ih * 0.69), iw + 400, int(ih * 1.45)], start=195, end=345, fill=(165, 228, 255, 190), width=6)
        wing_pts = [
            (0, int(ih * 0.94)),
            (int(iw * 0.76), int(ih * 0.61)),
            (int(iw * 0.84), int(ih * 0.45)),
            (int(iw * 0.87), int(ih * 0.46)),
            (int(iw * 0.80), int(ih * 0.65)),
            (0, int(ih * 1.00)),
        ]
        pdraw.polygon(wing_pts, fill=(212, 222, 232, 255))
        pdraw.line([(0, int(ih * 0.94)), (int(iw * 0.76), int(ih * 0.61)), (int(iw * 0.84), int(ih * 0.45))],
                   fill=(255, 255, 255, 240), width=5)
        if theme == "wing_vortex":
            # Crisp spiral wingtip contrail vortex
            vpts = [
                (int(iw * 0.85) + i * 8, int(ih * 0.45) + int(math.sin(i * 0.9) * (6 + i * 1.3)))
                for i in range(22)
            ]
            pdraw.line(vpts, fill=(186, 230, 253, 190), width=6, joint="curve")
        else:
            pdraw.line([(int(iw * 0.86), int(ih * 0.47)), (iw, int(ih * 0.44))], fill=(255, 255, 255, 110), width=9)

    img.paste(photo, (pad, pad))
    draw.rectangle([pad, pad, pad + iw, pad + ih], outline=(190, 186, 178, 255), width=2)

    # Stamp / title in thick white lower polaroid margin
    if stamp_prog > 0.01:
        a = int(255 * smoothstep(stamp_prog))
        label = photo_spec.get("stamp", "EASA ATPL")
        fsize = 118 if len(label) <= 6 else 92 if len(label) <= 9 else 72
        f_hero = get_font(fsize, bold=True, mono=True)
        draw.text((pad + 10, pad + ih + 30), label, font=f_hero, fill=(16, 24, 39, a))

    return img


# ═══════════════════════════════════════════════════════════════════════════
# OBJECT 2: FLIGHT TEST CHART SHEET (1320 x 1580)
# ═══════════════════════════════════════════════════════════════════════════

def render_chart_sheet(chart_spec: dict, left_p: float, right_p: float, apex_p: float) -> Image.Image:
    sw, sh = 1320, 1580
    img = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([0, 0, sw - 1, sh - 1], radius=18, fill=(244, 242, 236, 255))
    draw.line([(72, 118), (sw - 72, 118)], fill=(200, 196, 188, 255), width=3)

    f_hdr = get_font(38, bold=True, mono=True)
    draw.text((72, 58), chart_spec.get("header", "PERFORMANCE CHART"), font=f_hdr, fill=(95, 104, 118, 255))

    x0, y0 = 155, 220
    x1, y1 = sw - 90, sh - 210
    pw, ph = x1 - x0, y1 - y0

    for i in range(1, 5):
        gx = x0 + int(pw * i / 5)
        draw.line([(gx, y0), (gx, y1)], fill=(224, 221, 214, 255), width=2)
    for j in range(1, 6):
        gy = y0 + int(ph * j / 6)
        draw.line([(x0, gy), (x1, gy)], fill=(224, 221, 214, 255), width=2)

    draw.line([(x0, y1), (x1, y1)], fill=(40, 48, 62, 255), width=6)
    draw.line([(x0, y0), (x0, y1)], fill=(40, 48, 62, 255), width=6)

    f_axis = get_font(38, bold=True)
    draw_centered_text(draw, x0 + pw / 2.0, y1 + 42, chart_spec.get("x_label", "SPEED"), f_axis, (72, 82, 98, 255))
    draw.text((x0 - 84, y0 - 62), chart_spec.get("y_label", "ALT"), font=f_axis, fill=(72, 82, 98, 255))

    ctype = chart_spec.get("type", "envelope_converge")
    n_pts = 140
    us = np.linspace(0.0, 1.0, n_pts)

    red = (220, 38, 68, 255)
    blue = (2, 132, 199, 255)
    amber = (217, 119, 6, 255)
    slate_d = (30, 41, 59, 255)

    def circle_apex(ax_x: float, ax_y: float, rad_x: float = 92, rad_y: float = 82):
        if apex_p <= 0.01:
            return
        cp = smoothstep(apex_p)
        steps = max(2, int(cp * 72))
        ring_pts = []
        for i in range(steps):
            ang = -math.pi * 0.7 + (i / 64.0) * (2.15 * math.pi)
            wob = 1.0 + 0.05 * math.sin(ang * 3.0)
            ring_pts.append((ax_x + math.cos(ang) * rad_x * wob, ax_y + math.sin(ang) * rad_y * wob))
        if len(ring_pts) >= 2:
            draw.line(ring_pts, fill=amber, width=14, joint="curve")
        r_dot = int(18 * ease_out_back(clamp(apex_p * 1.5)))
        draw.ellipse([ax_x - r_dot, ax_y - r_dot, ax_x + r_dot, ax_y + r_dot], fill=amber)

    if ctype == "envelope_converge":
        ax_x, ax_y = x0 + pw * 0.48, y0 + ph * 0.16
        c1_pts = [(x0 + pw * 0.11 + (ax_x - (x0 + pw * 0.11)) * (u ** 1.65), y1 - u * (y1 - ax_y)) for u in us]
        c2_pts = [(x0 + pw * 0.90 - ((x0 + pw * 0.90) - ax_x) * (u ** 1.45), y1 - u * (y1 - ax_y)) for u in us]
        if left_p > 0.01:
            draw.line(c1_pts[:max(2, int(smoothstep(left_p) * n_pts))], fill=red, width=16, joint="curve")
            la = int(255 * smoothstep(clamp((left_p - 0.25) / 0.45)))
            if la > 5:
                draw.text((x0 + 48, y0 + int(ph * 0.50)), chart_spec.get("left_label", "Vs"), font=get_font(124, bold=True), fill=(220, 38, 68, la))
        if right_p > 0.01:
            draw.line(c2_pts[:max(2, int(smoothstep(right_p) * n_pts))], fill=blue, width=16, joint="curve")
            la = int(255 * smoothstep(clamp((right_p - 0.25) / 0.45)))
            if la > 5:
                draw.text((x0 + int(pw * 0.62), y0 + int(ph * 0.52)), chart_spec.get("right_label", "MMO"), font=get_font(110, bold=True), fill=(2, 132, 199, la))
        circle_apex(ax_x, ax_y)
        if apex_p > 0.01:
            la = int(255 * smoothstep(clamp((apex_p - 0.2) / 0.45)))
            if la > 5:
                for li, line in enumerate(chart_spec.get("apex_lines", ["COFFIN", "CORNER"])):
                    draw_centered_text(draw, ax_x, ax_y + 280 + li * 92, line, get_font(86, bold=True), (180, 83, 9, la))

    elif ctype in ("balanced_field", "drag_curve"):
        # Crossing X curves: C1 rises left->right (ASDR / Parasite), C2 falls left->right (TODR / Induced)
        ix, iy = x0 + pw * 0.50, y0 + ph * 0.48
        c1_pts = [((x0 + pw * 0.08) + u * (pw * 0.84), (y1 - ph * 0.14) - (u ** 1.45) * (ph * 0.68)) for u in us]
        c2_pts = [((x0 + pw * 0.08) + u * (pw * 0.84), (y0 + ph * 0.16) + (u ** 1.35) * (ph * 0.68)) for u in us]
        # Dashed total curve at top for drag_curve
        if ctype == "drag_curve" and (left_p > 0.2 and right_p > 0.2):
            tot_pts = []
            for p1, p2 in zip(c1_pts, c2_pts):
                # Combined bowl above intersection
                v_sum = ((p1[1] - y0) + (p2[1] - y0)) * 0.42
                tot_pts.append((p1[0], y0 + ph * 0.08 + abs(p1[0] - ix) * 0.28))
            draw.line(tot_pts, fill=(100, 116, 139, 170), width=10, joint="curve")

        if left_p > 0.01:
            # First spoken line (e.g. ASDR rising or INDUCED falling)
            pts = c2_pts if ctype == "drag_curve" else c1_pts
            draw.line(pts[:max(2, int(smoothstep(left_p) * n_pts))], fill=red, width=16, joint="curve")
            la = int(255 * smoothstep(clamp((left_p - 0.25) / 0.45)))
            if la > 5:
                lx = x0 + 34 if ctype == "drag_curve" else x0 + 48
                ly = y0 + int(ph * 0.04) if ctype == "drag_curve" else y1 - 145
                f_sz = 76 if ctype == "drag_curve" else 90
                draw_pill_text(
                    draw, lx, ly, chart_spec.get("left_label", "ASDR"),
                    get_font(f_sz, bold=True), (220, 38, 68, la),
                    bg_fill=(244, 242, 236, int(la * 0.92)),
                )
        if right_p > 0.01:
            pts = c1_pts if ctype == "drag_curve" else c2_pts
            draw.line(pts[:max(2, int(smoothstep(right_p) * n_pts))], fill=blue, width=16, joint="curve")
            la = int(255 * smoothstep(clamp((right_p - 0.25) / 0.45)))
            if la > 5:
                rx = x0 + int(pw * 0.59) if ctype == "drag_curve" else x0 + 52
                ry = y0 + int(ph * 0.04)
                f_sz = 76 if ctype == "drag_curve" else 90
                draw_pill_text(
                    draw, rx, ry, chart_spec.get("right_label", "TODR"),
                    get_font(f_sz, bold=True), (2, 132, 199, la),
                    bg_fill=(244, 242, 236, int(la * 0.92)),
                )

        # Sample exact crossing from c1_pts and c2_pts
        best_i = min(range(n_pts), key=lambda k: abs(c1_pts[k][1] - c2_pts[k][1]))
        cx_i, cy_i = c1_pts[best_i]
        circle_apex(cx_i, cy_i, 86, 86)
        if apex_p > 0.01:
            la = int(255 * smoothstep(clamp((apex_p - 0.2) / 0.45)))
            if la > 5:
                for dy in range(int(cy_i + 30), int(cy_i + 115), 28):
                    draw.line([(cx_i, dy), (cx_i, min(int(cy_i + 115), dy + 14))], fill=(180, 83, 9, la), width=8)
                for li, line in enumerate(chart_spec.get("apex_lines", ["BALANCED", "V1"])):
                    draw_pill_text(
                        draw, cx_i, cy_i + 140 + li * 92, line,
                        get_font(80, bold=True), (180, 83, 9, la),
                        bg_fill=(244, 242, 236, int(la * 0.94)),
                        centered=True,
                    )

    elif ctype == "climb_gradient":
        # Smooth bell-shaped Thrust Available (blue) vs U-shaped Thrust Required (red)
        ta_pts = [((x0 + pw * 0.08) + u * (pw * 0.84), y0 + ph * 0.22 + 0.18 * ph * (u ** 1.3)) for u in us]
        tr_pts = [((x0 + pw * 0.08) + u * (pw * 0.84), y1 - ph * 0.44 + 0.36 * ph * ((u - 0.36) * 2.1) ** 2) for u in us]
        if left_p > 0.01:
            draw.line(ta_pts[:max(2, int(smoothstep(left_p) * n_pts))], fill=blue, width=16, joint="curve")
            la = int(255 * smoothstep(clamp((left_p - 0.2) / 0.4)))
            if la > 5:
                draw.text((x0 + 55, y0 + int(ph * 0.11)), chart_spec.get("left_label", "THRUST AVAIL"), font=get_font(76, bold=True), fill=(2, 132, 199, la))
        if right_p > 0.01:
            draw.line(tr_pts[:max(2, int(smoothstep(right_p) * n_pts))], fill=red, width=16, joint="curve")
            la = int(255 * smoothstep(clamp((right_p - 0.2) / 0.4)))
            if la > 5:
                draw_pill_text(
                    draw, x0 + int(pw * 0.40), y1 - 170, chart_spec.get("right_label", "THRUST REQ"),
                    get_font(74, bold=True), (220, 38, 68, la),
                    bg_fill=(244, 242, 236, int(la * 0.92)),
                )
        # Vertical gap bar at max excess thrust (u ~ 0.36)
        k_vx = int(0.36 * (n_pts - 1))
        gx, gy_top = ta_pts[k_vx]
        _, gy_bot = tr_pts[k_vx]
        if apex_p > 0.01:
            draw.line([(gx, gy_top + 12), (gx, gy_bot - 12)], fill=amber, width=14)
        circle_apex(gx, (gy_top + gy_bot) * 0.5, 90, 120)
        if apex_p > 0.01:
            la = int(255 * smoothstep(clamp((apex_p - 0.2) / 0.45)))
            if la > 5:
                for li, line in enumerate(chart_spec.get("apex_lines", ["VX = MAX", "ANGLE"])):
                    draw_pill_text(
                        draw, gx + 235, y0 + int(ph * 0.34) + li * 86, line,
                        get_font(68, bold=True), (180, 83, 9, la),
                        bg_fill=(244, 242, 236, int(la * 0.94)),
                        centered=True,
                    )

    elif ctype == "sar_range":
        # Inverted-U Specific Air Range curve peaking at MRC, plus 99% LRC marker slightly right
        sar_pts = [((x0 + pw * 0.08) + u * (pw * 0.84), y1 - ph * 0.72 + ph * 0.62 * ((u - 0.44) * 1.85) ** 2) for u in us]
        mrc_x, mrc_y = sar_pts[int(0.44 * (n_pts - 1))]
        lrc_x, lrc_y = sar_pts[int(0.60 * (n_pts - 1))]
        if left_p > 0.01:
            draw.line(sar_pts[:max(2, int(smoothstep(left_p) * n_pts))], fill=blue, width=16, joint="curve")
            la = int(255 * smoothstep(clamp((left_p - 0.2) / 0.4)))
            if la > 5:
                draw_pill_text(draw, mrc_x, mrc_y - 125, chart_spec.get("left_label", "MRC"), get_font(92, bold=True), (2, 132, 199, la), bg_fill=(244, 242, 236, int(la * 0.92)), centered=True)
        if right_p > 0.01:
            la = int(255 * smoothstep(right_p))
            for dy in range(int(lrc_y), y1, 28):
                draw.line([(lrc_x, dy), (lrc_x, min(y1, dy + 14))], fill=(220, 38, 68, la), width=8)
            draw_pill_text(draw, lrc_x + 88, lrc_y - 36, chart_spec.get("right_label", "LRC"), get_font(90, bold=True), (220, 38, 68, la), bg_fill=(244, 242, 236, int(la * 0.92)))
        circle_apex(lrc_x, lrc_y, 82, 82)
        if apex_p > 0.01:
            la = int(255 * smoothstep(clamp((apex_p - 0.2) / 0.45)))
            if la > 5:
                for li, line in enumerate(chart_spec.get("apex_lines", ["99% SAR", "+4% SPD"])):
                    draw_centered_text(draw, x0 + pw * 0.5, y1 - 240 + li * 86, line, get_font(82, bold=True), (180, 83, 9, la))

    elif ctype == "density_curve":
        # Rho dropping with altitude (red) & TAS/IAS gap diverging upward (blue)
        rho_pts = [((x0 + pw * 0.12) + u * (pw * 0.72), y0 + ph * 0.16 + (u ** 1.35) * ph * 0.68) for u in us]
        tas_pts = [((x0 + pw * 0.12) + u * (pw * 0.76), y1 - ph * 0.18 - (u ** 1.3) * ph * 0.65) for u in us]
        if left_p > 0.01:
            draw.line(rho_pts[:max(2, int(smoothstep(left_p) * n_pts))], fill=red, width=16, joint="curve")
            la = int(255 * smoothstep(clamp((left_p - 0.25) / 0.45)))
            if la > 5:
                draw.text((x0 + 60, y0 + int(ph * 0.12)), chart_spec.get("left_label", "DENSITY"), font=get_font(88, bold=True), fill=(220, 38, 68, la))
        if right_p > 0.01:
            draw.line(tas_pts[:max(2, int(smoothstep(right_p) * n_pts))], fill=blue, width=16, joint="curve")
            la = int(255 * smoothstep(clamp((right_p - 0.25) / 0.45)))
            if la > 5:
                draw.text((x0 + int(pw * 0.52), y0 + int(ph * 0.14)), chart_spec.get("right_label", "TAS"), font=get_font(104, bold=True), fill=(2, 132, 199, la))
        ax_x, ax_y = tas_pts[int(0.84 * (n_pts - 1))]
        circle_apex(ax_x, ax_y, 88, 88)
        if apex_p > 0.01:
            la = int(255 * smoothstep(clamp((apex_p - 0.2) / 0.45)))
            if la > 5:
                for li, line in enumerate(chart_spec.get("apex_lines", ["TAS > IAS", "+2%/1000FT"])):
                    draw_centered_text(draw, x0 + pw * 0.48, y1 - 240 + li * 86, line, get_font(78, bold=True), (180, 83, 9, la))

    elif ctype == "lift_cl_alpha":
        # Lift Curve Slope (CL vs AoA) rising linearly then dropping sharply past critical AoA (~0.72)
        cl_pts = []
        for u in us:
            px = x0 + pw * 0.08 + u * pw * 0.84
            if u <= 0.72:
                val = (u / 0.72) * 0.82
            else:
                val = 0.82 - 1.4 * ((u - 0.72) ** 1.35)
            py = y1 - ph * 0.10 - val * ph * 0.82
            cl_pts.append((px, py))
        crit_x, crit_y = cl_pts[int(0.72 * (n_pts - 1))]
        if left_p > 0.01:
            draw.line(cl_pts[:max(2, int(smoothstep(left_p) * n_pts))], fill=blue, width=16, joint="curve")
            la = int(255 * smoothstep(clamp((left_p - 0.2) / 0.4)))
            if la > 5:
                draw.text((x0 + 50, y0 + int(ph * 0.34)), chart_spec.get("left_label", "CL MAX"), font=get_font(90, bold=True), fill=(2, 132, 199, la))
        if right_p > 0.01:
            la = int(255 * smoothstep(right_p))
            for dy in range(int(crit_y), y1, 28):
                draw.line([(crit_x, dy), (crit_x, min(y1, dy + 14))], fill=(220, 38, 68, la), width=8)
            draw.text((crit_x - 240, y1 - 150), chart_spec.get("right_label", "16° CRIT"), font=get_font(82, bold=True), fill=(220, 38, 68, la))
        circle_apex(crit_x, crit_y, 88, 88)
        if apex_p > 0.01:
            la = int(255 * smoothstep(clamp((apex_p - 0.2) / 0.45)))
            if la > 5:
                for li, line in enumerate(chart_spec.get("apex_lines", ["STALL", "VS × √n"])):
                    draw.text((x0 + 60, y0 + 70 + li * 92), line, font=get_font(84, bold=True), fill=(180, 83, 9, la))

    elif ctype in ("landing_factors", "class_b_factors"):
        # Clean chunky horizontal comparison bars
        if ctype == "landing_factors":
            bars = [
                ("DRY ALD", 0.42, (100, 116, 139, 255), left_p),
                ("DRY ÷ 0.60", 0.72, (2, 132, 199, 255), right_p),
                ("WET × 1.15", 0.86, (220, 38, 68, 255), apex_p),
            ]
        else:
            bars = [
                ("ACTUAL", 0.50, (100, 116, 139, 255), left_p),
                ("T/O × 1.25", 0.68, (2, 132, 199, 255), right_p),
                ("LDG × 1.43", 0.84, (220, 38, 68, 255), apex_p),
            ]
        for bi, (lbl, frac, col, bp) in enumerate(bars):
            by = y0 + 130 + bi * 280
            p = smoothstep(bp)
            draw.text((x0 + 30, by), lbl, font=get_font(76, bold=True), fill=slate_d if p > 0.1 else (180, 180, 180, 255))
            if p > 0.02:
                bw_cur = int((pw - 70) * frac * p)
                draw.rounded_rectangle([x0 + 30, by + 94, x0 + 30 + max(24, bw_cur), by + 184], radius=16, fill=col)
        # Circle around final highlighted bar end
        if apex_p > 0.25:
            circle_apex(x0 + 30 + int((pw - 70) * bars[2][1] * 0.7), y0 + 130 + 2 * 280 + 135, 130, 95)

    elif ctype == "class_a_segments":
        # 4 stepped climb segment bars: Seg1, Seg2 (2.4% highlighted), Seg3 (level accel), Final (1.2%)
        segs = [
            ("SEG 1", 0.22, (100, 116, 139, 255), left_p),
            ("SEG 2 · 2.4%", 0.82, (220, 38, 68, 255), right_p),
            ("SEG 3", 0.18, (100, 116, 139, 255), right_p),
            ("FINAL · 1.2%", 0.54, (2, 132, 199, 255), apex_p),
        ]
        bar_w = int((pw - 140) / 4)
        for si, (lbl, hfrac, col, sp) in enumerate(segs):
            bx = x0 + 45 + si * (bar_w + 26)
            p = smoothstep(sp)
            bh_val = max(24, int((ph - 240) * hfrac * p))
            if p > 0.01:
                draw.rounded_rectangle([bx, y1 - bh_val, bx + bar_w, y1], radius=12, fill=col)
            draw_centered_text(draw, bx + bar_w / 2.0, y1 - bh_val - 68, lbl.split("·")[0].strip(), get_font(44, bold=True), slate_d)
        # Highlight Seg 2 peak
        s2_x = x0 + 45 + (bar_w + 26) + bar_w / 2.0
        s2_y = y1 - int((ph - 240) * 0.82)
        circle_apex(s2_x, s2_y + 40, 105, 95)
        if apex_p > 0.01:
            la = int(255 * smoothstep(clamp((apex_p - 0.2) / 0.45)))
            if la > 5:
                for li, line in enumerate(chart_spec.get("apex_lines", ["2.4% MIN", "TWIN OEI"])):
                    draw.text((x0 + 60, y0 + 60 + li * 86), line, font=get_font(78, bold=True), fill=(180, 83, 9, la))

    return img


# ═══════════════════════════════════════════════════════════════════════════
# OBJECT 3: TECHNICAL NAVY BLUEPRINT (1380 x 1180)
# ═══════════════════════════════════════════════════════════════════════════

def render_blueprint(bp_spec: dict, p1: float, p2: float, p3: float) -> Image.Image:
    bw, bh = 1380, 1180
    img = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([0, 0, bw - 1, bh - 1], radius=16, fill=(14, 32, 62, 255))
    draw.rounded_rectangle([24, 24, bw - 25, bh - 25], radius=10, outline=(72, 122, 186, 180), width=3)
    for x in range(100, bw - 60, 110):
        draw.line([(x, 40), (x, bh - 40)], fill=(24, 52, 92, 170), width=1)
    for y in range(100, bh - 60, 110):
        draw.line([(40, y), (bw - 40, y)], fill=(24, 52, 92, 170), width=1)

    btype = bp_spec.get("type", "airfoil_shockwave")
    l1 = bp_spec.get("label_1", "CONCEPT")
    l2 = bp_spec.get("label_2", "SHIFT")
    lhero = bp_spec.get("label_hero", "KEY RULE")

    ax0, ax1 = 150, bw - 150
    ay = bh // 2 + 40
    chord = ax1 - ax0

    if btype == "airfoil_shockwave":
        xs = np.linspace(0.0, 1.0, 160)
        up = [(ax0 + s * chord, ay - 175 * (math.sin(math.pi * (s ** 0.72))) * (1.0 - 0.28 * s)) for s in xs]
        lo = [(ax0 + s * chord, ay - (-42 * math.sin(math.pi * s) + 26 * (s ** 3))) for s in xs]
        draw.polygon(up + list(reversed(lo)), fill=(28, 60, 108, 255))
        draw.line(up, fill=(235, 245, 255, 255), width=10, joint="curve")
        draw.line(lo, fill=(200, 220, 245, 255), width=8, joint="curve")
        cg_x, cg_y = ax0 + int(chord * 0.32), ay + 15
        draw.ellipse([cg_x - 24, cg_y - 24, cg_x + 24, cg_y + 24], fill=(245, 158, 11, 255), outline=(255, 255, 255, 255), width=4)
        draw.text((cg_x - 38, cg_y + 38), "CG", font=get_font(56, bold=True), fill=(251, 191, 36, 255))

        if p1 > 0.01:
            sp = ease_out_cubic(p1)
            sx = ax0 + int(chord * (0.54 + 0.09 * sp))
            sy_bot = ay - 142
            sy_top = int(sy_bot - 260 * sp)
            draw.line([(sx, sy_bot), (sx, sy_top)], fill=(244, 63, 94, 90), width=32)
            draw.line([(sx, sy_bot), (sx, sy_top)], fill=(251, 113, 133, 255), width=14)
            if sp > 0.45:
                wa = int(190 * smoothstep((sp - 0.45) / 0.55))
                for k in range(3):
                    wy = sy_bot - 35 - k * 34
                    wpts = [(sx + 20 + i * 24, wy + math.sin(i * 1.1 + k) * 14) for i in range(13)]
                    draw.line(wpts, fill=(251, 113, 133, wa), width=5, joint="curve")
            sa = int(255 * smoothstep(clamp((p1 - 0.15) / 0.45)))
            draw.text((sx + 24, sy_top - 12), l1, font=get_font(58, bold=True), fill=(253, 164, 175, sa))

        cp_x = ax0 + int(chord * (0.30 + 0.19 * smootherstep(p2)))
        cp_base_y, cp_tip_y = ay - 145, ay - 350
        draw.line([(cp_x, cp_base_y), (cp_x, cp_tip_y)], fill=(56, 189, 248, 255), width=14)
        draw.polygon([(cp_x, cp_tip_y - 34), (cp_x - 26, cp_tip_y + 12), (cp_x + 26, cp_tip_y + 12)], fill=(56, 189, 248, 255))
        if p2 > 0.08:
            ca = int(255 * smoothstep(clamp(p2 * 1.6)))
            draw.text((ax0 + 10, 88), l2, font=get_font(74, bold=True), fill=(125, 211, 252, ca))

        if p3 > 0.01:
            ta = int(255 * smoothstep(p3))
            draw.arc([ax0 - 30, ay - 70, ax0 + 230, ay + 240], start=145, end=215, fill=(52, 211, 153, ta), width=14)
            draw.polygon([(ax0 - 16, ay + 152), (ax0 - 50, ay + 108), (ax0 + 10, ay + 112)], fill=(52, 211, 153, ta))
            draw.text((ax0 + 270, bh - 220), lhero, font=get_font(104, bold=True), fill=(52, 211, 153, ta))

    elif btype == "airfoil_stall":
        # High-AoA airfoil rotated nose-up 18 deg
        xs = np.linspace(0.0, 1.0, 120)
        ang = math.radians(-16)
        ca, sa_r = math.cos(ang), math.sin(ang)
        cx_a, cy_a = bw * 0.48, bh * 0.50

        def rot_pt(sx_n, sy_n):
            lx = (sx_n - 0.5) * 900
            ly = -sy_n * 820
            return (cx_a + lx * ca - ly * sa_r, cy_a + lx * sa_r + ly * ca)

        up = [rot_pt(s, 0.14 * math.sin(math.pi * (s ** 0.7))) for s in xs]
        lo = [rot_pt(s, -0.04 * math.sin(math.pi * s)) for s in xs]
        draw.polygon(up + list(reversed(lo)), fill=(28, 60, 108, 255))
        draw.line(up, fill=(235, 245, 255, 255), width=10, joint="curve")
        draw.line(lo, fill=(200, 220, 245, 255), width=8, joint="curve")

        # Incoming relative airflow horizontal vector from bottom-left
        draw.line([(90, cy_a + 180), (430, cy_a + 180)], fill=(56, 189, 248, 255), width=12)
        draw.polygon([(460, cy_a + 180), (414, cy_a + 156), (414, cy_a + 204)], fill=(56, 189, 248, 255))
        draw.text((100, cy_a + 204), "REL AIRFLOW", font=get_font(54, bold=True), fill=(125, 211, 252, 255))

        if p1 > 0.01:
            sep = ease_out_cubic(p1)
            # Separation burbles advancing forward along upper surface
            for k in range(4):
                bx = cx_a + 120 - sep * 220 + k * 75
                by = cy_a - 110 + k * 24
                r_b = int(34 * sep)
                draw.arc([bx - r_b, by - r_b, bx + r_b, by + r_b], start=20, end=290, fill=(251, 113, 133, 255), width=8)
            draw.text((ax0, 90), l1, font=get_font(68, bold=True), fill=(253, 164, 175, int(255 * smoothstep(p1))))

        if p2 > 0.01:
            draw.text((bw // 2 + 40, 180), l2, font=get_font(74, bold=True), fill=(251, 191, 36, int(255 * smoothstep(p2))))

        if p3 > 0.01:
            ta = int(255 * smoothstep(p3))
            draw_centered_text(draw, bw * 0.5, bh - 210, lhero, get_font(94, bold=True), (52, 211, 153, ta))

    elif btype == "runway_distances":
        ry = bh // 2 - 20
        # Runway paved surface (TORA)
        r_x0, r_x1 = 110, 820
        sw_x1 = 980
        cw_x1 = 1230
        draw.rounded_rectangle([r_x0, ry - 90, r_x1, ry + 90], radius=6, fill=(45, 58, 82, 255), outline=(220, 232, 248, 255), width=5)
        for dx in range(r_x0 + 40, r_x1 - 40, 80):
            draw.line([(dx, ry), (dx + 44, ry)], fill=(255, 255, 255, 235), width=8)
        # Stopway (amber striped block)
        draw.rectangle([r_x1, ry - 80, sw_x1, ry + 80], fill=(92, 58, 18, 255), outline=(245, 158, 11, 255), width=4)
        # Clearway (green dashed area)
        draw.rectangle([r_x1, ry - 110, cw_x1, ry + 110], outline=(52, 211, 153, 220), width=4)

        # Animated distance brackets on cues
        if p1 > 0.01:
            e = r_x0 + int((r_x1 - r_x0) * ease_out_cubic(p1))
            draw.line([(r_x0, ry - 160), (e, ry - 160)], fill=(56, 189, 248, 255), width=12)
            draw.text((r_x0 + 20, ry - 245), "TORA", font=get_font(64, bold=True), fill=(125, 211, 252, int(255 * smoothstep(p1))))
        if p2 > 0.01:
            e_asda = r_x0 + int((sw_x1 - r_x0) * ease_out_cubic(p2))
            draw.line([(r_x0, ry + 155), (e_asda, ry + 155)], fill=(251, 113, 133, 255), width=12)
            draw.text((sw_x1 - 240, ry + 180), l1, font=get_font(64, bold=True), fill=(253, 164, 175, int(255 * smoothstep(p2))))
            e_toda = r_x0 + int((cw_x1 - r_x0) * ease_out_cubic(p2))
            draw.line([(r_x0, ry - 290), (e_toda, ry - 290)], fill=(52, 211, 153, 255), width=12)
            draw.text((cw_x1 - 260, ry - 375), l2, font=get_font(64, bold=True), fill=(52, 211, 153, int(255 * smoothstep(p2))))
        if p3 > 0.01:
            # V1 decision line
            vx = int((r_x0 + r_x1) * 0.48)
            draw.line([(vx, ry - 120), (vx, ry + 120)], fill=(251, 191, 36, 255), width=10)
            draw_centered_text(draw, bw * 0.5, bh - 205, lhero, get_font(94, bold=True), (251, 191, 36, int(255 * smoothstep(p3))))

    elif btype in ("landing_screen", "oei_net_gross", "prop_takeoff"):
        # Runway + Flight Path profile with 50ft/35ft screen
        ground_y = bh - 330
        draw.line([(90, ground_y), (bw - 90, ground_y)], fill=(200, 220, 245, 255), width=10)
        if btype == "landing_screen":
            # 50 ft screen on left descending right to touchdown + rollout
            sx = 220
            draw.line([(sx, ground_y), (sx, ground_y - 250)], fill=(251, 191, 36, 255), width=8)
            draw.text((sx - 60, ground_y - 325), "50 FT", font=get_font(56, bold=True), fill=(251, 191, 36, 255))
            td_x = 590
            end_x = 920
            if p1 > 0.01:
                sp = ease_out_cubic(p1)
                pts = [(110, ground_y - 330), (sx, ground_y - 250), (td_x, ground_y - 10), (end_x, ground_y - 10)]
                draw.line(pts[:4] if sp > 0.5 else pts[:2], fill=(56, 189, 248, 255), width=12, joint="curve")
                draw.text((td_x - 30, ground_y + 45), l1, font=get_font(62, bold=True), fill=(125, 211, 252, int(255 * smoothstep(p1))))
            if p2 > 0.01:
                fac_x = r = 1230
                draw.line([(sx, ground_y + 135), (sx + int((fac_x - sx) * ease_out_cubic(p2)), ground_y + 135)], fill=(251, 113, 133, 255), width=14)
                draw.text((sx + 20, ground_y + 165), l2, font=get_font(62, bold=True), fill=(253, 164, 175, int(255 * smoothstep(p2))))
            if p3 > 0.01:
                draw_centered_text(draw, bw * 0.5, 110, lhero, get_font(90, bold=True), (52, 211, 153, int(255 * smoothstep(p3))))
        else:
            # Takeoff profile rising from left to right over 35ft / 50ft obstacle
            liftoff_x = 460
            obs_x = 1140
            obs_y = ground_y - 210
            # Ground roll + Gross climb path (upper) vs Net climb path (lower, clears obstacle)
            draw.line([(120, ground_y - 8), (liftoff_x, ground_y - 8)], fill=(235, 245, 255, 255), width=12)
            draw.rectangle([obs_x - 18, obs_y, obs_x + 18, ground_y], fill=(244, 63, 94, 255))
            if p1 > 0.01:
                k = ease_out_cubic(p1)
                gx = liftoff_x + (obs_x + 90 - liftoff_x) * k
                gy = ground_y - 8 - 370 * k
                draw.line([(liftoff_x, ground_y - 8), (gx, gy)], fill=(56, 189, 248, 255), width=12)
                draw.text((liftoff_x - 30, ground_y - 425), l1, font=get_font(62, bold=True), fill=(125, 211, 252, int(255 * smoothstep(p1))))
            if p2 > 0.01:
                k = ease_out_cubic(p2)
                nx = liftoff_x + (obs_x + 90 - liftoff_x) * k
                ny = ground_y - 8 - 275 * k
                draw.line([(liftoff_x, ground_y - 8), (nx, ny)], fill=(251, 191, 36, 255), width=12)
                draw.text((obs_x - 390, ground_y - 155), l2, font=get_font(58, bold=True), fill=(251, 191, 36, int(255 * smoothstep(p2))))
            if p3 > 0.01:
                draw_centered_text(draw, bw * 0.5, 110, lhero, get_font(88, bold=True), (52, 211, 153, int(255 * smoothstep(p3))))

    else:
        # Clean schematic vector diagram for density_piston, climb_forces, cruise_step_climb, drag_vortex
        if btype == "climb_forces":
            # Flightpath angled up 18 degrees
            draw.line([(160, bh - 290), (bw - 160, 290)], fill=(100, 140, 190, 160), width=6)
            cx_f, cy_f = bw // 2, bh // 2 + 20
            # Jet fuselage silhouette tilted 18 deg
            draw.line([(cx_f - 180, cy_f + 60), (cx_f + 180, cy_f - 60)], fill=(245, 250, 255, 255), width=26)
            # Thrust forward
            if p1 > 0.01:
                tx = cx_f + int(340 * ease_out_cubic(p1))
                ty = cy_f - int(115 * ease_out_cubic(p1))
                draw.line([(cx_f, cy_f), (tx, ty)], fill=(52, 211, 153, 255), width=16)
                draw.text((tx - 110, ty - 90), l1, font=get_font(64, bold=True), fill=(52, 211, 153, int(255 * smoothstep(p1))))
            # Drag aft
            if p2 > 0.01:
                dx = cx_f - int(260 * ease_out_cubic(p2))
                dy = cy_f + int(88 * ease_out_cubic(p2))
                draw.line([(cx_f, cy_f), (dx, dy)], fill=(251, 113, 133, 255), width=16)
                draw.text((dx - 60, dy + 35), l2, font=get_font(64, bold=True), fill=(253, 164, 175, int(255 * smoothstep(p2))))
            if p3 > 0.01:
                draw_centered_text(draw, bw * 0.5, bh - 190, lhero, get_font(84, bold=True), (125, 211, 252, int(255 * smoothstep(p3))))

        elif btype == "cruise_step_climb":
            # Step-climb ladder FL340 -> FL360 -> FL380
            pts = [(140, bh - 340), (500, bh - 340), (580, bh - 540), (900, bh - 540), (980, bh - 740), (1240, bh - 740)]
            draw.line(pts, fill=(56, 189, 248, 255), width=14)
            if p1 > 0.01:
                draw.text((130, bh - 300), l1, font=get_font(64, bold=True), fill=(251, 191, 36, int(255 * smoothstep(p1))))
            if p2 > 0.01:
                draw.text((575, bh - 498), l2, font=get_font(64, bold=True), fill=(125, 211, 252, int(255 * smoothstep(p2))))
            if p3 > 0.01:
                draw_centered_text(draw, bw * 0.5, 110, lhero, get_font(88, bold=True), (52, 211, 153, int(255 * smoothstep(p3))))

        else:
            # density_piston or drag_vortex: Clean dual-panel contrast blueprint
            mid_x = bw // 2
            draw.line([(mid_x, 120), (mid_x, bh - 260)], fill=(72, 122, 186, 180), width=4)
            if btype == "density_piston":
                # Left: Dense sea level particles; Right: Sparse high altitude particles
                rng = np.random.default_rng(7)
                for _ in range(36):
                    px = int(rng.integers(140, mid_x - 90))
                    py = int(rng.integers(240, bh - 340))
                    draw.ellipse([px - 14, py - 14, px + 14, py + 14], fill=(56, 189, 248, 220))
                for _ in range(11):
                    px = int(rng.integers(mid_x + 90, bw - 140))
                    py = int(rng.integers(240, bh - 340))
                    draw.ellipse([px - 14, py - 14, px + 14, py + 14], fill=(251, 113, 133, 220))
            else:
                # drag_vortex: Left swirling induced vortex; Right clean airfoil streamline
                for r_arc in (60, 110, 160):
                    draw.arc([mid_x // 2 - r_arc, bh // 2 - 40 - r_arc, mid_x // 2 + r_arc, bh // 2 - 40 + r_arc],
                             start=20, end=310, fill=(251, 113, 133, 235), width=10)
                for dy_s in (-90, 0, 90):
                    draw.line([(mid_x + 100, bh // 2 - 40 + dy_s), (bw - 120, bh // 2 - 40 + dy_s)], fill=(56, 189, 248, 235), width=10)

            if p1 > 0.01:
                draw_centered_text(draw, mid_x * 0.5, 110, l1, font=get_font(62, bold=True), fill=(125, 211, 252, int(255 * smoothstep(p1))))
            if p2 > 0.01:
                draw_centered_text(draw, mid_x * 1.5, 110, l2, font=get_font(62, bold=True), fill=(253, 164, 175, int(255 * smoothstep(p2))))
            if p3 > 0.01:
                draw_centered_text(draw, bw * 0.5, bh - 205, lhero, get_font(92, bold=True), (52, 211, 153, int(255 * smoothstep(p3))))

    return img


# ═══════════════════════════════════════════════════════════════════════════
# OBJECT 4: EASA QRH CARD (1240 x 1680)
# ═══════════════════════════════════════════════════════════════════════════

def render_qrh_card(qrh_spec: dict, stamp_prog: float, step1_p: float, step2_p: float, step3_p: float) -> Image.Image:
    qw, qh = 1240, 1680
    img = Image.new("RGBA", (qw, qh), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([0, 0, qw - 1, qh - 1], radius=16, fill=(246, 244, 238, 255))
    draw.rounded_rectangle([48, 48, qw - 48, 154], radius=8, fill=(24, 30, 42, 255))
    draw.text((82, 78), qrh_spec.get("header", "QRH // EASA EXAM RULES"), font=get_font(44, bold=True, mono=True), fill=(246, 244, 238, 255))

    def greeking(y_start: int, widths: list[int]):
        for idx, w_bar in enumerate(widths):
            yy = y_start + idx * 34
            draw.rounded_rectangle([72, yy, 72 + w_bar, yy + 16], radius=6, fill=(214, 210, 202, 255))

    greeking(195, [980, 1040, 740])
    draw.rounded_rectangle([72, 340, qw - 72, 650], radius=14, fill=(236, 232, 224, 255), outline=(202, 196, 186, 255), width=3)
    greeking(395, [620, 880, 520, 760])

    if stamp_prog > 0.01:
        sp = clamp(stamp_prog)
        scale = 1.65 - 0.65 * ease_out_cubic(sp)
        sa = int(255 * smoothstep(clamp(sp * 2.2)))
        stamp_text = qrh_spec.get("stamp", "EXAM TRAP")
        f_size = 112 if len(stamp_text) <= 12 else 90 if len(stamp_text) <= 15 else 74
        stamp_img = Image.new("RGBA", (1020, 250), (0, 0, 0, 0))
        sd = ImageDraw.Draw(stamp_img)
        sd.rounded_rectangle([12, 12, 1008, 238], radius=18, outline=(210, 24, 48, sa), width=16)
        draw_centered_text(sd, 510, 125 - f_size * 0.52, stamp_text, get_font(f_size, bold=True), (210, 24, 48, sa))
        stamp_img = stamp_img.rotate(5.5, resample=Image.BICUBIC, expand=True)
        nw = max(1, int(stamp_img.width * scale))
        nh = max(1, int(stamp_img.height * scale))
        stamp_img = stamp_img.resize((nw, nh), Image.BICUBIC)
        img.alpha_composite(stamp_img, ((qw - nw) // 2, 495 - nh // 2))

    draw.line([(72, 710), (qw - 72, 710)], fill=(198, 194, 186, 255), width=4)
    greeking(750, [860, 640])

    step_texts = qrh_spec.get("steps", ["1. STEP ONE", "2. STEP TWO", "3. STEP THREE"])
    step_progs = [step1_p, step2_p, step3_p]
    for si, (label, prog) in enumerate(zip(step_texts, step_progs)):
        yy = 880 + si * 225
        p = smoothstep(prog)
        bg_r = int(234 + (16 - 234) * p)
        bg_g = int(231 + (185 - 231) * p)
        bg_b = int(224 + (129 - 224) * p)
        draw.rounded_rectangle([72, yy, qw - 72, yy + 172], radius=18, fill=(bg_r, bg_g, bg_b, 255))

        txt_r = int(196 + (255 - 196) * p)
        txt_g = int(193 + (255 - 193) * p)
        txt_b = int(186 + (255 - 186) * p)
        fsize = 86 if len(label) <= 15 else 72 if len(label) <= 20 else 60
        draw.text((112, yy + 86 - fsize * 0.56), label, font=get_font(fsize, bold=True), fill=(txt_r, txt_g, txt_b, 255))

    greeking(1555, [760, 520])
    return img


# ═══════════════════════════════════════════════════════════════════════════
# DIRECT VIEWPORT AFFINE COMPOSITOR & CAMERA RIG
# ═══════════════════════════════════════════════════════════════════════════

def build_camera_keyframes(meta: dict) -> list[tuple[float, float, float, float]]:
    b = {x["id"]: x for x in meta["beats"]}
    tot = meta["total_duration"]
    return [
        (0.0,           1020.0, 1180.0, 0.72),
        (b[1]["start"], 1140.0, 1270.0, 0.78),
        (b[1]["end"],   1235.0, 1300.0, 0.84),

        (b[2]["start"], 2880.0, 2060.0, 0.88),
        (b[2]["end"],   2960.0, 1980.0, 0.94),

        (b[3]["start"], 3250.0, 2020.0, 0.92),
        (b[3]["end"],   3160.0, 1860.0, 0.98),

        (b[4]["start"], 3060.0, 1740.0, 1.04),
        (b[4]["end"],   3055.0, 1720.0, 1.10),

        (b[5]["start"], 1420.0, 4030.0, 0.72),
        (b[5]["end"],   1390.0, 4045.0, 0.75),

        (b[6]["start"], 1375.0, 4060.0, 0.76),
        (b[6]["end"],   1385.0, 4085.0, 0.79),

        (b[7]["start"], 3120.0, 4560.0, 0.85),
        (b[7]["end"],   3120.0, 4640.0, 0.88),

        (b[8]["start"], 3120.0, 5020.0, 0.84),
        (b[8]["end"],   3120.0, 5160.0, 0.80),
        (tot,           2160.0, 3120.0, 0.33),
    ]


def eval_camera(t: float, kfs: list, stamp_t: float) -> tuple[float, float, float, float]:
    cx, cy, z = kfs[0][1], kfs[0][2], kfs[0][3]
    if t >= kfs[-1][0]:
        cx, cy, z = kfs[-1][1], kfs[-1][2], kfs[-1][3]
    else:
        for i in range(len(kfs) - 1):
            t0, x0, y0, z0 = kfs[i]
            t1, x1, y1, z1 = kfs[i + 1]
            if t0 <= t <= t1:
                u = smootherstep((t - t0) / max(1e-5, t1 - t0))
                cx = x0 + (x1 - x0) * u
                cy = y0 + (y1 - y0) * u
                z = z0 + (z1 - z0) * u
                break

    hx = 7.5 * math.sin(t * 0.95) + 3.5 * math.cos(t * 2.13)
    hy = 6.5 * math.cos(t * 0.82) + 3.0 * math.sin(t * 1.87)
    hrot = 0.22 * math.sin(t * 0.65)

    dt_stamp = t - stamp_t
    if 0.0 <= dt_stamp <= 0.28:
        amp = 22.0 * math.exp(-dt_stamp * 16.0)
        hx += amp * math.sin(dt_stamp * 95.0)
        hy += amp * math.cos(dt_stamp * 110.0)

    return cx + hx, cy + hy, z, hrot


def camera_matrix_3x3(cx: float, cy: float, zoom: float, rot_deg: float) -> np.ndarray:
    rad = math.radians(rot_deg)
    ca = math.cos(rad) * zoom
    sa = math.sin(rad) * zoom
    return np.array(
        [
            [ca, -sa, W / 2.0 - (ca * cx - sa * cy)],
            [sa, ca, H / 2.0 - (sa * cx + ca * cy)],
            [0.0, 0.0, 1.0],
        ],
        dtype=np.float64,
    )


def object_matrix_3x3(ow: int, oh: int, obj_cx: float, obj_cy: float, angle_deg: float, scale: float) -> np.ndarray:
    # PIL rotate(+angle_deg) is CCW around center -> in y-down screen coords, theta = -angle_deg
    theta = -math.radians(angle_deg)
    cs = scale * math.cos(theta)
    ss = scale * math.sin(theta)
    ox, oy = ow / 2.0, oh / 2.0
    tx = obj_cx - (cs * ox - ss * oy)
    ty = obj_cy - (ss * ox + cs * oy)
    return np.array(
        [
            [cs, -ss, tx],
            [ss, cs, ty],
            [0.0, 0.0, 1.0],
        ],
        dtype=np.float64,
    )


def _warp_and_blend_object(
    view_bgr: np.ndarray,
    obj_bgr: np.ndarray,
    obj_alpha_u8: np.ndarray,
    M_cam: np.ndarray,
    obj_cx: float,
    obj_cy: float,
    angle_deg: float,
    drop_prog: float,
    brightness: float,
):
    if drop_prog <= 0.005:
        return
    dp = ease_out_cubic(drop_prog)
    scale = 1.16 - 0.16 * dp
    alpha_mult = smoothstep(clamp(drop_prog * 1.8))
    oh, ow = obj_bgr.shape[:2]

    M_obj = object_matrix_3x3(ow, oh, obj_cx, obj_cy, angle_deg, scale)
    M_tot = M_cam @ M_obj

    corners = np.array([[0, ow, ow, 0], [0, 0, oh, oh], [1, 1, 1, 1]], dtype=np.float64)

    # 1. Shadow ROI pass (OpenCV C++ SIMD)
    sh_dx = 18.0 + 34.0 * (1.0 - dp)
    sh_dy = 22.0 + 42.0 * (1.0 - dp)
    sh_strength = (0.48 - 0.16 * (1.0 - dp)) * alpha_mult
    M_sh_world = M_obj.copy()
    M_sh_world[0, 2] += sh_dx
    M_sh_world[1, 2] += sh_dy
    M_sh = M_cam @ M_sh_world
    sc_sh = M_sh @ corners
    sx0 = max(0, int(math.floor(sc_sh[0].min())) - 2)
    sy0 = max(0, int(math.floor(sc_sh[1].min())) - 2)
    sx1 = min(W, int(math.ceil(sc_sh[0].max())) + 2)
    sy1 = min(H, int(math.ceil(sc_sh[1].max())) + 2)
    if sx1 > sx0 and sy1 > sy0:
        M_sh_roi = M_sh[:2, :].copy()
        M_sh_roi[0, 2] -= sx0
        M_sh_roi[1, 2] -= sy0
        sa = cv2.warpAffine(obj_alpha_u8, M_sh_roi, (sx1 - sx0, sy1 - sy0), flags=cv2.INTER_LINEAR, borderValue=0)
        inv_gray = cv2.convertScaleAbs(sa, alpha=-sh_strength, beta=255.0)
        inv_bgr = cv2.cvtColor(inv_gray, cv2.COLOR_GRAY2BGR)
        view_bgr[sy0:sy1, sx0:sx1] = cv2.multiply(view_bgr[sy0:sy1, sx0:sx1], inv_bgr, scale=1.0 / 255.0)

    # 2. Foreground Object ROI pass (OpenCV C++ SIMD)
    sc_fg = M_tot @ corners
    rx0 = max(0, int(math.floor(sc_fg[0].min())) - 2)
    ry0 = max(0, int(math.floor(sc_fg[1].min())) - 2)
    rx1 = min(W, int(math.ceil(sc_fg[0].max())) + 2)
    ry1 = min(H, int(math.ceil(sc_fg[1].max())) + 2)
    if rx1 > rx0 and ry1 > ry0:
        M_roi = M_tot[:2, :].copy()
        M_roi[0, 2] -= rx0
        M_roi[1, 2] -= ry0
        rw, rh = rx1 - rx0, ry1 - ry0
        w_bgr = cv2.warpAffine(obj_bgr, M_roi, (rw, rh), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0))
        w_alp = cv2.warpAffine(obj_alpha_u8, M_roi, (rw, rh), flags=cv2.INTER_LINEAR, borderValue=0)
        src = w_bgr if brightness >= 0.99 else cv2.convertScaleAbs(w_bgr, alpha=brightness)
        alp_u8 = w_alp if alpha_mult >= 0.99 else cv2.convertScaleAbs(w_alp, alpha=alpha_mult)
        inv_u8 = cv2.bitwise_not(alp_u8)
        alp_3 = cv2.cvtColor(alp_u8, cv2.COLOR_GRAY2BGR)
        inv_3 = cv2.cvtColor(inv_u8, cv2.COLOR_GRAY2BGR)
        dst_part = cv2.multiply(view_bgr[ry0:ry1, rx0:rx1], inv_3, scale=1.0 / 255.0)
        src_part = cv2.multiply(src, alp_3, scale=1.0 / 255.0)
        view_bgr[ry0:ry1, rx0:rx1] = cv2.add(dst_part, src_part)


def apply_directional_motion_blur(img_bgr: np.ndarray, vx: float, vy: float) -> np.ndarray:
    mag = math.hypot(vx, vy)
    klen = int(min(37, max(3, mag * 0.42)))
    if klen < 3:
        return img_bgr
    if klen % 2 == 0:
        klen += 1
    kernel = np.zeros((klen, klen), dtype=np.float32)
    c = klen // 2
    ux, uy = vx / mag, vy / mag
    cv2.line(
        kernel,
        (int(round(c - ux * c)), int(round(c - uy * c))),
        (int(round(c + ux * c)), int(round(c + uy * c))),
        1.0,
        1,
        lineType=cv2.LINE_AA,
    )
    s = kernel.sum()
    if s > 0:
        kernel /= s
    return cv2.filter2D(img_bgr, -1, kernel)


def apply_film_finish(frame_bgr: np.ndarray, frame_idx: int) -> np.ndarray:
    small = cv2.resize(frame_bgr, (W // 8, H // 8), interpolation=cv2.INTER_AREA)
    bright = cv2.subtract(small, (175, 175, 175, 0))
    glow_s = cv2.GaussianBlur(bright, (0, 0), sigmaX=4.0)
    glow = cv2.resize(glow_s, (W, H), interpolation=cv2.INTER_LINEAR)
    out = cv2.addWeighted(frame_bgr, 1.0, glow, 0.42, 0)
    out = cv2.multiply(out, VIGNETTE_U8, scale=1.0 / 255.0)
    gp, gn = _get_grain_pair(frame_idx)
    out = cv2.add(out, gp)
    out = cv2.subtract(out, gn)
    return out


class TopicReelRenderer:
    def __init__(self, spec: dict, meta: dict):
        self.spec = spec
        self.meta = meta
        self.kfs = build_camera_keyframes(meta)
        self.base_desk = build_desk_surface()
        self.cache: dict[tuple, tuple[np.ndarray, np.ndarray]] = {}

    @staticmethod
    def _pil_to_bgr_alpha(pil_img: Image.Image) -> tuple[np.ndarray, np.ndarray]:
        arr = np.array(pil_img, dtype=np.uint8)
        bgr = cv2.cvtColor(arr[:, :, :3], cv2.COLOR_RGB2BGR)
        alpha = arr[:, :, 3]
        return bgr, alpha

    def _get_cached_obj(self, key: tuple, builder_fn) -> tuple[np.ndarray, np.ndarray]:
        if key not in self.cache:
            if len(self.cache) > 180:
                self.cache.clear()
            self.cache[key] = self._pil_to_bgr_alpha(builder_fn())
        return self.cache[key]

    def render_frame(self, t: float, frame_idx: int) -> np.ndarray:
        b = {x["id"]: x for x in self.meta["beats"]}
        stamp_t = b[7]["cue1"]
        cx, cy, zoom, rot_deg = eval_camera(t, self.kfs, stamp_t)
        M_cam = camera_matrix_3x3(cx, cy, zoom, rot_deg)

        # Sample visible 1080x1920 background directly from desk (zero 82MB copy!)
        view = cv2.warpAffine(
            self.base_desk,
            M_cam[:2, :],
            (W, H),
            flags=cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_CONSTANT,
            borderValue=(10, 12, 16),
        )

        pull_t = b[8]["end"] - 0.15

        def hero_brightness(t_on: float, t_off: float) -> float:
            enter = smoothstep((t - (t_on - 0.45)) / 0.45)
            leave = 1.0 - smoothstep((t - t_off) / 0.55)
            active = enter * leave
            pull = smoothstep((t - pull_t) / 0.9)
            return max(0.36 + 0.64 * active, 0.36 + 0.52 * pull)

        # Object 1: Photo Print
        o1_drop = clamp((t - 0.08) / 0.60)
        if o1_drop > 0.005:
            p_st = clamp((t - b[1]["cue1"]) / 0.38)
            q1 = round(p_st * 30) / 30.0
            bgr1, alp1 = self._get_cached_obj(("o1", q1), lambda: render_photo_print(self.spec["photo"], q1))
            _warp_and_blend_object(view, bgr1, alp1, M_cam, OBJ1_POS[0], OBJ1_POS[1], -3.2, o1_drop, hero_brightness(0.0, b[1]["end"] + 0.1))

        # Object 2: Chart Sheet
        o2_drop = clamp((t - (b[2]["start"] - 0.60)) / 0.60)
        if o2_drop > 0.005:
            lp = round(clamp((t - (b[2]["cue1"] - 0.15)) / 1.25) * 32) / 32.0
            rp = round(clamp((t - (b[3]["cue1"] - 0.20)) / 1.25) * 32) / 32.0
            ap = round(clamp((t - (b[4]["cue1"] - 0.10)) / 0.85) * 32) / 32.0
            bgr2, alp2 = self._get_cached_obj(("o2", lp, rp, ap), lambda: render_chart_sheet(self.spec["chart"], lp, rp, ap))
            _warp_and_blend_object(view, bgr2, alp2, M_cam, OBJ2_POS[0], OBJ2_POS[1], 1.8, o2_drop, hero_brightness(b[2]["start"], b[4]["end"] + 0.1))

        # Object 3: Navy Blueprint
        o3_drop = clamp((t - (b[5]["start"] - 0.55)) / 0.60)
        if o3_drop > 0.005:
            bp1 = round(clamp((t - (b[5]["cue1"] - 0.08)) / 0.55) * 30) / 30.0
            bp2 = round(clamp((t - (b[6]["cue1"] - 0.10)) / 0.85) * 30) / 30.0
            bp3 = round(clamp((t - ((b[6]["cue2"] or b[6]["cue1"] + 1.0) - 0.08)) / 0.55) * 30) / 30.0
            bgr3, alp3 = self._get_cached_obj(("o3", bp1, bp2, bp3), lambda: render_blueprint(self.spec["blueprint"], bp1, bp2, bp3))
            _warp_and_blend_object(view, bgr3, alp3, M_cam, OBJ3_POS[0], OBJ3_POS[1], -2.0, o3_drop, hero_brightness(b[5]["start"], b[6]["end"] + 0.1))

        # Object 4: QRH Card
        o4_drop = clamp((t - (b[7]["start"] - 0.55)) / 0.60)
        if o4_drop > 0.005:
            st_p = round(clamp((t - b[7]["cue1"]) / 0.26) * 30) / 30.0
            s1_p = round(clamp((t - b[8]["cue1"]) / 0.35) * 24) / 24.0
            s2_p = round(clamp((t - (b[8]["cue2"] or b[8]["cue1"] + 0.8)) / 0.35) * 24) / 24.0
            s3_p = round(clamp((t - (b[8]["cue3"] or b[8]["cue1"] + 1.6)) / 0.35) * 24) / 24.0
            bgr4, alp4 = self._get_cached_obj(("o4", st_p, s1_p, s2_p, s3_p), lambda: render_qrh_card(self.spec["qrh"], st_p, s1_p, s2_p, s3_p))
            _warp_and_blend_object(view, bgr4, alp4, M_cam, OBJ4_POS[0], OBJ4_POS[1], 1.6, o4_drop, hero_brightness(b[7]["start"], b[8]["end"] + 0.2))

        # Optical directional motion blur on fast pans
        dt = 1.0 / FPS
        cx_p, cy_p, _, _ = eval_camera(max(0.0, t - dt), self.kfs, stamp_t)
        vx = (cx - cx_p) * zoom
        vy = (cy - cy_p) * zoom
        if math.hypot(vx, vy) > 14.0:
            view = apply_directional_motion_blur(view, vx, vy)

        return apply_film_finish(view, frame_idx)


_NVENC_AVAILABLE: bool | None = None


def check_nvenc_works() -> bool:
    global _NVENC_AVAILABLE
    if _NVENC_AVAILABLE is not None:
        return _NVENC_AVAILABLE
    try:
        res = subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-f",
                "lavfi",
                "-i",
                "color=c=black:s=256x256:d=0.1",
                "-c:v",
                "h264_nvenc",
                "-f",
                "null",
                "-",
            ],
            capture_output=True,
            timeout=10,
        )
        _NVENC_AVAILABLE = res.returncode == 0
    except Exception:
        _NVENC_AVAILABLE = False
    return _NVENC_AVAILABLE


async def generate_topic_reel(spec: dict, out_dir: Path, preview_only: bool = False) -> dict:
    view_key = spec["view"]
    work_dir = out_dir / "_work" / view_key
    work_dir.mkdir(parents=True, exist_ok=True)
    out_dir.mkdir(parents=True, exist_ok=True)

    t0 = time.time()
    meta = await build_word_synced_audio(spec, work_dir)
    renderer = TopicReelRenderer(spec, meta)

    # Save 8-beat preview grid alongside output for rapid visual QC
    stills = []
    for bt in meta["beats"]:
        ts = min(bt["end"] - 0.12, max(bt["cue1"] + 0.52, (bt["start"] + bt["end"]) * 0.65))
        if bt["id"] == 8:
            ts = (bt["cue3"] or bt["end"] - 0.5) + 0.35
        fr = renderer.render_frame(ts, int(ts * FPS))
        stills.append(cv2.resize(fr, (270, 480), interpolation=cv2.INTER_AREA))
    grid = np.vstack([np.hstack(stills[:4]), np.hstack(stills[4:])])
    grid_path = out_dir / f"{view_key}_preview.png"
    cv2.imwrite(str(grid_path), grid)

    if preview_only:
        return {
            "view": view_key,
            "preview_path": str(grid_path),
            "duration": meta["total_duration"],
            "elapsed": round(time.time() - t0, 2),
        }

    total_dur = meta["total_duration"]
    total_frames = int(math.ceil(total_dur * FPS))
    final_mp4 = out_dir / f"{view_key}.mp4"
    wav_path = work_dir / "narration.wav"

    use_nvenc = check_nvenc_works()
    vcodec_args = (
        ["-c:v", "h264_nvenc", "-preset", "p4", "-rc", "vbr", "-cq", "28", "-b:v", "0", "-pix_fmt", "yuv420p"]
        if use_nvenc
        else ["-c:v", "libx264", "-preset", "fast", "-crf", "24", "-pix_fmt", "yuv420p"]
    )

    cmd = [
        "ffmpeg",
        "-y",
        "-loglevel",
        "warning",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-pix_fmt",
        "bgr24",
        "-s",
        f"{W}x{H}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-i",
        str(wav_path),
        *vcodec_args,
        "-c:a",
        "aac",
        "-b:a",
        "160k",
        "-movflags",
        "+faststart",
        "-shortest",
        str(final_mp4),
    ]

    ffmpeg_log = work_dir / "ffmpeg.log"
    with open(ffmpeg_log, "wb") as err_f:
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=err_f)
        try:
            for f in range(total_frames):
                frame = renderer.render_frame(f / FPS, f)
                proc.stdin.write(frame.tobytes())
        finally:
            if proc.stdin:
                proc.stdin.close()
            proc.wait()

    if proc.returncode != 0:
        err_tail = ffmpeg_log.read_text(encoding="utf-8", errors="ignore")[-400:]
        raise RuntimeError(f"FFmpeg failed for {view_key}: {err_tail}")

    size_mb = final_mp4.stat().st_size / (1024 * 1024)
    return {
        "view": view_key,
        "mp4_path": str(final_mp4),
        "preview_path": str(grid_path),
        "duration": round(total_dur, 2),
        "size_mb": round(size_mb, 2),
        "encoder": "h264_nvenc" if use_nvenc else "libx264",
        "elapsed": round(time.time() - t0, 2),
    }
