#!/usr/bin/env python3
import os
import subprocess
import webbrowser

print("🔧 DIRECT BROWSER FIX")
print("=" * 25)

# Go to project directory
project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
os.chdir(project_dir)
print(f"📂 Directory: {os.getcwd()}")

# Create simple test file
print("\n🧪 Creating test file...")
html = '''<!DOCTYPE html>
<html><head><title>Browser Test</title></head>
<body style="background:#4f46e5;color:white;text-align:center;padding:50px;font-family:Arial;">
<h1>🎉 BROWSER WORKING!</h1>
<h2>✅ Fix Successful</h2>
<p>HEART website is ready!</p>
<a href="index.html" style="color:yellow;">🏠 Homepage</a> | 
<a href="heart_standalone.html" style="color:yellow;">❤️ HEART</a>
</body></html>'''

with open('fix-test.html', 'w') as f:
    f.write(html)
print("✅ Created fix-test.html")

# Try opening methods
print("\n🚀 Opening browser...")

# Method 1: Python webbrowser
try:
    webbrowser.open(f"file://{os.path.abspath('fix-test.html')}")
    print("✅ Python webbrowser - SUCCESS!")
except:
    print("❌ Python webbrowser failed")

# Method 2: macOS open command  
try:
    subprocess.run(['open', 'fix-test.html'], check=True, timeout=3)
    print("✅ macOS open - SUCCESS!")
except:
    print("❌ macOS open failed")

# Method 3: Safari
try:
    subprocess.run(['open', '-a', 'Safari', 'fix-test.html'], check=True, timeout=3)
    print("✅ Safari - SUCCESS!")
except:
    print("❌ Safari failed")

# Method 4: Open Finder
try:
    subprocess.run(['open', '.'], check=True, timeout=3)
    print("✅ Finder opened - double-click fix-test.html")
except:
    print("❌ Finder failed")

print(f"\n📋 Manual: Copy to browser:")
print(f"file://{os.path.abspath('fix-test.html')}")