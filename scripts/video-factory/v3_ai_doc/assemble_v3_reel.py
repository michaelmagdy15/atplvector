#!/usr/bin/env python3
"""
Zero-WebGL v3 Netflix-Documentary AI Reel Compositor for ATPLVector.

Composites:
- Act 1: ComfyUI MiniMax H3 vertical photoreal wet-runway clip + crisp HUD telemetry
- Act 2: ComfyUI MiniMax H3 vertical isometric clay diorama + tilt-shift + callouts
- Act 3: Pure 2D Netflix investigative macOS evidence board & animated ASDR/TODR chart
- Act 4: Noir amber vertical spotlight interactive 3-2-1 EASA pilot-call quiz
- Act 5: Emerald spotlight verdict + 3 saveable CS-25.107 rules
- Act 6: Branded ATPLVECTOR outro sting (`public/icons/icon-512.png`)

Uses pure OpenCV C++ SIMD + Pillow + FFmpeg (`h264_nvenc`) with zero WebGL.
"""

from __future__ import annotations

import argparse
import json
import math
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1080, 1920
FPS = 30
TRANSITION_S = 0.35

REPO_ROOT = Path(__file__).resolve().parents[3]
LOGO_PATH = REPO_ROOT / "public" / "icons" / "icon-512.png"


def _load_font(names: list[str], size: int) -> ImageFont.FreeTypeFont:
    font_dirs = [Path(r"C:\Windows\Fonts"), Path("/usr/share/fonts")]
    for d in font_dirs:
        for name in names:
            p = d / name
            if p.exists():
                return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


class FontBank:
    """Cached UI, display, and monospace fonts sized for mobile 9:16 readability."""

    def __init__(self) -> None:
        sans_b = ["segoeuib.ttf", "arialbd.ttf", "calibrib.ttf"]
        sans_r = ["segoeui.ttf", "arial.ttf", "calibri.ttf"]
        mono_b = ["consolab.ttf", "lucon.ttf", "courbd.ttf"]
        self.brand = _load_font(sans_b, 26)
        self.mono_sm = _load_font(mono_b, 22)
        self.mono_md = _load_font(mono_b, 27)
        self.mono_lg = _load_font(mono_b, 35)
        self.hud_speed = _load_font(mono_b, 92)
        self.pill = _load_font(sans_b, 36)
        self.sub = _load_font(sans_b, 28)
        self.reg = _load_font(sans_r, 26)
        self.card_big = _load_font(sans_b, 58)
        self.headline = _load_font(sans_b, 64)
        self.hero_xl = _load_font(sans_b, 76)
        self.countdown = _load_font(sans_b, 118)
        self.outro_title = _load_font(sans_b, 84)


def ease_out_cubic(u: float) -> float:
    u = max(0.0, min(1.0, u))
    return 1.0 - (1.0 - u) ** 3


def ease_in_out_cubic(u: float) -> float:
    u = max(0.0, min(1.0, u))
    return 4 * u * u * u if u < 0.5 else 1.0 - ((-2 * u + 2) ** 3) / 2.0


def clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))


