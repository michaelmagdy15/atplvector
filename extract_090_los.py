import json

def extract_090_los(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    los = []
    
    def traverse(node):
        if isinstance(node, list):
            for item in node:
                traverse(item)
        elif isinstance(node, dict):
            if 'full_id' in node and node['full_id'].startswith('090'):
                los.append(f"- [{node['full_id']}] {node['text']}")
            
            if 'children' in node:
                traverse(node['children'])
            if 'los' in node:
                traverse(node['los'])

    traverse(data)
    
    print("Found 090 LOs:")
    for lo in sorted(los):
        print(lo)

extract_090_los('c:/Users/Mi5a/atplvector/data/syllabus.json')
