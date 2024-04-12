import sys
from typing import Optional
import csv


source_data = ""
target_path = "extracted.csv"
mode =""
filter = ""
filtered_data = []

def check_sys_arg_exists(arg_list: list) -> Optional[int]:
    for index, item in enumerate(sys.argv[1:]):
        for arg in arg_list:
            if item == arg:
                return index + 1
    return None


if check_sys_arg_exists(["--help"]):
    print('''
    python extractor.py (--extract-entries|--stats) --data {path/to/data/file} [--target {target/file/name}] [--state-filter {state_name}]

    Mandatory parameters :
        --data : path to the data file
        --extract-entries or --stats : extract-entries is used to filter the csv file based on a State, 
                                       stats is used to generate stats about the percentage of people based on their Education
    Optional parameters :
        --target : Name of the file containing the output
        --state-filter : Filter on State, some examples of possible values are Oregon, California, Washington, Nevada
    ''')
    exit()

if data_arg_index := check_sys_arg_exists(["--data"]):
    with open(sys.argv[data_arg_index + 1], "r", encoding="utf-8") as f:
        source_data = csv.DictReader(f)
        if filter_arg_index := check_sys_arg_exists(["--state-filter"]):
            filter = sys.argv[filter_arg_index + 1]
            print("The name to use will be : ", filter)
            for row in source_data:
                if row["State"] == filter:
                    filtered_data.append(row)
        else:
            for row in source_data:
                filtered_data.append(row)

    print(filtered_data)
    print("data loaded correctly")
else:
    print("data option was not specified, launch the script with --help to see the available options, "
          "exiting script ...")
    exit(1)

if check_sys_arg_exists(["--extract-entries"]):
    mode = "extract"
    print("Mode set to extract")
elif check_sys_arg_exists(["--stats"]):
    mode = "stats"
    print("Mode set to stats")
else:
    print("No mode were specified, restart the command with either --extract-entries or --stats"
          "exiting script ...")
    exit(1)

if target_arg_index := check_sys_arg_exists(["--target"]):
    target_path = sys.argv[target_arg_index + 1]
    print("File will be saved in ", target_path)


if mode == "extract":
    with open(target_path, 'w', newline='') as targetcsv:
        fieldnames=list(filtered_data[0].keys())
        writer = csv.DictWriter(targetcsv, fieldnames=fieldnames)
        writer.writeheader()
        for entry in filtered_data:
            writer.writerow(entry)
elif mode == "stats":
    count = len(filtered_data)
    bachelor = 0
    master = 0
    doctor = 0
    college = 0
    highschool_or_below = 0
    for entry in filtered_data:
        if entry["Education"] == "Master":
            master = master + 1
        elif entry["Education"] == "Bachelor":
            bachelor = bachelor + 1
        elif entry["Education"] == "College":
            college = college + 1
        elif entry["Education"] == "Doctor":
            doctor = doctor + 1
        elif entry["Education"] == "High School or Below":
            highschool_or_below = highschool_or_below + 1

    stats_dict = {
        "Count": count,
        "Percent Bachelor": bachelor / count * 100,
        "Percent Master": master / count * 100,
        "Percent Doctor": doctor / count * 100,
        "Percent College": college / count * 100,
        "Percent Highschool Or Below": highschool_or_below / count * 100
    }

    with open(target_path, 'w', newline='') as targetcsv:
        fieldnames=list(stats_dict.keys())
        writer = csv.DictWriter(targetcsv, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerow(stats_dict)