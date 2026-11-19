#!/usr/bin/env python3
"""
Syncs ATPLVECTOR videos from the public Google Drive folder
(1CTzK5RtHsvJtqTNyysjLByYCibqiRS8Z) into data/topicVideos.ts.

Supports:
  1. Direct scraping of public Google Drive folder HTML (zero API key needed, up to ~50 files per folder).
  2. Optional Google Drive v3 API (--api-key <KEY>) for unlimited files & nested subject subfolders.
  3. Optional TSV/CSV file (--links-file <path>) with `VIEW_KEY.mp4<tab>URL_OR_ID` pairs.

Files should be named `<VIEW_KEY>.mp4` (e.g. `POF_HIGH_SPEED.mp4`, `PERF_TAKEOFF.mp4`).
"""

import argparse
import html
import json
import re
import urllib.request
from pathlib import Path

FOLDER_ID = "1CTzK5RtHsvJtqTNyysjLByYCibqiRS8Z"
ROOT = Path(__file__).resolve().parents[2]
TOPIC_VIDEOS_TS = ROOT / "data" / "topicVideos.ts"
QUEUE_PATH = Path(__file__).resolve().parent / "syllabus_queue.json"
SPECS_FILE = Path(__file__).resolve().parent / "day1_specs.py"


def extract_id_from_url(val: str) -> str:
    m = re.search(r"/d/([a-zA-Z0-9_-]{20,})", val)
    if m:
        return m.group(1)
    m2 = re.search(r"id=([a-zA-Z0-9_-]{20,})", val)
    if m2:
        return m2.group(1)
    return val.strip()


def fetch_public_folder(folder_id: str) -> dict[str, str]:
    """Fetch public Google Drive folder HTML and extract {VIEW_KEY: fileId} for .mp4 files."""
    url = f"https://drive.google.com/drive/folders/{folder_id}?usp=sharing"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = html.unescape(resp.read().decode("utf-8", errors="ignore"))

    title_m = re.search(r"<title>(.*?)</title>", raw)
    folder_title = title_m.group(1) if title_m else "Unknown"
    print(f"Connected to Google Drive Folder: {folder_title}")

    found: dict[str, str] = {}
    # Match Drive embedded JSON tuples containing [fileId, ..., "NAME.mp4"]
    for m in re.finditer(r'\["([a-zA-Z0-9_-]{20,})"[^\]]*?"([A-Z0-9_]+\.mp4)"', raw):
        fid, fname = m.group(1), m.group(2)
        view_key = fname[:-4]
        found[view_key] = fid
    return found


def fetch_via_api_key(folder_id: str, api_key: str) -> dict[str, str]:
    found: dict[str, str] = {}
    q = f"'{folder_id}'+in+parents+and+trashed=false"
    page_token = ""
    while True:
        url = (
            f"https://www.googleapis.com/drive/v3/files"
            f"?q={q}&fields=nextPageToken,files(id,name,mimeType)&pageSize=1000&key={api_key}"
        )
        if page_token:
            url += f"&pageToken={page_token}"
        with urllib.request.urlopen(url, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        for f in data.get("files", []):
            name = f.get("name", "")
            if f.get("mimeType") == "application/vnd.google-apps.folder":
                found.update(fetch_via_api_key(f["id"], api_key))
            elif name.upper().endswith(".MP4"):
                view_key = name[:-4].upper()
                found[view_key] = f["id"]
        page_token = data.get("nextPageToken", "")
        if not page_token:
            break
    return found


def load_links_file(path: Path) -> dict[str, str]:
    found: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = re.split(r"[\t,; ]+", line, maxsplit=1)
        if len(parts) == 2:
            view_key = parts[0].replace(".mp4", "").replace(".MP4", "").strip().upper()
            found[view_key] = extract_id_from_url(parts[1])
    return found


def update_topic_videos_ts(mapping: dict[str, str]) -> int:
    src = TOPIC_VIDEOS_TS.read_text(encoding="utf-8")
    updated = 0
    for view_key, file_id in mapping.items():
        # Update existing entry's driveFileId if present
        pat = re.compile(
            rf"(\[View\.{re.escape(view_key)}\]:\s*\{{[^}}]*?driveFileId:\s*')([^']*)(')"
        )
        if pat.search(src):
            src, n = pat.subn(rf"\g<1>{file_id}\g<3>", src, count=1)
            updated += n
        else:
            # Append new entry using metadata from syllabus_queue.json if available
            subj = view_key.split("_")[0]
            title = view_key.replace("_", " ").title()
            desc = f"Bite-sized EASA ATPL breakdown for {title}."
            day_batch = 2
            if QUEUE_PATH.exists():
                qdata = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
                for item in qdata.get("queue", []):
                    if item["view"] == view_key:
                        subj = item["subjectCode"]
                        title = item["label"]
                        desc = item.get("desc") or desc
                        day_batch = item.get("dayBatch", 2)
                        break
            block = (
                f"  [View.{view_key}]: {{\n"
                f"    view: View.{view_key},\n"
                f"    subjectCode: '{subj}',\n"
                f"    title: {json.dumps(title)},\n"
                f"    durationSec: 36,\n"
                f"    examTakeaway: {json.dumps(desc)},\n"
                f"    driveFileId: '{file_id}',\n"
                f"    dayBatch: {day_batch},\n"
                f"  }},\n"
            )
            marker = "};\n\nexport function hasPlayableVideo"
            if marker in src:
                src = src.replace(marker, block + marker, 1)
                updated += 1

    TOPIC_VIDEOS_TS.write_text(src, encoding="utf-8")
    return updated


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--folder-id", default=FOLDER_ID)
    parser.add_argument("--api-key", default="")
    parser.add_argument("--links-file", default="")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.links_file:
        mapping = load_links_file(Path(args.links_file))
    elif args.api_key:
        mapping = fetch_via_api_key(args.folder_id, args.api_key)
    else:
        mapping = fetch_public_folder(args.folder_id)

    print(f"Discovered {len(mapping)} <VIEW_KEY>.mp4 video(s) in Google Drive folder.")
    for k, v in sorted(mapping.items()):
        print(f"  {k:22s} -> {v}")

    if not args.dry_run and mapping:
        count = update_topic_videos_ts(mapping)
        print(f"Updated {count} entry(ies) in {TOPIC_VIDEOS_TS}.")
    elif args.dry_run:
        print("Dry-run complete (no files modified).")


if __name__ == "__main__":
    main()
