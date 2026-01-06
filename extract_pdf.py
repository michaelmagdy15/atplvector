import sys
import os

# Try to import pypdf, if not found, print installation instruction
try:
    from pypdf import PdfReader
except ImportError:
    print("Error: 'pypdf' library is used but not installed.")
    print("Please run: pip install pypdf")
    sys.exit(1)

def extract_text_from_pdf(pdf_path):
    if not os.path.exists(pdf_path):
        print(f"Error: File '{pdf_path}' not found.")
        return None

    try:
        reader = PdfReader(pdf_path)
        print(f"Extracting text from: {pdf_path}")
        print(f"Total pages: {len(reader.pages)}")
        
        full_text = []
        for i, page in enumerate(reader.pages):
            print(f"Processing page {i+1}...", end='\r')
            text = page.extract_text()
            if text:
                full_text.append(text)
        
        print("\nExtraction finished.")
        return "\n\n".join(full_text)
        
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    # Use command line argument if provided, otherwise check for the specific file in directory
    if len(sys.argv) > 1:
        pdf_file = sys.argv[1]
    else:
        # Default detected in your directory
        default_file = "040_Easy-Access-Rules-for-Aircrew-Regulation-EU-No-1178_2011-—-Revision-from-February-2022.pdf"
        if os.path.exists(default_file):
            print(f"No file argument provided. Using found file: {default_file}")
            pdf_file = default_file
        else:
            print("Usage: python extract_pdf.py <filename.pdf>")
            sys.exit(1)
    
    content = extract_text_from_pdf(pdf_file)
    
    if content:
        output_filename = f"{os.path.splitext(pdf_file)[0]}_extracted.txt"
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Text successfully saved to: {output_filename}")
