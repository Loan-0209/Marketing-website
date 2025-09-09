#!/usr/bin/env python3
"""Extract JavaScript from HTML file for syntax checking"""

import re

def extract_javascript(html_file, js_file):
    print("🔧 EXTRACTING JAVASCRIPT FOR SYNTAX CHECKING")
    print("=" * 50)
    
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all script tags and extract JavaScript
        script_pattern = r'<script[^>]*>(.*?)</script>'
        scripts = re.findall(script_pattern, content, re.DOTALL)
        
        print(f"📊 Found {len(scripts)} script blocks")
        
        # Combine all JavaScript
        all_js = ""
        for i, script in enumerate(scripts):
            all_js += f"\n// === SCRIPT BLOCK {i+1} ===\n"
            all_js += script.strip()
            all_js += f"\n// === END SCRIPT BLOCK {i+1} ===\n"
        
        # Write to JavaScript file
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(all_js)
        
        print(f"✅ JavaScript extracted to: {js_file}")
        print(f"   Total lines: {all_js.count(chr(10))}")
        print(f"   Total characters: {len(all_js)}")
        
        return js_file
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    html_file = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/3d-smart-city.html"
    js_file = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/extracted-js.js"
    extract_javascript(html_file, js_file)