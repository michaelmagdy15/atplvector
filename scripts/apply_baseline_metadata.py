import json
import os
from pathlib import Path

QUESTIONS_DIR = Path('public/question-bank/atpl')

def apply_baseline_metadata():
    if not QUESTIONS_DIR.exists():
        print(f"Directory {QUESTIONS_DIR} not found.")
        return

    for filename in os.listdir(QUESTIONS_DIR):
        if filename.endswith('.json'):
            file_path = QUESTIONS_DIR / filename
            print(f"Processing {filename}...")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    questions = json.load(f)
                except Exception as e:
                    print(f"  Error loading {filename}: {e}")
                    continue

            updated = False
            import random
            for q in questions:
                # Add default authority if missing
                if 'authorities' not in q:
                    q['authorities'] = ['EASA']
                    updated = True
                
                # Simulate trend data for demonstration (only for ~5% of questions)
                if random.random() < 0.05:
                    q['isRecent'] = True
                    q['countries'] = random.choices(['UK', 'AT', 'DE', 'IE'], k=random.randint(1, 2))
                    q['lastSeen'] = "2024-01-15"
                    updated = True
                else:
                    if 'countries' not in q: q['countries'] = []
                    if 'isRecent' not in q: q['isRecent'] = False
                    if 'lastSeen' not in q: q['lastSeen'] = None

            if updated:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(questions, f, indent=2)
                print(f"  Updated {filename} with baseline metadata.")
            else:
                print(f"  No baseline updates needed for {filename}.")

if __name__ == "__main__":
    apply_baseline_metadata()
