import json
import re

# Load data
with open('data/syllabus.json', 'r', encoding='utf-8') as f:
    syllabus = json.load(f)

# Extract IDs and View names from LEARNING_OBJECTIVES
with open('data/learningObjectives.ts', 'r', encoding='utf-8') as f:
    ts_content = f.read()

covered_map = {}
matches = re.finditer(r"id:\s*'([\d\.]+)',.*?coveredBy:\s*View\.([A-Z_0-9]+)", ts_content, re.DOTALL)
for m in matches:
    covered_map[m.group(1)] = m.group(2)

def normalize_code(code):
    if not code: return ""
    parts = code.split()
    while parts and parts[-1] == '00':
        parts.pop()
    return ".".join(parts)

def check_040(node):
    code = node.get('code', '')
    node_id = normalize_code(code)
    
    # Only care about 040
    if not node_id.startswith('040'):
        return None

    title = node.get('title', node.get('text', 'Unknown'))
    
    # Check coverage
    is_covered = node_id in covered_map or node.get('id', '') in covered_map
    
    status = "[OK]" if is_covered else "[MISSING]"
    
    # Print status for top-level 040 items (topics)
    depth = len(node_id.split('.'))
    
    if depth == 2: # e.g. 040.01
        print(f"{status} {node_id} {title}")
        
    if 'children' in node:
        for child in node['children']:
            check_040(child)

print("--- 040 Human Performance Coverage Check ---")
for subject in syllabus:
    if subject['code'].startswith('040'):
        check_040(subject)
