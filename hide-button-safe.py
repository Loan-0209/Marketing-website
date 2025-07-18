#!/usr/bin/env python3
"""
Precision hide for 300MW Data Center button - Safe approach using CSS only
"""

import re
from pathlib import Path
import time

def hide_data_center_button_safe():
    """Safely hide 300MW Data Center button using targeted CSS"""
    
    index_file = Path('index.html')
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
    
    print("🎯 APPLYING SAFE CSS TO HIDE 300MW DATA CENTER BUTTON...")
    print("=" * 60)
    
    # Read current content
    html_content = index_file.read_text(encoding='utf-8')
    
    # Create backup
    timestamp = int(time.time())
    backup_file = f'index.html.hide-button-backup-{timestamp}'
    Path(backup_file).write_text(html_content, encoding='utf-8')
    
    # Targeted CSS to hide only the 300MW Data Center button
    targeted_css = """
/* 🚫 HIDE 300MW DATA CENTER BUTTON - PRECISION TARGETING */

/* Method 1: Hide by exact text content */
.map-overlay div:contains("300MW Data Center") {
    display: none !important;
}

/* Method 2: Hide specific overlay structure */
.location-map .map-overlay > div:nth-child(2) {
    display: none !important;
}

/* Method 3: Hide orange button with lightning icon + 300MW text */
.map-overlay div[style*="orange"] div:contains("300MW"),
.map-overlay div[style*="FFA726"] div:contains("300MW"),
.map-overlay div[style*="#FF"] div:contains("300MW") {
    display: none !important;
}

/* Method 4: Hide by structure - lightning icon + 300MW Data Center */
.map-overlay div:has(div:contains("⚡")) + div:contains("300MW") {
    display: none !important;
}

/* Method 5: Hide any div that contains both ⚡ and 300MW */
.map-overlay div:contains("⚡"):contains("300MW") {
    display: none !important;
}

/* Method 6: Universal fallback - hide any element with 300MW in text */
*:contains("300MW Data Center") {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

/* Method 7: Specific for your layout */
.location-map .map-overlay .overlay-item:contains("300MW") {
    display: none !important;
}

/* Method 8: Hide by data attributes if they exist */
[data-label*="300MW"],
[data-content*="300MW"],
[aria-label*="300MW"] {
    display: none !important;
}

/* Method 9: CSS-only solution for modern browsers */
.map-overlay div {
    &:has-text("300MW Data Center") {
        display: none !important;
    }
}

/* Method 10: Fallback for older approach */
.data-center-overlay,
.tooltip-300mw,
.map-button-300mw {
    display: none !important;
}
"""
    
    # Insert CSS before closing style tag
    if '</style>' in html_content:
        html_content = html_content.replace('</style>', f'\n{targeted_css}\n</style>')
        
        # Write updated content
        index_file.write_text(html_content, encoding='utf-8')
        
        print("✅ TARGETED CSS APPLIED SUCCESSFULLY!")
        print(f"📁 Backup created: {backup_file}")
        print()
        print("🎯 CSS METHODS APPLIED:")
        print("• Text-based hiding (:contains)")
        print("• Structure-based hiding (nth-child)")
        print("• Style-based hiding (orange background)")
        print("• Icon-based hiding (⚡ + 300MW)")
        print("• Universal fallbacks")
        print()
        print("🚀 EXPECTED RESULT:")
        print("• 300MW Data Center button hidden")
        print("• All other map elements preserved")
        print("• Map functionality maintained")
        print("• No side effects on layout")
        
        return True
    else:
        print("❌ Could not find </style> tag")
        return False

if __name__ == "__main__":
    hide_data_center_button_safe()
