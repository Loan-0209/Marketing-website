#!/usr/bin/env python3
"""
🔧 FIX LOCALHOST REFUSED CONNECTION
Sửa lỗi "localhost đã từ chối kết nối"
"""

import os
import sys
import subprocess
import time
import socket
import signal
import webbrowser
from pathlib import Path

def kill_all_servers():
    """Dừng TẤT CẢ các process có thể chiếm port"""
    print("🔄 Stopping all existing servers...")
    
    commands = [
        "lsof -ti:8000 | xargs kill -9",
        "lsof -ti:8080 | xargs kill -9", 
        "lsof -ti:3000 | xargs kill -9",
        "lsof -ti:5000 | xargs kill -9",
        "pkill -f 'python.*http.server'",
        "pkill -f 'python3.*http.server'",
        "pkill -f 'SimpleHTTPServer'",
        "killall Python",
        "killall python3"
    ]
    
    for cmd in commands:
        try:
            subprocess.run(cmd, shell=True, stderr=subprocess.DEVNULL)
        except:
            pass
    
    time.sleep(2)
    print("✅ All servers stopped")

def check_port(port):
    """Kiểm tra port có đang được sử dụng không"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    return result == 0

def find_available_port():
    """Tìm port khả dụng"""
    ports = [8000, 8080, 8888, 9000, 9999, 3000, 5000]
    
    for port in ports:
        if not check_port(port):
            return port
    
    # Nếu không tìm thấy, thử random
    for port in range(10000, 20000):
        if not check_port(port):
            return port
    
    return None

def start_simple_server(port):
    """Khởi động server đơn giản nhất"""
    print(f"\n🌐 Starting HTTP server on port {port}...")
    
    # Tạo file test nếu chưa có
    test_file = "localhost-test.html"
    if not os.path.exists(test_file):
        with open(test_file, 'w') as f:
            f.write("""<!DOCTYPE html>
<html>
<head>
    <title>Localhost Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 40px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        .status { 
            font-size: 2em; 
            color: #4ade80;
            margin: 20px 0;
        }
        a {
            display: inline-block;
            margin: 10px;
            padding: 15px 30px;
            background: white;
            color: #764ba2;
            text-decoration: none;
            border-radius: 30px;
            font-weight: bold;
            transition: all 0.3s;
        }
        a:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 Localhost Fixed!</h1>
        <div class="status">✅ Server is running</div>
        <p>Port: """ + str(port) + """</p>
        <div>
            <a href="index.html">🏠 Homepage</a>
            <a href="3d-campus-with-navigation.html">🏛️ 3D Campus</a>
            <a href="facilities.html">🏢 Facilities</a>
        </div>
    </div>
</body>
</html>""")
    
    # Khởi động server
    cmd = [sys.executable, "-m", "http.server", str(port)]
    
    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=os.getcwd()
        )
        
        # Đợi server khởi động
        time.sleep(3)
        
        # Kiểm tra server đã chạy chưa
        if process.poll() is None and check_port(port):
            return process
        else:
            return None
            
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return None

def main():
    print("🔧 FIX LOCALHOST REFUSED CONNECTION")
    print("=" * 50)
    
    # Chuyển đến thư mục project
    project_dir = Path("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")
    try:
        os.chdir(project_dir)
        print(f"✅ Directory: {os.getcwd()}")
    except:
        print("❌ Cannot access project directory!")
        return
    
    # Bước 1: Dừng tất cả servers
    kill_all_servers()
    
    # Bước 2: Tìm port khả dụng
    port = find_available_port()
    if not port:
        print("❌ No available ports found!")
        return
    
    print(f"✅ Found available port: {port}")
    
    # Bước 3: Khởi động server
    server = start_simple_server(port)
    
    if server:
        print("\n✅ SERVER STARTED SUCCESSFULLY!")
        print("=" * 50)
        
        # URLs
        base_url = f"http://localhost:{port}"
        urls = {
            "Test Page": f"{base_url}/localhost-test.html",
            "Homepage": f"{base_url}/index.html",
            "3D Campus": f"{base_url}/3d-campus-with-navigation.html",
            "Facilities": f"{base_url}/facilities.html"
        }
        
        print("\n📋 WORKING URLs:")
        for name, url in urls.items():
            print(f"  {name}: {url}")
        
        # Copy URL to clipboard (macOS)
        try:
            subprocess.run(f"echo '{base_url}' | pbcopy", shell=True)
            print(f"\n📋 URL copied to clipboard: {base_url}")
        except:
            pass
        
        # Mở browser
        print("\n🌐 Opening browser...")
        try:
            # Thử mở test page trước
            webbrowser.open(f"{base_url}/localhost-test.html")
            time.sleep(2)
            # Sau đó mở homepage
            webbrowser.open(base_url)
            print("✅ Browser opened!")
        except:
            print("⚠️  Please open browser manually")
        
        print("\n🎯 INSTRUCTIONS:")
        print("1. Browser should open automatically")
        print("2. If not, copy this URL to browser:")
        print(f"   {base_url}")
        print("3. Press Ctrl+C to stop server")
        
        # Giữ server chạy
        try:
            print("\n⚡ Server is running...")
            server.wait()
        except KeyboardInterrupt:
            print("\n👋 Stopping server...")
            server.terminate()
            
    else:
        print("\n❌ FAILED TO START SERVER")
        print("\n🔧 MANUAL FIX:")
        print("1. Open Terminal")
        print("2. Run these commands:")
        print("   cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")
        print("   python3 -m http.server 8000")
        print("3. Open browser and go to: http://localhost:8000")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        import traceback
        traceback.print_exc()