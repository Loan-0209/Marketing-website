#!/usr/bin/env python3
"""
Start Project Server with Dashboard
Opens complete project browser interface
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import os
import sys

# Configuration
PORT = 8888
PROJECT_DIR = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

def start_server():
    """Start HTTP server for project"""
    os.chdir(PROJECT_DIR)
    
    class ProjectHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            # Custom logging
            message = format % args
            if any(x in message for x in ['.html', '.js', 'dashboard']):
                print(f"📄 {message}")
        
        def end_headers(self):
            # Add CORS headers
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-cache')
            super().end_headers()
    
    print(f"🚀 STARTING PROJECT SERVER")
    print("=" * 50)
    print(f"📁 Project Directory: {PROJECT_DIR}")
    print(f"🌐 Server Port: {PORT}")
    print("=" * 50)
    
    # Start server
    with socketserver.TCPServer(("", PORT), ProjectHandler) as httpd:
        print(f"✅ Server started successfully!")
        print(f"🌍 Project URLs:")
        print(f"   📊 Dashboard: http://localhost:{PORT}/project-dashboard.html")
        print(f"   🏛️ Master Plan 3D: http://localhost:{PORT}/archive-3d/ai-campus-3d-structure.html")
        print(f"   🏠 Homepage: http://localhost:{PORT}/index.html")
        print(f"   📁 File Browser: http://localhost:{PORT}/")
        print()
        print("🛑 Press Ctrl+C to stop server")
        print("=" * 50)
        
        # Open browser after delay
        def open_browser():
            time.sleep(2)
            url = f"http://localhost:{PORT}/project-dashboard.html"
            print(f"🔄 Opening project dashboard...")
            try:
                webbrowser.open(url)
                print("✅ Browser opened successfully")
            except Exception as e:
                print(f"⚠️  Could not open browser: {e}")
                print(f"Please manually open: {url}")
        
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")
            sys.exit(0)

if __name__ == "__main__":
    start_server()