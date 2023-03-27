from bs4 import BeautifulSoup
import sys
from pprint import pprint
import json
import re

def clean(s):
    return re.sub("\s{2,}", " ", s.replace("\t", " "))

def parse(filename, part):

    with open(filename) as f:
        html = f.read()

    rows = BeautifulSoup(html, 'html.parser').find_all("tr")

    table = [[td.text for td in row.find_all("td")] for row in rows]

    # print(table)

    table_dict = {
        "part": part,
        "title": {
            "chinese": table[1][1],
            "legge": table[1][2],
            "susuki": table[1][3],
            "goddard": table[1][4],
        },
        "verses": []
    }

    for verse in table[2:]:
        # pprint(verse)
        table_dict["verses"].append({
            "verse": verse[0],
            "chinese": clean(verse[1]),
            "legge": clean(verse[2]),
            "susuki": clean(verse[3]),
            "goddard": clean(verse[4]),
        })

    # result = json.dumps(table_dict, ensure_ascii=False)

    # with open(filename + ".json", "w") as writefile:
    #     writefile.write(result)

    return table_dict



if __name__ == "__main__":
    filenames = sys.argv[1:]

    parsed = [parse(f, i + 1) for (i, f) in enumerate(filenames)]

    print(json.dumps(parsed, ensure_ascii=False))
