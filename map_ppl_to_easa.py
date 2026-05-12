import json

def map_lessons():
    with open('ppl_objectives.json', 'r', encoding='utf-8') as f:
        syllabus = json.load(f)
        
    # High-level mapping from Jeppesen lesson text to EASA subjects
    # This is a heuristic mapping based on keywords and known contents of the lessons
    mapping_rules = {
        "Ground Lesson 1": ["010 Air Law", "040 Human Performance"],
        "Ground Lesson 2": ["010 Air Law", "021 Airframe and Systems", "022 Instrumentation"],
        "Ground Lesson 3": ["081 Principles of Flight"],
        "Ground Lesson 4": ["010 Air Law", "070 Operational Procedures", "061 General Navigation"],
        "Ground Lesson 5": ["090 Communications", "010 Air Law"],
        "Ground Lesson 7": ["050 Meteorology"],
        "Ground Lesson 8": ["010 Air Law", "070 Operational Procedures"],
        "Ground Lesson 9": ["050 Meteorology"],
        "Ground Lesson 11": ["032 Performance", "031 Mass and Balance"],
        "Ground Lesson 12": ["033 Flight Planning", "062 Radio Navigation"],
        "Ground Lesson 13": ["040 Human Performance"],
        "Ground Lesson 14": ["033 Flight Planning", "061 General Navigation"],
        "Ground Lesson 17": ["General Review"]
    }
    
    for lesson in syllabus:
        lesson_name = lesson["lesson"]
        # Default to unmapped if we don't have a specific rule
        easa_subjects = mapping_rules.get(lesson_name, [])
        lesson["easa_mapping"] = easa_subjects
        
    with open('ppl_to_easa_mapped.json', 'w', encoding='utf-8') as f:
        json.dump(syllabus, f, indent=2)
        
    print(f"Mapped {len(syllabus)} lessons and saved to ppl_to_easa_mapped.json")

if __name__ == "__main__":
    map_lessons()
