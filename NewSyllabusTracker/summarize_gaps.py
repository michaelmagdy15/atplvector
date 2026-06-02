import json
from collections import defaultdict

def summarize_gaps():
    summary_path = 'NewSyllabusTracker/true_coverage_summary.json'
    with open(summary_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    not_mapped = data.get('NOT_MAPPED', [])
    prefix_covered = data.get('PREFIX_COVERED', [])
    stubs = data.get('STUB', [])

    print(f"Total NOT_MAPPED: {len(not_mapped)}")
    print(f"Total PREFIX_COVERED: {len(prefix_covered)}")
    print(f"Total STUB: {len(stubs)}")

    # Group by subject
    subjects_gaps = defaultdict(list)
    for lo in not_mapped:
        subj = lo.get('subject')
        subjects_gaps[subj].append(lo)

    # Subject Names Mapping
    subject_names = {
        '010': 'Air Law',
        '021': 'Aircraft General Knowledge (Systems)',
        '022': 'Instrumentation',
        '031': 'Mass & Balance',
        '032': 'Performance (Aeroplanes)',
        '033': 'Flight Planning',
        '040': 'Human Performance & Limitations',
        '050': 'Meteorology',
        '061': 'General Navigation',
        '062': 'Radio Navigation',
        '070': 'Operational Procedures',
        '081': 'Principles of Flight',
        '090': 'Communications',
        '100': 'KSA (Knowledge, Skills and Attitudes)'
    }

    report = []
    report.append("# ATPL Vector Content Gap Audit\n")
    report.append("This report lists all required EASA ATPL(A) learning objectives that are completely unmapped (`NOT_MAPPED`) in our platform configuration (`data/learningObjectives.ts`).\n")
    
    total_unmapped = 0
    for subj_code in sorted(subject_names.keys()):
        gaps = subjects_gaps.get(subj_code, [])
        count = len(gaps)
        total_unmapped += count
        subj_name = subject_names[subj_code]
        
        report.append(f"## Subject {subj_code}: {subj_name}")
        report.append(f"**Total Completely Unmapped LOs: {count}**\n")
        
        if count == 0:
            report.append("*No completely unmapped learning objectives! Dynamic prefixing covers all required areas.*")
        else:
            report.append("### Critical Missing Content Blocks:")
            # Display unique sub-chapters / patterns
            sub_chapters = defaultdict(list)
            for lo in gaps:
                lo_id = lo.get('id', '')
                parts = lo_id.split('.')
                # Sub-chapter is like 010.01 or 010.01.01
                if len(parts) >= 3:
                    sub_chapter = '.'.join(parts[:3])
                else:
                    sub_chapter = '.'.join(parts)
                sub_chapters[sub_chapter].append(lo.get('text'))
            
            for sub_ch, texts in sorted(sub_chapters.items()):
                report.append(f"- **{sub_ch}** ({len(texts)} missing leaf LOs):")
                # Show up to 3 example texts
                for t in texts[:3]:
                    report.append(f"  - {t}")
                if len(texts) > 3:
                    report.append(f"  - *...and {len(texts) - 3} more.*")
        report.append("\n" + "-"*40 + "\n")
        
    print(f"Total unmapped in check: {total_unmapped}")
    
    with open('NewSyllabusTracker/unmapped_gaps_report.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(report))

if __name__ == '__main__':
    summarize_gaps()
