import re
import json

def parse_syllabus_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Pre-processing to join lines and fix codes
    # We want to remove page headers and join everything into a single stream, 
    # but strictly respecting the "tokens" of codes.
    
    clean_lines = []
    for line in lines:
        l = line.strip()
        if not l: continue
        if l.startswith('--- Page'): continue
        if 'Easy Access Rules' in l or 'Powered by EASA' in l: continue
        if l.startswith('Subject 062'): continue # Header
        clean_lines.append(l)
        
    full_text = " ".join(clean_lines)
    
    # Normalize spaces
    full_text = re.sub(r'\s+', ' ', full_text)
    
    # Fix split codes
    # Pattern: 062 followed by spaces and digits.
    # We expect 062 xx xx xx. Sometimes it might be 062 xx xx \n xx
    # Since we purely joined with spaces, it's just 062 xx xx xx now.
    # BUT, sometimes there might be text in between? No, usually codes are headings.
    
    # Let's try to match the code pattern strictly.
    # 062 \d{2} \d{2} \d{2}
    
    # Debug: print sample of text
    # print(full_text[:1000])
    
    parts = re.split(r'(062\s\d{2}\s\d{2}\s\d{2})', full_text)
    
    # The first part is preamble
    root = {
        "code": "062 00 00 00",
        "title": "RADIO NAVIGATION",
        "children": [],
        "los": []
    }
    
    # A map to easily find parents by code prefix
    # e.g. "062 01 00 00" parent is "062 00 00 00"
    # "062 01 01 00" parent is "062 01 00 00"
    nodes_by_code = { "062 00 00 00": root }
    
    # Helper to get parent code
    def get_parent_code(c):
        p = c.split()
        # 062 01 01 01 -> 062 01 01 00
        # 062 01 01 00 -> 062 01 00 00
        # 062 01 00 00 -> 062 00 00 00
        
        if p[3] != '00':
            return f"{p[0]} {p[1]} {p[2]} 00"
        elif p[2] != '00':
            return f"{p[0]} {p[1]} 00 00"
        elif p[1] != '00':
            return f"{p[0]} 00 00 00"
        return None

    for i in range(1, len(parts), 2):
        code = parts[i]
        content = parts[i+1] if i+1 < len(parts) else ""
        
        # Parse content
        # Content starts with Title, then LOs
        
        # Split by LOs (01) ...
        # Regex: space followed by (dd) space
        lo_parts = re.split(r'\s\((\d{2})\)\s', " " + content)
        
        # lo_parts[0] is title
        title = lo_parts[0].strip()
        
        # Remove trailing junk from title if any (like syllabus ref headers that might have leaked)
        # e.g. "Basic principles 062..."
        
        node = {
            "code": code,
            "title": title,
            "children": [],
            "los": []
        }
        
        # Add LOs
        if len(lo_parts) > 1:
            for j in range(1, len(lo_parts), 2):
                lo_id = lo_parts[j]
                lo_text = lo_parts[j+1].strip()
                
                # Clean up LO text
                # Remove "X X X" etc
                lo_text = re.sub(r'(?:X\s){2,}.*$', '', lo_text).strip()
                # Remove leading X
                if lo_text.startswith('X '): lo_text = lo_text[2:]
                
                # Check for "Remark" columns leakers
                
                node['los'].append({
                    "id": lo_id,
                    "text": lo_text,
                    "details": lo_text
                })
        
        # Link to parent
        parent_code = get_parent_code(code)
        if parent_code and parent_code in nodes_by_code:
            parent = nodes_by_code[parent_code]
            parent['children'].append(node)
            nodes_by_code[code] = node
        else:
            # If parent not found (maybe skipped or root), try to attach to root if level 1
            # or just ignore/warn?
            # 062 01 00 00 should attach to 062 00 00 00
            if parent_code == "062 00 00 00":
               root['children'].append(node)
               nodes_by_code[code] = node
            else:
               # Fallback: maybe the parent code structure is implied? 
               # Just attach to nearest known parent or ignore
               # For now, let's assume strict structure.
               pass

    return [root]

if __name__ == "__main__":
    data = parse_syllabus_text('components/RadioNav/062syllabus_extracted.txt')
    output_path = 'components/RadioNav/062syllabus_parsed_v2.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f"Done. Saved to {output_path}")
