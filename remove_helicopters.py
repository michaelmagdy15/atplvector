import json

def is_helicopter_content(node):
    code = node.get('code', '')
    title = node.get('title', '').upper()
    
    # Specific Helicopter Subjects
    if code.startswith('034') or code.startswith('082'):
        return True
        
    # Topics explicitly mentioning Helicopter
    if 'HELICOPTER' in title:
        return True
        
    return False

def filter_nodes(nodes):
    kept_nodes = []
    removed_count = 0
    
    for node in nodes:
        if is_helicopter_content(node):
            print(f"Removing: {node.get('code')} {node.get('title')}")
            removed_count += 1
            continue
            
        # Recursive filter
        if 'children' in node:
            node['children'], child_removed = filter_nodes(node['children'])
            removed_count += child_removed
            
        kept_nodes.append(node)
        
    return kept_nodes, removed_count

# Load data
try:
    with open('data/syllabus.json', 'r', encoding='utf-8') as f:
        syllabus = json.load(f)
        
    print(f"Total top-level subjects before: {len(syllabus)}")
    
    filtered_syllabus, total_removed = filter_nodes(syllabus)
    
    print(f"Total top-level subjects after: {len(filtered_syllabus)}")
    print(f"Total nodes removed: {total_removed}")
    
    with open('data/syllabus.json', 'w', encoding='utf-8') as f:
        json.dump(filtered_syllabus, f, indent=2)
        
    print("Successfully updated data/syllabus.json")
    
except Exception as e:
    print(f"Error: {e}")
