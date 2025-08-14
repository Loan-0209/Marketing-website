#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import time

# Change to project directory
os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')

# Check if 3d-campus-with-navigation.html exists
if os.path.exists('3d-campus-with-navigation.html'):
    print("✅ 3d-campus-with-navigation.html found!")
else:
    print("❌ 3d-campus-with-navigation.html NOT found!")
    print("Available HTML files:")
    for file in os.listdir('.'):
        if file.endswith('.html'):
            print(f"  - {file}")

# Start server
PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

print(f"🚀 Starting server on port {PORT}...")
print(f"📁 Directory: {os.getcwd()}")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Server running at http://localhost:{PORT}")
        print(f"🏢 3D Campus: http://localhost:{PORT}/3d-campus-with-navigation.html")
        
        # Auto open browser
        time.sleep(1)
        try:
            webbrowser.open(f"http://localhost:{PORT}/3d-campus-with-navigation.html")
            print("🌐 Browser opened!")
        except:
            print("⚠️ Please open browser manually")
        
        print("\n⚡ Server running! Press Ctrl+C to stop")
        httpd.serve_forever()
        
except KeyboardInterrupt:
    print("\n👋 Server stopped")