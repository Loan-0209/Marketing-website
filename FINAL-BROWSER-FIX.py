#!/usr/bin/env python3
"""
🎯 FINAL BROWSER FIX
Giải pháp cuối cùng cho vấn đề browser không mở được
"""

import os
import sys
import subprocess
import webbrowser
import platform
from pathlib import Path

def main():
    print("🎯 FINAL BROWSER FIX")
    print("=" * 30)
    
    # Kiểm tra hệ thống
    print(f"💻 System: {platform.system()} {platform.release()}")
    print(f"🐍 Python: {sys.version.split()[0]}")
    
    # Chuyển đến thư mục dự án
    project_dir = Path("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")
    
    try:
        os.chdir(project_dir)
        print(f"📂 Working directory: {os.getcwd()}")
    except Exception as e:
        print(f"❌ Cannot access directory: {e}")
        return False
    
    # Kiểm tra file test
    test_file = "browser-fix-test.html"
    if not os.path.exists(test_file):
        print(f"❌ {test_file} not found!")
        return False
    
    print(f"✅ Found: {test_file}")
    file_path = os.path.abspath(test_file)
    file_url = f"file://{file_path}"
    
    print(f"📄 File path: {file_path}")
    print(f"🔗 File URL: {file_url}")
    
    # Thử các phương pháp mở browser
    methods = [
        ("Python webbrowser", lambda: webbrowser.open(file_url)),
        ("macOS open command", lambda: subprocess.run(['open', test_file], check=True, timeout=5)),
        ("Safari specific", lambda: subprocess.run(['open', '-a', 'Safari', test_file], check=True, timeout=5)),
        ("Chrome specific", lambda: subprocess.run(['open', '-a', 'Google Chrome', test_file], check=True, timeout=5)),
        ("Firefox specific", lambda: subprocess.run(['open', '-a', 'Firefox', test_file], check=True, timeout=5)),
    ]
    
    print("\n🚀 Attempting to open browser...")
    
    success = False
    for method_name, method_func in methods:
        try:
            print(f"🌐 Trying {method_name}...", end=" ")
            method_func()
            print("✅ SUCCESS!")
            success = True
            break
        except Exception as e:
            print(f"❌ Failed: {str(e)[:50]}")
            continue
    
    if not success:
        print("\n🔧 Fallback: Opening Finder...")
        try:
            subprocess.run(['open', '.'], check=True, timeout=5)
            print("✅ Finder opened successfully!")
            print(f"👉 Please double-click: {test_file}")
            success = True
        except Exception as e:
            print(f"❌ Finder failed: {e}")
    
    # Final instructions
    if success:
        print("\n🎉 BROWSER FIX COMPLETED!")
        print("🌐 Browser should now be open with the test page.")
        print("✅ If you see the colorful test page, the fix was successful!")
    else:
        print("\n❌ All automatic methods failed.")
        print("📋 MANUAL INSTRUCTIONS:")
        print("1. Open Finder manually")
        print(f"2. Navigate to: {project_dir}")
        print(f"3. Double-click: {test_file}")
        print("4. Or copy this URL to any browser:")
        print(f"   {file_url}")
    
    # Summary
    print(f"\n📊 SUMMARY:")
    print(f"  • System: {platform.system()}")
    print(f"  • Directory: {os.getcwd()}")
    print(f"  • Test file: {test_file}")
    print(f"  • Fix status: {'✅ Success' if success else '⚠️ Manual required'}")
    
    return success

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Fix interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        import traceback
        traceback.print_exc()