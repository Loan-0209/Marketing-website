#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser

os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')

PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

print("🚀 HEART Smart City 3D Server Starting...")
print("=" * 50)
print(f"📁 Directory: {os.getcwd()}")

# Check if files exist
files_to_check = [
    'heart-smart-city-3d-restored.html',
    '3d-smart-city.html',
    'index.html'
]

print("\n📄 Available files:")
for file in files_to_check:
    if os.path.exists(file):
        size = os.path.getsize(file)
        print(f"  ✅ {file} ({size:,} bytes)")
    else:
        print(f"  ❌ {file} - NOT FOUND")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n🌐 Server running at http://localhost:{PORT}/")
        print("\n🎯 Access URLs:")
        print(f"  • HEART Smart City 3D: http://localhost:{PORT}/heart-smart-city-3d-restored.html")
        print(f"  • Original 3D City:    http://localhost:{PORT}/3d-smart-city.html")
        print(f"  • Homepage:            http://localhost:{PORT}/")
        print("\n💡 Press Ctrl+C to stop server")
        print("=" * 50)
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 Server stopped")
except Exception as e:
    print(f"❌ Error: {e}")