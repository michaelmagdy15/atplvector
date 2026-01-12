from pypdf import PdfReader
import os

pdf_path = r'components\RadioNav\062syllabus.pdf'
output_path = r'components\RadioNav\062syllabus_extracted.txt'

try:
    reader = PdfReader(pdf_path)
    print(f"Extracting text from {pdf_path}...")
    print(f"Number of pages: {len(reader.pages)}")
    
    with open(output_path, 'w', encoding='utf-8') as f:
        for i, page in enumerate(reader.pages):
            f.write(f"--- Page {i+1} ---\n")
            text = page.extract_text()
            f.write(text)
            f.write("\n\n")
            
    print(f"Text extracted to {output_path}")

except Exception as e:
    print(f"Error extracting text: {e}")
