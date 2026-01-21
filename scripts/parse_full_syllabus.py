import re
import json
import sys
import os

def parse_syllabus(file_path):
    print(f"Reading file: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    root_subjects = []
    
    # Pointers to current hierarchy
    current_subject = None # 010 00 00 00
    current_area = None    # 010 01 00 00
    current_topic = None   # 010 01 01 00
    current_uTopic = None  # 010 01 01 01 (If exists, rare but possible)
    
    # Helper to find where to add the next node
    # Hierarchy is strict: Subject -> Area -> Topic -> Subtopic
    # LOs attach to the deepest active node.
    
    # We need to robustly identify code patterns.
    # Pattern: Digit sequence separated by spaces or newlines: 010 00 00 00
    
    # Pre-processing:
    # 1. Clean headers/footers
    # 2. Join split codes/lines if necessary (though simple line iteration often works if we handle context)
    
    clean_lines = []
    for line in lines:
        line = line.strip()
        if not line: continue
        # Skip page numbers and headers
        if re.search(r'Page \d+ of \d+', line): continue
        if "Easy Access Rules for Aircrew" in line: continue
        if "Powered by EASA" in line: continue
        if line.startswith("ANNEX I"): continue
        if line.startswith("SUBPART D"): continue
        if line.startswith("LICENCE"): continue
        if "Syllabus details and associated Learning Objectives" in line: continue
        
        clean_lines.append(line)
        
    print(f"Cleaned lines: {len(clean_lines)}")
    
    # Regexes
    # Allow matching code at start of line, with optional title following
    code_pattern = re.compile(r'^(\d{3})\s+(\d{2})\s+(\d{2})\s+(\d{2})(?:\s+(.*))?$')
    lo_pattern = re.compile(r'^\((\d{2})\)')
    
    i = 0
    while i < len(clean_lines):
        line = clean_lines[i]
        
        # Check for Code
        match = code_pattern.match(line)
        if match:
            # It is a header
            full_code = f"{match.group(1)} {match.group(2)} {match.group(3)} {match.group(4)}"
            parts = [match.group(1), match.group(2), match.group(3), match.group(4)]
            
            # Title might be on same line (group 5) or next
            title = match.group(5).strip() if match.group(5) else ""
            
            if not title and i + 1 < len(clean_lines):
                # Check next line if title was not on same line
                potential_title = clean_lines[i+1]
                if not code_pattern.match(potential_title) and not lo_pattern.match(potential_title):
                     title = potential_title
                     i += 1
            
            # Check for title continuation on subsequent lines
            # If title is short or looks incomplete, or next line is just text
            if i + 1 < len(clean_lines):
                 next_l = clean_lines[i+1]
                 # Heuristic: if next line is not a code, not an LO, not "x x x", and not a page header
                 if (not code_pattern.match(next_l) and 
                     not lo_pattern.match(next_l) and 
                     not re.match(r'^\s*x\s', next_l, re.I) and
                     "Aeroplane" not in next_l):
                     title += " " + next_l
                     i += 1

            node = {
                "code": full_code,
                "title": title,
                "children": [],
                "los": []
            }
            
            # Determine hierarchy
            if parts[1] == '00' and parts[2] == '00' and parts[3] == '00':
                # Level 0: Subject (010 00 00 00)
                root_subjects.append(node)
                current_subject = node
                current_area = None
                current_topic = None
                current_uTopic = None
            elif parts[2] == '00' and parts[3] == '00':
                # Level 1: Area (010 01 00 00)
                if current_subject:
                    current_subject['children'].append(node)
                    current_area = node
                    current_topic = None
                    current_uTopic = None
            elif parts[3] == '00':
                # Level 2: Topic (010 01 01 00)
                if current_area:
                    current_area['children'].append(node)
                    current_topic = node
                    current_uTopic = None
                elif current_subject:
                    # Fallback if Area is missing (should verify if this happens)
                    current_subject['children'].append(node) # Attach to subject directly? Rare.
                    current_topic = node
            else:
                # Level 3: Subtopic (010 01 01 01)
                # Note: Usually these are headers above LOs too, but sometimes explicit LOs are under Level 2.
                if current_topic:
                    current_topic['children'].append(node)
                    current_uTopic = node
                elif current_area:
                     current_area['children'].append(node)
                     current_uTopic = node

            i += 1
            continue
            
        # Check for LO
        lo_match = lo_pattern.match(line)
        if lo_match:
            lo_id_short = lo_match.group(1) # e.g. "01"
            
            # Extract text
            raw_text = line[len(lo_match.group(0)):]
            # Remove leading "X " if present (exam mark)
            raw_text = re.sub(r'^\s*X\s+', '', raw_text)
            
            # Read ahead to capture full text until next LO or Code or "x x x" table
            text_lines = [raw_text]
            j = i + 1
            while j < len(clean_lines):
                next_line = clean_lines[j]
                if code_pattern.match(next_line) or lo_pattern.match(next_line):
                    break
                # Stop if we hit the exam checkmarks "X X X"
                if re.match(r'^\s*X\s+X\s+', next_line):
                    j += 1 # Skip the marks line
                    continue 
                if re.match(r'^Aeroplane\s+Helicopter', next_line):
                    j += 1
                    continue
                
                text_lines.append(next_line)
                j += 1
            
            full_text = " ".join(text_lines).strip()
            # Clean up extra spaces
            full_text = re.sub(r'\s+', ' ', full_text)
            
            # Construct full ID
            # Depends on parent
            # If we are in current_uTopic (010 01 01 01), LO is 01 -> 010.01.01.01.01 ? (Rare)
            # Usually LOs are under Level 2 (010 01 01 00) -> 010.01.01.01
            
            parent_node = current_uTopic if current_uTopic else current_topic
            if not parent_node:
                parent_node = current_area
                
            if parent_node:
                # Construct ID: Remove spaces from parent code, drop trailing 00s if any, append .id
                # Actually, standard is Code + .id
                # Parent code: "010 01 01 00" -> "010.01.01" -> full "010.01.01.01"
                
                p_code = parent_node['code']
                p_parts = p_code.split()
                # Remove trailing "00"
                valid_parts = [p for p in p_parts if p != "00"]
                
                full_id = ".".join(valid_parts) + f".{lo_id_short}"
                
                lo_obj = {
                    "id": lo_id_short,
                    "text": full_text,
                    "full_id": full_id
                }
                
                parent_node['los'].append(lo_obj)
            
            i = j
            continue
            
        i += 1
        
    return root_subjects

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python parse_full_syllabus.py <input_txt> <output_json>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    if not os.path.exists(input_file):
        print(f"Error: Input file {input_file} not found.")
        # Try finding it in current dir
        if os.path.exists(os.path.basename(input_file)):
            input_file = os.path.basename(input_file)
            print(f"Found {input_file} in current directory.")
        else:
             sys.exit(1)

    print("Parsing...")
    data = parse_syllabus(input_file)
    print(f"Found {len(data)} subjects.")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
        
    print(f"Saved to {output_file}")
