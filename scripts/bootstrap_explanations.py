import json
import os
import time
from pathlib import Path

# IMPORTANT: Set your Gemini API key here
# GEMINI_API_KEY = "your-api-key-here"

QUESTIONS_DIR = Path('public/question-bank/atpl')

def generate_explanation(question_text, options, correct_answer):
    """
    Template for calling Gemini 1.5 Flash.
    In a real implementation, you would use the google-generativeai package.
    """
    # prompt = f"As an ATPL expert, provide a concise explanation for this question: {question_text}. 
    # Options: {options}. Correct answer: {options[correct_answer]}."
    # response = model.generate_content(prompt)
    # return response.text
    return "AI-generated explanation placeholder. Run this script with a valid Gemini API key to populate."

def bootstrap_explanations():
    if not QUESTIONS_DIR.exists():
        print(f"Directory {QUESTIONS_DIR} not found.")
        return

    for filename in os.listdir(QUESTIONS_DIR):
        if filename.endswith('.json'):
            file_path = QUESTIONS_DIR / filename
            print(f"Processing {filename}...")
            
            with open(file_path, 'r', encoding='utf-8') as f:
                questions = json.load(f)

            updated_count = 0
            for q in questions:
                if not q.get('explanation') or q['explanation'].strip() == "":
                    # Limiting to a few for demo safety; remove limit for full run
                    if updated_count < 10: 
                        q['explanation'] = generate_explanation(q['question'], q['options'], q['correctAnswer'])
                        updated_count += 1
            
            if updated_count > 0:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(questions, f, indent=2)
                print(f"  Populated {updated_count} explanations in {filename}.")

if __name__ == "__main__":
    print("This script requires a Gemini API key to function.")
    print("Populating placeholders for demonstration...")
    bootstrap_explanations()
