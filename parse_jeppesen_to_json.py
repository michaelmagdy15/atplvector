import json
import re

def parse_markdown_to_json(input_md, output_json):
    with open(input_md, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    syllabus = []
    current_lesson = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.startswith("## Ground Lesson"):
            # New lesson
            if current_lesson:
                syllabus.append(current_lesson)
            current_lesson = {
                "lesson": line.replace("## ", "").strip(),
                "objectives": []
            }
        elif line.startswith("# ") or line.startswith("Extracted from"):
            continue
        elif current_lesson is not None:
            # We want to capture the actual objective bullets
            # Jeppesen bullets typically start with strange characters like ¢, *, ©, ), 0, 9
            # or just regular text if it's a category.
            # We can just store each line as an objective or category
            
            # Let's clean up bullet characters
            cleaned_line = re.sub(r'^[¢\*©\)\(09>e]\s*', '', line).strip()
            
            # If it's a category like "Part 141/61 Aeronautical Knowledge" or "Applicable Federal Aviation Regulations...", it might not be a bullet.
            # But the cleaned line is what we care about.
            if cleaned_line:
                current_lesson["objectives"].append({
                    "text": cleaned_line,
                    "original": line
                })
                
    if current_lesson:
        syllabus.append(current_lesson)
        
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(syllabus, f, indent=2)
        
    print(f"Parsed {len(syllabus)} lessons into {output_json}")

if __name__ == "__main__":
    parse_markdown_to_json('ppl_objectives_extracted.md', 'ppl_objectives.json')
