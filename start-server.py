#!/usr/bin/env python3
"""
Simple HTTP Server for 3D Campus Testing
Run this to serve files locally and avoid CORS issues
"""

import http.server
import socketserver
import os
import sys

# Set port
PORT = 8000

# Change to script directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Enhanced logging
        print(f"🌐 {self.address_string()} - {format % args}")

print("🚀 Starting 3D Campus HTTP Server...")
print(f"📁 Serving files from: {os.getcwd()}")
print(f"🌐 Server URL: http://localhost:{PORT}")
print(f"🎯 Test URL: http://localhost:{PORT}/archive-3d/ai-campus-3d-structure.html")
print("\n📊 Available 3D files:")

# List available 3D files
for root, dirs, files in os.walk("."):
    for file in files:
        if file.endswith(('.gltf', '.glb', '.fbx', '.obj')):
            print(f"  📄 {os.path.join(root, file)}")

print("\n🔧 Press Ctrl+C to stop server")
print("=" * 60)

try:
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n\n🛑 Server stopped by user")
    sys.exit(0)
except Exception as e:
    print(f"\n❌ Server error: {e}")
    sys.exit(1)