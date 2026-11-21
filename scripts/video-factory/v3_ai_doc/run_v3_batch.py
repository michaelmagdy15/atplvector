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
import re
import shutil
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
GDRIVE_FOLDER_ID = "1CTzK5RtHsvJtqTNyysjLByYCibqiRS8Z"

if str(THIS_DIR) not in sys.path:
    sys.path.insert(0, str(THIS_DIR))
from v3_topic_specs import DAY_BATCHES, get_topic_spec  # noqa: E402


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


def _find_gdrive_exe() -> str:
    exe = shutil.which("gdrive") or shutil.which("gdrive.cmd") or shutil.which("gdrive.exe")
    if not exe:
        raise FileNotFoundError("Google Drive CLI (`gdrive`) not found on PATH.")
    return exe


def _fetch_drive_map(gdrive_exe: str) -> dict[str, str]:
    for attempt in range(4):
        try:
            raw = subprocess.check_output(
                [gdrive_exe, "readonly", "ls", GDRIVE_FOLDER_ID, "--max", "0", "--json"],
                text=True,
                stderr=subprocess.PIPE,
            )
            out: dict[str, str] = {}
            for item in json.loads(raw):
                name = item.get("name", "")
                if name.upper().endswith(".MP4") and item.get("id"):
                    out[name[:-4].upper()] = item["id"]
            return out
        except subprocess.CalledProcessError as exc:
            err = (exc.stderr or "") + (exc.stdout or "")
            if attempt < 3 and any(k in err.lower() for k in ("ratelimit", "rate_limit", "403", "429")):
                wait_s = 65 + attempt * 30
                print(f"[Drive] Rate limited listing folder; sleeping {wait_s}s before retry...", flush=True)
                time.sleep(wait_s)
                continue
            raise
    return {}


def _upload_to_gdrive(gdrive_exe: str, view: str, mp4_path: Path, drive_map: dict[str, str]) -> None:
    cmd = (
        [gdrive_exe, "mutate", "update", drive_map[view], str(mp4_path)]
        if view in drive_map
        else [
            gdrive_exe,
            "mutate",
            "upload",
            str(mp4_path),
            "--parent",
            GDRIVE_FOLDER_ID,
            "--mime-type",
            "video/mp4",
        ]
    )
    action = f"update {view}.mp4 ({drive_map[view]})" if view in drive_map else f"upload {view}.mp4"
    for attempt in range(4):
        print(f"  -> Google Drive {action}" + (f" (retry {attempt})" if attempt else ""), flush=True)
        res = subprocess.run(cmd, check=False, text=True, capture_output=True)
        if res.returncode == 0:
            m = re.search(r"ID:\s*([a-zA-Z0-9_-]{20,})", res.stdout or "")
            if m:
                drive_map[view] = m.group(1)
            if res.stdout:
                print(f"     {res.stdout.strip()}", flush=True)
            return
        err = (res.stderr or res.stdout or "").strip()
        err_l = err.lower()
        if attempt < 3 and any(k in err_l for k in ("ratelimit", "rate_limit", "403", "429", "500", "503", "timeout")):
            wait_s = 65 + attempt * 30
            print(f"  [Warn] Drive rate limit / transient error ({err[:140]}); sleeping {wait_s}s...", flush=True)
            time.sleep(wait_s)
            continue
        raise RuntimeError(f"gdrive mutate failed (exit {res.returncode}) for {view}: {err}")


def _stitch_master_sheet(views: list[str], out_dir: Path, sheet_name: str) -> Path | None:
    thumbs = []
    for v in views:
        p = out_dir / f"{v}_preview.png"
        if p.exists():
            im = cv2.imread(str(p))
            if im is not None:
                thumb = cv2.resize(im, (960, 1138), interpolation=cv2.INTER_AREA)
                cv2.rectangle(thumb, (0, 0), (420, 48), (15, 23, 42), -1)
                cv2.putText(
                    thumb, v, (14, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.85, (251, 191, 36), 2, cv2.LINE_AA
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
    out_sheet = out_dir / sheet_name
    cv2.imwrite(str(out_sheet), sheet)
    return out_sheet


def _can_reuse_legacy_takeoff() -> bool:
    needed = ("timeline.json", "master_audio.wav", "act1_runway.mp4", "act2_diorama.mp4")
    return all((LEGACY_V3_TAKEOFF_WORK / f).exists() for f in needed)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--day", type=int, default=1, choices=sorted(DAY_BATCHES))
    parser.add_argument("--out", default="", help="Defaults to G:\\ATPLVECTOR_Videos\\Day_0<day>_v3")
    parser.add_argument("--only", default="", help="Comma-separated VIEW keys to render")
    parser.add_argument("--quality", default="medium", choices=["draft", "medium", "good"])
    parser.add_argument("--seconds", type=float, default=5.0)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--preview-only", action="store_true")
    parser.add_argument("--upload", action="store_true", help="Upload each finished MP4 to Google Drive")
    parser.add_argument("--sync", action="store_true", help="Run sync_gdrive_folder.py --gdrive-cli after batch")
    args = parser.parse_args()

    out_dir = Path(args.out) if args.out else Path(rf"G:\ATPLVECTOR_Videos\Day_{args.day:02d}_v3")
    out_dir.mkdir(parents=True, exist_ok=True)

    day_order = DAY_BATCHES[args.day]
    targets = (
        [x.strip().upper() for x in args.only.split(",") if x.strip()]
        if args.only
        else list(day_order)
    )
    for v in targets:
        get_topic_spec(v)

    gdrive_exe = _find_gdrive_exe() if args.upload else ""
    drive_map = _fetch_drive_map(gdrive_exe) if (args.upload and not args.preview_only) else {}
    if args.upload and not args.preview_only:
        print(f"[Drive] Indexed {len(drive_map)} existing MP4(s) in folder {GDRIVE_FOLDER_ID}", flush=True)

    print(
        f"=== ATPLVECTOR Day {args.day} v3 AI REELS BATCH ({len(targets)} topics, quality={args.quality}, "
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
            _update_queue(view, mp4_path, meta)
            print(
                f"[{idx}/{len(targets)}] [SKIP] {view}.mp4 already verified "
                f"({meta['duration']}s, {meta['size_mb']} MB)",
                flush=True,
            )
            if args.upload and view not in drive_map:
                _upload_to_gdrive(gdrive_exe, view, mp4_path, drive_map)
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
            if args.upload:
                _upload_to_gdrive(gdrive_exe, view, mp4_path, drive_map)
            elapsed = round(time.time() - t0, 1)
            print(
                f"  [OK] {view}.mp4 ({meta['duration']}s, {meta['size_mb']} MB, {elapsed}s total)",
                flush=True,
            )
            summary.append({"view": view, **meta, "path": str(mp4_path)})

    sheet = _stitch_master_sheet(day_order, out_dir, f"day{args.day}_v3_master_sheet.png")
    if sheet:
        print(f"\n[Batch] Master preview sheet -> {sheet}", flush=True)
    if args.sync and not args.preview_only:
        _run_step(
            [py, "-u", str(FACTORY_DIR / "sync_gdrive_folder.py"), "--gdrive-cli"],
            "Sync Google Drive folder -> data/topicVideos.ts",
        )
    print(f"[Batch] Finished {len(summary)}/{len(targets)} requested videos cleanly.", flush=True)


if __name__ == "__main__":
    main()
