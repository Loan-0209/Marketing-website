#!/usr/bin/env python3
"""
Quick Localhost Server for HEART Website
Double-click this file to start the server
"""

import http.server
import socketserver
import webbrowser
import os
import threading
import time

# Change to website directory
os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')

PORT = 8000

def open_browser():
    """Open browser after server starts"""
    time.sleep(3)
    webbrowser.open(f'http://localhost:{PORT}')

# Start browser opening in background
browser_thread = threading.Thread(target=open_browser)
browser_thread.daemon = True
browser_thread.start()

# Start server
Handler = http.server.SimpleHTTPRequestHandler

print("🚀 HEART Website Localhost Server Starting...")
print(f"📍 URL: http://localhost:{PORT}")
print("🌐 Available pages:")
print(f"   • Main: http://localhost:{PORT}/")
print(f"   • Index: http://localhost:{PORT}/index.html")
print(f"   • Standalone: http://localhost:{PORT}/heart_standalone.html")
print(f"   • 3D Campus: http://localhost:{PORT}/3d-campus-interactive.html")
print("✅ Browser will open automatically...")
print("Press Ctrl+C to stop server")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 Server stopped")
except OSError:
    print(f"❌ Port {PORT} in use, trying 8001...")
    PORT = 8001
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        webbrowser.open(f'http://localhost:{PORT}')
        httpd.serve_forever()