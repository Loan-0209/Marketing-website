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
URL = f"http://localhost:{PORT}/3d-campus-smart-city-complete.html"

print("🚀 3D SMART CITY CAMPUS - COMPLETE VERSION")
print("=" * 50)
print(f"🌐 Server: http://localhost:{PORT}")
print(f"🎯 Testing: {URL}")
print("=" * 50)

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Only log important requests
        if any(x in format % args for x in ['master-plan', '.js', 'structure.html']):
            print(f"📁 {format % args}")

def start_server():
    with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
        httpd.serve_forever()

# Start server in background
server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()

# Wait for server to start
time.sleep(1)

print("🌐 Opening browser...")
try:
    webbrowser.open(URL)
    print("✅ Browser opened successfully")
except Exception as e:
    print(f"⚠️  Could not open browser: {e}")
    print(f"Please manually open: {URL}")

print(f"""
🔍 WHAT TO CHECK:
1. Loading screen: "Loading Professional AI Campus Architecture..."
2. Console (F12): "🚀 Initializing Master Plan 3D..."  
3. Timeline buttons: Phase 1, 2, 3
4. Camera views: Overview, Aerial, Ground
5. FPS counter (top-right)
6. Professional 3D buildings

🎯 IF ISSUES:
- Check Console for error messages
- Verify js/master-plan-3d.js loads properly
- Ensure WebGL is supported

🎮 READY TO TEST!
Press Ctrl+C to stop server
""")

try:
    # Keep running
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\n🛑 Server stopped")