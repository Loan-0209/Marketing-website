#!/usr/bin/env python3
"""
Apply Scroll Fix to resolve sticky positioning issues
"""

import re
from pathlib import Path
import time

def apply_scroll_fix():
    """Apply scroll fix CSS to index.html"""
    
    index_file = Path('index.html')
    scroll_fix_file = Path('fix-scroll-issue.css')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
        
    if not scroll_fix_file.exists():
        print("❌ fix-scroll-issue.css not found!")
        return False
    
    # Read files
    html_content = index_file.read_text(encoding='utf-8')
    css_content = scroll_fix_file.read_text(encoding='utf-8')
    
    # Find closing </style> tag and insert before it
    if '</style>' in html_content:
        # Insert CSS before closing style tag
        updated_html = html_content.replace('</style>', f'\n/* 🚀 SCROLL ISSUE FIX */\n{css_content}\n</style>')
        
        # Create backup with timestamp
        timestamp = int(time.time())
        backup_file = f'index.html.scroll-fix-backup-{timestamp}'
        
        # Backup current version
        index_file.rename(backup_file)
        
        # Write updated content
        index_file.write_text(updated_html, encoding='utf-8')
        
        print("✅ SCROLL FIX APPLIED!")
        print(f"📁 Backup created: {backup_file}")
        print("\n🎯 FIXES APPLIED:")
        print("• ❌ Disabled sticky positioning")
        print("• ✅ Set position: static")  
        print("• ✅ Height: auto with aspect-ratio")
        print("• ✅ Max-height: 600px")
        print("• ✅ Responsive breakpoints")
        
        print("\n🚀 EXPECTED RESULTS:")
        print("• ✅ No more header cropping when scroll")
        print("• ✅ No more bottom whitespace") 
        print("• ✅ Smooth scroll behavior")
        print("• ✅ Proper responsive sizing")
        
        return True
    else:
        print("❌ Could not find </style> tag in index.html")
        return False

if __name__ == "__main__":
    apply_scroll_fix()
