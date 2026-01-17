import os
import yaml
import json
import shutil
from pathlib import Path

SOURCE_DIR = Path("chair-flight-source/libs/content/question-bank-atpl/content")
OUTPUT_DIR = Path("public/question-bank/atpl")
IMAGE_OUTPUT_DIR = OUTPUT_DIR / "images"

# Ensure output directories exist
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
IMAGE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def process_subject(subject_path):
    subject_id = subject_path.name
    print(f"Processing subject: {subject_id}")
    
    all_questions = []
    subject_images = {} # Map ID to filename
    
    # First pass: find all images in this subject
    for root, dirs, files in os.walk(subject_path):
        if "annexes" in dirs:
            annex_dir = Path(root) / "annexes"
            for image_file in annex_dir.glob("*"):
                if image_file.suffix.lower() in [".jpg", ".jpeg", ".png", ".svg"]:
                    shutil.copy(image_file, IMAGE_OUTPUT_DIR / image_file.name)
                    subject_images[image_file.stem] = image_file.name

    # Second pass: process questions
    for root, dirs, files in os.walk(subject_path):
        if "questions.yaml" in files:
            yaml_path = Path(root) / "questions.yaml"
            with open(yaml_path, 'r', encoding='utf-8') as f:
                try:
                    questions = yaml.safe_load(f)
                    if questions:
                        for q in questions:
                            # Map chair-flight structure to something clean
                            annex_ids = q.get("annexes", [])
                            processed_annexes = []
                            for aid in annex_ids:
                                if aid in subject_images:
                                    processed_annexes.append(subject_images[aid])
                                else:
                                    # Fallback if not found in this subject, maybe it's global or misspelled
                                    processed_annexes.append(f"{aid}.jpg") 
                            
                            processed_q = {
                                "id": q.get("id"),
                                "question": q.get("variant", {}).get("question", ""),
                                "explanation": q.get("explanation", ""),
                                "options": [],
                                "correctAnswer": -1,
                                "learningObjectives": q.get("learningObjectives", []),
                                "annexes": processed_annexes
                            }
                            
                            options = q.get("variant", {}).get("options", [])
                            for idx, opt in enumerate(options):
                                processed_q["options"].append(opt.get("text", ""))
                                if opt.get("correct"):
                                    processed_q["correctAnswer"] = idx
                            
                            all_questions.append(processed_q)
                except Exception as e:
                    print(f"Error parsing {yaml_path}: {e}")

    if all_questions:
        output_file = OUTPUT_DIR / f"{subject_id}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_questions, f, indent=2)
        print(f"Saved {len(all_questions)} questions to {output_file}")

def main():
    if not SOURCE_DIR.exists():
        print(f"Source directory {SOURCE_DIR} not found. Please clone the repo first.")
        return

    # Iterate over subject folders (010, 021, etc.)
    for subject_dir in sorted(SOURCE_DIR.iterdir()):
        if subject_dir.is_dir() and subject_dir.name.isdigit():
            process_subject(subject_dir)

if __name__ == "__main__":
    main()
