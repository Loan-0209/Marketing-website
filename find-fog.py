#!/usr/bin/env python3
import re

def find_fog_references(filename):
    """Find all fog-related lines in the file"""
    fog_pattern = re.compile(r'fog|Fog|FOG|THREE\.Fog', re.IGNORECASE)
    
    fog_lines = []
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                if fog_pattern.search(line):
                    fog_lines.append({
                        'line_number': line_num,
                        'content': line.strip()
                    })
    except Exception as e:
        print(f"Error reading file: {e}")
        return []
    
    return fog_lines

def main():
    filename = '3d-campus-smart-city-complete.html'
    fog_lines = find_fog_references(filename)
    
    print(f"Found {len(fog_lines)} fog-related lines in {filename}:\n")
    
    for item in fog_lines:
        print(f"Line {item['line_number']}: {item['content']}")
    
    print(f"\nTotal fog references found: {len(fog_lines)}")

if __name__ == "__main__":
    main()