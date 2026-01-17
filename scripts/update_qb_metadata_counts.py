import json
from pathlib import Path

DATA_DIR = Path("data")
METADATA_FILE = DATA_DIR / "qb_metadata.json"
QUESTIONS_DIR = Path("public/question-bank/atpl")

def update_counts():
    if not METADATA_FILE.exists():
        print("Metadata file not found.")
        return

    print("Loading metadata...")
    with open(METADATA_FILE, 'r', encoding='utf-8') as f:
        metadata = json.load(f)

    for subject_id, nodes in metadata.items():
        print(f"Processing Subject {subject_id}...")
        
        # Load questions for this subject
        q_file = QUESTIONS_DIR / f"{subject_id}.json"
        if not q_file.exists():
            print(f"  Warning: Question file for {subject_id} not found.")
            # Initialize counts to 0 if file missing
            for node in nodes:
                node['questionCount'] = 0
            continue

        with open(q_file, 'r', encoding='utf-8') as f:
            questions = json.load(f)
        
        print(f"  Loaded {len(questions)} questions.")

        # Initialize counts
        node_counts = {node['id']: 0 for node in nodes}

        # Calculate counts
        # A question counts for a node if any of its LOs start with the node ID
        for q in questions:
            # Get unique LO prefixes that match our nodes
            # Optimization: A question might have 010.01.01.01 and 010.01.01.02.
            # Both map to 010.01.01 (level 3), 010.01 (level 2), 010 (level 1).
            # We must count this question ONCE for each node it belongs to.
            
            matched_nodes = set()
            
            for lo in q.get('learningObjectives', []):
                # Check against all nodes? No, too slow.
                # Generate potential parent IDs from LO string.
                # LO: 010.01.01.01 -> Potential: 010, 010.01, 010.01.01
                parts = lo.split('.')
                current_id = ""
                for i, part in enumerate(parts):
                    if i > 2: break # We only go up to level 3 in metadata
                    if i > 0: current_id += "."
                    current_id += part
                    
                    if current_id in node_counts:
                        matched_nodes.add(current_id)
            
            for node_id in matched_nodes:
                node_counts[node_id] += 1

        # Update metadata nodes
        for node in nodes:
            node['questionCount'] = node_counts.get(node['id'], 0)
        
    print("Saving updated metadata...")
    with open(METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    print("Done.")

if __name__ == "__main__":
    update_counts()
