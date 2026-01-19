import PyPDF2
import sys

def extract_text(pdf_path, output_path):
    try:
        with open(pdf_path, 'rb') as pdf_file:
            reader = PyPDF2.PdfReader(pdf_file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        
        with open(output_path, 'w', encoding='utf-8') as text_file:
            text_file.write(text)
        print(f"Successfully extracted text to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    extract_text(r'C:\Users\Mi5a\atplvector\INST-SUMM.pdf', 'inst_summ_content.txt')
