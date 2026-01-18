import json
import os
from pathlib import Path

# This is a template for the synchronization script.
# In a real implementation, this would connect to Supabase
# and pull the latest explanations.

QUESTIONS_DIR = Path('public/question-bank/atpl')

def sync_from_database():
    """
    Mock function to represent pulling from Supabase.
    """
    # Example data structure from DB
    # db_explanations = [
    #     {"id": "QXB2VSTJF", "explanation": "Actual explanation from student/AI..."},
    # ]
    return []

def sync_explanations():
    if not QUESTIONS_DIR.exists():
        print(f"Directory {QUESTIONS_DIR} not found.")
        return

    # In a real scenario, we'd fetch all explanations from Supabase
    db_data = sync_from_database()
    if not db_data:
        print("No new explanations found in database to sync.")
        return

    # Map for quick lookup
    updates_map = {item['id']: item['explanation'] for item in db_data}

    for filename in os.listdir(QUESTIONS_DIR):
        if filename.endswith('.json'):
            file_path = QUESTIONS_DIR / filename
            print(f"Checking {filename} for updates...")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                questions = json.load(f)

            updated = False
            for q in questions:
                if q['id'] in updates_map:
                    if q.get('explanation') != updates_map[q['id']]:
                        q['explanation'] = updates_map[q['id']]
                        updated = True
            
            if updated:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(questions, f, indent=2)
                print(f"  Synced and backed up explanations in {filename}.")

if __name__ == "__main__":
    sync_explanations()
