import re
import json

def parse_syllabus_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    structure = []
    current_subject = None
    current_topic = None
    current_subtopic = None
    current_lo_group = None
    
    # Regex patterns
    # 062 00 00 00
    code_pattern = re.compile(r'^(\d{3}\s\d{2}\s\d{2}\s\d{2})')
    # (01) ...
    lo_pattern = re.compile(r'^\((\d{2})\)\s+(?:X\s+)?(.*)')
    
    # Helper to clean up text (remove page headers etc)
    def clean_line(line):
        if line.strip().startswith('--- Page') or 'Easy Access Rules' in line or 'Powered by EASA' in line:
            return ''
        return line.strip()

    buffer_text = ""
    
    # We need a state machine because the text is spread across lines
    # and codes might be split like:
    # 062 01 01
    # 00
    # Title
    
    full_text = ""
    for line in lines:
        cleaned = clean_line(line)
        if cleaned:
            full_text += " " + cleaned
            
    # Normalize spaces
    full_text = re.sub(r'\s+', ' ', full_text)
    
    # Now try to split by codes. This is tricky because the text flow is messy.
    # Alternative: iterate line by line but handle multi-line codes/titles
    
    # Let's try a different approach: Regex verify the structure on the whole text?
    # No, let's process the raw lines but keep a buffer
    
    processed_structure = {
        "code": "062 00 00 00",
        "title": "RADIO NAVIGATION",
        "children": []
    }
    
    # We can try to match the hierarchical codes
    # The codes look like "062 01 00 00" or split across lines "062 01 00 \n 00"
    
    # Let's refine the text to fix line breaks
    # Join everything into one big string first
    content = ""
    for line in lines:
        l = line.strip()
        if not l or l.startswith('--- Page') or 'Easy Access Rules' in l or 'Powered by EASA' in l or 'Syllabus' in l or 'reference BK' in l or 'ATPL CPL' in l or 'IR CB-IR' in l:
            continue
        content += " " + l
        
    content = re.sub(r'\s+', ' ', content)
    
    # Now regex for codes
    # 062 xx xx xx
    # We want to find all occurrences of pattern: 062 \d{2} \d{2} \d{2}
    
    # Split content by codes?
    parts = re.split(r'(062\s\d{2}\s\d{2}\s\d{2})', content)
    
    current_node_stack = [processed_structure] 
    # This might be too naive because we don't know the depth just from the split
    # But usually:
    # 062 01 00 00 -> Level 1
    # 062 01 01 00 -> Level 2
    # 062 01 01 01 -> Level 3
    
    root = processed_structure
    
    for i in range(1, len(parts), 2):
        code_str = parts[i]
        text_chunk = parts[i+1] if i+1 < len(parts) else ""
        
        # Parse code
        code_parts = code_str.split()
        # e.g. ['062', '01', '00', '00']
        
        level = 0
        if code_parts[1] != '00': level = 1
        if code_parts[2] != '00': level = 2
        if code_parts[3] != '00': level = 3
        
        # Extract title
        # The title is at the start of text_chunk. 
        # But text_chunk also contains LOs like (01) ...
        # So we split by first LO
        
        lo_split = re.split(r'\((\d{2})\)', text_chunk)
        title = lo_split[0].strip()
        
        node = {
            "code": code_str,
            "title": title,
            "children": [],
            "los": []
        }
        
        # Add to correct parent
        # If level 1, parent is root
        # If level 2, parent is last child of root
        # If level 3, parent is last child of last child of root
        
        # We need a robust way to find parent.
        # Actually, we can just look at the code prefix.
        
        if level == 1:
            root['children'].append(node)
        elif level == 2:
            if root['children']:
                root['children'][-1]['children'].append(node)
        elif level == 3:
             if root['children'] and root['children'][-1]['children']:
                 root['children'][-1]['children'][-1]['children'].append(node)
                 
        # Parse LOs
        # lo_split will be [title, id_1, text_1, id_2, text_2, ...]
        if len(lo_split) > 1:
            for j in range(1, len(lo_split), 2):
                lo_id = lo_split[j]
                lo_text = lo_split[j+1].strip()
                
                # Cleanup LO text (remove X X X ...)
                # Usually ends with remarks or X marks
                # naive cleanup: remove trailing X sequence
                lo_text = re.sub(r'(X\s+)+.*$', '', lo_text).strip()
                # Remove leading X if present
                if lo_text.startswith('X '):
                    lo_text = lo_text[2:]
                    
                lo_obj = {
                    "id": lo_id,
                    "text": lo_text,
                    "details": lo_text # Use full text as details
                }
                node['los'].append(lo_obj)

    return [root]

if __name__ == "__main__":
    extracted_data = parse_syllabus_text('components/RadioNav/062syllabus_extracted.txt')
    with open('components/RadioNav/062syllabus_parsed.json', 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2)
    print("Parsed JSON saved to components/RadioNav/062syllabus_parsed.json")
