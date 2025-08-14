#!/usr/bin/env python3
"""
ULTIMATE FIX - Giải pháp cuối cùng cho lỗi localhost
"""

import os
import sys
import subprocess
import time
import socket
import webbrowser

def kill_servers():
    """Dừng tất cả server"""
    print("🔧 Dừng tất cả server cũ...")
    try:
        subprocess.run("pkill -f 'python.*http.server'", shell=True, stderr=subprocess.DEVNULL)
        for port in [8080, 8888, 9999]:
            subprocess.run(f"lsof -ti:{port} | xargs kill -9", shell=True, stderr=subprocess.DEVNULL)
    except:
        pass
    time.sleep(2)
    print("✅ Đã dọn dẹp")

def check_port(port):
    """Kiểm tra port có sẵn không"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result != 0

def create_test_page():
    """Tạo trang test"""
    html = """<!DOCTYPE html>
<html>
<head><title>🎉 LOCALHOST WORKS!</title>
<style>
body{font-family:Arial;text-align:center;padding:50px;background:#f0f0f0;}
.success{background:#d4edda;color:#155724;padding:20px;border-radius:10px;margin:20px;}
a{display:inline-block;margin:10px;padding:10px 20px;background:#007bff;color:white;text-decoration:none;border-radius:5px;}
</style></head>
<body>
<h1>🎉 LOCALHOST ĐANG HOẠT ĐỘNG!</h1>
<div class="success">✅ Server đã khởi động thành công!</div>
<div>
<a href="index.html">🏠 Trang chủ</a>
<a href="project-dashboard.html">📊 Dashboard</a>
<a href="archive-3d/ai-campus-3d-structure.html">🏛️ 3D Campus</a>
</div>
<p>Server is working! ✅</p>
</body></html>"""
    
    with open("TEST_SUCCESS.html", "w") as f:
        f.write(html)
    print("✅ Tạo trang test thành công")

def main():
    print("🚀 ULTIMATE LOCALHOST FIX")
    print("=" * 40)
    
    # Chuyển đến thư mục project
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    os.chdir(project_dir)
    print(f"📁 Thư mục: {os.getcwd()}")
    
    # Dừng server cũ
    kill_servers()
    
    # Tạo trang test
    create_test_page()
    
    # Tìm port khả dụng
    port = 8080
    if not check_port(port):
        port = 8888
        if not check_port(port):
            port = 9999
    
    print(f"🔍 Sử dụng port: {port}")
    
    # Khởi động server
    print("🌐 Khởi động server...")
    process = subprocess.Popen([
        sys.executable, "-m", "http.server", str(port)
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    # Đợi khởi động
    time.sleep(3)
    
    # Kiểm tra server
    if process.poll() is None and not check_port(port):
        print("✅ SERVER ĐANG CHẠY!")
        
        # Mở browser
        url = f"http://localhost:{port}/TEST_SUCCESS.html"
        print(f"🌐 Mở: {url}")
        
        try:
            webbrowser.open(url)
            print("✅ Browser đã mở!")
        except:
            print(f"Mở thủ công: {url}")
        
        print(f"\n📌 LINKS:")
        print(f"🧪 Test: http://localhost:{port}/TEST_SUCCESS.html")
        print(f"🏠 Home: http://localhost:{port}/index.html")
        print(f"📊 Dashboard: http://localhost:{port}/project-dashboard.html")
        
        print("\n🛑 Nhấn Enter để dừng...")
        input()
        process.terminate()
        print("✅ Đã dừng server")
    else:
        print("❌ Không thể khởi động server!")
        print("Thử chạy thủ công:")
        print(f"cd {project_dir}")
        print(f"python3 -m http.server {port}")

if __name__ == "__main__":
    main()