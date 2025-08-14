#!/usr/bin/env python3
"""
🌐 MỞ BROWSER - HEART WEBSITE
Mở cả HEART standalone và 3D Campus interactive
"""

import os
import webbrowser
import time

def mo_browser_heart():
    print("🌐 MỞ BROWSER - HEART WEBSITE")
    print("=" * 40)
    
    # Chuyển đến thư mục dự án
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    os.chdir(project_dir)
    
    print(f"📁 Working directory: {os.getcwd()}")
    print()
    
    # Files cần mở
    files_to_open = [
        ("heart_standalone.html", "HEART Standalone Website"),
        ("3d-campus-interactive.html", "3D Campus Interactive")
    ]
    
    opened_files = []
    
    for filename, description in files_to_open:
        print(f"🔍 Checking {filename}...")
        
        if os.path.exists(filename):
            print(f"✅ {filename} - Found")
            
            # Tạo file URL
            file_path = os.path.abspath(filename)
            file_url = f"file://{file_path}"
            
            try:
                # Mở trong browser
                webbrowser.open(file_url)
                opened_files.append((description, file_url))
                print(f"🚀 Opened: {description}")
                
                # Đợi một chút giữa các lần mở
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ Error opening {filename}: {e}")
        else:
            print(f"❌ {filename} - Not found")
    
    print()
    print("🎉 BROWSER OPENING COMPLETE!")
    print(f"📈 Successfully opened {len(opened_files)} websites:")
    
    for i, (desc, url) in enumerate(opened_files, 1):
        print(f"   {i}. {desc}")
    
    if len(opened_files) > 0:
        print()
        print("🎯 TESTING INSTRUCTIONS:")
        print("1. ✅ HEART Standalone - Main website với navigation")
        print("2. 🎮 3D Campus Interactive - Test các tính năng:")
        print("   • Phase 1, 2, 3 buttons (development phases)")
        print("   • View controls (Overview, Aerial, Ground)")
        print("   • Click buildings để explore")
        print("   • Watch stats panel (FPS, Objects, Triangles)")
        print("   • Animated particles background")
        
        print()
        print("🔗 NAVIGATION TEST:")
        print("   • From HEART website → Click '3D Campus'")
        print("   • Should open interactive 3D page")
        print("   • From 3D Campus → Click 'Back to HEART'")
        
        print()
        print("🎊 Both websites ready for testing!")
    
    return len(opened_files) > 0

if __name__ == "__main__":
    try:
        success = mo_browser_heart()
        if success:
            print("\n✅ All websites opened successfully!")
        else:
            print("\n❌ Failed to open websites")
    except Exception as e:
        print(f"\n💥 Error: {e}")
        import traceback
        traceback.print_exc()