from pypdf import PdfReader
import re

reader = PdfReader("ATPLSYLLABUS.pdf")
print(f"Searching {len(reader.pages)} pages...")

pattern = re.compile(r"062\s+00\s+00\s+00")

for i, page in enumerate(reader.pages):
    text = page.extract_text()
    if pattern.search(text):
        print(f"Found 062 header on page {i+1}")
        lines = text.split('\n')
        for line in lines:
            if "062" in line:
                print(f"Line content: '{line.strip()}'")
                # Show hex to detect hidden chars
                print(f"Hex: {line.strip().encode('utf-8').hex()}")
        break
