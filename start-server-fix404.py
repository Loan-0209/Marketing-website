#!/usr/bin/env python3
"""
🔧 FIX ERROR 404 - Web Server
Khởi động server để fix lỗi 404 khi mở browser
"""

import os
import sys
import subprocess
import webbrowser
import time
import socket
from pathlib import Path
import http.server
import socketserver

def find_free_port(start_port=8000):
    """Tìm port trống"""
    for port in range(start_port, start_port + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('', port))
                return port
            except:
                continue
    return None

def kill_existing_servers():
    """Dừng các server đang chạy"""
    print("🔄 Stopping existing servers...")
    try:
        # Kill Python HTTP servers
        subprocess.run("pkill -f 'python.*http.server'", shell=True, stderr=subprocess.DEVNULL)
        subprocess.run("pkill -f 'python3.*http.server'", shell=True, stderr=subprocess.DEVNULL)
        time.sleep(1)
    except:
        pass

def main():
    print("🔧 FIX ERROR 404 - Starting Web Server")
    print("=" * 50)
    
    # Chuyển đến thư mục project
    project_dir = Path("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")
    
    try:
        os.chdir(project_dir)
        print(f"✅ Working directory: {os.getcwd()}")
    except Exception as e:
        print(f"❌ Cannot access directory: {e}")
        return False
    
    # Kiểm tra files quan trọng
    important_files = ['index.html', '3d-campus-with-navigation.html', 'facilities.html']
    print("\n📁 Checking important files:")
    for file in important_files:
        if os.path.exists(file):
            print(f"  ✅ {file} - Found")
        else:
            print(f"  ❌ {file} - Not found")
    
    # Dừng server cũ
    kill_existing_servers()
    
    # Tìm port trống
    port = find_free_port()
    if not port:
        print("❌ Cannot find free port!")
        return False
    
    print(f"\n✅ Found free port: {port}")
    
    # URLs
    base_url = f"http://localhost:{port}"
    urls = {
        "Homepage": base_url,
        "3D Smart City": f"{base_url}/3d-campus-with-navigation.html",
        "Facilities": f"{base_url}/facilities.html",
        "About": f"{base_url}/about.html"
    }
    
    print("\n📋 Server URLs:")
    print("-" * 50)
    for name, url in urls.items():
        print(f"{name}: {url}")
    
    # Khởi động server
    print(f"\n🌐 Starting HTTP server on port {port}...")
    
    # Create custom handler to fix 404
    class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            # Log request
            print(f"📥 Request: {self.path}")
            
            # Handle root path
            if self.path == '/':
                self.path = '/index.html'
            
            # Check if file exists
            file_path = self.path.lstrip('/')
            if not os.path.exists(file_path) and not file_path.endswith('.html'):
                # Try adding .html extension
                html_path = file_path + '.html'
                if os.path.exists(html_path):
                    self.path = '/' + html_path
            
            # Call parent handler
            return super().do_GET()
        
        def end_headers(self):
            # Add CORS headers to prevent issues
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            super().end_headers()
    
    # Start server in thread
    Handler = CustomHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            print(f"✅ Server started successfully!")
            print(f"\n🎯 Main URL: {base_url}")
            print("\n⚡ Server is running! Press Ctrl+C to stop")
            
            # Open browser after short delay
            time.sleep(1)
            print("\n🌐 Opening browser...")
            
            try:
                # Try different browsers
                browsers = ['safari', 'chrome', 'firefox']
                opened = False
                
                for browser in browsers:
                    try:
                        controller = webbrowser.get(browser)
                        controller.open(base_url)
                        print(f"✅ Opened with {browser}")
                        opened = True
                        break
                    except:
                        continue
                
                if not opened:
                    # Fallback to default browser
                    webbrowser.open(base_url)
                    print("✅ Opened with default browser")
                    
            except Exception as e:
                print(f"⚠️ Cannot open browser automatically: {e}")
                print(f"👉 Please open manually: {base_url}")
            
            # Keep server running
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")
        
        # Alternative method
        print("\n🔄 Trying alternative server method...")
        server_cmd = [sys.executable, "-m", "http.server", str(port)]
        try:
            print(f"Running: {' '.join(server_cmd)}")
            subprocess.run(server_cmd)
        except KeyboardInterrupt:
            print("\n👋 Server stopped")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        print("\n📋 Manual instructions:")
        print("1. Open Terminal")
        print("2. Run: cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")
        print("3. Run: python3 -m http.server 8000")
        print("4. Open browser: http://localhost:8000")