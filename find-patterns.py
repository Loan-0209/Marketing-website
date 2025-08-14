#!/usr/bin/env python3
import re

def find_patterns(filename):
    patterns = {
        'AmbientLight': r'AmbientLight.*intensity',
        'buildingColors': r'buildingColors\s*=\s*\[',
        'density': r'density\s*=\s*0\.\d+'
    }
    
    results = {key: [] for key in patterns}
    
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for i, line in enumerate(lines, 1):
        for pattern_name, pattern in patterns.items():
            if re.search(pattern, line):
                results[pattern_name].append({
                    'line_number': i,
                    'content': line.strip()
                })
    
    return results

if __name__ == '__main__':
    results = find_patterns('3d-campus-smart-city-complete.html')
    
    print("=== SEARCH RESULTS ===\n")
    
    print("1. AmbientLight with intensity:")
    for match in results['AmbientLight']:
        print(f"   Line {match['line_number']}: {match['content']}")
    
    print("\n2. buildingColors array:")
    for match in results['buildingColors']:
        print(f"   Line {match['line_number']}: {match['content']}")
    
    print("\n3. density settings:")
    for match in results['density']:
        print(f"   Line {match['line_number']}: {match['content']}")