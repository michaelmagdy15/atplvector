import re
import json
import sys

def parse_syllabus(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    root = {
        "code": "062 00 00 00",
        "title": "RADIO NAVIGATION",
        "children": [],
        "los": []
    }
    
    current_area = None
    current_topic = None
    current_subtopic = None
    
    current_lo_text = []
    current_lo_id = None
    
    # Regex patterns
    # Code pattern matches 062 01 00 00 (possibly split)
    # We will try to reconstruct lines first or handle line-by-line state machine
    
    # Pre-processing to remove headers/footers and join lines
    cleaned_lines = []
    skip_next = False
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if "Easy Access Rules for Aircrew" in line or "Powered by EASA eRules" in line or "ANNEX I" in line or "SUBPART D" in line or "Syllabus" in line and "reference" in line:
            continue
        if line.startswith("Page ") and "of" in line:
            continue
        cleaned_lines.append(line)

    # State machine
    # Need to handle codes that might be split like:
    # 062 01 02 
    # 00
    
    # A simple approach is to join all lines and then regex, but LOs need distinct text.
    # Let's iterate and try to detect codes.
    
    buffer = []
    
    # Hierarchy helpers
    def get_or_create_child(parent, code, title):
        for child in parent['children']:
            if child['code'] == code:
                return child
        new_child = {"code": code, "title": title, "children": [], "los": []}
        parent['children'].append(new_child)
        return new_child

    # Processed structure
    # 062 00 00 00 -> root
    # 062 XX 00 00 -> Area
    # 062 XX XX 00 -> Topic
    # 062 XX XX XX -> Subtopic
    
    # We will walk through lines. If we see a code start, we look ahead.
    
    full_text = "\n".join(cleaned_lines)
    
    # Remove some common noise specific to this file layout
    # The file has things like:
    # 062 01 00 
    # 00 
    # BASIC RADIO...
    
    # Let's try to normalize codes.
    # Pattern: Digit sequence separated by spaces or newlines
    
    # Find all codes + titles
    # Regex: ^(\d{3}\s+\d{2}\s+\d{2}\s+\d{2})\s+(.*) ?
    # But newlines break it.
    
    # Strategy: Loop through lines, identify if line starts with code part. 
    
    def is_code_start(s):
        return re.match(r'^\d{3}\s\d{2}', s)
    
    def is_lo_start(s):
        return re.match(r'^\(\d{2}\)', s)

    i = 0
    while i < len(cleaned_lines):
        line = cleaned_lines[i]
        
        # Check for code (could be split)
        # 062 01 00 00
        # or 062 01 00 \n 00
        
        code_match = re.match(r'^(\d{3})\s+(\d{2})\s+(\d{2})\s+(\d{2})$', line)
        if not code_match:
            # Check if split code
            if re.match(r'^\d{3}\s\d{2}\s\d{2}$', line) and i+1 < len(cleaned_lines) and re.match(r'^\d{2}$', cleaned_lines[i+1]):
                # Joined
                line_combined = line + " " + cleaned_lines[i+1]
                code_match = re.match(r'^(\d{3})\s+(\d{2})\s+(\d{2})\s+(\d{2})$', line_combined)
                if code_match:
                    i += 1 # consumed next line
        
        if code_match:
            # Found a section content
            # The Title follows on the next line or same line?
            # From view_file, title matches often on next line
            # "062 01 00 \n 00 \n BASIC RADIO..."
            
            # If we just consumed the code, look for title
            code_str = f"{code_match.group(1)} {code_match.group(2)} {code_match.group(3)} {code_match.group(4)}"
            
            # Title is likely the NEXT line
            title = ""
            if i + 1 < len(cleaned_lines):
                 title = cleaned_lines[i+1]
                 # Sometimes title is multiple lines or followed by "Syllabus" garbage
                 # But based on file, usually clean title line.
                 i += 1
            
            # Determine level
            # 062 00 00 00 -> Root (we have it)
            # 062 xx 00 00 -> Level 1
            # 062 xx xx 00 -> Level 2
            # 062 xx xx xx -> Level 3
            
            parts = [code_match.group(1), code_match.group(2), code_match.group(3), code_match.group(4)]
            
            if parts[1] != '00' and parts[2] == '00' and parts[3] == '00':
                current_area = get_or_create_child(root, code_str, title)
                current_topic = None
                current_subtopic = None
            elif parts[2] != '00' and parts[3] == '00':
                if current_area:
                    current_topic = get_or_create_child(current_area, code_str, title)
                    current_subtopic = None
            elif parts[3] != '00':
                if current_topic:
                    current_subtopic = get_or_create_child(current_topic, code_str, title)
                elif current_area:
                     # Fallback if intermediate missing, though unlikely
                     pass
                     
            i += 1
            continue

        # Check for LO
        lo_match = re.match(r'^\((\d{2})\)', line)
        if lo_match:
             # This is a new LO.
             # Save previous LO if exists
             if current_subtopic:
                 # The text follows the (XX). It might be "X State that..."
                 # Remove (XX) and optional 'X '
                 raw_text = line[len(lo_match.group(0)):]
                 raw_text = re.sub(r'^\s*X\s*', '', raw_text).strip()
                 
                 # Append subsequent lines until next LO or Code
                 j = i + 1
                 while j < len(cleaned_lines):
                     next_line = cleaned_lines[j]
                     if is_code_start(next_line) or is_lo_start(next_line):
                         break
                     # Filter out "X X X X" noise lines which represent exam checkmarks
                     if re.match(r'^[X\s]+(?:\d+)?$', next_line):
                         j += 1
                         continue
                     if re.match(r'^Aeroplane Helicopter', next_line):
                         j += 1
                         continue
                         
                     raw_text += " " + next_line
                     j += 1
                 
                 # Add to subtopic
                 lo_id = lo_match.group(1)
                 # Clean up text
                 final_text = re.sub(r'\s+', ' ', raw_text).strip()
                 
                 # Create LO object
                 lo_obj = {
                     "id": lo_id,
                     "text": final_text,
                     "details": final_text[:50] + "..." # Simplified details
                 }
                 current_subtopic['los'].append(lo_obj)
                 
                 i = j - 1 # Main loop increment will take us to j
        
        i += 1

    return root

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python parse_syllabus.py <input_txt> <output_json>")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    result = parse_syllabus(input_file)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump([result], f, indent=2) # Wrap in list to match syllabus.json structure
        
    print(f"Parsed data saved to {output_file}")
