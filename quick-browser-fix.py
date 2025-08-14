#!/usr/bin/env python3
"""
🚀 QUICK BROWSER FIX - Simple solution
Giải pháp nhanh cho browser không mở được
"""

import os
import subprocess
import webbrowser
import time

def quick_browser_fix():
    print("🚀 QUICK BROWSER FIX")
    print("=" * 25)
    
    # Chuyển đến thư mục đúng
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    try:
        os.chdir(project_dir)
        print(f"✅ Directory: {os.getcwd()}")
    except:
        print(f"❌ Cannot access: {project_dir}")
        return
    
    # Tạo file test đơn giản
    print("🧪 Creating test file...")
    test_html = """<!DOCTYPE html>
<html>
<head><title>Browser Test</title></head>
<body style="font-family:Arial; background:#4f46e5; color:white; text-align:center; padding:50px;">
    <h1>🎉 BROWSER WORKS!</h1>
    <h2>✅ Connection Successful</h2>
    <p>Browser opening fixed! HEART website is ready.</p>
    <div style="margin:20px;">
        <a href="index.html" style="color:yellow;">🏠 Homepage</a> |
        <a href="heart_standalone.html" style="color:yellow;">❤️ Standalone</a> |
        <a href="3d-campus-interactive.html" style="color:yellow;">🎮 3D Campus</a>
    </div>
    <script>console.log('✅ Browser test successful!');</script>
</body>
</html>"""
    
    with open('test.html', 'w') as f:
        f.write(test_html)
    print("✅ test.html created")
    
    # Method 1: Direct open
    print("\n🌐 Method 1: Direct open...")
    try:
        subprocess.run(['open', 'test.html'], check=True, timeout=3)
        print("✅ SUCCESS! Browser should open now.")
        return True
    except:
        print("❌ Method 1 failed")
    
    # Method 2: Python webbrowser
    print("🌐 Method 2: Python webbrowser...")
    try:
        file_url = f"file://{os.path.abspath('test.html')}"
        webbrowser.open(file_url)
        print("✅ SUCCESS! Browser should open now.")
        return True
    except:
        print("❌ Method 2 failed")
    
    # Method 3: Specific browser
    print("🌐 Method 3: Safari...")
    try:
        subprocess.run(['open', '-a', 'Safari', 'test.html'], check=True, timeout=3)
        print("✅ SUCCESS! Safari should open now.")
        return True
    except:
        print("❌ Method 3 failed")
    
    # Method 4: Finder
    print("🌐 Method 4: Open Finder...")
    try:
        subprocess.run(['open', '.'], check=True, timeout=3)
        print("✅ Finder opened! Double-click test.html")
        return True
    except:
        print("❌ All methods failed")
    
    # Manual instructions
    print("\n📋 MANUAL INSTRUCTIONS:")
    print("1. Open Finder")
    print(f"2. Go to: {os.getcwd()}")
    print("3. Double-click: test.html")
    print(f"4. Or copy to browser: file://{os.path.abspath('test.html')}")
    
    return False

if __name__ == "__main__":
    quick_browser_fix()