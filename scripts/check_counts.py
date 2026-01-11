import json

with open('data/syllabus.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

target_subjects = [
    '010', '021', '022', '031', '032', '033', '040', 
    '050', '061', '062', '070', '081', '090'
]

def count_los(node):
    count = len(node.get('los', []))
    for child in node.get('children', []):
        count += count_los(child)
    return count

print("Subject | Title | LO Count")
print("-" * 50)
for sub in data:
    code = sub['code'].split()[0]
    if code in target_subjects:
        count = count_los(sub)
        print(f"{code} | {sub['title'][:30]}... | {count}")
