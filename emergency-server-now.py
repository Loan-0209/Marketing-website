#!/usr/bin/env python3
"""
🚨 EMERGENCY SERVER - Fix 404 Error
Khởi động server ngay lập tức để fix lỗi localhost
"""

import http.server
import socketserver
import os
import webbrowser
import time
import sys

def main():
    print("🚨 EMERGENCY SERVER STARTING...")
    print("=" * 50)
    
    # Change to project directory
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    
    try:
        os.chdir(project_dir)
        print(f"✅ Working directory: {os.getcwd()}")
    except Exception as e:
        print(f"❌ Cannot access directory: {e}")
        return
    
    # Check important files
    important_files = ['index.html', '3d-campus-with-navigation.html']
    print("\n📁 Checking files:")
    for file in important_files:
        if os.path.exists(file):
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} - Missing!")
    
    # Find free port
    port = 8000
    print(f"\n🌐 Starting server on port {port}...")
    
    # Custom handler for better 404 handling
    class CustomHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            print(f"📥 Request: {self.path}")
            
            # Route handling
            if self.path == '/':
                self.path = '/index.html'
            elif self.path == '/3d-campus' or self.path == '/3d-campus/':
                self.path = '/3d-campus-with-navigation.html'
            
            # Check if file exists
            file_path = self.path.lstrip('/')
            if not os.path.exists(file_path):
                print(f"⚠️ File not found: {file_path}")
                # Try alternatives
                alternatives = [
                    '3d-campus-with-navigation.html',
                    '3d-campus-fixed.html', 
                    '3d-campus-smart-city.html',
                    'index.html'
                ]
                
                for alt in alternatives:
                    if os.path.exists(alt):
                        print(f"🔄 Redirecting to: {alt}")
                        self.path = '/' + alt
                        break
            
            return super().do_GET()
        
        def end_headers(self):
            # Add CORS headers
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            super().end_headers()
    
    # Start server
    try:
        with socketserver.TCPServer(("", port), CustomHandler) as httpd:
            print(f"✅ Server started on http://localhost:{port}")
            print("\n📋 Available URLs:")
            print(f"  🏠 Homepage: http://localhost:{port}")
            print(f"  🏢 3D Campus: http://localhost:{port}/3d-campus-with-navigation.html")
            print(f"  🏢 3D Campus (short): http://localhost:{port}/3d-campus")
            print(f"  🏭 Facilities: http://localhost:{port}/facilities.html")
            
            print("\n🌐 Opening browser...")
            time.sleep(1)
            
            # Open browser
            try:
                webbrowser.open(f"http://localhost:{port}")
                print("✅ Browser opened successfully!")
            except Exception as e:
                print(f"⚠️ Cannot open browser: {e}")
                print(f"👉 Please open manually: http://localhost:{port}")
            
            print(f"\n⚡ Server running! Press Ctrl+C to stop")
            print("=" * 50)
            
            # Keep server running
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        print("\n📋 Manual fix:")
        print("1. Open Terminal")
        print(f"2. Run: cd {project_dir}")
        print("3. Run: python3 -m http.server 8000")
        print("4. Open: http://localhost:8000")

if __name__ == "__main__":
    main()