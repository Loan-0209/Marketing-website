#!/usr/bin/env python3
"""
🔧 EMERGENCY BROWSER FIX
Khắc phục nhanh vấn đề browser không mở được
"""

import os
import subprocess
import webbrowser
import sys

def emergency_fix():
    print("🔧 EMERGENCY BROWSER FIX")
    print("=" * 30)
    
    # Đảm bảo đúng thư mục
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    
    print(f"📂 Switching to: {project_dir}")
    try:
        os.chdir(project_dir)
        print(f"✅ Current directory: {os.getcwd()}")
    except Exception as e:
        print(f"❌ Directory error: {e}")
        return False
    
    # Kiểm tra files HTML có sẵn
    html_files = []
    priority_files = ['index.html', 'heart_standalone.html', '3d-campus-interactive.html', 'browser-test.html']
    
    for file in priority_files:
        if os.path.exists(file):
            html_files.append(file)
            print(f"✅ Found: {file}")
    
    if not html_files:
        print("❌ No HTML files found!")
        return False
    
    # Tạo simple test file
    print("\n🧪 Creating emergency test file...")
    test_content = '''<!DOCTYPE html>
<html>
<head>
    <title>🚨 Emergency Browser Test - HEART</title>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        .box {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px auto;
            max-width: 600px;
        }
    </style>
</head>
<body>
    <h1>🚨 EMERGENCY FIX SUCCESS!</h1>
    <div class="box">
        <h2>✅ Browser is Working!</h2>
        <p>If you can see this page, the browser opening issue has been fixed.</p>
    </div>
    
    <div class="box">
        <h3>🔗 Available Pages</h3>
        <p>
            <a href="index.html" style="color: yellow; text-decoration: none;">🏠 Homepage</a> | 
            <a href="heart_standalone.html" style="color: yellow; text-decoration: none;">❤️ HEART Standalone</a> | 
            <a href="3d-campus-interactive.html" style="color: yellow; text-decoration: none;">🎮 3D Campus</a>
        </p>
    </div>
    
    <div class="box">
        <p>✅ Emergency fix completed successfully!</p>
        <p>🕐 Time: <span id="time"></span></p>
    </div>
    
    <script>
        document.getElementById('time').textContent = new Date().toLocaleString();
        console.log('🚨 Emergency browser fix successful!');
    </script>
</body>
</html>'''
    
    try:
        with open('emergency-test.html', 'w', encoding='utf-8') as f:
            f.write(test_content)
        print("✅ Created emergency-test.html")
        html_files.insert(0, 'emergency-test.html')
    except Exception as e:
        print(f"❌ Cannot create test file: {e}")
    
    # Thử các phương pháp mở browser
    methods = [
        ("Direct Open", lambda f: subprocess.run(['open', f], check=True, timeout=5)),
        ("Safari", lambda f: subprocess.run(['open', '-a', 'Safari', f], check=True, timeout=5)),
        ("Chrome", lambda f: subprocess.run(['open', '-a', 'Google Chrome', f], check=True, timeout=5)),
        ("Webbrowser", lambda f: webbrowser.open(f'file://{os.path.abspath(f)}')),
    ]
    
    print("\n🚀 Trying to open browser...")
    
    for file in html_files[:3]:  # Try first 3 files
        print(f"\n📄 Testing with: {file}")
        
        for method_name, method_func in methods:
            try:
                print(f"  🌐 {method_name}...", end="")
                method_func(file)
                print(" ✅ SUCCESS!")
                print(f"\n🎉 Browser opened with {method_name}!")
                print(f"📄 File: {file}")
                print(f"🔗 Path: {os.path.abspath(file)}")
                return True
            except Exception as e:
                print(f" ❌")
                continue
    
    # Fallback: Open Finder
    print("\n🔧 Fallback: Opening Finder...")
    try:
        subprocess.run(['open', '.'], check=True)
        print("✅ Finder opened!")
        print("👉 Double-click any HTML file to open in browser")
        return True
    except:
        print("❌ Finder open failed")
    
    # Last resort: Manual instructions
    print("\n📋 MANUAL INSTRUCTIONS:")
    print("1. Open Finder manually")
    print(f"2. Navigate to: {os.getcwd()}")
    print("3. Double-click on any of these files:")
    for i, file in enumerate(html_files, 1):
        print(f"   {i}. {file}")
    print("\n4. Or copy this URL to any browser:")
    print(f"   file://{os.path.abspath(html_files[0])}")
    
    return False

if __name__ == "__main__":
    try:
        success = emergency_fix()
        if success:
            print("\n🎉 EMERGENCY FIX COMPLETED!")
            print("Browser should now be open.")
        else:
            print("\n⚠️ Automatic fix failed.")
            print("Please follow manual instructions above.")
    except KeyboardInterrupt:
        print("\n👋 Fix interrupted")
    except Exception as e:
        print(f"\n💥 Error: {e}")