def _load_clip_frames(mp4_path: Path) -> list[np.ndarray]:
    """Load an AI clip into memory as cover-fitted 1080x1920 RGB24 uint8 frames."""
    cap = cv2.VideoCapture(str(mp4_path))
    if not cap.isOpened():
        raise RuntimeError(f"Failed to open AI video clip: {mp4_path}")
    frames: list[np.ndarray] = []
    while True:
        ok, bgr = cap.read()
        if not ok or bgr is None:
            break
        h0, w0 = bgr.shape[:2]
        scale = max(W / w0, H / h0)
        nw, nh = int(round(w0 * scale)), int(round(h0 * scale))
        resized = cv2.resize(bgr, (nw, nh), interpolation=cv2.INTER_LANCZOS4)
        x0 = max(0, (nw - W) // 2)
        y0 = max(0, (nh - H) // 2)
        cropped = resized[y0 : y0 + H, x0 : x0 + W]
        if cropped.shape[0] != H or cropped.shape[1] != W:
            cropped = cv2.resize(cropped, (W, H), interpolation=cv2.INTER_LANCZOS4)
        frames.append(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
    cap.release()
    if not frames:
        raise RuntimeError(f"AI video clip has zero decoded frames: {mp4_path}")
    print(f"[Clip] Loaded {mp4_path.name}: {len(frames)} frames @ {W}x{H}", flush=True)
    return frames


def _sample_clip_slowmo(
    frames: list[np.ndarray],
    progress: float,
    zoom: float = 1.0,
    dx: float = 0.0,
    dy: float = 0.0,
) -> np.ndarray:
    """Blended forward slow-motion sampling + smooth affine camera motion."""
    n = len(frames)
    fpos = clamp01(progress) * max(0, n - 1)
    i0 = min(n - 1, int(math.floor(fpos)))
    i1 = min(n - 1, i0 + 1)
    frac = fpos - i0
    if frac < 0.01 or i0 == i1:
        base = frames[i0]
    else:
        base = cv2.addWeighted(frames[i0], 1.0 - frac, frames[i1], frac, 0.0)

    if abs(zoom - 1.0) > 1e-4 or abs(dx) > 0.2 or abs(dy) > 0.2:
        cx, cy = W * 0.5, H * 0.5
        M = np.array(
            [
                [zoom, 0.0, (1.0 - zoom) * cx + dx],
                [0.0, zoom, (1.0 - zoom) * cy + dy],
            ],
            dtype=np.float32,
        )
        return cv2.warpAffine(
            base, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT_101
        )
    return base.copy()


def _alpha_composite_rgba(dst_rgb: np.ndarray, overlay_rgba: np.ndarray, alpha_scale: float = 1.0) -> np.ndarray:
    """Fast uint8 alpha composite of a full or cropped RGBA layer onto dst_rgb (in-place safe copy)."""
    if alpha_scale <= 0.005:
        return dst_rgb
    a = overlay_rgba[:, :, 3:4].astype(np.float32) * (alpha_scale / 255.0)
    rgb = overlay_rgba[:, :, :3].astype(np.float32)
    out = dst_rgb.astype(np.float32) * (1.0 - a) + rgb * a
    return np.clip(out, 0, 255).astype(np.uint8)


def _paste_rgba_roi(
    dst_rgb: np.ndarray, layer_rgba: np.ndarray, x: int, y: int, alpha_scale: float = 1.0
) -> None:
    """Fast ROI-only alpha blend of an RGBA stamp onto dst_rgb in place."""
    if alpha_scale <= 0.005:
        return
    lh, lw = layer_rgba.shape[:2]
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W, x + lw), min(H, y + lh)
    if x1 <= x0 or y1 <= y0:
        return
    sx0, sy0 = x0 - x, y0 - y
    sx1, sy1 = sx0 + (x1 - x0), sy0 + (y1 - y0)
    src = layer_rgba[sy0:sy1, sx0:sx1]
    a = src[:, :, 3:4].astype(np.float32) * (alpha_scale / 255.0)
    roi = dst_rgb[y0:y1, x0:x1].astype(np.float32)
    blended = roi * (1.0 - a) + src[:, :, :3].astype(np.float32) * a
    dst_rgb[y0:y1, x0:x1] = np.clip(blended, 0, 255).astype(np.uint8)


def _make_rounded_logo(size: int, radius: int) -> Image.Image:
    if not LOGO_PATH.exists():
        raise FileNotFoundError(f"Missing official logo crest: {LOGO_PATH}")
    icon = Image.open(LOGO_PATH).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(icon, (0, 0), mask)
    return out


def _draw_pill_stamp(
    w: int,
    h: int,
    radius: int,
    fill: tuple[int, int, int, int],
    border: tuple[int, int, int, int],
    border_w: int = 3,
    shadow_pad: int = 18,
) -> tuple[Image.Image, ImageDraw.ImageDraw, tuple[int, int]]:
    cw, ch = w + shadow_pad * 2, h + shadow_pad * 2
    img = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    sh = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.rounded_rectangle(
        [shadow_pad, shadow_pad + 6, shadow_pad + w, shadow_pad + h + 6],
        radius=radius,
        fill=(0, 0, 0, 145),
    )
    sh = sh.filter(ImageFilter.GaussianBlur(10))
    img = Image.alpha_composite(img, sh)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(
        [shadow_pad, shadow_pad, shadow_pad + w, shadow_pad + h],
        radius=radius,
        fill=fill,
        outline=border,
        width=border_w,
    )
    return img, d, (shadow_pad, shadow_pad)


def _center_text(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int, int],
) -> None:
    x0, y0, x1, y1 = box
    bb = draw.textbbox((0, 0), text, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    tx = x0 + (x1 - x0 - tw) // 2 - bb[0]
    ty = y0 + (y1 - y0 - th) // 2 - bb[1]
    draw.text((tx, ty), text, font=font, fill=fill)


class PrebuiltAssets:
    """Pre-renders all vector/typography cards cleanly once for fast frame compositing."""

    def __init__(self, fonts: FontBank) -> None:
        self.fonts = fonts

        # 1. Persistent Brand Bug (top-left x=52, y=108)
        bug_img, bd, (ox, oy) = _draw_pill_stamp(
            320, 74, 18, (8, 14, 28, 200), (56, 189, 248, 125), border_w=2, shadow_pad=12
        )
        mini_logo = _make_rounded_logo(50, 11)
        bug_img.paste(mini_logo, (ox + 12, oy + 12), mini_logo)
        bd.text((ox + 76, oy + 22), "ATPLVECTOR", font=fonts.brand, fill=(248, 250, 252, 255))
        self.brand_bug = np.array(bug_img)

        # 2. Global radial vignette uint8 LUT + film grain frames
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        dx = (xx - W * 0.5) / (W * 0.52)
        dy = (yy - H * 0.5) / (H * 0.52)
        r2 = dx * dx + dy * dy
        vig = np.clip(1.04 - 0.34 * (r2 ** 1.35), 0.42, 1.0)
        self.vig_lut = np.repeat((vig[:, :, None] * 255.0).astype(np.uint8), 3, axis=2)

        rng = np.random.default_rng(77)
        self.grain_frames = [
            rng.integers(-6, 7, size=(H // 2, W // 2, 1), dtype=np.int16) for _ in range(8)
        ]

        # 3. Act 1 Overlays
        # Legibility bottom gradient scrim
        scrim = np.zeros((H, W, 4), dtype=np.uint8)
        for row in range(H):
            t = max(0.0, (row - 1250) / (H - 1250)) ** 1.4
            top_t = max(0.0, (280 - row) / 280.0) ** 1.5
            scrim[row, :, 3] = int(min(220, (t * 195 + top_t * 145)))
        self.act1_scrim = scrim

        warn_img, wd, (ox, oy) = _draw_pill_stamp(
            780, 92, 18, (200, 18, 58, 238), (253, 164, 175, 255), border_w=4
        )
        _center_text(
            wd,
            (ox, oy, ox + 780, oy + 92),
            "▲ MASTER WARN · ENG 2 FAIL",
            fonts.pill,
            (255, 255, 255, 255),
        )
        self.eng_fail_banner = np.array(warn_img)

        q_img, qd, (ox, oy) = _draw_pill_stamp(
            910, 128, 24, (6, 11, 22, 228), (251, 191, 36, 210), border_w=3
        )
        _center_text(
            qd,
            (ox, oy, ox + 910, oy + 128),
            "FLY — OR SLAM THE BRAKES?",
            fonts.card_big,
            (251, 191, 36, 255),
        )
        self.act1_question_pill = np.array(q_img)

        # 4. Act 2 Diorama Pills
        v1_img, vd, (ox, oy) = _draw_pill_stamp(
            560, 86, 20, (15, 23, 42, 235), (245, 158, 11, 255), border_w=4
        )
        _center_text(
            vd, (ox, oy, ox + 560, oy + 86), "V1 · DECISION GATE", fonts.pill, (253, 230, 138, 255)
        )
        self.tag_v1 = np.array(v1_img)

        asda_img, ad, (ox, oy) = _draw_pill_stamp(
            470, 186, 24, (136, 19, 55, 238), (251, 113, 133, 255), border_w=4
        )
        _center_text(ad, (ox, oy + 18, ox + 470, oy + 52), "BEFORE V1", fonts.mono_sm, (254, 205, 211, 255))
        _center_text(ad, (ox, oy + 48, ox + 470, oy + 126), "ASDA", fonts.hero_xl, (255, 255, 255, 255))
        _center_text(ad, (ox, oy + 128, ox + 470, oy + 168), "STOPWAY · ABORT", fonts.mono_sm, (255, 228, 230, 255))
        self.tag_asda = np.array(asda_img)

        toda_img, td, (ox, oy) = _draw_pill_stamp(
            470, 186, 24, (6, 78, 59, 238), (52, 211, 153, 255), border_w=4
        )
        _center_text(td, (ox, oy + 18, ox + 470, oy + 52), "PAST V1", fonts.mono_sm, (167, 243, 208, 255))
        _center_text(td, (ox, oy + 48, ox + 470, oy + 126), "TODA", fonts.hero_xl, (255, 255, 255, 255))
        _center_text(td, (ox, oy + 128, ox + 470, oy + 168), "CLEARWAY · CLIMB", fonts.mono_sm, (209, 250, 229, 255))
        self.tag_toda = np.array(toda_img)

        # Tilt-shift alpha masks (top & bottom bands)
        ts_a = np.zeros((H, W), dtype=np.float32)
        ts_a[:310, :] = np.linspace(0.95, 0.0, 310)[:, None]
        ts_a[H - 340 :, :] = np.linspace(0.0, 0.95, 340)[:, None]
        self.tilt_shift_mask = ts_a[:, :, None]

        # 5. Act 3 Static Blueprint Desk & Tilted FCOM Window
        self.act3_desk = self._build_act3_desk()
        self.act3_fcom_win = self._build_fcom_window(fonts)
        self.act3_bfl_pill = self._build_bfl_pill(fonts)
        self.cursor_rgba = self._build_cursor()

        # 6. Act 4/5 Elements (Spotlight + Headline + Option Cards + Verdict + 3 Rules)
        self.beam_amber = self._build_spotlight_beam((245, 158, 11), (234, 88, 12))
        self.beam_emerald = self._build_spotlight_beam((16, 185, 129), (5, 150, 105))
        self.quiz_header = self._build_quiz_header(fonts)
        self.opt_a_idle, self.opt_a_win, self.opt_b_idle = self._build_option_cards(fonts)
        self.verdict_badge = self._build_verdict_badge(fonts)
        self.comment_cta = self._build_comment_cta(fonts)
        self.rule_cards = self._build_rule_cards(fonts)

        # 7. Act 6 Outro Background + Crest Block
        self.act6_bg, self.act6_crest = self._build_outro_assets(fonts)

    def _build_act3_desk(self) -> np.ndarray:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        dist = np.sqrt(((xx - W * 0.5) / 680.0) ** 2 + ((yy - H * 0.44) / 960.0) ** 2)
        f = np.clip(1.0 - dist * 0.78, 0.0, 1.0)
        bg = np.zeros((H, W, 3), dtype=np.uint8)
        bg[:, :, 0] = np.clip(5 + f * 16, 0, 255).astype(np.uint8)
        bg[:, :, 1] = np.clip(9 + f * 30, 0, 255).astype(np.uint8)
        bg[:, :, 2] = np.clip(20 + f * 52, 0, 255).astype(np.uint8)
        # Subtle cyan blueprint grid
        bg[::64, :, :] = np.clip(bg[::64, :, :].astype(np.int16) + [4, 14, 24], 0, 255).astype(np.uint8)
        bg[:, ::64, :] = np.clip(bg[:, ::64, :].astype(np.int16) + [4, 14, 24], 0, 255).astype(np.uint8)
        return bg

    def _build_fcom_window(self, fonts: FontBank) -> np.ndarray:
        w, h = 720, 310
        img, d, (ox, oy) = _draw_pill_stamp(
            w, h, 24, (245, 243, 238, 255), (255, 255, 255, 190), border_w=2, shadow_pad=24
        )
        # Header bar
        d.rounded_rectangle([ox, oy, ox + w, oy + 58], radius=24, fill=(226, 222, 212, 255))
        d.rectangle([ox, oy + 32, ox + w, oy + 58], fill=(226, 222, 212, 255))
        d.line([(ox, oy + 58), (ox + w, oy + 58)], fill=(205, 200, 188, 255), width=2)
        for ci, col in enumerate(((239, 68, 68, 255), (245, 158, 11, 255), (16, 185, 129, 255))):
            cx = ox + 28 + ci * 28
            d.ellipse([cx - 8, oy + 21, cx + 8, oy + 37], fill=col)
        d.text((ox + 124, oy + 16), "EASA_FCOM_032.DOC", font=fonts.mono_md, fill=(51, 65, 85, 255))
        # Highlighted yellow CS-25 rule pill (zero filler text!)
        d.rounded_rectangle([ox + 34, oy + 84, ox + 390, oy + 138], radius=12, fill=(254, 240, 138, 255))
        d.text((ox + 50, oy + 94), "CS-25.107 · V1", font=fonts.mono_lg, fill=(15, 23, 42, 255))
        # Soft grey body paper lines (read as paper, not filler words)
        for li, bw in enumerate((620, 560, 600, 440)):
            ly = oy + 162 + li * 30
            d.rounded_rectangle([ox + 34, ly, ox + 34 + bw, ly + 15], radius=7, fill=(214, 210, 200, 255))
        rotated = img.rotate(2.2, resample=Image.Resampling.BICUBIC, expand=True)
        return np.array(rotated)

    def _build_bfl_pill(self, fonts: FontBank) -> np.ndarray:
        img, d, (ox, oy) = _draw_pill_stamp(
            740, 96, 20, (15, 23, 42, 245), (245, 158, 11, 255), border_w=4
        )
        _center_text(
            d,
            (ox, oy, ox + 740, oy + 96),
            "BALANCED FIELD · ASDR = TODR",
            fonts.pill,
            (253, 230, 138, 255),
        )
        return np.array(img)

    def _build_cursor(self) -> np.ndarray:
        c = Image.new("RGBA", (80, 80), (0, 0, 0, 0))
        cd = ImageDraw.Draw(c)
        pts = [(12, 8), (12, 62), (26, 48), (38, 70), (46, 65), (34, 43), (54, 43)]
        cd.polygon(pts, fill=(255, 255, 255, 255), outline=(15, 23, 42, 255), width=4)
        return np.array(c)

    def _build_spotlight_beam(self, c_top: tuple[int, int, int], c_bot: tuple[int, int, int]) -> np.ndarray:
        # Full 1080x1920 RGB base for Act 4/5
        base = np.zeros((H, W, 3), dtype=np.float32)
        base[:, :] = (9.0, 13.0, 22.0)
        xx = np.arange(W, dtype=np.float32)[None, :]
        yy = np.linspace(0.0, 1.0, H, dtype=np.float32)[:, None]

        beam_col = (
            np.array(c_top, dtype=np.float32)[None, None, :] * (1.0 - yy[:, :, None])
            + np.array(c_bot, dtype=np.float32)[None, None, :] * yy[:, :, None]
        )
        dx = np.abs(xx - W * 0.5)
        core = np.clip((165.0 - dx) / 14.0, 0.0, 1.0)[:, :, None]
        glow = np.exp(-((dx / 230.0) ** 2))[:, :, None] * 0.34
        mixed = base * (1.0 - core) + beam_col * core + beam_col * glow * (1.0 - core * 0.5)
        return np.clip(mixed, 0, 255).astype(np.uint8)

    def _build_quiz_header(self, fonts: FontBank) -> np.ndarray:
        box = Image.new("RGBA", (980, 310), (0, 0, 0, 0))
        d = ImageDraw.Draw(box)
        # Badge pill
        d.rounded_rectangle([200, 10, 780, 68], radius=29, fill=(15, 23, 42, 238), outline=(251, 191, 36, 200), width=3)
        _center_text(d, (200, 10, 780, 68), "PILOT CALL // EASA EXAM TRAP", fonts.mono_md, (251, 191, 36, 255))
        # Dark backing strip behind headline so it stays super crisp over the amber beam
        d.rounded_rectangle([90, 96, 890, 286], radius=24, fill=(10, 15, 24, 228), outline=(148, 163, 184, 70), width=2)
        _center_text(d, (90, 110, 890, 192), "ENGINE FAILS", fonts.headline, (255, 255, 255, 255))
        _center_text(d, (90, 188, 890, 272), "2 KT BEFORE V1", fonts.headline, (251, 191, 36, 255))
        return np.array(box)

    def _build_option_cards(self, fonts: FontBank) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        def card(key_txt: str, val_txt: str, sub_txt: str, fill, border, key_c, val_c, bw=4):
            im, d, (ox, oy) = _draw_pill_stamp(460, 230, 26, fill, border, border_w=bw)
            _center_text(d, (ox, oy + 26, ox + 460, oy + 64), key_txt, fonts.mono_md, key_c)
            _center_text(d, (ox, oy + 68, ox + 460, oy + 148), val_txt, fonts.card_big, val_c)
            _center_text(d, (ox, oy + 154, ox + 460, oy + 198), sub_txt, fonts.mono_sm, key_c)
            return np.array(im)

        a_idle = card(
            "OPTION A", "STOP", "REJECT TAKEOFF",
            (15, 23, 42, 242), (148, 163, 184, 130), (148, 163, 184, 255), (255, 255, 255, 255),
        )
        a_win = card(
            "OPTION A · CORRECT", "STOP", "RTO IMMEDIATELY",
            (6, 78, 59, 250), (52, 211, 153, 255), (167, 243, 208, 255), (255, 255, 255, 255), bw=5,
        )
        b_idle = card(
            "OPTION B", "GO", "CONTINUE FLYING",
            (15, 23, 42, 242), (148, 163, 184, 130), (148, 163, 184, 255), (255, 255, 255, 255),
        )
        return a_idle, a_win, b_idle

    def _build_verdict_badge(self, fonts: FontBank) -> np.ndarray:
        im, d, (ox, oy) = _draw_pill_stamp(
            820, 96, 22, (6, 78, 59, 248), (52, 211, 153, 255), border_w=4
        )
        # Draw vector checkmark icon (avoids missing Unicode glyphs across fonts)
        cx, cy = ox + 78, oy + 48
        d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=(52, 211, 153, 255))
        d.line([(cx - 11, cy + 1), (cx - 2, cy + 10), (cx + 13, cy - 8)], fill=(6, 78, 59, 255), width=6)
        _center_text(
            d,
            (ox + 92, oy, ox + 800, oy + 96),
            "REJECT TAKEOFF IMMEDIATELY",
            fonts.pill,
            (255, 255, 255, 255),
        )
        return np.array(im)

    def _build_comment_cta(self, fonts: FontBank) -> np.ndarray:
        im, d, (ox, oy) = _draw_pill_stamp(
            520, 68, 18, (10, 15, 24, 228), (251, 191, 36, 150), border_w=2
        )
        _center_text(d, (ox, oy, ox + 520, oy + 68), "COMMENT A OR B NOW", fonts.mono_md, (253, 230, 138, 255))
        return np.array(im)

    def _build_rule_cards(self, fonts: FontBank) -> list[np.ndarray]:
        specs = [
            ("1. V1 ≥ VMCG", "MIN CONTROL GROUND"),
            ("2. V1 ≤ VR", "ROTATION SPEED"),
            ("3. V1 ≤ VMBE", "MAX BRAKE ENERGY"),
        ]
        cards = []
        for main_t, sub_t in specs:
            im, d, (ox, oy) = _draw_pill_stamp(
                940, 132, 24, (6, 78, 59, 245), (52, 211, 153, 255), border_w=4
            )
            d.text((ox + 42, oy + 36), main_t, font=fonts.card_big, fill=(255, 255, 255, 255))
            bb = d.textbbox((0, 0), sub_t, font=fonts.mono_sm)
            tw = bb[2] - bb[0]
            d.text((ox + 940 - 38 - tw, oy + 52), sub_t, font=fonts.mono_sm, fill=(167, 243, 208, 255))
            cards.append(np.array(im))
        return cards

    def _build_outro_assets(self, fonts: FontBank) -> tuple[np.ndarray, np.ndarray]:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        dist = np.sqrt(((xx - W * 0.5) / 560.0) ** 2 + ((yy - H * 0.44) / 760.0) ** 2)
        f = np.clip(1.0 - dist, 0.0, 1.0) ** 1.4
        bg = np.zeros((H, W, 3), dtype=np.uint8)
        bg[:, :, 0] = np.clip(3 + f * 18, 0, 255).astype(np.uint8)
        bg[:, :, 1] = np.clip(7 + f * 44, 0, 255).astype(np.uint8)
        bg[:, :, 2] = np.clip(16 + f * 90, 0, 255).astype(np.uint8)

        crest = Image.new("RGBA", (960, 620), (0, 0, 0, 0))
        glow = Image.new("RGBA", (960, 620), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        gd.ellipse([320, 40, 640, 360], fill=(56, 189, 248, 120))
        glow = glow.filter(ImageFilter.GaussianBlur(42))
        crest = Image.alpha_composite(crest, glow)

        logo = _make_rounded_logo(250, 54)
        crest.paste(logo, (355, 70), logo)
        cd = ImageDraw.Draw(crest)
        _center_text(cd, (0, 365, 960, 468), "ATPLVECTOR", fonts.outro_title, (255, 255, 255, 255))
        _center_text(
            cd,
            (0, 480, 960, 540),
            "032 PERFORMANCE · MASTER EVERY EASA TOPIC",
            fonts.mono_md,
            (56, 189, 248, 255),
        )
        return bg, np.array(crest)


class ReelRenderer:
    """Renders individual frames cleanly by time `t` across Acts 1–6."""

    def __init__(
        self,
        timeline: dict,
        act1_frames: list[np.ndarray],
        act2_frames: list[np.ndarray],
        fonts: FontBank,
        assets: PrebuiltAssets,
    ) -> None:
        self.tl = timeline
        self.acts = timeline["acts"]
        self.cues = timeline["cues"]
        self.act1_frames = act1_frames
        self.act2_frames = act2_frames
        self.fonts = fonts
        self.assets = assets

        # Curve points for Act 3 chart in window-relative coordinates
        self.chart_w = 940
        self.chart_h = 840
        self.chart_base = self._build_act3_chart_base()

    def _build_act3_chart_base(self) -> np.ndarray:
        w, h = self.chart_w, self.chart_h
        im, d, (ox, oy) = _draw_pill_stamp(
            w, h, 26, (248, 246, 241, 255), (255, 255, 255, 200), border_w=2, shadow_pad=24
        )
        # macOS top bar
        d.rounded_rectangle([ox, oy, ox + w, oy + 58], radius=26, fill=(226, 222, 212, 255))
        d.rectangle([ox, oy + 32, ox + w, oy + 58], fill=(226, 222, 212, 255))
        d.line([(ox, oy + 58), (ox + w, oy + 58)], fill=(205, 200, 188, 255), width=2)
        for ci, col in enumerate(((239, 68, 68, 255), (245, 158, 11, 255), (16, 185, 129, 255))):
            cx = ox + 28 + ci * 28
            d.ellipse([cx - 8, oy + 21, cx + 8, oy + 37], fill=col)
        d.text((ox + 124, oy + 16), "CS25_BALANCED_FIELD.PDF", font=self.fonts.mono_md, fill=(51, 65, 85, 255))

        # Plot area inside window
        px0, py0 = ox + 90, oy + 100
        px1, py1 = ox + w - 55, oy + h - 90
        for gx in range(px0, px1 + 1, 95):
            d.line([(gx, py0), (gx, py1)], fill=(228, 224, 214, 255), width=2)
        for gy in range(py0, py1 + 1, 95):
            d.line([(px0, gy), (px1, gy)], fill=(228, 224, 214, 255), width=2)
        # Axes
        d.line([(px0, py0), (px0, py1), (px1, py1)], fill=(71, 85, 105, 255), width=4)
        _center_text(d, (px0, py1 + 18, px1, py1 + 60), "DECISION SPEED (V1) →", self.fonts.mono_md, (51, 65, 85, 255))
        d.text((ox + 22, py0 + 24), "DIST", font=self.fonts.mono_sm, fill=(51, 65, 85, 255))
        self.plot_box = (px0, py0, px1, py1)
        self.chart_ox_oy = (ox, oy)
        return np.array(im)

    def _render_act1(self, t: float) -> np.ndarray:
        a = self.acts["1"]
        dur = max(1.0, a["end"] - a["start"])
        prog = clamp01((t - a["start"]) / dur)
        # Dramatic shake right after engine fail cue
        t_fail = t - self.cues["eng_fail"]
        shake_dx, shake_dy = 0.0, 0.0
        if 0.0 <= t_fail <= 0.50:
            amp = 22.0 * math.exp(-t_fail * 7.5)
            shake_dx = amp * math.sin(t_fail * 62.0)
            shake_dy = amp * 0.7 * math.cos(t_fail * 51.0)

        zoom = 1.00 + 0.07 * ease_in_out_cubic(prog)
        frame = _sample_clip_slowmo(
            self.act1_frames, prog, zoom=zoom, dx=shake_dx, dy=shake_dy
        )
        frame = _alpha_composite_rgba(frame, self.assets.act1_scrim)

        # Crimson warning pulse flash on engine failure
        if 0.0 <= t_fail <= 1.1:
            flash = 0.28 * math.exp(-t_fail * 2.5) * (0.55 + 0.45 * math.sin(t_fail * 18.0))
            red = np.zeros_like(frame)
            red[:, :, 0] = 220
            frame = cv2.addWeighted(frame, 1.0 - flash, red, flash, 0.0)

        # HUD Airspeed card (PIL dynamic readout)
        kts_prog = clamp01(t / max(0.8, self.cues["eng_fail"]))
        kts = int(round(98 + 42 * ease_out_cubic(kts_prog)))
        hud_col = (248, 113, 113, 255) if t_fail >= 0 else (255, 255, 255, 255)
        hud_border = (244, 63, 94, 210) if t_fail >= 0 else (34, 211, 238, 180)
        him, hd, (ox, oy) = _draw_pill_stamp(360, 152, 22, (6, 14, 28, 232), hud_border, border_w=3)
        hd.text((ox + 26, oy + 16), "IAS // WET RWY", font=self.fonts.mono_sm, fill=(103, 232, 249, 255))
        hd.text((ox + 24, oy + 46), f"{kts} KT", font=self.fonts.hud_speed, fill=hud_col)
        _paste_rgba_roi(frame, np.array(him), 40, 210)

        # MASTER WARN banner
        if t_fail >= 0.0:
            en = ease_out_cubic(clamp01(t_fail / 0.25))
            bx = (W - self.assets.eng_fail_banner.shape[1]) // 2
            by = int(420 - (1.0 - en) * 28)
            _paste_rgba_roi(frame, self.assets.eng_fail_banner, bx, by, alpha_scale=en)

        # "FLY — OR SLAM THE BRAKES?" hero pill
        t_q = t - self.cues["fly_or_stop"]
        if t_q >= 0.0:
            en = ease_out_cubic(clamp01(t_q / 0.28))
            qx = (W - self.assets.act1_question_pill.shape[1]) // 2
            qy = int(1430 + (1.0 - en) * 40)
            _paste_rgba_roi(frame, self.assets.act1_question_pill, qx, qy, alpha_scale=en)

        return frame

    def _render_act2(self, t: float) -> np.ndarray:
        a = self.acts["2"]
        dur = max(1.0, a["end"] - a["start"])
        t_loc = t - a["start"]
        prog = clamp01(t_loc / dur)

        zoom = 1.01 + 0.05 * ease_in_out_cubic(prog)
        dx = math.sin(prog * math.pi) * -14.0
        frame = _sample_clip_slowmo(self.act2_frames, prog, zoom=zoom, dx=dx)

        # Tilt-shift miniature blur at top and bottom bands
        blurred = cv2.GaussianBlur(frame, (0, 0), sigmaX=7.5, sigmaY=7.5)
        m = self.assets.tilt_shift_mask
        frame = np.clip(frame.astype(np.float32) * (1.0 - m) + blurred.astype(np.float32) * m, 0, 255).astype(np.uint8)

        # V1 Decision Gate top pill
        en_v1 = ease_out_cubic(clamp01(t_loc / 0.35))
        vx = (W - self.assets.tag_v1.shape[1]) // 2
        _paste_rgba_roi(frame, self.assets.tag_v1, vx, int(230 - (1.0 - en_v1) * 24), alpha_scale=en_v1)

        # ASDA bottom-left pill
        t_asda = t - self.cues["asda_reveal"]
        if t_asda >= 0.0:
            en = ease_out_cubic(clamp01(t_asda / 0.30))
            _paste_rgba_roi(frame, self.assets.tag_asda, 34, int(1340 + (1.0 - en) * 45), alpha_scale=en)

        # TODA bottom-right pill
        t_toda = t - self.cues["toda_reveal"]
        if t_toda >= 0.0:
            en = ease_out_cubic(clamp01(t_toda / 0.30))
            _paste_rgba_roi(
                frame,
                self.assets.tag_toda,
                W - 34 - self.assets.tag_toda.shape[1],
                int(1340 + (1.0 - en) * 45),
                alpha_scale=en,
            )

        return frame

    def _render_act3(self, t: float) -> np.ndarray:
        a = self.acts["3"]
        dur = max(1.0, a["end"] - a["start"])
        t_loc = t - a["start"]
        prog = clamp01(t_loc / dur)

        frame = self.assets.act3_desk.copy()
        # Subtle camera drift over evidence board
        drift_y = int(round((prog - 0.5) * -18))

        # Top FCOM window
        en_f = ease_out_cubic(clamp01(t_loc / 0.32))
        _paste_rgba_roi(frame, self.assets.act3_fcom_win, 44, 218 + drift_y - int((1 - en_f) * 30), alpha_scale=en_f)

        # Dynamic CS-25 Chart window rendered cleanly with Pillow for razor-sharp AA curves
        ch_rgba = self.chart_base.copy()
        im = Image.fromarray(ch_rgba, "RGBA")
        d = ImageDraw.Draw(im)
        px0, py0, px1, py1 = self.plot_box
        pw, ph = px1 - px0, py1 - py0

        def asdr_pt(u: float) -> tuple[float, float]:
            # ASDR rises steeply with V1
            return px0 + u * pw, py1 - (0.14 + 0.72 * (u ** 1.35)) * ph

        def todr_pt(u: float) -> tuple[float, float]:
            # TODR drops as V1 increases
            return px0 + u * pw, py1 - (0.84 - 0.68 * (u ** 0.85)) * ph

        # Find exact intersection u*
        best_u, best_diff = 0.5, 1e9
        for k in range(200):
            uu = k / 199.0
            diff = abs(asdr_pt(uu)[1] - todr_pt(uu)[1])
            if diff < best_diff:
                best_diff = diff
                best_u = uu
        ix, iy = asdr_pt(best_u)

        asdr_u = clamp01((t - self.cues["asdr_draw"]) / 1.45)
        todr_u = clamp01((t - self.cues["todr_draw"]) / 1.45)

        if asdr_u > 0.02:
            pts = [asdr_pt(asdr_u * (i / 60.0)) for i in range(61)]
            d.line(pts, fill=(225, 29, 72, 255), width=9, joint="curve")
            tx, ty = pts[-1]
            d.text((min(px1 - 210, tx - 30), max(py0 + 10, ty - 42)), "ASDR (STOP)", font=self.fonts.mono_md, fill=(225, 29, 72, 255))

        if todr_u > 0.02:
            pts = [todr_pt(todr_u * (i / 60.0)) for i in range(61)]
            d.line(pts, fill=(5, 150, 105, 255), width=9, joint="curve")
            tx, ty = pts[-1]
            d.text((max(px0 + 16, min(px1 - 190, tx - 40)), min(py1 - 44, ty + 14)), "TODR (GO)", font=self.fonts.mono_md, fill=(5, 150, 105, 255))

        # Intersection + balanced field gate on v1_collide
        t_col = t - self.cues["v1_collide"]
        if t_col >= 0.0:
            en_c = ease_out_cubic(clamp01(t_col / 0.25))
            # Vertical dashed V1 marker
            for sy in range(int(iy), py1, 22):
                d.line([(ix, sy), (ix, min(py1, sy + 12))], fill=(245, 158, 11, int(230 * en_c)), width=4)
            # Expanding ripple
            if t_col < 1.1:
                ru = t_col / 1.1
                rr = int(14 + ru * 76)
                ra = int((1.0 - ru) * 230)
                d.ellipse([ix - rr, iy - rr, ix + rr, iy + rr], outline=(245, 158, 11, ra), width=5)
            d.ellipse([ix - 14, iy - 14, ix + 14, iy + 14], fill=(245, 158, 11, 255), outline=(15, 23, 42, 255), width=4)
            d.rounded_rectangle([int(ix - 90), py1 - 54, int(ix + 90), py1 - 10], radius=10, fill=(245, 158, 11, 255))
            _center_text(d, (int(ix - 90), py1 - 54, int(ix + 90), py1 - 10), "BALANCED V1", self.fonts.mono_sm, (15, 23, 42, 255))

        # MacOS Cursor glides smoothly into intersection before v1_collide
        cur_prog = ease_in_out_cubic(clamp01((t - (self.cues["v1_collide"] - 0.9)) / 0.9))
        cx = int(px1 - 120 + (ix - (px1 - 120)) * cur_prog)
        cy = int(py1 - 140 + (iy - (py1 - 140)) * cur_prog)

        chart_x, chart_y = 46, 540 + drift_y
        _paste_rgba_roi(frame, np.array(im), chart_x, chart_y)
        _paste_rgba_roi(frame, self.assets.cursor_rgba, chart_x + cx - 12, chart_y + cy - 8)

        if t_col >= 0.08:
            en_p = ease_out_cubic(clamp01((t_col - 0.08) / 0.25))
            px = (W - self.assets.act3_bfl_pill.shape[1]) // 2
            _paste_rgba_roi(frame, self.assets.act3_bfl_pill, px, int(1470 + (1 - en_p) * 35), alpha_scale=en_p)

        return frame

    def _render_act45(self, t: float, act_id: int) -> np.ndarray:
        a4 = self.acts["4"]
        is_act5 = act_id == 5
        t_v = t - self.cues["verdict_stop"]
        morph = ease_out_cubic(clamp01(t_v / 0.45)) if t_v >= 0.0 else 0.0

        # Spotlight backdrop morphs cleanly amber -> emerald on verdict_stop
        if morph <= 0.005:
            frame = self.assets.beam_amber.copy()
        elif morph >= 0.995:
            frame = self.assets.beam_emerald.copy()
        else:
            frame = cv2.addWeighted(self.assets.beam_amber, 1.0 - morph, self.assets.beam_emerald, morph, 0.0)

        # Header & headline
        _paste_rgba_roi(frame, self.assets.quiz_header, (W - self.assets.quiz_header.shape[1]) // 2, 225)

        # Option Cards A & B side-by-side
        card_a = self.assets.opt_a_win if morph > 0.35 else self.assets.opt_a_idle
        _paste_rgba_roi(frame, card_a, 46, 590, alpha_scale=1.0)
        b_alpha = 1.0 - 0.72 * morph
        _paste_rgba_roi(frame, self.assets.opt_b_idle, W - 46 - self.assets.opt_b_idle.shape[1], 590, alpha_scale=b_alpha)

        if t_v < 0.0:
            # Countdown ring 3 -> 2 -> 1 (holds on 1 cleanly right up to "Stop.")
            q3, q2, q1 = self.cues["quiz_3"], self.cues["quiz_2"], self.cues["quiz_1"]
            if t >= q1:
                num_str, tick_t = "1", t - q1
            elif t >= q2:
                num_str, tick_t = "2", t - q2
            elif t >= q3:
                num_str, tick_t = "3", t - q3
            else:
                num_str, tick_t = "3", -1.0

            ring_span = max(0.8, a4["end"] - q3)
            arc_frac = clamp01(1.0 - max(0.0, t - q3) / ring_span) if t >= q3 else 1.0

            rim = Image.new("RGBA", (300, 300), (0, 0, 0, 0))
            rd = ImageDraw.Draw(rim)
            rd.ellipse([26, 26, 274, 274], fill=(10, 15, 24, 225), outline=(71, 85, 105, 170), width=16)
            if arc_frac > 0.02:
                rd.arc([26, 26, 274, 274], start=-90, end=-90 + 360 * arc_frac, fill=(251, 191, 36, 255), width=16)
            _center_text(rd, (26, 20, 274, 268), num_str, self.fonts.countdown, (255, 255, 255, 255))
            _paste_rgba_roi(frame, np.array(rim), (W - 300) // 2, 910)

            _paste_rgba_roi(frame, self.assets.comment_cta, (W - self.assets.comment_cta.shape[1]) // 2, 1260)
        else:
            # Act 5 Verdict + 3 Saveable CS-25.107 Rules
            en_v = ease_out_cubic(clamp01(max(0.0, t_v) / 0.25))
            _paste_rgba_roi(
                frame,
                self.assets.verdict_badge,
                (W - self.assets.verdict_badge.shape[1]) // 2,
                int(885 + (1 - en_v) * 24),
                alpha_scale=en_v,
            )

            rule_cues = (self.cues["rule_1"], self.cues["rule_2"], self.cues["rule_3"])
            ys = (1035, 1210, 1385)
            for idx, (rcue, ry, card) in enumerate(zip(rule_cues, ys, self.assets.rule_cards)):
                dt = t - rcue
                if dt >= 0.0:
                    en_r = ease_out_cubic(clamp01(dt / 0.28))
                    _paste_rgba_roi(
                        frame,
                        card,
                        (W - card.shape[1]) // 2,
                        int(ry + (1 - en_r) * 38),
                        alpha_scale=en_r,
                    )

        return frame

    def _render_act6(self, t: float) -> np.ndarray:
        a = self.acts["6"]
        dur = max(0.8, a["end"] - a["start"])
        u = clamp01((t - a["start"]) / dur)
        en = ease_out_cubic(clamp01((t - a["start"]) / 0.45))
        frame = self.assets.act6_bg.copy()
        scale = 0.90 + 0.12 * ease_out_cubic(u)
        cw, ch = self.assets.act6_crest.shape[1], self.assets.act6_crest.shape[0]
        nw, nh = int(round(cw * scale)), int(round(ch * scale))
        scaled = cv2.resize(self.assets.act6_crest, (nw, nh), interpolation=cv2.INTER_LINEAR)
        _paste_rgba_roi(frame, scaled, (W - nw) // 2, (H - nh) // 2 - 40, alpha_scale=en)
        return frame

    def _render_act(self, t: float, act_id: int) -> np.ndarray:
        if act_id == 1:
            return self._render_act1(t)
        if act_id == 2:
            return self._render_act2(t)
        if act_id == 3:
            return self._render_act3(t)
        if act_id in (4, 5):
            return self._render_act45(t, act_id)
        return self._render_act6(t)

    def _act_at(self, t: float) -> int:
        for i in range(1, 7):
            s = self.acts[str(i)]
            if t < s["end"] or i == 6:
                return i
        return 6

    def render_frame(self, frame_idx: int, t: float) -> np.ndarray:
        act_id = self._act_at(t)
        frame = self._render_act(t, act_id)

        # Smooth 0.35s cross-dissolve across Act boundaries
        if act_id > 1:
            s_cur = self.acts[str(act_id)]
            dt = t - s_cur["start"]
            if 0.0 <= dt < TRANSITION_S:
                # Avoid cross-dissolving Act 4 -> 5 since Act 45 already smoothly morphs!
                if act_id != 5:
                    prev_frame = self._render_act(t, act_id - 1)
                    alpha = ease_in_out_cubic(dt / TRANSITION_S)
                    frame = cv2.addWeighted(prev_frame, 1.0 - alpha, frame, alpha, 0.0)

        # Persistent ATPLVECTOR bug (Acts 1..5; Act 6 has centered full logo)
        if act_id < 6:
            _paste_rgba_roi(frame, self.assets.brand_bug, 40, 100)
        else:
            dt6 = t - self.acts["6"]["start"]
            if dt6 < TRANSITION_S:
                bug_a = 1.0 - ease_in_out_cubic(dt6 / TRANSITION_S)
                _paste_rgba_roi(frame, self.assets.brand_bug, 40, 100, alpha_scale=bug_a)

        # Fast C++ SIMD Cinema Vignette + subtle 35mm film grain
        frame = cv2.multiply(frame, self.assets.vig_lut, scale=1.0 / 255.0)
        g_small = self.assets.grain_frames[frame_idx % len(self.assets.grain_frames)]
        g_full = cv2.resize(g_small, (W, H), interpolation=cv2.INTER_NEAREST)
        frame = np.clip(frame.astype(np.int16) + g_full[:, :, None], 0, 255).astype(np.uint8)
        return frame


def write_preview_sheet(renderer: ReelRenderer, out_png: Path) -> None:
    tl = renderer.tl
    cues = tl["cues"]
    acts = tl["acts"]
    sample_times = [
        ("ACT 1 - AI RUNWAY + HUD", min(acts["1"]["end"] - 0.2, cues["fly_or_stop"] + 0.55)),
        ("ACT 2 - AI DIORAMA + GATES", min(acts["2"]["end"] - 0.2, cues["toda_reveal"] + 0.75)),
        ("ACT 3 - EVIDENCE BOARD", min(acts["3"]["end"] - 0.2, cues["v1_collide"] + 0.55)),
        ("ACT 4 - PILOT CALL QUIZ", min(acts["4"]["end"] - 0.15, cues["quiz_2"] + 0.25)),
        ("ACT 5 - VERDICT + 3 RULES", min(acts["5"]["end"] - 0.2, cues["rule_3"] + 0.60)),
        ("ACT 6 - ATPLVECTOR OUTRO", min(tl["total_duration"] - 0.2, acts["6"]["start"] + 1.10)),
    ]

    pw, ph = 540, 960
    panels = []
    for label, st in sample_times:
        rgb = renderer.render_frame(int(st * FPS), st)
        thumb = cv2.resize(rgb, (pw, ph), interpolation=cv2.INTER_AREA)
        bgr = cv2.cvtColor(thumb, cv2.COLOR_RGB2BGR)
        cv2.rectangle(bgr, (0, 0), (pw, 44), (8, 12, 22), -1)
        cv2.putText(bgr, f"{label} ({st:.1f}s)", (16, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.68, (56, 189, 248), 2, cv2.LINE_AA)
        panels.append(bgr)

    top = cv2.hconcat(panels[:3])
    bot = cv2.hconcat(panels[3:])
    sheet = cv2.vconcat([top, bot])
    cv2.imwrite(str(out_png), sheet)
    print(f"[Preview] Wrote 6-Act visual review contact sheet: {out_png}", flush=True)


def render_mp4(renderer: ReelRenderer, master_audio: Path, out_mp4: Path, log_path: Path) -> None:
    import soundfile as sf

    audio_dur = sf.info(str(master_audio)).duration
    total_dur = min(float(renderer.tl["total_duration"]), float(audio_dur))
    total_frames = int(math.floor(total_dur * FPS))
    print(f"[Render] Streaming {total_frames} frames ({total_dur:.2f}s @ {FPS}fps) -> h264_nvenc...", flush=True)

    cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-s", f"{W}x{H}",
        "-r", str(FPS),
        "-i", "pipe:0",
        "-i", str(master_audio),
        "-c:v", "h264_nvenc",
        "-preset", "p5",
        "-cq", "19",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        "-movflags", "+faststart",
        str(out_mp4),
    ]

    with open(log_path, "wb") as logf:
        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=logf)
        assert proc.stdin is not None
        for fi in range(total_frames):
            t = fi / FPS
            rgb = renderer.render_frame(fi, t)
            proc.stdin.write(rgb.tobytes())
            if fi > 0 and fi % 300 == 0:
                print(f"   progress: {fi}/{total_frames} frames ({100.0 * fi / total_frames:.0f}%)", flush=True)
        proc.stdin.close()
        ret = proc.wait()
        if ret != 0:
            raise RuntimeError(f"FFmpeg encode failed (exit {ret}); inspect {log_path}")

    mb = out_mp4.stat().st_size / (1024 * 1024)
    print(f"[Render] DONE! {out_mp4} ({mb:.2f} MB)", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--work", default=r"G:\ATPLVECTOR_Videos\v3_AI\_work")
    parser.add_argument("--out", default=r"G:\ATPLVECTOR_Videos\v3_AI\PERF_TAKEOFF_v3_AI.mp4")
    parser.add_argument("--preview-only", action="store_true")
    args = parser.parse_args()

    work_dir = Path(args.work)
    out_mp4 = Path(args.out)
    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    preview_png = out_mp4.parent / "PERF_TAKEOFF_v3_preview.png"

    tl_path = work_dir / "timeline.json"
    if not tl_path.exists():
        raise FileNotFoundError(f"Missing {tl_path} — run gemini_voice_engine.py first.")
    timeline = json.loads(tl_path.read_text(encoding="utf-8"))

    act1_path = work_dir / "act1_runway.mp4"
    act2_path = work_dir / "act2_diorama.mp4"
    act1_frames = _load_clip_frames(act1_path)
    act2_frames = _load_clip_frames(act2_path)

    fonts = FontBank()
    assets = PrebuiltAssets(fonts)
    renderer = ReelRenderer(timeline, act1_frames, act2_frames, fonts, assets)

    write_preview_sheet(renderer, preview_png)
    if args.preview_only:
        return

    master_audio = Path(timeline["master_audio"])
    log_path = work_dir / "ffmpeg_video.log"
    render_mp4(renderer, master_audio, out_mp4, log_path)


if __name__ == "__main__":
    main()
