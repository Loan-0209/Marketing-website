#!/usr/bin/env python3
"""
Quick Website Launcher for Testing Map Fix
"""

import webbrowser
import time
import subprocess
import os
from pathlib import Path

def launch_website():
    """Launch website to test map layout fix"""
    
    project_root = Path.cwd()
    index_file = project_root / 'index.html'
    
    if not index_file.exists():
        print("❌ index.html not found!")
        return
    
    print("🚀 LAUNCHING WEBSITE TO TEST MAP FIX...")
    print("=" * 50)
    
    # Try different methods to open the website
    try:
        # Method 1: Direct file URL
        file_url = f"file://{index_file.absolute()}"
        print(f"📂 Opening: {file_url}")
        
        # Open in default browser
        webbrowser.open(file_url)
        
        print("✅ Website opened in browser!")
        print("\n🎯 WHAT TO CHECK:")
        print("1. ✅ Map shows FULL image (not cropped)")
        print("2. ✅ Less white space above/below")
        print("3. ✅ Map takes more space in layout")
        print("4. ✅ Responsive behavior on mobile")
        
        print("\n🔄 COMPARE:")
        print("• BEFORE: object-fit: cover (cropped)")
        print("• AFTER: object-fit: contain (full image)")
        print("• BEFORE: padding: 100px (too much space)")
        print("• AFTER: padding: 50px (optimized)")
        
        print("\n💡 IF STILL NOT PERFECT:")
        print("• Try different aspect-ratios: 16/10, 4/3, 21/9")
        print("• Adjust max-height if needed")
        print("• Consider fullwidth option")
        
        return True
        
    except Exception as e:
        print(f"❌ Error opening website: {e}")
        print("\n🔧 MANUAL STEPS:")
        print("1. Open your browser")
        print(f"2. Navigate to: {file_url}")
        print("3. Check the map layout")
        
        return False

if __name__ == "__main__":
    launch_website()
