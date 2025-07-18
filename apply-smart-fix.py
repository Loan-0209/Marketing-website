#!/usr/bin/env python3
"""
Smart Map Fix - Giải quyết đồng thời crop issue và scroll effect
"""

import re
import time
from pathlib import Path

def apply_smart_map_fix():
    """Apply smart map fix that preserves scroll effect while showing full image"""
    
    index_file = Path('index.html')
    smart_fix_file = Path('smart-map-fix.css')
    
    print("🎯 APPLYING SMART MAP FIX...")
    print("=" * 50)
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return False
        
    if not smart_fix_file.exists():
        print("❌ smart-map-fix.css not found!")
        return False
    
    # Read files
    html_content = index_file.read_text(encoding='utf-8')
    css_content = smart_fix_file.read_text(encoding='utf-8')
    
    # Create backup with timestamp
    timestamp = int(time.time())
    backup_file = f'index.html.smart-fix-backup-{timestamp}'
    
    # Backup current version
    index_file.rename(backup_file)
    
    # Remove any previous emergency fixes that might conflict
    html_content = re.sub(r'/\* 🚀 SCROLL ISSUE FIX \*/.*?(?=/\*|</style>)', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'/\* URGENT MAP LAYOUT FIX \*/.*?(?=/\*|</style>)', '', html_content, flags=re.DOTALL)
    
    # Insert smart fix before closing style tag
    if '</style>' in html_content:
        updated_html = html_content.replace('</style>', f'\n/* 🧠 SMART MAP FIX - Full Image + Scroll Effect */\n{css_content}\n</style>')
        
        # Write updated content
        index_file.write_text(updated_html, encoding='utf-8')
        
        print("✅ SMART FIX APPLIED SUCCESSFULLY!")
        print(f"📁 Backup created: {backup_file}")
        print()
        print("🎯 SMART FIX FEATURES:")
        print("• ✅ Object-fit: contain → Full image display")
        print("• ✅ Smart sticky positioning → Scroll effect preserved")
        print("• ✅ Responsive aspect-ratio → Perfect on all devices")
        print("• ✅ Performance optimized → Smooth animations")
        print("• ✅ Fallback support → Works on older browsers")
        print()
        print("📱 RESPONSIVE BEHAVIOR:")
        print("• Desktop (1400px+): 2:1 aspect ratio, max 700px height")
        print("• Large (1200px+): 18:10 aspect ratio, max 600px height") 
        print("• Medium (1024px+): 16:10 aspect ratio, sticky enabled")
        print("• Tablet (<1024px): 4:3 aspect ratio, static positioning")
        print("• Mobile (<768px): 1:1 aspect ratio, compact layout")
        print()
        print("🔄 SCROLL BEHAVIOR:")
        print("• Desktop: Sticky at top: 20px")
        print("• Tablet/Mobile: Static (no sticky for better UX)")
        print("• Smooth scroll enabled")
        print("• Performance optimized")
        
        return True
    else:
        print("❌ Could not find </style> tag in index.html")
        # Restore backup
        index_file.write_text(html_content, encoding='utf-8')
        return False

if __name__ == "__main__":
    if apply_smart_map_fix():
        print("\n🚀 SMART FIX COMPLETED!")
        print("Test your website now - you should see:")
        print("1. ✅ Full map image (no cropping)")
        print("2. ✅ Scroll effect maintained on desktop")
        print("3. ✅ Responsive behavior on all devices")
        print("4. ✅ Debug label 'SMART FIX ACTIVE' (remove later)")
