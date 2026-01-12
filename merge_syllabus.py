import json
import os

syllabus_path = 'data/syllabus.json'
radio_path = 'data/radio_nav_syllabus.json'

print(f"Loading {syllabus_path}...")
with open(syllabus_path, 'r', encoding='utf-8') as f:
    syllabus = json.load(f)

print(f"Loading {radio_path}...")
with open(radio_path, 'r', encoding='utf-8') as f:
    radio_data = json.load(f)

# radio_data is a list containing the subject object(s)
radio_subject = radio_data[0]
radio_code = radio_subject['code']

# Check if already exists
existing_codes = [s['code'] for s in syllabus]
if any(c.startswith('062') for c in existing_codes):
    print("Subject 062 already exists in syllabus.json. Skipping.")
else:
    print("Subject 062 not found. appending...")
    syllabus.append(radio_subject)
    
    # Sort
    print("Sorting syllabus by code...")
    syllabus.sort(key=lambda x: x['code'])
    
    print(f"Saving to {syllabus_path}...")
    with open(syllabus_path, 'w', encoding='utf-8') as f:
        json.dump(syllabus, f, indent=2)
    print("Done.")
