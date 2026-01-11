from pypdf import PdfReader
import re

reader = PdfReader("ATPLSYLLABUS.pdf")
full_text = ""
for page in reader.pages:
    full_text += page.extract_text() + "\n"

lines = full_text.split('\n')
print("Searching for lines with 062...")
for i, line in enumerate(lines):
    if "062" in line:
        context = lines[i-2:i+3]
        print(f"Match at line {i}:")
        for c in context:
            print(f"  {c.strip()}")
        print("-" * 20)
