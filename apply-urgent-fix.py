#!/usr/bin/env python3
"""
Quick Map Layout Fix Application
Applies urgent CSS fixes to index.html
"""

import re
from pathlib import Path

def apply_urgent_fix():
    """Apply urgent map layout fixes to index.html"""
    
    index_file = Path('index.html')
    urgent_css_file = Path('urgent-map-fix.css')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
        
    if not urgent_css_file.exists():
        print("❌ urgent-map-fix.css not found!")
        return False
    
    # Read files
    html_content = index_file.read_text(encoding='utf-8')
    css_content = urgent_css_file.read_text(encoding='utf-8')
    
    # Find closing </style> tag
    style_close_pattern = r'</style>'
    
    if '</style>' in html_content:
        # Insert CSS before closing style tag
        updated_html = html_content.replace('</style>', f'\n/* URGENT MAP LAYOUT FIX */\n{css_content}\n</style>')
        
        # Create backup
        backup_file = f'index.html.backup-{int(time.time())}'
        index_file.rename(backup_file)
        
        # Write updated content
        index_file.write_text(updated_html, encoding='utf-8')
        
        print("✅ URGENT FIX APPLIED!")
        print(f"📁 Backup created: {backup_file}")
        print("🚀 Test your website now!")
        
        return True
    else:
        print("❌ Could not find </style> tag in index.html")
        return False

if __name__ == "__main__":
    import time
    apply_urgent_fix()
