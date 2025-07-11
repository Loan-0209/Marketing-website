#!/usr/bin/env python3
import webbrowser
import os
import time

# Navigate to project directory
project_dir = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'

print("🌐 Mở HEART Technology Park trong web browser...")
print(f"📁 Directory: {project_dir}")

# File paths to open
files_to_open = [
    'QUICK_TEST.html',
    'about.html', 
    'test-nuclear-final.html'
]

print("🚀 Mở các trang web...")

for i, file in enumerate(files_to_open, 1):
    file_path = os.path.join(project_dir, file)
    if os.path.exists(file_path):
        file_url = f'file://{file_path}'
        webbrowser.open(file_url)
        print(f"✅ Tab {i}: {file} - {file_url}")
        time.sleep(1)  # Delay between tabs
    else:
        print(f"❌ File not found: {file}")

print("\n🎯 Nuclear Gradient Removal Test:")
print("   💥 About page - Auto-activates after 1 second")
print("   🧪 Quick test page - Interactive buttons")
print("   🔧 Test page - Full nuclear mode testing")

print("\n🔧 Browser Console Commands:")
print("   window.nuclearGradientRemoval() - Apply nuclear mode")
print("   window.toggleNuclearMode() - Toggle mode")
print("   window.debugBuilding() - Debug info")

print("\n🎨 Expected Results:")
print("   ✅ Pure white background (no gradients)")
print("   ✅ Enhanced HEART building with blue glow")
print("   ✅ Building 8% larger with enhanced contrast")

print("\n✅ Browser tabs opened successfully!")
print("💥 Nuclear gradient removal ready for testing!")