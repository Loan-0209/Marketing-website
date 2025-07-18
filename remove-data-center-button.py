#!/usr/bin/env python3
"""
Remove "300MW Data Center" button from map overlay
"""

import re
from pathlib import Path

def remove_data_center_button():
    """Remove the 300MW Data Center button from map overlay"""
    
    index_file = Path('index.html')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
    
    print("🔍 SEARCHING FOR 300MW DATA CENTER BUTTON...")
    print("=" * 50)
    
    # Read current content
    html_content = index_file.read_text(encoding='utf-8')
    
    # Create backup
    backup_file = f'index.html.remove-button-backup-{int(__import__("time").time())}'
    Path(backup_file).write_text(html_content, encoding='utf-8')
    
    # Search for patterns related to 300MW Data Center button
    patterns_to_remove = [
        # HTML patterns
        r'<div[^>]*>.*?300MW Data Center.*?</div>',
        r'<button[^>]*>.*?300MW Data Center.*?</button>',
        r'<a[^>]*>.*?300MW Data Center.*?</a>',
        
        # More specific patterns
        r'<div[^>]*class="[^"]*data-center[^"]*"[^>]*>.*?</div>',
        r'<div[^>]*>.*?⚡.*?300MW Data Center.*?</div>',
        
        # Generic overlay patterns that might contain the button
        r'<div[^>]*class="[^"]*overlay[^"]*"[^>]*>.*?300MW.*?</div>',
        r'<div[^>]*class="[^"]*tooltip[^"]*"[^>]*>.*?300MW.*?</div>',
        
        # Look for the specific structure with lightning icon
        r'<div[^>]*>.*?<div[^>]*>.*?⚡.*?</div>.*?<div[^>]*>.*?300MW Data Center.*?</div>.*?</div>',
    ]
    
    # CSS patterns to hide the button
    css_patterns_to_add = [
        # Hide any element containing "300MW Data Center"
        r'[data-content*="300MW"], [title*="300MW"], [alt*="300MW"] { display: none !important; }',
        
        # Hide common overlay classes that might contain the button
        r'.data-center-overlay, .map-tooltip, .map-popup { display: none !important; }',
        
        # More specific hiding rules
        r'.location-map .overlay-button { display: none !important; }',
        r'.map-overlay .data-center { display: none !important; }',
    ]
    
    removed_count = 0
    
    # Try to remove HTML patterns
    for pattern in patterns_to_remove:
        matches = re.findall(pattern, html_content, re.IGNORECASE | re.DOTALL)
        if matches:
            print(f"🎯 Found pattern: {pattern[:50]}...")
            for match in matches:
                print(f"   Removing: {match[:100]}...")
            html_content = re.sub(pattern, '', html_content, flags=re.IGNORECASE | re.DOTALL)
            removed_count += len(matches)
    
    # If no HTML patterns found, add CSS to hide the element
    if removed_count == 0:
        print("📝 No HTML patterns found, adding CSS to hide button...")
        
        # Add CSS rules to hide the button
        css_hide_rules = """
/* 🚫 HIDE 300MW DATA CENTER BUTTON */
[data-content*="300MW"],
[title*="300MW"], 
[alt*="300MW"],
.data-center-overlay,
.map-tooltip,
.map-popup,
.location-map .overlay-button,
.map-overlay .data-center,
.map-overlay div:has-text("300MW") {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

/* Hide any div containing "300MW Data Center" text */
.map-overlay div {
    &:contains("300MW") {
        display: none !important;
    }
}

/* Alternative approach - hide by content */
.location-map *:contains("300MW Data Center") {
    display: none !important;
}

/* Hide the specific orange button if it has these styles */
.location-map div[style*="background"] div:contains("300MW") {
    display: none !important;
}
"""
        
        # Insert CSS before closing style tag
        if '</style>' in html_content:
            html_content = html_content.replace('</style>', f'\n{css_hide_rules}\n</style>')
            print("✅ Added CSS rules to hide button")
        else:
            print("⚠️ No </style> tag found, adding style section")
            head_end = html_content.find('</head>')
            if head_end != -1:
                style_section = f'<style>{css_hide_rules}</style>'
                html_content = html_content[:head_end] + style_section + html_content[head_end:]
    
    # Write updated content
    index_file.write_text(html_content, encoding='utf-8')
    
    print("\n✅ OPERATION COMPLETED!")
    print(f"📁 Backup created: {backup_file}")
    
    if removed_count > 0:
        print(f"🗑️ Removed {removed_count} HTML elements")
    else:
        print("🎨 Added CSS rules to hide button")
    
    print("\n🎯 EXPECTED RESULT:")
    print("• 300MW Data Center button should be hidden")
    print("• Map should remain fully functional")
    print("• Other map elements should be unaffected")
    
    return True

if __name__ == "__main__":
    remove_data_center_button()
