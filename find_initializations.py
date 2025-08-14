#!/usr/bin/env python3

import re

def find_patterns_in_file(filename):
    """Find the specific patterns in the HTML file and return exact line numbers with context."""
    
    patterns = [
        'window.dataFlowSystem.initializeDataFlows()',
        'window.neuralSystem.applyToAllBuildings()', 
        'window.dataFlowSystem.maxStreams'
    ]
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        results = []
        
        for line_num, line in enumerate(lines, 1):
            for pattern in patterns:
                if pattern in line:
                    results.append({
                        'pattern': pattern,
                        'line_number': line_num,
                        'line_content': line.strip(),
                        'context_start': max(1, line_num - 5),
                        'context_end': min(len(lines), line_num + 5)
                    })
        
        return results, lines
    
    except Exception as e:
        return [], []

def print_results(results, lines):
    """Print the results with context."""
    if not results:
        print("❌ No patterns found in file")
        return
    
    for result in results:
        print(f"\n{'='*80}")
        print(f"🎯 PATTERN FOUND: {result['pattern']}")
        print(f"📍 LINE: {result['line_number']}")
        print('='*80)
        
        # Print context
        for i in range(result['context_start'] - 1, result['context_end']):
            if i < len(lines):
                line_num = i + 1
                prefix = ">>> " if line_num == result['line_number'] else "    "
                print(f"{prefix}{line_num:4d}: {lines[i].rstrip()}")

if __name__ == "__main__":
    filename = '3d-campus-smart-city-complete.html'
    print(f"🔍 Searching for initialization patterns in {filename}...")
    
    results, lines = find_patterns_in_file(filename)
    print_results(results, lines)
    
    if not results:
        print("\n🔍 Let me also search for related patterns...")
        # Search for related patterns
        related_patterns = [
            'dataFlowSystem',
            'neuralSystem', 
            'initializeDataFlows',
            'applyToAllBuildings',
            'maxStreams'
        ]
        
        found_related = []
        for line_num, line in enumerate(lines, 1):
            for pattern in related_patterns:
                if pattern in line and 'window.' in line:
                    found_related.append({
                        'pattern': pattern,
                        'line_number': line_num,
                        'line_content': line.strip()
                    })
        
        if found_related:
            print("\n📋 Related patterns found:")
            for item in found_related[:10]:  # Show first 10 matches
                print(f"  Line {item['line_number']}: {item['line_content']}")
        else:
            print("❌ No related patterns found either")