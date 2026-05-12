import re
import json

def extract_objectives_from_chunks(chunk_files):
    text = ""
    for cf in chunk_files:
        with open(cf, 'r', encoding='utf-8') as f:
            text += f.read() + "\n"

    # Split by GROUND LESSON \d+
    # Find all lesson names and their contents
    matches = list(re.finditer(r'GROUND LESSON (\d+)', text))
    
    lessons = []
    
    for i in range(len(matches)):
        start = matches[i].start()
        end = matches[i+1].start() if i+1 < len(matches) else len(text)
        
        lesson_text = text[start:end]
        lesson_num = matches[i].group(1)
        
        # Find OBJECTIVES and CONTENT
        obj_match = re.search(r'OBJECTIVES(.*?)CONTENT', lesson_text, re.DOTALL)
        if obj_match:
            obj_text = obj_match.group(1).strip()
            # Clean up the text
            # Remove any artifacts like page footers "Private Pilot Syllabus"
            obj_text = re.sub(r'Private Pilot Syllabus', '', obj_text)
            # Remove line breaks that split sentences (naive approach: just replace newlines with space, then re-split by bullets)
            lines = obj_text.split('\n')
            cleaned_lines = []
            for line in lines:
                line = line.strip()
                if not line or line.isdigit() or line.startswith('--- Page'):
                    continue
                cleaned_lines.append(line)
                
            lessons.append({
                "lesson": f"Ground Lesson {lesson_num}",
                "objectives_text": "\n".join(cleaned_lines)
            })
            
    return lessons

if __name__ == "__main__":
    lessons = extract_objectives_from_chunks(['chunk1.txt', 'chunk2.txt'])
    
    # Save to markdown
    with open('ppl_objectives_extracted.md', 'w', encoding='utf-8') as f:
        f.write("# PPL Ground Training Objectives\n\n")
        f.write("Extracted from Jeppesen Guided Flight Discovery Private Pilot Syllabus.\n\n")
        for lesson in lessons:
            f.write(f"## {lesson['lesson']}\n")
            f.write(lesson['objectives_text'] + "\n\n")
            
    print("Extraction complete. Found", len(lessons), "lessons.")
