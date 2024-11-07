from datetime import datetime
import re

def parse_time_string(time_str):
    # Check if the time string ends with 'Z' (indicating UTC)
    if time_str.endswith("Z"):
        # Remove 'Z' and parse as UTC time
        time_only = datetime.strptime(time_str[:-1], "%H:%M:%S.%f")
    else:
        # Parse as naive local time
        time_only = datetime.strptime(time_str, "%H:%M:%S.%f")
    return time_only

def get_year(date_str):
    try:
        # Regex pattern to match YYYY-MM-DD format
        pattern = r"^\d{4}-\d{2}-\d{2}$"
        if re.match(pattern, date_str) is None:
            raise ValueError
        return date_str[:4]
    except ValueError as e:
        print(e)

def get_month(date_str):
    try:
        # Regex pattern to match YYYY-MM-DD format
        pattern = r"^\d{4}-\d{2}-\d{2}$"
        if re.match(pattern, date_str) is None:
            raise ValueError
        return date_str[5:7]
    except ValueError as e:
        print(e)