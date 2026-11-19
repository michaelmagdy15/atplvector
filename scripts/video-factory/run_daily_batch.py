#!/usr/bin/env python3
"""
Runs a 10-video daily ATPLVector Reels batch into an external folder (default: G:\\ATPLVECTOR_Videos\\Day_01).
Supports --only PERF_TAKEOFF, --preview-only, --workers N (parallel ProcessPoolExecutor), and --force.
"""

import argparse
import asyncio
import concurrent.futures
import json
import sys
import time
from pathlib import Path

import cv2
import numpy as np

FACTORY_DIR = str(Path(__file__).resolve().parent)
sys.path.insert(0, FACTORY_DIR)
from day1_specs import DAY1_SPECS
from reel_engine import generate_topic_reel

QUEUE_PATH = Path(__file__).resolve().parent / "syllabus_queue.json"


def _worker_render(task: tuple[dict, str, bool]) -> dict:
    spec, out_dir_str, preview_only = task
    if FACTORY_DIR not in sys.path:
        sys.path.insert(0, FACTORY_DIR)
    from reel_engine import generate_topic_reel as _gen
    return asyncio.run(_gen(spec, Path(out_dir_str), preview_only=preview_only))


def run_batch(args):
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.day != 1:
        raise NotImplementedError(
            f"Day {args.day} specs have not been authored yet. Run generate_syllabus_queue.py to view upcoming topics."
        )

    specs = DAY1_SPECS
    if args.only:
        targets = {x.strip().upper() for x in args.only.split(",")}
        specs = [s for s in specs if s["view"] in targets]
        if not specs:
            raise ValueError(f"No matching views found in Day 1 for --only={args.only}")

    to_render: list[dict] = []
    skipped_results: list[dict] = []
    for s in specs:
        mp4_p = out_dir / f"{s['view']}.mp4"
        prev_p = out_dir / f"{s['view']}_preview.png"
        if not args.force and not args.preview_only and mp4_p.exists() and mp4_p.stat().st_size > 100_000 and prev_p.exists():
            print(f"[SKIP] {s['view']}.mp4 already exists ({mp4_p.stat().st_size / (1024*1024):.2f} MB). Use --force to re-render.", flush=True)
            skipped_results.append({
                "view": s["view"],
                "mp4_path": str(mp4_p),
                "preview_path": str(prev_p),
                "size_mb": round(mp4_p.stat().st_size / (1024 * 1024), 2),
            })
        else:
            to_render.append(s)

    print(
        f"=== ATPLVECTOR REELS FACTORY // DAY {args.day} ({len(to_render)} to render, {len(skipped_results)} skipped, workers={args.workers}) -> {out_dir} ===",
        flush=True,
    )
    t_all = time.time()
    rendered_results: list[dict] = []

    if to_render:
        if args.workers <= 1 or len(to_render) == 1:
            for idx, spec in enumerate(to_render, 1):
                print(f"\n[{idx}/{len(to_render)}] Rendering {spec['view']} ({spec['title']})...", flush=True)
                res = asyncio.run(generate_topic_reel(spec, out_dir, preview_only=args.preview_only))
                rendered_results.append(res)
                if args.preview_only:
                    print(f"    Preview ready in {res['elapsed']}s -> {res['preview_path']}", flush=True)
                else:
                    print(
                        f"    DONE in {res['elapsed']}s | {res['duration']}s reel | {res['size_mb']} MB | "
                        f"codec={res['encoder']} -> {res['mp4_path']}",
                        flush=True,
                    )
        else:
            tasks = [(spec, str(out_dir), args.preview_only) for spec in to_render]
            with concurrent.futures.ProcessPoolExecutor(max_workers=args.workers) as pool:
                fut_map = {pool.submit(_worker_render, t): t[0] for t in tasks}
                done_cnt = 0
                for fut in concurrent.futures.as_completed(fut_map):
                    spec = fut_map[fut]
                    res = fut.result()
                    done_cnt += 1
                    rendered_results.append(res)
                    if args.preview_only:
                        print(f"[{done_cnt}/{len(to_render)}] Preview {spec['view']} ready in {res['elapsed']}s", flush=True)
                    else:
                        print(
                            f"[{done_cnt}/{len(to_render)}] DONE {spec['view']} in {res['elapsed']}s | "
                            f"{res['duration']}s | {res['size_mb']} MB | {res['encoder']}",
                            flush=True,
                        )

    all_results = rendered_results + skipped_results

    # Update syllabus_queue.json statuses when actual MP4s were rendered
    if not args.preview_only and QUEUE_PATH.exists():
        qdata = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
        by_view = {r["view"]: r for r in all_results}
        for item in qdata.get("queue", []):
            if item["view"] in by_view:
                item["status"] = "rendered"
                item["outputPath"] = by_view[item["view"]]["mp4_path"]
        QUEUE_PATH.write_text(json.dumps(qdata, indent=2), encoding="utf-8")

    # Build combined Day 1 contact sheet from preview grids in spec order
    preview_imgs = []
    for s in specs:
        p = out_dir / f"{s['view']}_preview.png"
        if p.exists():
            im = cv2.imread(str(p))
            if im is not None:
                preview_imgs.append(cv2.resize(im, (960, 853), interpolation=cv2.INTER_AREA))

    if preview_imgs:
        rows = []
        for i in range(0, len(preview_imgs), 2):
            pair = preview_imgs[i:i + 2]
            if len(pair) == 1:
                pair.append(np.zeros_like(pair[0]))
            rows.append(np.hstack(pair))
        sheet_path = out_dir / f"day{args.day}_contact_sheet.png"
        cv2.imwrite(str(sheet_path), np.vstack(rows))
        print(f"\nMaster contact sheet saved -> {sheet_path}", flush=True)

    print(f"\nBatch finished in {time.time() - t_all:.1f}s total.", flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--day", type=int, default=1)
    parser.add_argument("--out", type=str, default=r"G:\ATPLVECTOR_Videos\Day_01")
    parser.add_argument("--only", type=str, default="", help="Comma-separated View keys to render")
    parser.add_argument("--workers", type=int, default=3, help="Number of parallel render workers")
    parser.add_argument("--force", action="store_true", help="Re-render existing MP4s")
    parser.add_argument("--preview-only", action="store_true")
    args = parser.parse_args()
    run_batch(args)


if __name__ == "__main__":
    main()
