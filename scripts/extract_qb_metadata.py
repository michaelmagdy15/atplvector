import yaml
import json
from pathlib import Path

SOURCE_DIR = Path("chair-flight-source/libs/content/question-bank-atpl/content")
LO_FILE = SOURCE_DIR / "learning-objectives.yaml"
OUTPUT_FILE = Path("data/qb_metadata.json")

def extract_metadata():
    if not LO_FILE.exists():
        print("Learning objectives file not found.")
        return

    with open(LO_FILE, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    # We want a hierarchy: Subject -> Topic (090.01) -> Subtopic (090.01.01)
    # We only care about entries that are potentially topics (short IDs)
    topics = {}
    
    for item in data:
        lo_id = item.get('id')
        # Only process IDs like "090", "090.01", "090.01.01"
        # Skip leaf nodes (e.g. "090.01.01.01.01") to keep metadata small
        parts = lo_id.split('.')
        if len(parts) > 3:
            continue
            
        subject = item.get('subject')
        text = item.get('text')
        parent_id = item.get('parentId')

        if subject not in topics:
            topics[subject] = []

        topics[subject].append({
            "id": lo_id,
            "title": text if isinstance(text, str) else "",
            "parentId": parent_id,
            "level": len(parts) # 1 for subject, 2 for topic, 3 for subtopic
        })

    # Ensure data directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(topics, f, indent=2)
    
    print(f"Metadata saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    extract_metadata()
