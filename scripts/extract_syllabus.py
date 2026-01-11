import re
import json
import os
from pypdf import PdfReader

def clean_text(text):
    return re.sub(r'\s+', ' ', text).strip()

def extract_syllabus(pdf_path, output_path):
    print(f"Reading {pdf_path}...")
    try:
        reader = PdfReader(pdf_path)
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return

    full_text = ""
    print(f"Extracting text from {len(reader.pages)} pages...")
    for i, page in enumerate(reader.pages):
        try:
            full_text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Warning: Could not extract text from page {i}: {e}")

    # EASA Syllabus Reference Numbers usually follow this hierarchy:
    # Subject:   010 00 00 00
    # Topic:     010 01 00 00
    # Subtopic:  010 01 01 00
    # LO:        010 01 01 01 (sometimes with dots: 010.01.01.01)
    
    # We will build a hierarchical dictionary
    syllabus = []
    
    # Map to keep track of current context
    current_subject = None
    current_topic = None
    current_subtopic = None
    
    lines = full_text.split('\n')
    
    # Regex Patterns
    # 010 00 00 00 followed by text
    subject_pattern = re.compile(r"^(\d{3})\s+00\s+00\s+00\s+(.+)$")
    
    # 010 01 00 00 
    topic_pattern = re.compile(r"^(\d{3})\s+(\d{2})\s+00\s+00\s+(.+)$")
    
    # 010 01 01 00
    subtopic_pattern = re.compile(r"^(\d{3})\s+(\d{2})\s+(\d{2})\s+00\s+(.+)$")
    
    # LO: 010 01 01 01 OR 010.01.01.01
    lo_pattern_spaces = re.compile(r"^(\d{3})\s+(\d{2})\s+(\d{2})\s+(\d{2})\s+(.+)$")
    lo_pattern_dots = re.compile(r"^(\d{3})\.(\d{2})\.(\d{2})\.(\d{2})\s+(.+)$")

    print("Parsing text...")
    
    # Helper to find or create nodes
    def find_or_create_subject(code, title):
        nonlocal current_subject, current_topic, current_subtopic
        # Check if subject already exists (in case of page breaks repeating headers)
        for sub in syllabus:
            if sub['code'].startswith(code):
                current_subject = sub
                current_topic = None
                current_subtopic = None
                return
        
        # Create new
        new_subject = {
            "code": f"{code} 00 00 00",
            "title": clean_text(title),
            "children": [],
            "los": []
        }
        syllabus.append(new_subject)
        current_subject = new_subject
        current_topic = None
        current_subtopic = None

    def find_or_create_topic(code, topic_idx, title):
        nonlocal current_topic, current_subtopic
        if not current_subject: return 
        
        full_code = f"{code} {topic_idx} 00 00"
        
        # Check existing
        for t in current_subject['children']:
            if t['code'] == full_code:
                current_topic = t
                current_subtopic = None
                return

        new_topic = {
            "code": full_code,
            "title": clean_text(title),
            "children": [],
            "los": []
        }
        current_subject['children'].append(new_topic)
        current_topic = new_topic
        current_subtopic = None

    def find_or_create_subtopic(code, topic_idx, subtopic_idx, title):
        nonlocal current_subtopic
        if not current_topic: return

        full_code = f"{code} {topic_idx} {subtopic_idx} 00"
        
        for st in current_topic['children']:
            if st['code'] == full_code:
                current_subtopic = st
                return

        new_subtopic = {
            "code": full_code,
            "title": clean_text(title),
            "children": [],
            "los": [] # Leaf LOs here
        }
        current_topic['children'].append(new_subtopic)
        current_subtopic = new_subtopic

    def add_lo(code, topic_idx, sub_idx, lo_idx, text):
        # Determine where to add LO. Ideally in current_subtopic.
        # But sometimes PDF structure skips levels or LO is direct child of topic.
        
        target = current_subtopic if current_subtopic else current_topic
        if not target and current_subject: target = current_subject # Fallback
        
        if target:
            full_id = f"{code}.{topic_idx}.{sub_idx}.{lo_idx}"
            target['los'].append({
                "id": lo_idx,
                "text": clean_text(text),
                "full_id": full_id
            })

    for line in lines:
        line = line.strip()
        if not line: continue
        
        # Subject
        m_subj = subject_pattern.match(line)
        if m_subj:
            find_or_create_subject(m_subj.group(1), m_subj.group(2))
            continue
            
        # Topic
        m_topic = topic_pattern.match(line)
        if m_topic:
            # Ensure subject context is correct or inferred? 
            # We assume sequential processing matches context.
            if current_subject and m_topic.group(1) == current_subject['code'][:3]:
                find_or_create_topic(m_topic.group(1), m_topic.group(2), m_topic.group(3))
            continue
            
        # Subtopic
        m_sub = subtopic_pattern.match(line)
        if m_sub:
            if current_topic: # Simplification: assume parent topic is set
                 find_or_create_subtopic(m_sub.group(1), m_sub.group(2), m_sub.group(3), m_sub.group(4))
            continue

        # LO
        m_lo = lo_pattern_spaces.match(line) or lo_pattern_dots.match(line)
        if m_lo:
            # 1=code, 2=topic, 3=sub, 4=lo, 5=text
            # Try to auto-create hierarchy if missing?
            # For now, just add to current context if possible
            add_lo(m_lo.group(1), m_lo.group(2), m_lo.group(3), m_lo.group(4), m_lo.group(5))
            continue

    print(f"Extraction complete. Found {len(syllabus)} subjects.")
    
    # Save
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(syllabus, f, indent=2)
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    pdf_file = "ATPLSYLLABUS.pdf"
    output_file = "data/syllabus.json"
    
    if os.path.exists(pdf_file):
        extract_syllabus(pdf_file, output_file)
    else:
        print(f"File not found: {pdf_file}")
