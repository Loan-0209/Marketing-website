import re

filename = '3d-campus-smart-city-complete.html'

# Read file
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

# Search patterns
patterns = [
    'window.dataFlowSystem.initializeDataFlows()',
    'window.neuralSystem.applyToAllBuildings()', 
    'window.dataFlowSystem.maxStreams'
]

for pattern in patterns:
    print(f"\n{'='*60}")
    print(f"Searching for: {pattern}")
    print('='*60)
    
    found = False
    for i, line in enumerate(lines):
        if pattern in line:
            found = True
            line_num = i + 1
            print(f"\nFound at line {line_num}:")
            
            # Show context (5 lines before and after)
            start = max(0, i - 5)
            end = min(len(lines), i + 6)
            
            for j in range(start, end):
                marker = ">>> " if j == i else "    "
                print(f"{marker}{j+1:4d}: {lines[j]}")
    
    if not found:
        print("Not found")