#!/usr/bin/env python3
import webbrowser
import http.server
import socketserver
import threading
import time
import os

# Change to project directory
os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/')

PORT = 8080
URL = f"http://localhost:{PORT}/archive-3d/ai-campus-3d-structure.html"

print("🚀 MASTER PLAN 3D INTEGRATION TEST")
print("=" * 40)
print(f"🎯 URL: {URL}")
print("=" * 40)

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        if 'master-plan-3d.js' in format % args:
            print(f"📄 Master Plan JS loaded: {format % args}")
        elif 'ai-campus-3d-structure.html' in format % args:
            print(f"🏗️  Structure HTML loaded: {format % args}")

def start_server():
    with socketserver.TCPServer(("", PORT), SimpleHandler) as httpd:
        httpd.serve_forever()

# Start server in background
server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()
time.sleep(1)

print("✅ Server started")
print("🌐 Opening browser...")

try:
    webbrowser.open(URL)
    print("✅ Browser opened successfully")
except Exception as e:
    print(f"⚠️  Browser error: {e}")

print(f"""
🔍 CHECK IN BROWSER:
✅ Console (F12) should show: "🚀 Initializing Master Plan 3D..."
✅ Timeline controls: Phase 1, 2, 3
✅ View buttons: Overview, Aerial, Ground  
✅ FPS counter in top-right
✅ Professional 3D campus with buildings

❌ If "MasterPlan3D class not found" error:
   - Check Network tab for failed js/master-plan-3d.js load
   - Verify file path is correct

Server running on: {URL}
Press Ctrl+C to stop...
""")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\n🛑 Server stopped")