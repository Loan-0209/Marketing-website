#!/usr/bin/env python3
"""
Test Master Plan 3D Integration
Khởi động server và test Professional Architecture version
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import os
import sys

PORT = 8080
TEST_URL = f"http://localhost:{PORT}/archive-3d/ai-campus-3d-structure.html"

class TestHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Enhanced logging for 3D content
        message = format % args
        if any(ext in message for ext in ['.js', '.gltf', '.glb']):
            print(f"🎮 3D Asset: {message}")
        elif 'master-plan' in message.lower():
            print(f"🏗️  Master Plan: {message}")
        else:
            print(f"🌐 {message}")

def start_server():
    print("🚀 Starting Master Plan 3D Test Server...")
    print(f"📁 Serving from: {os.getcwd()}")
    print(f"🌐 Server URL: http://localhost:{PORT}")
    print(f"🎯 Test URL: {TEST_URL}")
    
    # Check if required files exist
    required_files = [
        "archive-3d/ai-campus-3d-structure.html",
        "js/master-plan-3d.js"
    ]
    
    print("\n📋 File Check:")
    all_files_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path) / 1024
            print(f"  ✅ {file_path} ({size:.1f} KB)")
        else:
            print(f"  ❌ {file_path} - NOT FOUND")
            all_files_exist = False
    
    if not all_files_exist:
        print("\n⚠️  Some required files are missing!")
        print("Please ensure all files are in the correct location.")
    
    print(f"\n🎯 Testing Instructions:")
    print(f"1. Open: {TEST_URL}")
    print(f"2. Check Console (F12) for initialization messages")
    print(f"3. Look for: '🚀 Initializing Master Plan 3D Professional Architecture...'")
    print(f"4. Verify professional 3D campus loads with timeline controls")
    print(f"5. Test Phase 1/2/3 buttons and camera views")
    print(f"6. Check FPS indicator in top-right")
    
    print(f"\n🔧 Troubleshooting:")
    print(f"- If 'MasterPlan3D class not found': Check js/master-plan-3d.js path")
    print(f"- If loading stuck: Check Console for WebGL errors")
    print(f"- If no buildings: Check phase buttons functionality")
    
    print("\n" + "="*60)
    print("🎮 READY TO TEST - Press Ctrl+C to stop server")
    print("="*60)
    
    try:
        with socketserver.TCPServer(("", PORT), TestHTTPRequestHandler) as httpd:
            # Auto-open browser after 2 seconds
            def open_browser():
                time.sleep(2)
                print(f"\n🌐 Opening browser: {TEST_URL}")
                try:
                    webbrowser.open(TEST_URL)
                except Exception as e:
                    print(f"⚠️  Could not auto-open browser: {e}")
                    print(f"Please manually open: {TEST_URL}")
            
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Server error: {e}")
        sys.exit(1)

def main():
    # Change to project directory
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    
    if os.path.exists(project_dir):
        os.chdir(project_dir)
        print(f"📁 Changed to project directory: {project_dir}")
    else:
        print(f"❌ Project directory not found: {project_dir}")
        print("Please run this script from the correct location")
        sys.exit(1)
    
    start_server()

if __name__ == "__main__":
    main()