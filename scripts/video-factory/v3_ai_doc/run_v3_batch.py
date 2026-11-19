#!/usr/bin/env python3
"""
Resumable Day 1 (10-Video) v3 Netflix Documentary AI Reels Batch Runner.

Pipeline per topic:
1. gemini_voice_engine.py (--topic <VIEW>) -> human narration + Whisper timeline + SFX mix
2. comfy_minimax_gen.py   (--topic <VIEW>) -> vertical 9:16 ComfyUI MiniMax H3 clips
3. assemble_v3_reel.py    (--topic <VIEW>) -> 1080x1920@30fps NVENC MP4 + 6-act preview PNG
4. ffprobe stream check + incremental syllabus_queue.json status update

Outputs directly to G:\\ATPLVECTOR_Videos\\Day_01_v3\\<VIEW_KEY>.mp4 for direct
upload to Google Drive & auto-sync via scripts/video-factory/sync_gdrive_folder.py.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

import cv2
import numpy as np

THIS_DIR = Path(__file__).resolve().parent
FACTORY_DIR = THIS_DIR.parent
QUEUE_PATH = FACTORY_DIR / "syllabus_queue.json"
LEGACY_V3_TAKEOFF_WORK = Path(r"G:\ATPLVECTOR_Videos\v3_AI\_work")

if str(THIS_DIR) not in sys.path:
    sys.path.insert(0, str(THIS_DIR))
from v3_topic_specs import DAY1_ORDER, get_topic_spec  # noqa: E402


def _run_step(cmd: list[str], label: str) -> None:
    print(f"  -> {label}", flush=True)
    res = subprocess.run(cmd, check=False)
    if res.returncode != 0:
        raise RuntimeError(f"Step failed (exit {res.returncode}): {' '.join(cmd)}")


def _ffprobe_verify(mp4_path: Path) -> dict:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate",
            "-of",
            "json",
            str(mp4_path),
        ],
        text=True,
    )
    data = json.loads(out)
    streams = {s["codec_type"]: s for s in data.get("streams", [])}
    v = streams.get("video") or {}
    a = streams.get("audio") or {}
    dur = float((data.get("format") or {}).get("duration") or 0.0)
    size_mb = float((data.get("format") or {}).get("size") or 0) / (1024 * 1024)
    if v.get("codec_name") != "h264" or v.get("width") != 1080 or v.get("height") != 1920:
        raise RuntimeError(f"Invalid video stream in {mp4_path}: {v}")
    if a.get("codec_name") != "aac":
        raise RuntimeError(f"Invalid audio stream in {mp4_path}: {a}")
    if dur < 35.0:
        raise RuntimeError(f"Unexpected short duration ({dur:.2f}s) in {mp4_path}")
    return {
        "duration": round(dur, 2),
        "size_mb": round(size_mb, 2),
        "fps": v.get("r_frame_rate"),
    }


def _update_queue(view: str, mp4_path: Path, meta: dict) -> None:
    if not QUEUE_PATH.exists():
        return
    qdata = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    for item in qdata.get("queue", []):
        if item.get("view") == view:
            item["status"] = "rendered_v3"
            item["outputPath"] = str(mp4_path)
            item["durationSec"] = meta["duration"]
            item["sizeMb"] = meta["size_mb"]
    QUEUE_PATH.write_text(json.dumps(qdata, indent=2), encoding="utf-8")


def _stitch_master_sheet(views: list[str], out_dir: Path) -> Path | None:
    thumbs = []
    for v in views:
        p = out_dir / f"{v}_preview.png"
        if p.exists():
            im = cv2.imread(str(p))
            if im is not None:
                thumb = cv2.resize(im, (960, 1138), interpolation=cv2.INTER_AREA)
                cv2.rectangle(thumb, (0, 0), (360, 48), (15, 23, 42), -1)
                cv2.putText(
                    thumb, v, (14, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (251, 191, 36), 2, cv2.LINE_AA
                )
                thumbs.append(thumb)
    if not thumbs:
        return None
    rows = []
    for i in range(0, len(thumbs), 2):
        pair = thumbs[i : i + 2]
        if len(pair) == 1:
            pair.append(np.zeros_like(pair[0]))
        rows.append(np.hstack(pair))
    sheet = np.vstack(rows)
    out_sheet = out_dir / "day1_v3_master_sheet.png"
    cv2.imwrite(str(out_sheet), sheet)
    return out_sheet


def _can_reuse_legacy_takeoff() -> bool:
    needed = ("timeline.json", "master_audio.wav", "act1_runway.mp4", "act2_diorama.mp4")
    return all((LEGACY_V3_TAKEOFF_WORK / f).exists() for f in needed)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=r"G:\ATPLVECTOR_Videos\Day_01_v3")
    parser.add_argument("--only", default="", help="Comma-separated VIEW keys to render")
    parser.add_argument("--quality", default="medium", choices=["draft", "medium", "good"])
    parser.add_argument("--seconds", type=float, default=5.0)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--preview-only", action="store_true")
    args = parser.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    targets = (
        [x.strip().upper() for x in args.only.split(",") if x.strip()]
        if args.only
        else list(DAY1_ORDER)
    )
    for v in targets:
        get_topic_spec(v)

    print(
        f"=== ATPLVECTOR v3 AI REELS BATCH ({len(targets)} topics, quality={args.quality}, "
        f"clip_sec={args.seconds}) -> {out_dir} ===",
        flush=True,
    )

    py = sys.executable
    summary: list[dict] = []
    last_gemini_call = 0.0

    for idx, view in enumerate(targets, 1):
        mp4_path = out_dir / f"{view}.mp4"
        preview_png = out_dir / f"{view}_preview.png"

        if (
            not args.force
            and not args.preview_only
            and mp4_path.exists()
            and mp4_path.stat().st_size > 1_000_000
            and preview_png.exists()
        ):
            meta = _ffprobe_verify(mp4_path)
            print(
                f"[{idx}/{len(targets)}] [SKIP] {view}.mp4 already verified "
                f"({meta['duration']}s, {meta['size_mb']} MB)",
                flush=True,
            )
            summary.append({"view": view, **meta, "path": str(mp4_path)})
            continue

        t0 = time.time()
        print(f"\n[{idx}/{len(targets)}] Building {view} ({get_topic_spec(view)['title']})...", flush=True)

        if view == "PERF_TAKEOFF" and not args.force and _can_reuse_legacy_takeoff():
            work_dir = LEGACY_V3_TAKEOFF_WORK
            print(f"  -> Reusing verified Gemini/ComfyUI work dir: {work_dir}", flush=True)
        else:
            work_dir = out_dir / "_work" / view
            work_dir.mkdir(parents=True, exist_ok=True)

            # Polite 5s pacing pause between live Gemini TTS API calls
            tl_exists = (work_dir / "timeline.json").exists() and (work_dir / "master_audio.wav").exists()
            if (args.force or not tl_exists) and last_gemini_call > 0:
                gap = time.time() - last_gemini_call
                if gap < 5.0:
                    time.sleep(5.0 - gap)

            voice_cmd = [
                py, "-u", str(THIS_DIR / "gemini_voice_engine.py"),
                "--topic", view,
                "--out", str(work_dir),
            ]
            if args.force:
                voice_cmd.append("--force")
            _run_step(voice_cmd, f"Voice + Whisper Alignment + Mix ({view})")
            if not tl_exists or args.force:
                last_gemini_call = time.time()

            comfy_cmd = [
                py, "-u", str(THIS_DIR / "comfy_minimax_gen.py"),
                "--topic", view,
                "--out", str(work_dir),
                "--quality", args.quality,
                "--seconds", str(args.seconds),
            ]
            if args.force:
                comfy_cmd.append("--force")
            _run_step(comfy_cmd, f"ComfyUI MiniMax H3 9:16 AI Clips ({view})")

        asm_cmd = [
            py, "-u", str(THIS_DIR / "assemble_v3_reel.py"),
            "--topic", view,
            "--work", str(work_dir),
            "--out", str(mp4_path),
        ]
        if args.preview_only:
            asm_cmd.append("--preview-only")
        _run_step(asm_cmd, f"Compositor + NVENC Encode ({view})")

        if not args.preview_only:
            meta = _ffprobe_verify(mp4_path)
            _update_queue(view, mp4_path, meta)
            elapsed = round(time.time() - t0, 1)
            print(
                f"  [OK] {view}.mp4 ({meta['duration']}s, {meta['size_mb']} MB, {elapsed}s total)",
                flush=True,
            )
            summary.append({"view": view, **meta, "path": str(mp4_path)})

    sheet = _stitch_master_sheet(DAY1_ORDER, out_dir)
    if sheet:
        print(f"\n[Batch] Master preview sheet -> {sheet}", flush=True)
    print(f"[Batch] Finished {len(summary)}/{len(targets)} requested videos cleanly.", flush=True)


if __name__ == "__main__":
    main()
