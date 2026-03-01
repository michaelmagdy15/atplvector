import json
import re

def normalize_code(code):
    if not code:
        return ""
    parts = code.split(' ')
    while parts and parts[-1] == '00':
        parts.pop()
    return '.'.join(parts)

def is_subcode(parent, child):
    """Checks if 'child' is a subcode of 'parent' (e.g., 010.01.01 is a subcode of 010.01)"""
    if not parent: return False
    return child == parent or child.startswith(parent + '.')

def find_missing_topics():
    # 1. Load syllabus.json
    with open('data/syllabus.json', 'r', encoding='utf-8') as f:
        syllabus_data = json.load(f)
    
    try:
        with open('data/radio_nav_syllabus.json', 'r', encoding='utf-8') as f:
            rad_nav = json.load(f)
            if isinstance(rad_nav, list):
                syllabus_data.extend(rad_nav)
            else:
                syllabus_data.append(rad_nav)
    except:
        pass

    # 2. Extract covered IDs from learningObjectives.ts (Specifically from LEARNING_OBJECTIVES array)
    covered_ids = set()
    with open('data/learningObjectives.ts', 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Isolate the LEARNING_OBJECTIVES array content
        array_match = re.search(r'export const LEARNING_OBJECTIVES: LearningObjective\[\] = \[(.*?)\];', content, re.DOTALL)
        if array_match:
            lo_content = array_match.group(1)
            # Find matches for id: '...' or id: "..."
            matches = re.findall(r"id:\s*['\"]([\d.]+)['\"]", lo_content)
            for m in matches:
                covered_ids.add(m)
        else:
            print("WARNING: Could not find LEARNING_OBJECTIVES array in learningObjectives.ts")
    
    print(f"DEBUG: Found {len(covered_ids)} covered IDs in learningObjectives.ts")

    missing = []
    
    # Subjects to exclude entirely (Helicopter specific)
    EXCLUDED_SUBJECTS = {'034', '082', '030', '060', '020', '080'} 
    # Partial sub-subjects that are helicopter only
    HELI_SUBPARTS = {'071.03', '021.13', '021.14', '021.15', '021.16', '021.17'}
    
    HELICOPTER_KEYWORDS = {
        'helicopter', 'rotor', 'blade stall', 'vortex ring', 'mast bumping', 
        'dynamic rollover', 'ground resonance', 'hems', 'hec', 'autorotation',
        'cyclic', 'collective', 'overpitch', 'skids', 'fenestron', 'notar'
    }
    
    def traverse(node):
        code = node.get('code', '')
        normalized = normalize_code(code)
        subject_id = normalized.split('.')[0] if normalized else ""
        
        if subject_id in EXCLUDED_SUBJECTS:
            return

        # Check if this node or any of its parents are covered
        is_covered = False
        for cid in covered_ids:
            if is_subcode(cid, normalized):
                is_covered = True
                break
        
        if any(normalized.startswith(sub) for sub in HELI_SUBPARTS):
            return

        # Terminal node check (no children or children is empty list)
        children = node.get('children', [])
        title = node.get('title', '')
        
        # Filter out titles explicitly mentioning Helicopter or Rotor at the terminal level
        title_lower = title.lower()
        is_heli_topic = any(term in title_lower for term in HELICOPTER_KEYWORDS)

        if not children:
            if not is_covered and not is_heli_topic and "Intentionally left blank" not in title:
                missing.append({
                    'code': code,
                    'normalized': normalized,
                    'title': title,
                    'lo_count': len(node.get('los', []))
                })
        else:
            for child in children:
                traverse(child)

    for subject in syllabus_data:
        if subject.get('code') == '030 00 00 00': continue # Skip aggregate
        traverse(subject)

    # 3. Group by subject prefix
    grouped = {}
    for m in missing:
        subject_id = m['normalized'].split('.')[0]
        if subject_id not in grouped:
            grouped[subject_id] = []
        grouped[subject_id].append(m)
    
    # 4. Generate report
    report = "# Missing Syllabus Topics (Granular)\n\n"
    report += "This report lists all terminal topics in the syllabus that are NOT covered by any mapping in `learningObjectives.ts`.\n\n"
    
    for subj in sorted(grouped.keys()):
        report += f"## Subject {subj}\n"
        report += f"**Missing Topics: {len(grouped[subj])}**\n\n"
        for m in grouped[subj]:
            report += f"- **[{m['code']}]** {m['title']} ({m['lo_count']} LOs)\n"
        report += "\n"
        
    with open('missing_topics_report.md', 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"Report generated: missing_topics_report.md with {len(missing)} missing topics.")

if __name__ == "__main__":
    find_missing_topics()
