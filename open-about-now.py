#!/usr/bin/env python3
import webbrowser
import os

file_path = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/about.html"
url = f"file://{file_path}"

print(f"🚀 Opening HEART Technology Park - About Page")
print(f"📄 File: {file_path}")
print(f"🌐 URL: {url}")

try:
    webbrowser.open(url)
    print("✅ Browser opened successfully!")
except Exception as e:
    print(f"❌ Error opening browser: {e}")