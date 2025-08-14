#!/usr/bin/env python3
import re

def search_patterns_with_context(filename, patterns, context_lines=5):
    """Search for patterns in a file and return line numbers with context."""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        results = {}
        
        for pattern in patterns:
            results[pattern] = []
            compiled_pattern = re.compile(pattern)
            
            for i, line in enumerate(lines):
                if compiled_pattern.search(line):
                    # Get context around the match
                    start = max(0, i - context_lines)
                    end = min(len(lines), i + context_lines + 1)
                    
                    context = []
                    for j in range(start, end):
                        prefix = ">>> " if j == i else "    "
                        context.append(f"{prefix}{j+1:4d}: {lines[j].rstrip()}")
                    
                    results[pattern].append({
                        'line_number': i + 1,
                        'line_content': line.strip(),
                        'context': context
                    })
        
        return results
    
    except Exception as e:
        return {'error': str(e)}

# Patterns to search for
patterns = [
    r'window\.dataFlowSystem\.initializeDataFlows\(\)',
    r'window\.neuralSystem\.applyToAllBuildings\(\)',
    r'window\.dataFlowSystem\.maxStreams'
]

filename = '3d-campus-smart-city-complete.html'
results = search_patterns_with_context(filename, patterns)

for pattern, matches in results.items():
    if pattern == 'error':
        print(f"ERROR: {matches}")
        continue
        
    print(f"\n{'='*80}")
    print(f"PATTERN: {pattern}")
    print(f"{'='*80}")
    
    if not matches:
        print("No matches found.")
        continue
    
    for match in matches:
        print(f"\nLine {match['line_number']}: {match['line_content']}")
        print("-" * 60)
        for context_line in match['context']:
            print(context_line)