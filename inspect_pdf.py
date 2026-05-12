import fitz
doc = fitz.open('PPL SYLLABUS 2025.pdf')
print('Pages:', doc.page_count)
print('Metadata:', doc.metadata)
text = ''
for i in range(min(15, doc.page_count)):
    text += doc[i].get_text() + '\n'
lines = text.splitlines()
for i, line in enumerate(lines[:300]):
    print(f"{i}: {line}")
