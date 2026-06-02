import json

with open("egyptair/abc_extracted_knowledge.json", "r", encoding="utf-8") as f:
    data = json.load(f)

kb = data["knowledge_base"]
chapters = [str(ch).encode('ascii', 'ignore').decode('ascii') for ch in data.get("chapters_detected", [])]
print("Detected Chapters:", chapters)

print("\n--- Key Concepts by Category ---")
for k, v in kb.items():
    print(f"\nCategory: {k} (Total: {len(v)})")
    concepts = set(str(item["concept"]).encode('ascii', 'ignore').decode('ascii') for item in v)
    print("Unique Concepts:", list(concepts)[:20])
    
    print("Sample items:")
    for item in v[:5]:
        concept_safe = str(item['concept']).encode('ascii', 'ignore').decode('ascii')
        context_safe = str(item['context']).encode('ascii', 'ignore').decode('ascii')
        print(f"  - {concept_safe}: {context_safe}")
