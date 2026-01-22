
import json
import os

try:
    with open('data/qb_metadata.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    subjects = ['010', '021', '022', '031', '032', '033', '040', '050', '061', '062', '070', '081', '090']
    for s in subjects:
        if s in data:
            # The structure is data["010"] = [ { "id": "010", "questionCount": 1220, ... }, ... ]
            count = data[s][0].get('questionCount', 0)
            print(f"{s}: {count}")
        else:
            print(f"{s}: Not Found")
except Exception as e:
    print(e)
