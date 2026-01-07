import json
import sys

def merge_syllabus(main_file, new_file):
    with open(main_file, 'r', encoding='utf-8') as f:
        main_data = json.load(f)
        
    with open(new_file, 'r', encoding='utf-8') as f:
        new_data_list = json.load(f)
        
    # Check if we are appending a list
    if isinstance(new_data_list, list):
        for item in new_data_list:
            # Check if this code already exists to avoid duplicates
             if not any(x['code'] == item['code'] for x in main_data):
                main_data.append(item)
             else:
                print(f"Item with code {item['code']} already exists. Skipping.")
    else:
        print("New data is not a list.")

    with open(main_file, 'w', encoding='utf-8') as f:
        json.dump(main_data, f, indent=2)
        
    print(f"Successfully merged data into {main_file}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python merge_syllabus.py <main_json> <new_json>")
        sys.exit(1)
        
    main_file = sys.argv[1]
    new_file = sys.argv[2]
    
    merge_syllabus(main_file, new_file)
