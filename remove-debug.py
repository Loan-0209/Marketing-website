#!/usr/bin/env python3
"""
Remove Debug Elements - Clean up after confirming smart fix works
"""

import re
from pathlib import Path

def remove_debug_elements():
    """Remove debug borders and labels after confirming fix works"""
    
    index_file = Path('index.html')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
    
    # Read current content
    html_content = index_file.read_text(encoding='utf-8')
    
    # Remove debug CSS
    debug_patterns = [
        r'/\* 12\. DEBUG MODE.*?\}',  # Debug section
        r'\.location-map\.debug.*?\}',  # Debug class styles
        r'\.location-map\.debug::before.*?\}',  # Debug label
    ]
    
    for pattern in debug_patterns:
        html_content = re.sub(pattern, '', html_content, flags=re.DOTALL)
    
    # Write cleaned content
    index_file.write_text(html_content, encoding='utf-8')
    
    print("✅ DEBUG ELEMENTS REMOVED!")
    print("• Green debug border removed")
    print("• 'SMART FIX ACTIVE' label removed") 
    print("• Clean production-ready CSS")

if __name__ == "__main__":
    remove_debug_elements()
