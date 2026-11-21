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
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

THIS_DIR = Path(__file__).resolve().parent
if str(THIS_DIR) not in sys.path:
    sys.path.insert(0, str(THIS_DIR))
from v3_topic_specs import get_topic_spec  # noqa: E402

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
    pad_x: int = 24,
) -> None:
    x0, y0, x1, y1 = box
    max_w = max(40, (x1 - x0) - pad_x)
    active_font = font
    bb = draw.textbbox((0, 0), text, font=active_font)
    tw = bb[2] - bb[0]
    if tw > max_w and getattr(font, "path", None):
        scaled = max(16, int(font.size * (max_w / max(tw, 1))))
        active_font = ImageFont.truetype(font.path, scaled)
        bb = draw.textbbox((0, 0), text, font=active_font)
        tw = bb[2] - bb[0]
    th = bb[3] - bb[1]
    tx = x0 + (x1 - x0 - tw) // 2 - bb[0]
    ty = y0 + (y1 - y0 - th) // 2 - bb[1]
    draw.text((tx, ty), text, font=active_font, fill=fill)


def _left_fit_text(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int, int],
) -> None:
    x0, y0, x1, y1 = box
    max_w = max(40, x1 - x0)
    active_font = font
    bb = draw.textbbox((0, 0), text, font=active_font)
    tw = bb[2] - bb[0]
    if tw > max_w and getattr(font, "path", None):
        scaled = max(14, int(font.size * (max_w / max(tw, 1))))
        active_font = ImageFont.truetype(font.path, scaled)
        bb = draw.textbbox((0, 0), text, font=active_font)
    th = bb[3] - bb[1]
    ty = y0 + (y1 - y0 - th) // 2 - bb[1]
    draw.text((x0 - bb[0], ty), text, font=active_font, fill=fill)


