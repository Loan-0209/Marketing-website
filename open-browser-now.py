#!/usr/bin/env python3
import webbrowser
import os

# File URL
url = "file:///Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/archive-3d/ai-campus-3d-structure.html"

print("🌐 Opening Master Plan 3D in browser...")
print("📁 File: ai-campus-3d-structure.html")
print("=" * 50)

# Open in default browser
webbrowser.open(url)

print("✅ Browser opened!")
print("")
print("🔍 CHECK IN BROWSER:")
print("1. Open Console (F12)")
print("2. Look for: 'MasterPlan3D class not found' error")
print("3. If error exists, use HTTP server instead")
print("")
print("🚀 For HTTP server, run:")
print("   python3 quick-open.py")