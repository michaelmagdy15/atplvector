import fitz

pdf_path = r"egyptair/ABC 4th Edition.pdf"
try:
    doc = fitz.open(pdf_path)
    toc = doc.get_toc()
    print(f"Total entries: {len(toc)}")
    
    current_chapter = None
    for entry in toc:
        level, title, page = entry
        if level == 2:
            current_chapter = title
            print(f"\n--- {title} (Page {page}) ---")
        elif level == 3 and current_chapter:
            print(f"  - {title} (Page {page})")
except Exception as e:
    print("Error:", e)
