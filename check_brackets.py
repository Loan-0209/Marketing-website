import re

with open('3d-smart-city.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract JavaScript content (between script tags)
script_pattern = r'<script[^>]*>(.*?)</script>'
scripts = re.findall(script_pattern, content, re.DOTALL)

# Combine all JavaScript code
js_code = '\n'.join(scripts)

# Stack-based bracket matching
def check_brackets(code):
    stack = []
    brackets = {'(': ')', '[': ']', '{': '}'}
    line_num = 1
    col_num = 1
    
    for i, char in enumerate(code):
        if char == '\n':
            line_num += 1
            col_num = 1
        else:
            col_num += 1
            
        if char in brackets:
            stack.append({'char': char, 'line': line_num, 'col': col_num, 'pos': i})
        elif char in brackets.values():
            if not stack:
                print(f'❌ Extra closing bracket {char} at line {line_num}, col {col_num}')
                return False
            
            last = stack.pop()
            expected = brackets[last['char']]
            if char != expected:
                print(f'❌ Mismatch: Expected {expected} but found {char} at line {line_num}, col {col_num}')
                print(f'   Opening {last["char"]} was at line {last["line"]}, col {last["col"]}')
                return False
    
    if stack:
        print(f'❌ {len(stack)} unclosed brackets:')
        for item in stack[:5]:  # Show first 5
            print(f'   {item["char"]} at line {item["line"]}, col {item["col"]}')
        return False
    
    return True

# Check brackets in JavaScript sections
print('🔍 Checking bracket matching in JavaScript code...')
if check_brackets(js_code):
    print('✅ All brackets match correctly!')
    
# Count brackets
print(f'\n📊 Bracket counts:')
print(f'   {{ : {js_code.count("{")} | }} : {js_code.count("}")}')
print(f'   [ : {js_code.count("[")} | ] : {js_code.count("]")}')
print(f'   ( : {js_code.count("(")} | ) : {js_code.count(")")}')

# Also check for common issues
print('\n🔍 Checking for common syntax issues:')

# Check for unclosed strings
string_patterns = [
    (r'"[^"]*$', 'Unclosed double quote'),
    (r"'[^']*$", 'Unclosed single quote'),
    (r'`[^`]*$', 'Unclosed template literal')
]

for pattern, desc in string_patterns:
    matches = re.findall(pattern, js_code, re.MULTILINE)
    if matches:
        print(f'❌ {desc} found: {len(matches)} instances')
    else:
        print(f'✅ No {desc.lower()}s')