#!/usr/bin/env python3
"""
🎯 3D Campus Link Fix Verification
Verify that the ERR_FILE_NOT_FOUND issue has been resolved
"""

import os
import webbrowser
from pathlib import Path

def verify_fix():
    print("🎯 3D Campus Link Fix Verification")
    print("=" * 40)
    
    # Set working directory
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    os.chdir(project_dir)
    print(f"📁 Working directory: {os.getcwd()}")
    print()
    
    # Check if main files exist
    print("🔍 File Existence Check:")
    
    index_file = Path("index.html")
    if index_file.exists():
        print("✅ index.html exists")
    else:
        print("❌ index.html missing")
        return False
    
    campus_3d_file = Path("archive-3d/ai-campus-3d-structure.html")
    if campus_3d_file.exists():
        print("✅ archive-3d/ai-campus-3d-structure.html exists")
    else:
        print("❌ archive-3d/ai-campus-3d-structure.html missing")
        return False
    
    print()
    
    # Check navigation link in index.html
    print("🔍 Navigation Link Check:")
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            content = f.read()
            
        if 'href="archive-3d/ai-campus-3d-structure.html"' in content:
            print("✅ Navigation link correctly points to archive-3d/ai-campus-3d-structure.html")
        else:
            print("❌ Navigation link not found or incorrect")
            return False
            
    except Exception as e:
        print(f"❌ Error reading index.html: {e}")
        return False
    
    print()
    
    # Check standalone files too
    print("🔍 Standalone Files Check:")
    
    standalone_files = ["standalone.html", "heart_standalone.html"]
    for file_name in standalone_files:
        if Path(file_name).exists():
            try:
                with open(file_name, "r", encoding="utf-8") as f:
                    content = f.read()
                if 'archive-3d/ai-campus-3d-structure.html' in content:
                    print(f"✅ {file_name} has correct 3D Campus link")
                else:
                    print(f"⚠️ {file_name} may have old 3D Campus link")
            except:
                print(f"⚠️ Could not read {file_name}")
        else:
            print(f"⚠️ {file_name} not found")
    
    print()
    print("🌐 Opening main website for testing...")
    
    # Open the website
    try:
        file_url = f"file://{os.path.abspath('index.html')}"
        webbrowser.open(file_url)
        print(f"✅ Website opened: {file_url}")
    except Exception as e:
        print(f"❌ Error opening website: {e}")
    
    print()
    print("✅ VERIFICATION COMPLETE!")
    print()
    print("📝 TESTING INSTRUCTIONS:")
    print("1. The website should now be open in your browser")
    print("2. Click on '3D Campus' in the navigation menu")
    print("3. The 3D Campus page should load successfully")
    print("4. You should see a 3D visualization instead of ERR_FILE_NOT_FOUND")
    print()
    print("🎉 The ERR_FILE_NOT_FOUND issue has been fixed!")
    print("   Navigation now correctly points to: archive-3d/ai-campus-3d-structure.html")
    
    return True

if __name__ == "__main__":
    try:
        verify_fix()
    except Exception as e:
        print(f"💥 Verification failed: {e}")
        import traceback
        traceback.print_exc()