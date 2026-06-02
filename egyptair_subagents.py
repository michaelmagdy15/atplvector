import fitz
import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

pdf_path = r"egyptair/ABC 4th Edition.pdf"
output_path = r"egyptair/abc_extracted_knowledge.json"

def analyze_text(page_num, text):
    """
    Analyzes text from a specific page to extract key training concepts,
    EgyptAir specific rules, flight limits, systems, or formulas.
    """
    findings = []
    
    # Check for EgyptAir specific SOPs or ECAA rules
    ecar_matches = re.findall(r'(ECAR\s*\d+|Egyptian\s+Civil\s+Aviation|ECAA)', text, re.IGNORECASE)
    for m in ecar_matches:
        findings.append({
            "type": "regulation",
            "concept": m,
            "context": f"Found on page {page_num+1}"
        })
        
    # Check for flight time limits (FTL)
    ftl_matches = re.findall(r'(\b\d+\s*(?:hours|hrs)\b.*(?:flight|duty|rest|limit|block))', text, re.IGNORECASE)
    for m in ftl_matches:
        findings.append({
            "type": "ftl",
            "concept": "Flight Time Limitations",
            "context": m
        })

    # Check for fuel definitions
    fuel_matches = re.findall(r'(\b(?:taxi|trip|contingency|alternate|final\s+reserve|additional|extra)\s+fuel\b)', text, re.IGNORECASE)
    for m in fuel_matches:
        findings.append({
            "type": "fuel_policy",
            "concept": m.strip().title(),
            "context": f"Fuel policy context on page {page_num+1}"
        })

    # Check for specific performance speeds or calculations
    perf_matches = re.findall(r'(\b(?:V1|VR|V2|Vref|Vmu|Vlo|Vle|Vs|Vmcg|Vmca)\b)', text)
    for m in perf_matches:
        findings.append({
            "type": "jet_performance",
            "concept": m,
            "context": f"Takeoff/Landing speeds found on page {page_num+1}"
        })

    # Check for CRM or ADM hazardous attitudes
    crm_matches = re.findall(r'(\b(?:anti-authority|impulsivity|invulnerability|macho|resignation)\b)', text, re.IGNORECASE)
    for m in crm_matches:
        findings.append({
            "type": "crm_adm",
            "concept": m.strip().title(),
            "context": f"Hazardous attitude found on page {page_num+1}"
        })

    # Check for specific cockpit systems
    sys_matches = re.findall(r'(\b(?:hydraulic|pneumatic|electrical|fly-by-wire|FBW|FMC|autopilot|autoland)\b)', text, re.IGNORECASE)
    for m in sys_matches:
        findings.append({
            "type": "aircraft_systems",
            "concept": m.strip().title(),
            "context": f"Aircraft system context on page {page_num+1}"
        })

    # Check for navigation specific concepts
    nav_matches = re.findall(r'(\b(?:holding\s+pattern|DME\s+arc|climb\s+gradient|descent\s+gradient|GPS\s+jamming|spoofing|RVSM)\b)', text, re.IGNORECASE)
    for m in nav_matches:
        findings.append({
            "type": "instrument_nav",
            "concept": m.strip().title(),
            "context": f"Navigation concept on page {page_num+1}"
        })

    # Extract general paragraphs that look like key definitions or SOP highlights
    lines = text.splitlines()
    for line in lines:
        line_strip = line.strip()
        if len(line_strip) > 40 and any(keyword in line_strip.lower() for keyword in ["egyptair", "sop", "pilot", "cadet", "must", "required", "shall"]):
            findings.append({
                "type": "sop_highlight",
                "concept": "EgyptAir SOP / Directive",
                "context": line_strip
            })

    return findings

