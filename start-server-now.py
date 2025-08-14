#!/usr/bin/env python3
import os
import http.server
import socketserver
import threading
import time
import webbrowser

# Change to the correct directory
project_dir = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'
os.chdir(project_dir)

PORT = 8000

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        print(f"[{time.strftime('%H:%M:%S')}] {format % args}")

def start_server():
    try:
        print(f"🚀 Starting HTTP Server on port {PORT}...")
        print(f"📁 Serving directory: {os.getcwd()}")
        
        with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
            httpd.allow_reuse_address = True
            print(f"✅ Server running at http://localhost:{PORT}")
            print("\n📋 Available pages:")
            print(f"   → http://localhost:{PORT}/index.html")
            print(f"   → http://localhost:{PORT}/3d-campus-smart-city-complete.html")
            print(f"   → http://localhost:{PORT}/open-direct.html")
            print("\n🛑 Press Ctrl+C to stop server")
            
            # Auto-open browser after 2 seconds
            def open_browser():
                time.sleep(2)
                try:
                    webbrowser.open(f'http://localhost:{PORT}/3d-campus-smart-city-complete.html')
                    print("\n🌐 Opened browser automatically")
                except:
                    print("\n⚠️ Could not auto-open browser")
            
            threading.Thread(target=open_browser, daemon=True).start()
            
            # Start serving
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use!")
            print("🔧 Trying to kill existing process...")
            os.system(f"lsof -ti:{PORT} | xargs kill -9 2>/dev/null")
            time.sleep(1)
            print("🔄 Retrying...")
            start_server()
        else:
            print(f"❌ Server error: {e}")
    except KeyboardInterrupt:
        print("\n⏹️ Server stopped by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    start_server()