#!/usr/bin/env python3
"""
Extracts every ATPL topic View across all subjects from data/sidebarNavigation.ts
and config/subjectRoutes.ts, and schedules them into 10-video daily production batches.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SIDEBAR_TS = ROOT / "data" / "sidebarNavigation.ts"
SUBJECT_ROUTES_TS = ROOT / "config" / "subjectRoutes.ts"
QUEUE_PATH = Path(__file__).resolve().parent / "syllabus_queue.json"

DAY1_PRIORITY = [
    "PERF_INTRO",
    "PERF_TAKEOFF",
    "PERF_CLIMB",
    "PERF_CRUISE",
    "PERF_LANDING",
    "PERF_CLASS_A",
    "PERF_CLASS_B",
    "POF_HIGH_SPEED",
    "POF_STALL",
    "POF_DRAG",
]

SUBJECT_NAMES = {
    "010": "Air Law",
    "021": "AGK: Systems",
    "022": "Instrumentation",
    "031": "Mass & Balance",
    "032": "Performance",
    "033": "Flight Planning",
    "040": "Human Performance",
    "050": "Meteorology",
    "061": "General Navigation",
    "062": "Radio Navigation",
    "070": "Operational Procedures",
    "081": "Principles of Flight",
    "082": "PoF - Helicopters",
    "090": "Communications",
    "100": "KSA",
}


def extract_topics() -> dict[str, dict]:
    topics: dict[str, dict] = {}

    # 1. Parse sidebarNavigation.ts
    sb_src = SIDEBAR_TS.read_text(encoding="utf-8")
    blocks = re.split(r"\{\s*id:\s*'", sb_src)[1:]
    for b in blocks:
        subj_id = b.split("'")[0]
        if subj_id == "FAA":
            continue
        for m in re.finditer(r"\{\s*label:\s*'([^']+)',\s*view:\s*View\.([A-Z0-9_]+)", b):
            label, view = m.group(1), m.group(2)
            if view.endswith("_HOME") or view == "DASHBOARD":
                continue
            if view not in topics:
                topics[view] = {
                    "view": view,
                    "subjectCode": subj_id,
                    "subjectName": SUBJECT_NAMES.get(subj_id, subj_id),
                    "label": label,
                    "desc": "",
                    "status": "pending",
                }

    # 2. Enrich / add any extra modules from config/subjectRoutes.ts
    sr_src = SUBJECT_ROUTES_TS.read_text(encoding="utf-8")
    sr_blocks = re.split(r"\[View\.[A-Z0-9_]+\]:\s*\{", sr_src)[1:]
    for b in sr_blocks:
        cm = re.search(r'subjectCode:\s*"([^"]+)"', b)
        if not cm:
            continue
        subj_id = cm.group(1)
        if subj_id in ("FAA", "PPL"):
            continue
        for m in re.finditer(
            r"\{\s*title:\s*'([^']+)',\s*desc:\s*'([^']*)',\s*view:\s*View\.([A-Z0-9_]+)", b
        ):
            title, desc, view = m.group(1), m.group(2), m.group(3)
            if view.endswith("_HOME") or view == "DASHBOARD":
                continue
            if view not in topics:
                topics[view] = {
                    "view": view,
                    "subjectCode": subj_id,
                    "subjectName": SUBJECT_NAMES.get(subj_id, subj_id),
                    "label": title,
                    "desc": desc,
                    "status": "pending",
                }
            elif not topics[view]["desc"] and desc:
                topics[view]["desc"] = desc

    # Also handle double-quoted desc or title lines in subjectRoutes.ts
    for b in sr_blocks:
        cm = re.search(r'subjectCode:\s*"([^"]+)"', b)
        if not cm:
            continue
        subj_id = cm.group(1)
        for m in re.finditer(
            r"title:\s*['\"]([^'\"]+)['\"],\s*desc:\s*['\"]([^'\"]*)['\"],\s*view:\s*View\.([A-Z0-9_]+)",
            b,
        ):
            title, desc, view = m.group(1), m.group(2), m.group(3)
            if view.endswith("_HOME") or view == "DASHBOARD":
                continue
            if view not in topics:
                topics[view] = {
                    "view": view,
                    "subjectCode": subj_id,
                    "subjectName": SUBJECT_NAMES.get(subj_id, subj_id),
                    "label": title,
                    "desc": desc,
                    "status": "pending",
                }
            elif not topics[view]["desc"] and desc:
                topics[view]["desc"] = desc

    return topics


def build_queue():
    topics = extract_topics()

    # Preserve completed status / driveFileId if syllabus_queue.json already exists
    existing_status: dict[str, dict] = {}
    if QUEUE_PATH.exists():
        try:
            old = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
            for item in old.get("queue", []):
                existing_status[item["view"]] = {
                    "status": item.get("status", "pending"),
                    "outputPath": item.get("outputPath"),
                    "driveFileId": item.get("driveFileId"),
                }
        except Exception:
            pass

    ordered: list[dict] = []
    seen = set()

    # Day 1 exact 10 topics first
    for v in DAY1_PRIORITY:
        if v in topics:
            ordered.append(topics[v])
            seen.add(v)

    # Remaining topics sorted by subjectCode then appearance
    remaining = [t for v, t in topics.items() if v not in seen]
    remaining.sort(key=lambda x: (x["subjectCode"], x["view"]))
    ordered.extend(remaining)

    # Assign 10-video day batches & restore saved status
    for idx, item in enumerate(ordered):
        item["dayBatch"] = (idx // 10) + 1
        item["indexInBatch"] = (idx % 10) + 1
        if item["view"] in existing_status:
            item.update(existing_status[item["view"]])

    # Subject summary
    by_subj: dict[str, int] = {}
    for item in ordered:
        sc = item["subjectCode"]
        by_subj[sc] = by_subj.get(sc, 0) + 1

    payload = {
        "totalTopics": len(ordered),
        "videosPerDay": 10,
        "totalDays": (len(ordered) + 9) // 10,
        "subjectCounts": dict(sorted(by_subj.items())),
        "queue": ordered,
    }
    QUEUE_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Generated syllabus_queue.json: {payload['totalTopics']} ATPL topics across {payload['totalDays']} days (10/day).")
    for sc, cnt in payload["subjectCounts"].items():
        print(f"  {sc} ({SUBJECT_NAMES.get(sc, sc)}): {cnt}")


if __name__ == "__main__":
    build_queue()
