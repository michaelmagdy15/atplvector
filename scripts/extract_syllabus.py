import re
import json
import os
from pypdf import PdfReader

def extract_syllabus(pdf_path, output_path):
    print(f"Reading {pdf_path}...")
    try:
        reader = PdfReader(pdf_path)
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return

    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"

    # Regex patterns for EASA syllabus
    # Subject: 010 00 00 00 AIR LAW
    # Topic: 010 01 00 00 ...
    # LO: 010.01.01.01 ... (Format varies, sometimes 010 01 01 01)
    
    # Let's try to capture the hierarchical structure
    # We will use a simplified structure:
    # {
    #   "010": { name: "Air Law", totalLOs: 0, los: [] },
    #   ...
    # }

    subjects = {}
    current_subject_id = None

    # Flexible regex to catch the LOs
    # Pattern to match subject headers like "010 00 00 00 AIR LAW"
    subject_pattern = re.compile(r"^(\d{3})\s+00\s+00\s+00\s+(.+)$", re.MULTILINE)
    
    # Pattern to match LOs. 
    # EASA LOs often look like "010 05 02 03" followed by text.
    # Sometimes dotted: "010.05.02.03"
    # We'll try to catch lines starting with the subject ID and having at least 3 parts
    lo_pattern = re.compile(r"^(\d{3})[\s\.](\d{2})[\s\.](\d{2})[\s\.](\d{2})\s+(.+)$", re.MULTILINE)

    lines = text.split('\n')
    
    # Pre-processing to handle potential multi-line LOs could be complex. 
    # For a first pass, we'll assume single line or primary line contains the code.
    
    # Note: The PDF text extraction might not be perfect with whitespace.
    
    # Let's do a pass to find subjects first
    for line in lines:
        line = line.strip()
        
        # Check for Subject Header
        # e.g. 010 00 00 00 AIR LAW
        # We need to be careful not to match LOs as subjects if regex is loose
        # But the 00 00 00 signature is usually good for top level.
        
        # Heuristic: Starts with 3 digits, then space/dot, then 00...
        if re.match(r"^\d{3}[\s\.]00[\s\.]00[\s\.]00", line):
            parts = re.split(r"[\s\.]", line)
            if len(parts) >= 4:
                subj_id = parts[0]
                # Extract name: everything after the zeros. 
                # Identifying where the name starts is tricky if split by space.
                # Let's use specific regex.
                match = re.match(r"^(\d{3})[\s\.]00[\s\.]00[\s\.]00\s+(.*)", line)
                if match:
                    subj_id = match.group(1)
                    subj_name = match.group(2).strip()
                    if subj_id not in subjects:
                        subjects[subj_id] = {
                            "id": subj_id,
                            "name": subj_name,
                            "totalLOs": 0,
                            "los": [] # We might store just IDs to count them
                        }
                        current_subject_id = subj_id
                        print(f"Found Subject: {subj_id} - {subj_name}")

        # Check for LOs
        # 010 01 01 01 or 010.01.01.01
        elif re.match(r"^\d{3}[\s\.]\d{2}[\s\.]\d{2}[\s\.]\d{2}", line):
             # It's an LO or a topic header.
             # EASA structure:
             # Subject: 010 00 00 00
             # Topic: 010 01 00 00
             # Subtopic: 010 01 01 00
             # LO: 010 01 01 01
             
             # We want to count the leaf nodes (LOs).
             # Usually LOs end with non-zero.
             parts = re.split(r"[\s\.]", line)
             # Clean parts (remove empty strings from consecutive spaces)
             parts = [p for p in parts if p]
             
             if len(parts) >= 4:
                 try:
                     id_parts = parts[:4]
                     # Check if it is a leaf LO. 
                     # If the last part is not '00', it's likely an LO.
                     # However, sometimes they go deeper? No, standard is 4 levels.
                     
                     s_id = id_parts[0]
                     if s_id in subjects:
                         # Check if it's a leaf node (last two digits != 00)
                         # Actually usually last TWO digits are the LO index.
                         # Example: 010 01 01 01 -> LO
                         # Example: 010 01 01 00 -> Subtopic
                         
                         idx = id_parts[3]
                         if idx != '00':
                             subjects[s_id]["totalLOs"] += 1
                             # Construct ID
                             full_id = ".".join(id_parts)
                             subjects[s_id]["los"].append(full_id)
                 except:
                     pass

    # Post processing
    final_data = []
    for k, v in subjects.items():
        print(f"Subject {k}: {v['totalLOs']} LOs found.")
        final_data.append({
            "id": k,
            "name": v["name"],
            "totalLOs": v["totalLOs"]
        })

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2)
    print(f"Database saved to {output_path}")

if __name__ == "__main__":
    pdf_file = "ATPLSYLLABUS.pdf"
    output_file = "data/syllabus_db.json"
    
    # Check if files exist
    if not os.path.exists(pdf_file):
        # try referencing from root if running from script dir?
        # script is widely assumed to be run from project root as per Cwd
        pass

    extract_syllabus(pdf_file, output_file)
