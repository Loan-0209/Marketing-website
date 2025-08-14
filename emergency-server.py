#!/usr/bin/env python3
"""
EMERGENCY SERVER - Giải pháp cuối cùng
"""

import os
import sys
import socket
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser
import subprocess

def kill_all():
    """Dừng tất cả server"""
    print("🔥 Dừng tất cả process...")
    try:
        subprocess.run("pkill -f python", shell=True, stderr=subprocess.DEVNULL)
        for port in range(8000, 9000):
            subprocess.run(f"lsof -ti:{port} | xargs kill -9", shell=True, stderr=subprocess.DEVNULL)
    except:
        pass
    time.sleep(3)
    print("✅ Đã dọn dẹp")

def find_port():
    """Tìm port trống"""
    for port in [8080, 8888, 9999, 8000, 8001]:
        try:
            with socket.socket() as s:
                s.bind(('', port))
                return port
        except:
            continue
    return 8080

def create_test():
    """Tạo trang test"""
    html = """<!DOCTYPE html>
<html><head><title>🚨 EMERGENCY ACTIVE</title>
<style>
body{font-family:Arial;background:linear-gradient(45deg,#ff6b6b,#4ecdc4);color:white;text-align:center;padding:50px;margin:0;}
.container{background:rgba(255,255,255,0.1);padding:40px;border-radius:20px;max-width:600px;margin:0 auto;}
h1{font-size:3em;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.7;}}
.status{background:#27ae60;padding:20px;border-radius:10px;margin:20px 0;font-size:1.2em;}
a{display:inline-block;background:rgba(255,255,255,0.2);color:white;padding:15px 30px;margin:10px;text-decoration:none;border-radius:25px;}
</style></head>
<body>
<div class="container">
<h1>🚨 EMERGENCY SERVER</h1>
<div class="status">✅ LOCALHOST ĐANG HOẠT ĐỘNG!</div>
<p><strong>Server đã khởi động thành công!</strong></p>
<div>
<a href="index.html">🏠 Home</a>
<a href="project-dashboard.html">📊 Dashboard</a>
<a href="archive-3d/ai-campus-3d-structure.html">🏛️ 3D Campus</a>
</div>
</div>
</body></html>"""
    
    with open("EMERGENCY_ACTIVE.html", "w") as f:
        f.write(html)
    print("✅ Tạo trang test")

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"✅ {format % args}")

def main():
    print("🚨 EMERGENCY LOCALHOST FIX")
    print("=" * 40)
    
    # Change directory
    os.chdir("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")
    print(f"📁 Thư mục: {os.getcwd()}")
    
    # Kill all processes
    kill_all()
    
    # Create test page
    create_test()
    
    # Find port
    port = find_port()
    print(f"🔍 Sử dụng port: {port}")
    
    # Start server
    try:
        print("🚀 Khởi động emergency server...")
        server = HTTPServer(('localhost', port), Handler)
        
        # Start in thread
        def run_server():
            server.serve_forever()
        
        thread = threading.Thread(target=run_server)
        thread.daemon = True
        thread.start()
        
        time.sleep(2)
        
        # Test connection
        try:
            with socket.socket() as s:
                s.connect(('localhost', port))
            print("✅ SERVER HOẠT ĐỘNG!")
        except:
            print("❌ Không thể kết nối")
            return
        
        # Open browser
        url = f"http://localhost:{port}/EMERGENCY_ACTIVE.html"
        print(f"🌐 Mở: {url}")
        
        try:
            webbrowser.open(url)
            print("✅ Browser đã mở!")
        except:
            print(f"Mở thủ công: {url}")
        
        print(f"\n🎯 URLS:")
        print(f"🚨 Emergency: {url}")
        print(f"🏠 Home: http://localhost:{port}/index.html")
        print(f"📊 Dashboard: http://localhost:{port}/project-dashboard.html")
        
        print(f"\n📌 NẾU VẪN KHÔNG TRUY CẬP ĐƯỢC:")
        print(f"1. Thử: http://127.0.0.1:{port}/EMERGENCY_ACTIVE.html")
        print(f"2. Tắt firewall tạm thời")
        print(f"3. Thử browser khác")
        print(f"4. Khởi động lại máy")
        
        print("\n🛑 Nhấn Enter để dừng...")
        input()
        server.shutdown()
        print("✅ Đã dừng server")
        
    except Exception as e:
        print(f"❌ Lỗi: {e}")

if __name__ == "__main__":
    main()