# capitalize names of cities or destinations
# e.g. san francisco -> San Francisco
#       museum of fine arts -> Museum of Fine Arts
def capitalize_name(name_str):
    name_str_tokens = name_str.strip().split()
    length = len(name_str_tokens)
    capitalized_name = ""
    for idx, s in enumerate(name_str_tokens):
        s = s.capitalize()
        if s in ['Of', 'In']:
            capitalized_name += s.lower()
        else:
            capitalized_name += s
        if idx != length-1:
            capitalized_name += " "
    return capitalized_name