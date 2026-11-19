#!/usr/bin/env python3
"""
Headless ComfyUI MiniMax H3 Vertical AI Clip Generator for ATPLVector v3.

Generates the two vertical 9:16 AI documentary clips via ComfyUI's
`/continuity/render` endpoint (using quantized H3 FL2VA + 8-step Turbo LoRA +
built-in `kitchen` attention kernel), downloads outputs to `_work/`, and builds
3-frame visual verification contact strips (`act1_check.png`, `act2_check.png`).
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import cv2
import numpy as np

THIS_DIR = Path(__file__).resolve().parent
if str(THIS_DIR) not in sys.path:
    sys.path.insert(0, str(THIS_DIR))
from v3_topic_specs import get_topic_spec  # noqa: E402

DEFAULT_URL = "http://127.0.0.1:8188"


def build_clip_specs(topic_spec: dict) -> list[dict]:
    return [
        {
            "name": "act1",
            "filename": "act1_clip.mp4",
            "alt_filename": "act1_runway.mp4",
            "check_png": "act1_check.png",
            "seed": int(topic_spec["seed_1"]),
            "prompt": topic_spec["act1_prompt"],
        },
        {
            "name": "act2",
            "filename": "act2_clip.mp4",
            "alt_filename": "act2_diorama.mp4",
            "check_png": "act2_check.png",
            "seed": int(topic_spec["seed_2"]),
            "prompt": topic_spec["act2_prompt"],
        },
    ]


def _http_json(url: str, body: dict | None = None, timeout: int = 120) -> dict:
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Content-Type": "application/json"} if body is not None else {}
    req = urllib.request.Request(
        url, data=data, headers=headers, method="POST" if body is not None else "GET"
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        msg = exc.read().decode("utf-8", "replace")
        raise RuntimeError(f"HTTP {exc.code} from {url}: {msg}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Cannot reach ComfyUI at {url}: {exc.reason}") from exc


def _http_bytes(url: str, timeout: int = 300) -> bytes:
    with urllib.request.urlopen(url, timeout=timeout) as resp:
        return resp.read()


def check_comfy_h3_ready(base_url: str) -> None:
    info = _http_json(f"{base_url}/continuity/render")
    h3 = next((f for f in info.get("families", []) if f.get("id") == "h3"), None)
    if not h3:
        raise RuntimeError("ComfyUI /continuity/render did not list 'h3' family.")
    if not h3.get("ready"):
        raise RuntimeError(f"ComfyUI MiniMax H3 is not ready: missing={h3.get('missing')}")
    if not (h3.get("fast") or {}).get("switch"):
        raise RuntimeError("ComfyUI MiniMax H3 fast turbo switch unavailable.")
    print(f"[ComfyUI] H3 ready! picks={h3.get('picks')}", flush=True)


def _extract_failure(entry: dict) -> str | None:
    for kind, data in (entry.get("status") or {}).get("messages") or []:
        if kind == "execution_error":
            return f"{data.get('node_type')}: {data.get('exception_message', '').strip()}"
        if kind == "execution_interrupted":
            return "Render interrupted"
    return None


def _extract_outputs(entry: dict) -> list[dict]:
    files = []
    for node in (entry.get("outputs") or {}).values():
        for key in ("mmc_video", "videos"):
            for item in node.get(key) or []:
                if item.get("type", "output") == "output":
                    files.append(item)
    return files


def _render_single_clip(
    base_url: str,
    clip: dict,
    short_edge: int,
    seconds: float,
    quality: str,
    chunk_ffn: bool,
) -> tuple[bytes, float]:
    payload = {
        "family": "h3",
        "prompt": clip["prompt"],
        "aspect": "9:16",
        "short_edge": int(short_edge),
        "seconds": float(seconds),
        "seed": int(clip["seed"]),
        "fast": True,
        "quality": quality,
        "accel": {
            "attention": "kitchen",
            "chunk_ffn": bool(chunk_ffn),
        },
    }
    print(
        f"[ComfyUI] Queuing {clip['name']} (edge={short_edge}, sec={seconds}, "
        f"quality={quality}, chunk_ffn={chunk_ffn}, seed={clip['seed']})...",
        flush=True,
    )
    queued = _http_json(f"{base_url}/continuity/render", body=payload)
    prompt_id = queued["prompt_id"]
    print(f"   prompt_id={prompt_id} speed={queued.get('speed')}", flush=True)

    started = time.time()
    last_log = -15.0
    while True:
        hist = _http_json(f"{base_url}/history/{prompt_id}")
        entry = hist.get(prompt_id)
        elapsed = time.time() - started
        if entry and (entry.get("status") or {}).get("completed") is not None:
            err = _extract_failure(entry)
            if not entry["status"]["completed"] or err:
                raise RuntimeError(err or "Unknown ComfyUI render failure")
            files = _extract_outputs(entry)
            if not files:
                raise RuntimeError(f"ComfyUI finished {prompt_id} but returned no video file.")
            item = files[0]
            q = urllib.parse.urlencode({
                "filename": item["filename"],
                "subfolder": item.get("subfolder") or "",
                "type": item.get("type") or "output",
            })
            data = _http_bytes(f"{base_url}/view?{q}")
            return data, elapsed

        if elapsed - last_log >= 15.0:
            qinfo = _http_json(f"{base_url}/queue")
            running = [it[1] for it in qinfo.get("queue_running") or []]
            pending = [it[1] for it in qinfo.get("queue_pending") or []]
            state = "rendering" if prompt_id in running else f"queued({len(pending)})"
            print(f"   [{clip['name']}] {state} ... {elapsed:.0f}s elapsed", flush=True)
            last_log = elapsed
        time.sleep(3.0)


def _write_check_strip(video_path: Path, out_png: Path) -> dict:
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open generated clip: {video_path}")
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = float(cap.get(cv2.CAP_PROP_FPS) or 24.0)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    indices = [0, max(0, total // 2), max(0, total - 1)]
    panels = []
    for idx in indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ok, frame = cap.read()
        if not ok or frame is None:
            frame = np.zeros((h, w, 3), dtype=np.uint8)
        thumb = cv2.resize(frame, (360, 640), interpolation=cv2.INTER_AREA)
        cv2.putText(
            thumb,
            f"f{idx}/{total} ({idx/max(fps,1):.1f}s)",
            (14, 34),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 255, 255),
            2,
            cv2.LINE_AA,
        )
        panels.append(thumb)
    cap.release()

    strip = cv2.hconcat(panels)
    cv2.imwrite(str(out_png), strip)
    return {"width": w, "height": h, "frames": total, "fps": round(fps, 2)}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--topic", default="PERF_TAKEOFF")
    parser.add_argument("--url", default=DEFAULT_URL)
    parser.add_argument("--out", default=r"G:\ATPLVECTOR_Videos\v3_AI\_work")
    parser.add_argument("--quality", default="medium", choices=["draft", "medium", "good"])
    parser.add_argument("--short-edge", type=int, default=576)
    parser.add_argument("--seconds", type=float, default=5.0)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--only", choices=["act1", "act2"], default=None)
    args = parser.parse_args()

    spec = get_topic_spec(args.topic)
    clips = build_clip_specs(spec)

    base_url = args.url.rstrip("/")
    work_dir = Path(args.out)
    work_dir.mkdir(parents=True, exist_ok=True)

    check_comfy_h3_ready(base_url)

    manifest = {}
    targets = [c for c in clips if not args.only or c["name"] == args.only]

    for clip in targets:
        mp4_path = work_dir / clip["filename"]
        alt_path = work_dir / clip["alt_filename"]
        check_path = work_dir / clip["check_png"]
        existing = mp4_path if mp4_path.exists() else (alt_path if alt_path.exists() else None)
        if existing and check_path.exists() and not args.force:
            print(f"[ComfyUI] [{spec['view']}] Reusing existing {existing}", flush=True)
            manifest[clip["name"]] = _write_check_strip(existing, check_path)
            continue

        try:
            raw_bytes, took = _render_single_clip(
                base_url,
                clip,
                short_edge=args.short_edge,
                seconds=args.seconds,
                quality=args.quality,
                chunk_ffn=False,
            )
        except Exception as exc:
            err_l = str(exc).lower()
            if "out of memory" in err_l or "cuda" in err_l or "alloc" in err_l or "576" in err_l:
                print(
                    f"[ComfyUI] Retrying {clip['name']} with OOM-safe settings "
                    f"(short_edge=480, quality=medium, seconds=5, chunk_ffn=True): {exc}",
                    flush=True,
                )
                raw_bytes, took = _render_single_clip(
                    base_url,
                    clip,
                    short_edge=480,
                    seconds=5.0,
                    quality="medium",
                    chunk_ffn=True,
                )
            else:
                raise

        mp4_path.write_bytes(raw_bytes)
        meta = _write_check_strip(mp4_path, check_path)
        meta["elapsed_s"] = round(took, 1)
        meta["bytes"] = len(raw_bytes)
        manifest[clip["name"]] = meta
        print(
            f"[ComfyUI] [{spec['view']}] Saved {mp4_path} ({len(raw_bytes)/1e6:.2f} MB, {took:.1f}s, "
            f"{meta['width']}x{meta['height']}, {meta['frames']}f) | preview={check_path}",
            flush=True,
        )

    (work_dir / "clips_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
