import json

try:
    with open(r'c:\Users\Mi5a\atplvector\data\syllabus.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for subject in data:
        print(f"### {subject['code'][:3]} - {subject['title']}")
        for chapter in subject.get('children', []):
            print(f"- {chapter['title']}")
except Exception as e:
    print(f"Error: {e}")
