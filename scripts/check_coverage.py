import json
import re
import os
import sys

# Add parent directory to path to allow importing data if needed, 
# though we are reading files directly for simplicity and robustness.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def load_json(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: {filepath} not found.")
        return None

def load_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Error: {filepath} not found.")
        return None

def normalize_id(code_str):
    """
    Normalizes a code string from the syllabus (e.g. "010 01 02 00") 
    to a dot-separated ID (e.g. "010.01.02").
    Removes trailing '00' parts to match the style used in learningObjectives.ts and full_id.
    """
    parts = code_str.split()
    while parts and parts[-1] == '00':
        parts.pop()
    return ".".join(parts)

def count_and_check_coverage(node, covered_ids_set, parent_covered=False):
    """
    Recursively checks coverage for a node and its children.
    
    Args:
        node: The syllabus node (dict).
        covered_ids_set: Set of IDs explicitly marked as covered in the code.
        parent_covered: Boolean, true if an ancestor of this node is covered.
        
    Returns:
        (total_los, covered_los) tuple for this subtree.
    """
    
    # 1. Determine if this specific node is covered
    # A node is covered if:
    #   a) Its parent is covered (inheritance)
    #   b) Its ID is explicitly in the covered set
    
    # Get node ID from 'full_id' (if LO) or derived from 'code' (if topic)
    node_id = None
    if 'full_id' in node:
        node_id = node['full_id']
    elif 'code' in node:
        node_id = normalize_id(node['code'])
    
    # Check strict coverage for this node
    is_node_explicitly_covered = False
    if node_id and node_id in covered_ids_set:
        is_node_explicitly_covered = True
        
    # Also check if 'id' (short version like '01') maps (less likely to be unique globally, but check context)
    # We rely mostly on full IDs for uniqueness.
    
    is_subtree_covered = parent_covered or is_node_explicitly_covered
    
    current_total = 0
    current_covered = 0
    
    # 2. Count LOs in this node (if it's a leaf LO itself)
    # The structure is a bit mixed: some nodes are containers, some are LOs ("los" list inside topic)
    # The 'los' list contains leaf objects.
    
    if 'los' in node:
        for lo in node['los']:
            lo_full_id = lo.get('full_id')
            
            # Check if this specific LO is explicitly covered
            # (matches logic above, but for the items in the 'los' list)
            lo_covered = is_subtree_covered
            if not lo_covered and lo_full_id and lo_full_id in covered_ids_set:
                lo_covered = True
                
            current_total += 1
            if lo_covered:
                current_covered += 1
                
    # 3. Recurse into children
    if 'children' in node:
        for child in node['children']:
            t, c = count_and_check_coverage(child, covered_ids_set, is_subtree_covered)
            current_total += t
            current_covered += c
            
    return current_total, current_covered

def get_covered_ids(ts_content):
    """
    Extracts all covered LO IDs from the learningObjectives.ts file using regex.
    """
    pattern = r"id:\s*['\"]([\d\.]+)['\"].*?coveredBy:"
    matches = re.finditer(pattern, ts_content, re.DOTALL)
    covered_ids = set()
    for m in matches:
        covered_ids.add(m.group(1))
    return covered_ids

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    syllabus_path = os.path.join(root_dir, 'data', 'syllabus.json')
    radio_syllabus_path = os.path.join(root_dir, 'data', 'radio_nav_syllabus.json')
    lo_ts_path = os.path.join(root_dir, 'data', 'learningObjectives.ts')
    
    print(f"Loading syllabus from {syllabus_path}...")
    syllabus = load_json(syllabus_path)
    if not syllabus: return

    # Merge Radio Nav (062) if present
    # Warning: syllabus.json might already contain a placeholder for 062 that needs replacing
    radio_syllabus = load_json(radio_syllabus_path)
    if radio_syllabus:
        print("Merging Radio Nav syllabus...")
        # Find index of 062 in main syllabus
        idx_062 = -1
        for i, node in enumerate(syllabus):
            if node.get('code', '').startswith('062'):
                idx_062 = i
                break
        
        if idx_062 != -1:
            # Replace placeholder with loaded data
            # radio_syllabus is a list, likely containing the 062 root node(s)
            syllabus[idx_062] = radio_syllabus[0]
        else:
            # Append if not found (unexpected, but safe)
            syllabus.extend(radio_syllabus)

    print(f"Loading mappings from {lo_ts_path}...")
    ts_content = load_file(lo_ts_path)
    if not ts_content: return

    covered_ids = get_covered_ids(ts_content)
    print(f"Found {len(covered_ids)} explicitly mapped coverage points.")

    # Define subjects (Subject ID -> Name)
    subjects = {
        "010": "Air Law",
        "021": "AGK: Systems",
        "022": "AGK: Instruments",
        "031": "Mass & Balance",
        "032": "Performance",
        "033": "Flight Planning",
        "040": "Human Performance",
        "050": "Meteorology",
        "061": "General Nav",
        "062": "Radio Nav",
        "070": "Operational Proc.",
        "081": "Principles of Flight",
        "090": "Communications",
        "100": "KSA"
    }

    print("\n" + "="*65)
    print(f"{'Subject':<25} | {'Covered':<10} | {'Total':<10} | {'%':<5}")
    print("="*65)

    grand_total_los = 0
    grand_covered_los = 0

    for sub_id, sub_name in subjects.items():
        # Find root node for this subject
        subject_node = None
        for node in syllabus:
            if node.get('code', '').replace(' ', '').startswith(sub_id):
                subject_node = node
                break
        
        total = 0
        covered = 0
        
        if subject_node:
            total, covered = count_and_check_coverage(subject_node, covered_ids)
        
        # Avoid division by zero
        percentage = (covered / total * 100) if total > 0 else 0.0
            
        print(f"{sub_id} {sub_name:<21} | {covered:<10} | {total:<10} | {percentage:.1f}%")

        grand_total_los += total
        grand_covered_los += covered

    print("="*65)
    total_pct = (grand_covered_los / grand_total_los * 100) if grand_total_los else 0
    print(f"{'TOTAL':<25} | {grand_covered_los:<10} | {grand_total_los:<10} | {total_pct:.1f}%")
    print("="*65)

if __name__ == "__main__":
    main()
