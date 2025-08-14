#!/usr/bin/env python3
"""
🌐 HEART Website Server - Smart Port Detection
Automatically finds available port and launches website
"""

import http.server
import socketserver
import webbrowser
import os
import socket
import time
from threading import Timer
import sys

# Change to project directory
PROJECT_DIR = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
os.chdir(PROJECT_DIR)

def find_free_port():
    """Find an available port, avoiding common conflicts"""
    # Try preferred ports first
    preferred_ports = [8080, 9000, 7777, 8888, 5555, 3333, 4444, 8081, 8082, 8083]
    
    for port in preferred_ports:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    
    # If all preferred ports are taken, get a random free port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

def kill_existing_servers():
    """Kill any existing Python servers"""
    try:
        os.system("pkill -f 'python.*http.server' 2>/dev/null")
        os.system("pkill -f 'python.*SimpleHTTPServer' 2>/dev/null")
        time.sleep(1)
    except:
        pass

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with better error handling and caching disabled"""
    
    def end_headers(self):
        # Disable caching
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Only log important requests
        if any(x in format % args for x in ['.html', '/', '3d-campus', 'smart-city']):
            print(f"✅ {format % args}")

def open_browser_delayed(url, delay=1.5):
    """Open browser after a short delay"""
    def open_browser():
        print(f"\n🌐 Opening browser: {url}")
        webbrowser.open(url)
    
    Timer(delay, open_browser).start()

def main():
    print("🚀 HEART Website Server - Starting...")
    print("=" * 60)
    
    # Kill any existing servers
    kill_existing_servers()
    
    # Find available port
    PORT = find_free_port()
    
    print(f"📁 Project Directory: {PROJECT_DIR}")
    print(f"🔍 Found available port: {PORT}")
    
    try:
        # Create server with reuse address enabled
        with socketserver.TCPServer(("", PORT), CustomHTTPHandler) as httpd:
            httpd.allow_reuse_address = True
            
            # Server URLs
            base_url = f"http://localhost:{PORT}"
            index_url = f"{base_url}/index.html"
            smart_city_url = f"{base_url}/3d-campus-smart-city.html"
            
            print(f"\n✅ Server started successfully!")
            print("=" * 60)
            print(f"🏠 Homepage: {index_url}")
            print(f"🏙️ 3D Smart City: {smart_city_url}")
            print("=" * 60)
            print("\n📌 Available pages:")
            print("  • index.html - Main website")
            print("  • 3d-campus-smart-city.html - 3D Smart City Demo")
            print("  • about.html - About page")
            print("  • facilities.html - Facilities page")
            print("  • master-plan.html - Master Plan page")
            print("\n🛑 Press Ctrl+C to stop the server")
            print("=" * 60)
            
            # Open browser automatically
            open_browser_delayed(index_url)
            
            # Start serving
            httpd.serve_forever()
            
    except OSError as e:
        print(f"\n❌ Error starting server: {e}")
        print("\n🔄 Trying alternative solution...")
        
        # Fallback: Try Python's built-in server module
        try:
            os.system(f"python3 -m http.server {PORT + 1}")
        except:
            print("\n📂 Opening files directly in browser...")
            # Final fallback: Open files directly
            file_path = os.path.join(PROJECT_DIR, "index.html")
            webbrowser.open(f"file://{file_path}")
            
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
        sys.exit(0)

if __name__ == "__main__":
    main()