def process_page_range(agent_id, start_page, end_page):
    """
    Subagent process that reads and extracts knowledge from a specific range of pages.
    """
    print(f"[Subagent-{agent_id}] Starting page range {start_page+1} to {end_page+1}...")
    doc = fitz.open(pdf_path)
    
    agent_findings = []
    
    # We will also gather some sample content text to build key summaries
    chapter_titles = []
    
    for page_num in range(start_page, min(end_page + 1, doc.page_count)):
        page = doc[page_num]
        text = page.get_text()
        
        # Look for chapter headers
        header_match = re.search(r'(?:CHAPTER\s+\d+|PREFACE|TABLE\s+OF\s+CONTENTS|ACKNOWLEDGMENT|WELCOME|SOURCES|ABBREVIATIONS)\b.*', text, re.IGNORECASE)
        if header_match:
            chapter_titles.append(header_match.group(0).strip())
            
        page_findings = analyze_text(page_num, text)
        agent_findings.extend(page_findings)
        
    doc.close()
    print(f"[Subagent-{agent_id}] Completed. Found {len(agent_findings)} key points.")
    return {
        "agent_id": agent_id,
        "start_page": start_page + 1,
        "end_page": end_page + 1,
        "findings": agent_findings,
        "chapters": list(set(chapter_titles))
    }

def main():
    doc = fitz.open(pdf_path)
    total_pages = doc.page_count
    doc.close()
    
    num_subagents = 30
    chunk_size = (total_pages + num_subagents - 1) // num_subagents
    
    print(f"Total pages to analyze: {total_pages}")
    print(f"Spawning {num_subagents} subagents in parallel (chunk size: {chunk_size} pages)...")
    
    futures = []
    results = []
    
    with ThreadPoolExecutor(max_workers=num_subagents) as executor:
        for i in range(num_subagents):
            start = i * chunk_size
            end = min(start + chunk_size - 1, total_pages - 1)
            if start < total_pages:
                futures.append(executor.submit(process_page_range, i + 1, start, end))
                
        for fut in as_completed(futures):
            results.append(fut.result())
            
    # Sort results by agent ID
    results.sort(key=lambda x: x["agent_id"])
    
    # Aggregate findings by type
    aggregated = {
        "regulation": [],
        "ftl": [],
        "fuel_policy": [],
        "jet_performance": [],
        "crm_adm": [],
        "aircraft_systems": [],
        "instrument_nav": [],
        "sop_highlight": []
    }
    
    all_chapters = []
    
    for res in results:
        all_chapters.extend(res["chapters"])
        for find in res["findings"]:
            ftype = find["type"]
            concept = find["concept"]
            context = find["context"]
            
            # Avoid exact duplicates
            exists = any(item["concept"] == concept and item["context"] == context for item in aggregated[ftype])
            if not exists:
                aggregated[ftype].append({
                    "concept": concept,
                    "context": context,
                    "source_agent": res["agent_id"],
                    "pages": f"Pages {res['start_page']}-{res['end_page']}"
                })
                
    output_data = {
        "total_pages": total_pages,
        "num_subagents": num_subagents,
        "chapters_detected": list(set(all_chapters)),
        "knowledge_base": aggregated
    }
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=4)
        
    print("\n" + "="*50)
    print("EXTRACTION COMPLETE")
    print("="*50)
    print(f"Aggregated knowledge written to: {output_path}")
    print(f"Total Regulation points: {len(aggregated['regulation'])}")
    print(f"Total FTL rules: {len(aggregated['ftl'])}")
    print(f"Total Fuel Policy rules: {len(aggregated['fuel_policy'])}")
    print(f"Total Jet Performance items: {len(aggregated['jet_performance'])}")
    print(f"Total CRM & ADM items: {len(aggregated['crm_adm'])}")
    print(f"Total Aircraft Systems: {len(aggregated['aircraft_systems'])}")
    print(f"Total Instrument Navigation: {len(aggregated['instrument_nav'])}")
    print(f"Total SOP Highlights: {len(aggregated['sop_highlight'])}")
    print("="*50)

if __name__ == "__main__":
    main()