class PrebuiltAssets:
    """Pre-renders all vector/typography cards cleanly once for fast frame compositing."""

    def __init__(self, fonts: FontBank, spec: dict) -> None:
        self.fonts = fonts
        self.spec = spec
        hud = spec["act1_hud"]
        pills = spec["act2_pills"]
        board = spec["act3_board"]
        quiz = spec["act45_quiz"]

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
        self.grain_pairs: list[tuple[np.ndarray, np.ndarray]] = []
        for _ in range(8):
            g_small = rng.integers(-6, 7, size=(H // 2, W // 2, 1), dtype=np.int16)
            g_pos_s = np.clip(g_small, 0, 6).astype(np.uint8)
            g_neg_s = np.clip(-g_small, 0, 6).astype(np.uint8)
            gp = np.repeat(cv2.resize(g_pos_s, (W, H), interpolation=cv2.INTER_NEAREST)[:, :, None], 3, axis=2)
            gn = np.repeat(cv2.resize(g_neg_s, (W, H), interpolation=cv2.INTER_NEAREST)[:, :, None], 3, axis=2)
            self.grain_pairs.append((gp, gn))

        # 3. Act 1 Overlays (pre-computed SIMD darkening LUTs for top 0..280 & bottom 1250..1920)
        top_rows = np.arange(280, dtype=np.float32)
        top_alpha = np.clip(((280.0 - top_rows) / 280.0) ** 1.5 * 145.0, 0.0, 220.0)
        top_mul_1d = np.clip(np.round(255.0 * (1.0 - top_alpha / 255.0)), 0, 255).astype(np.uint8)
        self.act1_top_mul = np.broadcast_to(top_mul_1d[:, None, None], (280, W, 3)).copy()

        bot_rows = np.arange(1250, H, dtype=np.float32)
        bot_alpha = np.clip(((bot_rows - 1250.0) / (H - 1250.0)) ** 1.4 * 195.0, 0.0, 220.0)
        bot_mul_1d = np.clip(np.round(255.0 * (1.0 - bot_alpha / 255.0)), 0, 255).astype(np.uint8)
        self.act1_bot_mul = np.broadcast_to(bot_mul_1d[:, None, None], (H - 1250, W, 3)).copy()

        warn_img, wd, (ox, oy) = _draw_pill_stamp(
            840, 92, 18, (200, 18, 58, 238), (253, 164, 175, 255), border_w=4
        )
        _center_text(
            wd,
            (ox, oy, ox + 840, oy + 92),
            hud["warn_banner"],
            fonts.pill,
            (255, 255, 255, 255),
        )
        self.eng_fail_banner = np.array(warn_img)

        q_img, qd, (ox, oy) = _draw_pill_stamp(
            930, 128, 24, (6, 11, 22, 234), (251, 191, 36, 215), border_w=3
        )
        _center_text(
            qd,
            (ox, oy, ox + 930, oy + 128),
            hud["question_pill"],
            fonts.card_big,
            (251, 191, 36, 255),
        )
        self.act1_question_pill = np.array(q_img)

        # 4. Act 2 Diorama Pills
        v1_img, vd, (ox, oy) = _draw_pill_stamp(
            680, 86, 20, (15, 23, 42, 235), (245, 158, 11, 255), border_w=4
        )
        _center_text(
            vd, (ox, oy, ox + 680, oy + 86), pills["top_pill"], fonts.pill, (253, 230, 138, 255)
        )
        self.tag_v1 = np.array(v1_img)

        asda_img, ad, (ox, oy) = _draw_pill_stamp(
            470, 186, 24, (136, 19, 55, 238), (251, 113, 133, 255), border_w=4
        )
        _center_text(ad, (ox, oy + 18, ox + 470, oy + 52), pills["left_top"], fonts.mono_sm, (254, 205, 211, 255))
        _center_text(ad, (ox, oy + 48, ox + 470, oy + 126), pills["left_hero"], fonts.hero_xl, (255, 255, 255, 255))
        _center_text(ad, (ox, oy + 128, ox + 470, oy + 168), pills["left_sub"], fonts.mono_sm, (255, 228, 230, 255))
        self.tag_asda = np.array(asda_img)

        toda_img, td, (ox, oy) = _draw_pill_stamp(
            470, 186, 24, (6, 78, 59, 238), (52, 211, 153, 255), border_w=4
        )
        _center_text(td, (ox, oy + 18, ox + 470, oy + 52), pills["right_top"], fonts.mono_sm, (167, 243, 208, 255))
        _center_text(td, (ox, oy + 48, ox + 470, oy + 126), pills["right_hero"], fonts.hero_xl, (255, 255, 255, 255))
        _center_text(td, (ox, oy + 128, ox + 470, oy + 168), pills["right_sub"], fonts.mono_sm, (209, 250, 229, 255))
        self.tag_toda = np.array(toda_img)

        # Tilt-shift alpha masks (top & bottom bands)
        ts_a = np.zeros((H, W), dtype=np.float32)
        ts_a[:310, :] = np.linspace(0.95, 0.0, 310)[:, None]
        ts_a[H - 340 :, :] = np.linspace(0.0, 0.95, 340)[:, None]
        self.tilt_shift_mask = ts_a[:, :, None]

        # 5. Act 3 Static Blueprint Desk & Tilted FCOM Window
        self.act3_desk = self._build_act3_desk()
        self.act3_fcom_win = self._build_fcom_window(fonts, board["fcom_file"], board["fcom_tag"])
        self.act3_bfl_pill = self._build_bfl_pill(fonts, board["bfl_pill"])
        self.cursor_rgba = self._build_cursor()

        # 6. Act 4/5 Elements (Spotlight + Headline + Option Cards + Verdict + 3 Rules)
        self.beam_amber = self._build_spotlight_beam((245, 158, 11), (234, 88, 12))
        self.beam_emerald = self._build_spotlight_beam((16, 185, 129), (5, 150, 105))
        self.quiz_header = self._build_quiz_header(fonts, quiz["headline_1"], quiz["headline_2"])
        self.opt_a_idle, self.opt_a_win, self.opt_b_idle, self.opt_b_win = self._build_option_cards(fonts, quiz)
        self.verdict_badge = self._build_verdict_badge(fonts, quiz["verdict_banner"])
        self.comment_cta = self._build_comment_cta(fonts)
        self.rule_cards = self._build_rule_cards(fonts, quiz["rules"])

        # 7. Act 6 Outro Background + Crest Block
        self.act6_bg, self.act6_crest = self._build_outro_assets(fonts, spec["outro_sub"])

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

    def _build_fcom_window(self, fonts: FontBank, fcom_file: str, fcom_tag: str) -> np.ndarray:
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
        d.text((ox + 124, oy + 16), fcom_file, font=fonts.mono_md, fill=(51, 65, 85, 255))
        # Highlighted yellow CS-25 rule pill (auto-sized to fit tag cleanly)
        bb = d.textbbox((0, 0), fcom_tag, font=fonts.mono_lg)
        tag_w = min(w - 68, max(320, (bb[2] - bb[0]) + 36))
        d.rounded_rectangle([ox + 34, oy + 84, ox + 34 + tag_w, oy + 138], radius=12, fill=(254, 240, 138, 255))
        _center_text(d, (ox + 34, oy + 84, ox + 34 + tag_w, oy + 138), fcom_tag, fonts.mono_lg, (15, 23, 42, 255), pad_x=16)
        # Soft grey body paper lines (read as paper, not filler words)
        for li, bw in enumerate((620, 560, 600, 440)):
            ly = oy + 162 + li * 30
            d.rounded_rectangle([ox + 34, ly, ox + 34 + bw, ly + 15], radius=7, fill=(214, 210, 200, 255))
        rotated = img.rotate(2.2, resample=Image.Resampling.BICUBIC, expand=True)
        return np.array(rotated)

    def _build_bfl_pill(self, fonts: FontBank, pill_text: str) -> np.ndarray:
        img, d, (ox, oy) = _draw_pill_stamp(
            840, 96, 20, (15, 23, 42, 245), (245, 158, 11, 255), border_w=4
        )
        _center_text(
            d,
            (ox, oy, ox + 840, oy + 96),
            pill_text,
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

    def _build_quiz_header(self, fonts: FontBank, line1: str, line2: str) -> np.ndarray:
        box = Image.new("RGBA", (980, 310), (0, 0, 0, 0))
        d = ImageDraw.Draw(box)
        d.rounded_rectangle([200, 10, 780, 68], radius=29, fill=(15, 23, 42, 238), outline=(251, 191, 36, 200), width=3)
        _center_text(d, (200, 10, 780, 68), "PILOT CALL // EASA EXAM TRAP", fonts.mono_md, (251, 191, 36, 255))
        d.rounded_rectangle([70, 96, 910, 286], radius=24, fill=(10, 15, 24, 228), outline=(148, 163, 184, 70), width=2)
        _center_text(d, (70, 110, 910, 192), line1, fonts.headline, (255, 255, 255, 255))
        _center_text(d, (70, 188, 910, 272), line2, fonts.headline, (251, 191, 36, 255))
        return np.array(box)

    def _build_option_cards(
        self, fonts: FontBank, quiz: dict
    ) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        def card(key_txt: str, val_txt: str, sub_txt: str, fill, border, key_c, val_c, bw=4):
            im, d, (ox, oy) = _draw_pill_stamp(460, 230, 26, fill, border, border_w=bw)
            _center_text(d, (ox, oy + 26, ox + 460, oy + 64), key_txt, fonts.mono_md, key_c)
            _center_text(d, (ox, oy + 68, ox + 460, oy + 148), val_txt, fonts.card_big, val_c)
            _center_text(d, (ox, oy + 154, ox + 460, oy + 198), sub_txt, fonts.mono_sm, key_c)
            return np.array(im)

        a_idle = card(
            "OPTION A", quiz["opt_a_val"], quiz["opt_a_sub"],
            (15, 23, 42, 242), (148, 163, 184, 130), (148, 163, 184, 255), (255, 255, 255, 255),
        )
        a_win = card(
            "OPTION A · CORRECT", quiz["opt_a_val"], quiz["opt_a_sub"],
            (6, 78, 59, 250), (52, 211, 153, 255), (167, 243, 208, 255), (255, 255, 255, 255), bw=5,
        )
        b_idle = card(
            "OPTION B", quiz["opt_b_val"], quiz["opt_b_sub"],
            (15, 23, 42, 242), (148, 163, 184, 130), (148, 163, 184, 255), (255, 255, 255, 255),
        )
        b_win = card(
            "OPTION B · CORRECT", quiz["opt_b_val"], quiz["opt_b_sub"],
            (6, 78, 59, 250), (52, 211, 153, 255), (167, 243, 208, 255), (255, 255, 255, 255), bw=5,
        )
        return a_idle, a_win, b_idle, b_win

    def _build_verdict_badge(self, fonts: FontBank, verdict_txt: str) -> np.ndarray:
        im, d, (ox, oy) = _draw_pill_stamp(
            880, 96, 22, (6, 78, 59, 248), (52, 211, 153, 255), border_w=4
        )
        # Draw vector checkmark icon (avoids missing Unicode glyphs across fonts)
        cx, cy = ox + 74, oy + 48
        d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=(52, 211, 153, 255))
        d.line([(cx - 11, cy + 1), (cx - 2, cy + 10), (cx + 13, cy - 8)], fill=(6, 78, 59, 255), width=6)
        _center_text(
            d,
            (ox + 96, oy, ox + 860, oy + 96),
            verdict_txt,
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

    def _build_rule_cards(self, fonts: FontBank, specs: list[tuple[str, str]]) -> list[np.ndarray]:
        cards = []
        for main_t, sub_t in specs:
            im, d, (ox, oy) = _draw_pill_stamp(
                940, 132, 24, (6, 78, 59, 245), (52, 211, 153, 255), border_w=4
            )
            bb_sub = d.textbbox((0, 0), sub_t, font=fonts.mono_sm)
            tw_sub = bb_sub[2] - bb_sub[0]
            sub_x = ox + 940 - 38 - tw_sub
            d.text((sub_x, oy + 52), sub_t, font=fonts.mono_sm, fill=(167, 243, 208, 255))
            # Auto-fit main rule text into available left region so it never collides with sub_t
            max_main_w = max(220, sub_x - (ox + 42) - 24)
            f_main = fonts.card_big
            bb_m = d.textbbox((0, 0), main_t, font=f_main)
            if (bb_m[2] - bb_m[0]) > max_main_w and getattr(f_main, "path", None):
                sz = max(24, int(f_main.size * (max_main_w / max(bb_m[2] - bb_m[0], 1))))
                f_main = ImageFont.truetype(f_main.path, sz)
                bb_m = d.textbbox((0, 0), main_t, font=f_main)
            mh = bb_m[3] - bb_m[1]
            ty = oy + (132 - mh) // 2 - bb_m[1]
            d.text((ox + 42, ty), main_t, font=f_main, fill=(255, 255, 255, 255))
            cards.append(np.array(im))
        return cards

    def _build_outro_assets(self, fonts: FontBank, outro_sub: str) -> tuple[np.ndarray, np.ndarray]:
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
            outro_sub,
            fonts.mono_md,
            (56, 189, 248, 255),
        )
        return bg, np.array(crest)


class ReelRenderer:
    """Renders individual frames cleanly by time `t` across Acts 1–6."""

    def __init__(
        self,
        timeline: dict,
        spec: dict,
        act1_frames: list[np.ndarray],
        act2_frames: list[np.ndarray],
        fonts: FontBank,
        assets: PrebuiltAssets,
    ) -> None:
        self.tl = timeline
        self.spec = spec
        self.acts = timeline["acts"]
        self.cues = timeline["cues"]
        self.act1_frames = act1_frames
        self.act2_frames = act2_frames
        self.fonts = fonts
        self.assets = assets

        # Curve / ladder caches
        self._hud_cache: dict[tuple[str, bool], np.ndarray] = {}
        self._act3_done_chart: np.ndarray | None = None
        self.chart_w = 940
        self.chart_h = 840
        self.chart_base = self._build_act3_chart_base()

    def _build_act3_chart_base(self) -> np.ndarray:
        board = self.spec["act3_board"]
        ctype = board["chart_type"]
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
        d.text((ox + 124, oy + 16), board["chart_file"], font=self.fonts.mono_md, fill=(51, 65, 85, 255))

        if ctype == "rules_ladder":
            sub_hdr = board.get("x_label", "")
            if sub_hdr:
                _left_fit_text(
                    d,
                    (ox + 42, oy + 68, ox + w - 42, oy + 112),
                    sub_hdr,
                    self.fonts.mono_md,
                    (71, 85, 105, 255),
                )
                d.line([(ox + 42, oy + 116), (ox + w - 42, oy + 116)], fill=(226, 222, 212, 255), width=2)
            self.plot_box = (ox + 42, oy + 128, ox + w - 42, oy + h - 76)
            self.chart_ox_oy = (ox, oy)
            return np.array(im)

        # Plot area inside window
        px0, py0 = ox + 90, oy + 100
        px1, py1 = ox + w - 55, oy + h - 90
        for gx in range(px0, px1 + 1, 95):
            d.line([(gx, py0), (gx, py1)], fill=(228, 224, 214, 255), width=2)
        for gy in range(py0, py1 + 1, 95):
            d.line([(px0, gy), (px1, gy)], fill=(228, 224, 214, 255), width=2)
        # Axes
        d.line([(px0, py0), (px0, py1), (px1, py1)], fill=(71, 85, 105, 255), width=4)
        _center_text(d, (px0, py1 + 18, px1, py1 + 60), board["x_label"], self.fonts.mono_md, (51, 65, 85, 255))
        d.text((ox + 18, py0 + 24), board["y_label"], font=self.fonts.mono_sm, fill=(51, 65, 85, 255))
        self.plot_box = (px0, py0, px1, py1)
        self.chart_ox_oy = (ox, oy)
        return np.array(im)

    def _render_act1(self, t: float) -> np.ndarray:
        a = self.acts["1"]
        dur = max(1.0, a["end"] - a["start"])
        prog = clamp01((t - a["start"]) / dur)
        hud = self.spec["act1_hud"]

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
        cv2.multiply(frame[:280], self.assets.act1_top_mul, dst=frame[:280], scale=1.0 / 255.0)
        cv2.multiply(frame[1250:], self.assets.act1_bot_mul, dst=frame[1250:], scale=1.0 / 255.0)

        if 0.0 <= t_fail <= 1.1:
            flash = 0.28 * math.exp(-t_fail * 2.5) * (0.55 + 0.45 * math.sin(t_fail * 18.0))
            red = np.zeros_like(frame)
            red[:, :, 0] = 220
            frame = cv2.addWeighted(frame, 1.0 - flash, red, flash, 0.0)

        # HUD numeric telemetry card (cached by formatted text + alert state)
        kts_prog = clamp01(t / max(0.8, self.cues["eng_fail"]))
        val = hud["start_val"] + (hud["end_val"] - hud["start_val"]) * ease_out_cubic(kts_prog)
        decs = hud.get("decimals", 0)
        val_txt = f"{val:.{decs}f}" if decs > 0 else f"{int(round(val))}"
        prefix = hud.get("prefix", "")
        disp_txt = f"{prefix}{val_txt} {hud['unit']}".strip()
        is_fail = t_fail >= 0.0
        hud_rgba = self._hud_cache.get((disp_txt, is_fail))
        if hud_rgba is None:
            hud_col = (248, 113, 113, 255) if is_fail else (255, 255, 255, 255)
            hud_border = (244, 63, 94, 210) if is_fail else (34, 211, 238, 180)
            him, hd, (ox, oy) = _draw_pill_stamp(400, 152, 22, (6, 14, 28, 232), hud_border, border_w=3)
            _left_fit_text(hd, (ox + 26, oy + 14, ox + 376, oy + 44), hud["label"], self.fonts.mono_sm, (103, 232, 249, 255))
            _left_fit_text(hd, (ox + 24, oy + 46, ox + 376, oy + 140), disp_txt, self.fonts.hud_speed, hud_col)
            hud_rgba = np.array(him)
            self._hud_cache[(disp_txt, is_fail)] = hud_rgba
        _paste_rgba_roi(frame, hud_rgba, 40, 210)

        if t_fail >= 0.0:
            en = ease_out_cubic(clamp01(t_fail / 0.25))
            bx = (W - self.assets.eng_fail_banner.shape[1]) // 2
            by = int(420 - (1.0 - en) * 28)
            _paste_rgba_roi(frame, self.assets.eng_fail_banner, bx, by, alpha_scale=en)

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

        # Fast strip-only half-res tilt-shift blur on top and bottom vignette bands
        for sl_y0, sl_y1 in ((0, 310), (H - 340, H)):
            strip = frame[sl_y0:sl_y1]
            sh, sw = strip.shape[:2]
            small = cv2.resize(strip, (sw // 2, sh // 2), interpolation=cv2.INTER_AREA)
            small_b = cv2.GaussianBlur(small, (0, 0), sigmaX=3.75, sigmaY=3.75)
            blurred = cv2.resize(small_b, (sw, sh), interpolation=cv2.INTER_LINEAR)
            m = self.assets.tilt_shift_mask[sl_y0:sl_y1]
            frame[sl_y0:sl_y1] = np.clip(
                strip.astype(np.float32) * (1.0 - m) + blurred.astype(np.float32) * m,
                0,
                255,
            ).astype(np.uint8)

        en_v1 = ease_out_cubic(clamp01(t_loc / 0.35))
        vx = (W - self.assets.tag_v1.shape[1]) // 2
        _paste_rgba_roi(frame, self.assets.tag_v1, vx, int(230 - (1.0 - en_v1) * 24), alpha_scale=en_v1)

        t_asda = t - self.cues["asda_reveal"]
        if t_asda >= 0.0:
            en = ease_out_cubic(clamp01(t_asda / 0.30))
            _paste_rgba_roi(frame, self.assets.tag_asda, 34, int(1340 + (1.0 - en) * 45), alpha_scale=en)

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

    def _draw_chart_content(self, d: ImageDraw.ImageDraw, t: float) -> tuple[float, float, str]:
        """Draw the topic's engineering chart & return cursor click (ix, iy, marker_label)."""
        board = self.spec["act3_board"]
        ctype = board["chart_type"]
        px0, py0, px1, py1 = self.plot_box
        pw, ph = px1 - px0, py1 - py0

        u1 = clamp01((t - self.cues["asdr_draw"]) / 1.45)
        u2 = clamp01((t - self.cues["todr_draw"]) / 1.45)
        t_col = t - self.cues["v1_collide"]

        def pt(ux: float, ny: float) -> tuple[float, float]:
            return px0 + ux * pw, py1 - ny * ph

        if ctype == "bars_compare":
            bars = board["bars"]
            max_v = max(b[1] for b in bars) * 1.12
            bx_start = px0 + 215
            bar_max_w = px1 - 30 - bx_start
            n_b = len(bars)
            row_h = (ph - 82) / max(n_b, 1)
            prog_all = clamp01((t - self.acts["3"]["start"] - 0.3) / max(1.8, (self.cues["v1_collide"] - self.acts["3"]["start"])))
            hi_idx = int(board.get("highlight_row", n_b - 1)) % max(1, n_b)
            target_xy = (
                bx_start + bar_max_w * (bars[hi_idx][1] / max_v),
                py0 + 12 + (hi_idx + 0.5) * row_h,
            )
            for idx, item in enumerate(bars):
                lbl, val, col = item[0], item[1], item[2]
                val_str = item[3] if len(item) > 3 else ""
                b_u = ease_out_cubic(clamp01((prog_all * n_b) - idx * 0.50))
                cy = int(py0 + 12 + (idx + 0.5) * row_h)
                bh = min(56, max(38, int(row_h * 0.58)))
                _left_fit_text(d, (px0 + 10, cy - 26, bx_start - 14, cy + 26), lbl, self.fonts.mono_sm, (30, 41, 59, 255))
                d.rounded_rectangle([bx_start, cy - bh // 2, bx_start + bar_max_w, cy + bh // 2], radius=12, fill=(228, 224, 214, 255))
                bw_now = max(14, int(bar_max_w * (val / max_v) * b_u))
                d.rounded_rectangle([bx_start, cy - bh // 2, bx_start + bw_now, cy + bh // 2], radius=12, fill=(*col, 255))
                if val_str and b_u > 0.35:
                    bb_vs = d.textbbox((0, 0), val_str, font=self.fonts.mono_sm)
                    vw_vs = bb_vs[2] - bb_vs[0]
                    vh_vs = bb_vs[3] - bb_vs[1]
                    vy_vs = cy - vh_vs // 2 - bb_vs[1]
                    if bw_now >= vw_vs + 24:
                        d.text((bx_start + bw_now - 12 - vw_vs, vy_vs), val_str, font=self.fonts.mono_sm, fill=(255, 255, 255, 255))
                    else:
                        tx_vs = min(bx_start + bar_max_w - vw_vs - 8, bx_start + bw_now + 10)
                        d.text((tx_vs, vy_vs), val_str, font=self.fonts.mono_sm, fill=(30, 41, 59, 255))
                if idx == hi_idx:
                    target_xy = (float(bx_start + bw_now), float(cy))
            return target_xy[0], target_xy[1], board.get("marker_label", bars[hi_idx][0])

        if ctype == "rules_ladder":
            rows = board["rows"]
            n_r = len(rows)
            hi_idx = int(board.get("highlight_row", n_r - 1)) % max(1, n_r)
            avail_h = py1 - py0
            gap = 16 if n_r <= 4 else 12
            card_h = int((avail_h - gap * max(0, n_r - 1)) / max(1, n_r))
            prog_all = clamp01(
                (t - self.acts["3"]["start"] - 0.25)
                / max(1.6, (self.cues["v1_collide"] - self.acts["3"]["start"]))
            )
            hi_cy = py0 + (hi_idx + 0.5) * card_h + hi_idx * gap
            target_xy = (float(px1 - 44), float(hi_cy))
            for idx, item in enumerate(rows):
                badge, title_t, detail_t, col = item[0], item[1], item[2], item[3]
                ru = ease_out_cubic(clamp01((prog_all * n_r) - idx * 0.48))
                if ru <= 0.01:
                    continue
                slide_x = int((1.0 - ru) * 42)
                ry0 = int(py0 + idx * (card_h + gap))
                ry1 = ry0 + card_h
                rx0 = px0 + slide_x
                rx1 = px1 + slide_x
                is_hi = t_col >= 0.0 and idx == hi_idx
                bg_col = (254, 249, 231, 255) if is_hi else (255, 255, 255, 255)
                bd_col = (245, 158, 11, 255) if is_hi else (218, 214, 204, 255)
                bd_w = 5 if is_hi else 2
                d.rounded_rectangle([rx0, ry0, rx1, ry1], radius=16, fill=bg_col, outline=bd_col, width=bd_w)

                bw = min(215, max(135, int(len(badge) * 18 + 38)))
                bx0, by0, bx1, by1 = rx0 + 14, ry0 + 12, rx0 + 14 + bw, ry1 - 12
                d.rounded_rectangle([bx0, by0, bx1, by1], radius=12, fill=(*col, 255))
                _center_text(d, (bx0, by0, bx1, by1), badge, self.fonts.mono_md, (255, 255, 255, 255), pad_x=14)

                tx0, tx1 = bx1 + 18, rx1 - 18
                mid_y = (ry0 + ry1) // 2
                _left_fit_text(d, (tx0, ry0 + 10, tx1, mid_y + 2), title_t, self.fonts.sub, (15, 23, 42, 255))
                _left_fit_text(d, (tx0, mid_y + 2, tx1, ry1 - 10), detail_t, self.fonts.mono_sm, (71, 85, 105, 255))
            return target_xy[0], target_xy[1], board["marker_label"]

        if ctype == "crossing":
            f1 = lambda u: 0.14 + 0.72 * (u ** 1.35)
            f2 = lambda u: 0.84 - 0.68 * (u ** 0.85)
            best_u = min((k / 199.0 for k in range(200)), key=lambda uu: abs(f1(uu) - f2(uu)))
            ix, iy = pt(best_u, f1(best_u))
            if u1 > 0.02:
                pts = [pt(u1 * (i / 60.0), f1(u1 * (i / 60.0))) for i in range(61)]
                d.line(pts, fill=(225, 29, 72, 255), width=9, joint="curve")
                d.text((min(px1 - 210, pts[-1][0] - 30), max(py0 + 10, pts[-1][1] - 42)), board["curve1_label"], font=self.fonts.mono_md, fill=(225, 29, 72, 255))
            if u2 > 0.02:
                pts = [pt(u2 * (i / 60.0), f2(u2 * (i / 60.0))) for i in range(61)]
                d.line(pts, fill=(5, 150, 105, 255), width=9, joint="curve")
                d.text((max(px0 + 16, min(px1 - 190, pts[-1][0] - 40)), min(py1 - 44, pts[-1][1] + 14)), board["curve2_label"], font=self.fonts.mono_md, fill=(5, 150, 105, 255))
            return ix, iy, board["marker_label"]

        if ctype == "dual_diverge":
            f1 = lambda u: 0.84 - 0.64 * (u ** 0.90)
            f2 = lambda u: 0.22 + 0.60 * (u ** 1.08)
            ix, iy = pt(0.76, f2(0.76))
            if u1 > 0.02:
                pts = [pt(u1 * (i / 60.0), f1(u1 * (i / 60.0))) for i in range(61)]
                d.line(pts, fill=(225, 29, 72, 255), width=9, joint="curve")
                d.text((px0 + 24, max(py0 + 14, pts[4][1] - 46)), board["curve1_label"], font=self.fonts.mono_md, fill=(225, 29, 72, 255))
            if u2 > 0.02:
                pts = [pt(u2 * (i / 60.0), f2(u2 * (i / 60.0))) for i in range(61)]
                d.line(pts, fill=(5, 150, 105, 255), width=9, joint="curve")
                d.text((min(px1 - 240, pts[-1][0] - 120), max(py0 + 16, pts[-1][1] - 42)), board["curve2_label"], font=self.fonts.mono_md, fill=(5, 150, 105, 255))
            return ix, iy, board["marker_label"]

        if ctype == "climb_thrust":
            f1 = lambda u: 0.22 + 0.54 * (((u - 0.42) / 0.58) ** 2)
            f2 = lambda u: 0.82 - 0.09 * u
            ix, iy = pt(0.42, (f1(0.42) + f2(0.42)) * 0.5)
            if u1 > 0.02:
                pts2 = [pt(u1 * (i / 60.0), f2(u1 * (i / 60.0))) for i in range(61)]
                d.line(pts2, fill=(5, 150, 105, 255), width=9, joint="curve")
                d.text((px0 + 20, py0 + 26), board["curve2_label"], font=self.fonts.mono_md, fill=(5, 150, 105, 255))
            if u2 > 0.02:
                pts1 = [pt(u2 * (i / 60.0), f1(u2 * (i / 60.0))) for i in range(61)]
                d.line(pts1, fill=(225, 29, 72, 255), width=9, joint="curve")
                d.text((px0 + 24, py1 - 92), board["curve1_label"], font=self.fonts.mono_md, fill=(225, 29, 72, 255))
            if t_col >= 0.0:
                p_top = pt(0.42, f2(0.42))
                p_bot = pt(0.42, f1(0.42))
                d.line([p_top, p_bot], fill=(245, 158, 11, 255), width=7)
            return ix, iy, board["marker_label"]

        if ctype == "sar_arch":
            f_heavy = lambda u: max(0.08, 0.60 - 0.50 * (((u - 0.46) / 0.54) ** 2))
            f_light = lambda u: max(0.10, 0.84 - 0.56 * (((u - 0.48) / 0.52) ** 2))
            ix, iy = pt(0.56, f_light(0.56))
            if u1 > 0.02:
                pts1 = [pt(u1 * (i / 60.0), f_heavy(u1 * (i / 60.0))) for i in range(61)]
                d.line(pts1, fill=(225, 29, 72, 255), width=8, joint="curve")
                d.text((px0 + 24, py1 - 150), "HEAVY (FL340)", font=self.fonts.mono_sm, fill=(225, 29, 72, 255))
            if u2 > 0.02:
                pts2 = [pt(u2 * (i / 60.0), f_light(u2 * (i / 60.0))) for i in range(61)]
                d.line(pts2, fill=(5, 150, 105, 255), width=9, joint="curve")
                d.text((px0 + 24, py0 + 22), "LIGHT (FL360)", font=self.fonts.mono_md, fill=(5, 150, 105, 255))
            return ix, iy, board["marker_label"]

        if ctype == "coffin_corner":
            apex_u, apex_y = 0.52, 0.86
            ix, iy = pt(apex_u, apex_y)
            if u1 > 0.02:
                pts1 = [pt(0.08 + (apex_u - 0.08) * u1 * (i / 50.0), 0.14 + (apex_y - 0.14) * ((u1 * (i / 50.0)) ** 0.85)) for i in range(51)]
                d.line(pts1, fill=(225, 29, 72, 255), width=9, joint="curve")
                d.text((px0 + 20, py0 + 28), board["curve1_label"], font=self.fonts.mono_md, fill=(225, 29, 72, 255))
            if u2 > 0.02:
                pts2 = [pt(0.92 - (0.92 - apex_u) * u2 * (i / 50.0), 0.14 + (apex_y - 0.14) * ((u2 * (i / 50.0)) ** 1.10)) for i in range(51)]
                d.line(pts2, fill=(5, 150, 105, 255), width=9, joint="curve")
                d.text((px1 - 210, py0 + 28), board["curve2_label"], font=self.fonts.mono_md, fill=(5, 150, 105, 255))
            return ix, iy, board["marker_label"]

        if ctype == "lift_stall":
            def f_cl(u: float) -> float:
                if u <= 0.70:
                    return 0.14 + 0.70 * (u / 0.70)
                return max(0.28, 0.84 - 0.54 * (((u - 0.70) / 0.28) ** 1.25))

            ix, iy = pt(0.70, 0.84)
            if u1 > 0.02:
                u_pre = min(0.70, u1 * 0.96)
                pts1 = [pt(u_pre * (i / 50.0), f_cl(u_pre * (i / 50.0))) for i in range(51)]
                d.line(pts1, fill=(5, 150, 105, 255), width=9, joint="curve")
                d.text((px0 + 26, py1 - 250), board["curve1_label"], font=self.fonts.mono_md, fill=(5, 150, 105, 255))
            if u2 > 0.02:
                u_span = 0.25 * u2
                pts2 = [pt(0.70 + u_span * (i / 30.0), f_cl(0.70 + u_span * (i / 30.0))) for i in range(31)]
                d.line(pts2, fill=(225, 29, 72, 255), width=9, joint="curve")
                d.text((px1 - 220, py0 + 180), board["curve2_label"], font=self.fonts.mono_md, fill=(225, 29, 72, 255))
            return ix, iy, board["marker_label"]

        # Default fallback & "drag_curve"
        fi = lambda u: min(0.84, 0.09 + 0.56 * ((0.30 / (u + 0.16)) ** 1.55))
        fp = lambda u: min(0.84, 0.08 + 0.54 * ((u / 0.94) ** 1.95))
        ftot = lambda u: min(0.92, fi(u) * 0.55 + fp(u) * 0.55 + 0.22)
        best_u = min((0.15 + 0.70 * (k / 199.0) for k in range(200)), key=ftot)
        ix, iy = pt(best_u, ftot(best_u))
        if u1 > 0.02:
            pts_i = [pt(0.08 + 0.84 * u1 * (i / 60.0), fi(0.08 + 0.84 * u1 * (i / 60.0))) for i in range(61)]
            pts_p = [pt(0.08 + 0.84 * u1 * (i / 60.0), fp(0.08 + 0.84 * u1 * (i / 60.0))) for i in range(61)]
            d.line(pts_i, fill=(225, 29, 72, 255), width=7, joint="curve")
            d.line(pts_p, fill=(5, 150, 105, 255), width=7, joint="curve")
            d.text((px0 + 18, py0 + 26), board["curve1_label"], font=self.fonts.mono_sm, fill=(225, 29, 72, 255))
            d.text((px1 - 245, py1 - 165), board["curve2_label"], font=self.fonts.mono_sm, fill=(5, 150, 105, 255))
        if u2 > 0.02:
            pts_t = [pt(0.08 + 0.84 * u2 * (i / 60.0), ftot(0.08 + 0.84 * u2 * (i / 60.0))) for i in range(61)]
            d.line(pts_t, fill=(30, 41, 59, 255), width=10, joint="curve")
            d.text((ix - 75, max(py0 + 18, iy - 130)), "TOTAL DRAG", font=self.fonts.mono_md, fill=(30, 41, 59, 255))
        return ix, iy, board["marker_label"]

    def _render_act3(self, t: float) -> np.ndarray:
        a = self.acts["3"]
        dur = max(1.0, a["end"] - a["start"])
        t_loc = t - a["start"]
        prog = clamp01(t_loc / dur)

        frame = self.assets.act3_desk.copy()
        drift_y = int(round((prog - 0.5) * -18))

        en_f = ease_out_cubic(clamp01(t_loc / 0.32))
        _paste_rgba_roi(frame, self.assets.act3_fcom_win, 44, 218 + drift_y - int((1 - en_f) * 30), alpha_scale=en_f)

        px0, py0, px1, py1 = self.plot_box
        t_col = t - self.cues["v1_collide"]
        ctype = self.spec["act3_board"]["chart_type"]

        if self._act3_done_chart is not None:
            ch_arr = self._act3_done_chart
            ix, iy = self._act3_done_target
        else:
            ch_rgba = self.chart_base.copy()
            im = Image.fromarray(ch_rgba, "RGBA")
            d = ImageDraw.Draw(im)
            ix, iy, m_label = self._draw_chart_content(d, t)

            if t_col >= 0.0:
                en_c = ease_out_cubic(clamp01(t_col / 0.25))
                if ctype != "rules_ladder":
                    for sy in range(int(iy), py1, 22):
                        d.line([(ix, sy), (ix, min(py1, sy + 12))], fill=(245, 158, 11, int(230 * en_c)), width=4)
                if t_col < 1.1:
                    ru = t_col / 1.1
                    rr = int(14 + ru * 76)
                    ra = int((1.0 - ru) * 230)
                    d.ellipse([ix - rr, iy - rr, ix + rr, iy + rr], outline=(245, 158, 11, ra), width=5)
                d.ellipse([ix - 14, iy - 14, ix + 14, iy + 14], fill=(245, 158, 11, 255), outline=(15, 23, 42, 255), width=4)
                if ctype == "rules_ladder":
                    mw = 280
                    mx0 = int(max(px0, min(px1 - mw, ix - mw // 2)))
                    d.rounded_rectangle([mx0, py1 + 12, mx0 + mw, py1 + 56], radius=10, fill=(245, 158, 11, 255))
                    _center_text(d, (mx0, py1 + 12, mx0 + mw, py1 + 56), m_label, self.fonts.mono_sm, (15, 23, 42, 255), pad_x=12)
                else:
                    mx0 = int(max(px0 + 10, min(px1 - 210, ix - 105)))
                    d.rounded_rectangle([mx0, py1 - 54, mx0 + 210, py1 - 10], radius=10, fill=(245, 158, 11, 255))
                    _center_text(d, (mx0, py1 - 54, mx0 + 210, py1 - 10), m_label, self.fonts.mono_sm, (15, 23, 42, 255), pad_x=10)

            ch_arr = np.array(im)
            done_draw = (
                t >= self.cues["asdr_draw"] + 1.48
                and t >= self.cues["todr_draw"] + 1.48
                and t >= self.acts["3"]["start"] + 2.25
                and t_col >= 1.15
            )
            if done_draw:
                self._act3_done_chart = ch_arr
                self._act3_done_target = (ix, iy)

        cur_prog = ease_in_out_cubic(clamp01((t - (self.cues["v1_collide"] - 0.9)) / 0.9))
        cx = int(px1 - 120 + (ix - (px1 - 120)) * cur_prog)
        cy = int(py1 - 140 + (iy - (py1 - 140)) * cur_prog)

        chart_x, chart_y = 46, 540 + drift_y
        _paste_rgba_roi(frame, ch_arr, chart_x, chart_y)
        _paste_rgba_roi(frame, self.assets.cursor_rgba, chart_x + cx - 12, chart_y + cy - 8)

        if t_col >= 0.08:
            en_p = ease_out_cubic(clamp01((t_col - 0.08) / 0.25))
            px = (W - self.assets.act3_bfl_pill.shape[1]) // 2
            _paste_rgba_roi(frame, self.assets.act3_bfl_pill, px, int(1470 + (1 - en_p) * 35), alpha_scale=en_p)

        return frame

    def _render_act45(self, t: float, act_id: int) -> np.ndarray:
        a4 = self.acts["4"]
        t_v = t - self.cues["verdict_stop"]
        morph = ease_out_cubic(clamp01(t_v / 0.45)) if t_v >= 0.0 else 0.0
        win_opt = self.spec["act45_quiz"]["correct_opt"]

        if morph <= 0.005:
            frame = self.assets.beam_amber.copy()
        elif morph >= 0.995:
            frame = self.assets.beam_emerald.copy()
        else:
            frame = cv2.addWeighted(self.assets.beam_amber, 1.0 - morph, self.assets.beam_emerald, morph, 0.0)

        _paste_rgba_roi(frame, self.assets.quiz_header, (W - self.assets.quiz_header.shape[1]) // 2, 225)

        if win_opt == "A":
            card_a = self.assets.opt_a_win if morph > 0.35 else self.assets.opt_a_idle
            card_b = self.assets.opt_b_idle
            a_alpha, b_alpha = 1.0, 1.0 - 0.72 * morph
        else:
            card_a = self.assets.opt_a_idle
            card_b = self.assets.opt_b_win if morph > 0.35 else self.assets.opt_b_idle
            a_alpha, b_alpha = 1.0 - 0.72 * morph, 1.0

        _paste_rgba_roi(frame, card_a, 46, 590, alpha_scale=a_alpha)
        _paste_rgba_roi(frame, card_b, W - 46 - card_b.shape[1], 590, alpha_scale=b_alpha)

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
        g_pos, g_neg = self.assets.grain_pairs[frame_idx % len(self.assets.grain_pairs)]
        cv2.add(frame, g_pos, dst=frame)
        cv2.subtract(frame, g_neg, dst=frame)
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
        "-rc", "vbr",
        "-cq", "23",
        "-b:v", "4.5M",
        "-maxrate", "6.5M",
        "-bufsize", "13M",
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


def _find_clip(work_dir: Path, names: tuple[str, ...]) -> Path:
    for n in names:
        p = work_dir / n
        if p.exists():
            return p
    raise FileNotFoundError(f"Missing AI clip in {work_dir} (checked {names})")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--topic", default="PERF_TAKEOFF")
    parser.add_argument("--work", default=r"G:\ATPLVECTOR_Videos\v3_AI\_work")
    parser.add_argument("--out", default=r"G:\ATPLVECTOR_Videos\v3_AI\PERF_TAKEOFF_v3_AI.mp4")
    parser.add_argument("--preview-only", action="store_true")
    args = parser.parse_args()

    spec = get_topic_spec(args.topic)
    work_dir = Path(args.work)
    out_mp4 = Path(args.out)
    out_mp4.parent.mkdir(parents=True, exist_ok=True)
    preview_png = out_mp4.parent / f"{out_mp4.stem}_preview.png"

    tl_path = work_dir / "timeline.json"
    if not tl_path.exists():
        raise FileNotFoundError(f"Missing {tl_path} — run gemini_voice_engine.py first.")
    timeline = json.loads(tl_path.read_text(encoding="utf-8"))

    act1_path = _find_clip(work_dir, ("act1_clip.mp4", "act1_runway.mp4"))
    act2_path = _find_clip(work_dir, ("act2_clip.mp4", "act2_diorama.mp4"))
    act1_frames = _load_clip_frames(act1_path)
    act2_frames = _load_clip_frames(act2_path)

    fonts = FontBank()
    assets = PrebuiltAssets(fonts, spec)
    renderer = ReelRenderer(timeline, spec, act1_frames, act2_frames, fonts, assets)

    write_preview_sheet(renderer, preview_png)
    if args.preview_only:
        return

    master_audio = Path(timeline["master_audio"])
    log_path = work_dir / "ffmpeg_video.log"
    render_mp4(renderer, master_audio, out_mp4, log_path)


if __name__ == "__main__":
    main()
