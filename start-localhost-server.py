#!/usr/bin/env python3
"""
🌐 START LOCALHOST SERVER - HEART WEBSITE
Khởi động server để truy cập bằng URL http://localhost
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import os
import socket

def find_free_port():
    """Tìm port trống"""
    ports_to_try = [8000, 8080, 8888, 9000, 9999]
    
    for port in ports_to_try:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            if result != 0:  # Port is free
                return port
        except:
            continue
    
    return 8000  # Default fallback

def start_localhost_server():
    print("🌐 STARTING LOCALHOST SERVER - HEART WEBSITE")
    print("=" * 50)
    
    # Chuyển đến thư mục website
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    os.chdir(project_dir)
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Tìm port trống
    port = find_free_port()
    print(f"🔍 Using port: {port}")
    
    # Kiểm tra files chính
    main_files = ["index.html", "heart_standalone.html", "3d-campus-interactive.html"]
    existing_files = []
    
    print("\n🔍 Checking main website files:")
    for file in main_files:
        if os.path.exists(file):
            print(f"✅ {file} - Ready")
            existing_files.append(file)
        else:
            print(f"❌ {file} - Missing")
    
    if not existing_files:
        print("❌ No website files found!")
        return False
    
    # Tạo custom handler
    class HeartWebHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            print(f"📄 {self.address_string()} - {format % args}")
        
        def do_GET(self):
            # Redirect root to main page
            if self.path == '/':
                if os.path.exists('index.html'):
                    self.path = '/index.html'
                elif os.path.exists('heart_standalone.html'):
                    self.path = '/heart_standalone.html'
            
            return super().do_GET()
    
    # Khởi động server
    try:
        print(f"\n🚀 Starting HTTP server on port {port}...")
        httpd = socketserver.TCPServer(("", port), HeartWebHandler)
        
        # URLs available
        base_url = f"http://localhost:{port}"
        print(f"\n🌐 HEART WEBSITE URLS:")
        print(f"   🏠 Main Website: {base_url}/")
        
        if "index.html" in existing_files:
            print(f"   📱 Homepage: {base_url}/index.html")
        
        if "heart_standalone.html" in existing_files:
            print(f"   ❤️  Standalone: {base_url}/heart_standalone.html")
        
        if "3d-campus-interactive.html" in existing_files:
            print(f"   🎮 3D Campus: {base_url}/3d-campus-interactive.html")
        
        print(f"\n📋 Additional pages:")
        other_pages = ["about.html", "facilities.html", "master-plan.html", "contact.html"]
        for page in other_pages:
            if os.path.exists(page):
                print(f"   📄 {page}: {base_url}/{page}")
        
        # Mở browser sau 2 giây
        def open_browser():
            time.sleep(2)
            main_url = f"{base_url}/"
            print(f"\n🌐 Opening browser: {main_url}")
            try:
                webbrowser.open(main_url)
                print("✅ Browser opened successfully!")
            except Exception as e:
                print(f"❌ Could not open browser: {e}")
                print(f"📋 Manual access: Copy this URL to your browser: {main_url}")
        
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        print(f"\n🎉 SERVER RUNNING!")
        print(f"🔗 Access your website at: {base_url}")
        print(f"⏹️  Press Ctrl+C to stop server")
        print("=" * 50)
        
        # Chạy server
        httpd.serve_forever()
        
    except KeyboardInterrupt:
        print(f"\n⏹️  Server stopped by user")
        httpd.shutdown()
        return True
        
    except Exception as e:
        print(f"❌ Server error: {e}")
        return False

if __name__ == "__main__":
    try:
        start_localhost_server()
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
    except Exception as e:
        print(f"\n💥 Error: {e}")
        import traceback
        traceback.print_exc()