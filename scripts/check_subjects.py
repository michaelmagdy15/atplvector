import json

with open('data/syllabus.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for d in data:
    code = d['code'].split()[0]
    title = d['title']
    print(f"{code}: {title}")
