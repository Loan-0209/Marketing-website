#!/usr/bin/env python3
import os
import webbrowser

# Change to correct directory
os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')

print("🚀 HEART Technology Park - Simple Server")
print("📁 Directory:", os.getcwd())

# Check key files
files_to_check = ['about.html', 'index.html', 'test-nuclear-final.html']
for file in files_to_check:
    if os.path.exists(file):
        print(f"✅ {file} found")
    else:
        print(f"❌ {file} missing")

print("\n🌐 Starting Python HTTP server...")
print("📍 Server will run on: http://localhost:8000")
print("💥 About page URL: http://localhost:8000/about.html")
print("🧪 Test page URL: http://localhost:8000/test-nuclear-final.html")

# Open browser
webbrowser.open('http://localhost:8000/about.html')
print("✅ Browser opened to About page")

# Start server
import http.server
import socketserver

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🎯 Server running at http://localhost:{PORT}/")
    print("🔧 Press Ctrl+C to stop")
    httpd.serve_forever()