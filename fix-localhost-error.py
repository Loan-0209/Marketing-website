#!/usr/bin/env python3
"""
Fix localhost connection refused error
Sửa lỗi localhost từ chối kết nối
"""

import os
import sys
import subprocess
import time
import socket
import http.server
import socketserver
import webbrowser
import signal

def kill_all_servers():
    """Dừng tất cả các server đang chạy"""
    print("🔧 Dừng tất cả server cũ...")
    
    # Kill Python HTTP servers
    try:
        subprocess.run("pkill -f 'python.*http.server'", shell=True, stderr=subprocess.DEVNULL)
        subprocess.run("pkill -f 'python.*fix-'", shell=True, stderr=subprocess.DEVNULL)
        subprocess.run("pkill -f 'python.*start-'", shell=True, stderr=subprocess.DEVNULL)
    except:
        pass
    
    # Kill processes on common ports
    ports = [8080, 8888, 9999, 3000, 5000, 5500, 8000]
    for port in ports:
        try:
            # macOS/Linux
            subprocess.run(f"lsof -ti:{port} | xargs kill -9", shell=True, stderr=subprocess.DEVNULL)
            # Alternative method
            subprocess.run(f"fuser -k {port}/tcp", shell=True, stderr=subprocess.DEVNULL)
        except:
            pass
    
    time.sleep(2)
    print("✅ Đã dọn dẹp tất cả server cũ")

def check_port_available(port):
    """Kiểm tra port có sẵn không"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result != 0

def find_available_port():
    """Tìm port khả dụng"""
    ports = [8080, 8888, 9999, 3000, 5000, 8000, 5500]
    for port in ports:
        if check_port_available(port):
            return port
    # If all common ports are taken, find a random one
    sock = socket.socket()
    sock.bind(('', 0))
    port = sock.getsockname()[1]
    sock.close()
    return port

def start_simple_server(port, directory):
    """Khởi động server HTTP đơn giản"""
    os.chdir(directory)
    
    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            # Only log important messages
            message = format % args
            if "GET / " in message or "GET /index" in message:
                print(f"✅ Truy cập: {message}")
            elif "404" in message:
                print(f"⚠️ Không tìm thấy: {message}")
    
    try:
        with socketserver.TCPServer(("", port), QuietHandler) as httpd:
            print(f"✅ Server đang chạy tại: http://localhost:{port}/")
            print("🛑 Nhấn Ctrl+C để dừng server")
            httpd.serve_forever()
    except Exception as e:
        print(f"❌ Lỗi server: {e}")

def main():
    print("🚀 SỬA LỖI LOCALHOST TỪ CHỐI KẾT NỐI")
    print("=" * 50)
    
    # 1. Dừng tất cả server cũ
    kill_all_servers()
    
    # 2. Chuyển đến thư mục project
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    if not os.path.exists(project_dir):
        print(f"❌ Không tìm thấy thư mục: {project_dir}")
        return
    
    os.chdir(project_dir)
    print(f"📁 Thư mục làm việc: {os.getcwd()}")
    
    # 3. Tìm port khả dụng
    port = find_available_port()
    print(f"🔍 Sử dụng port: {port}")
    
    # 4. Kiểm tra file index
    index_files = ["index.html", "project-dashboard.html", "quick-index.html"]
    homepage = None
    
    for file in index_files:
        if os.path.exists(file):
            homepage = file
            print(f"✅ Tìm thấy trang chủ: {file}")
            break
    
    if not homepage:
        print("⚠️ Không tìm thấy file index, tạo trang tạm...")
        create_emergency_index()
        homepage = "emergency-index.html"
    
    # 5. Khởi động server với subprocess
    print(f"\n🌐 Khởi động web server...")
    
    # Start server in subprocess
    server_cmd = [sys.executable, "-m", "http.server", str(port)]
    server_process = subprocess.Popen(
        server_cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        cwd=project_dir
    )
    
    # Wait for server to start
    time.sleep(3)
    
    # 6. Kiểm tra server đã khởi động
    if not check_port_available(port):
        print("✅ Server đã khởi động thành công!")
        
        # 7. Mở browser
        url = f"http://localhost:{port}/{homepage}"
        print(f"\n🌐 Mở website: {url}")
        
        # Try multiple methods to open browser
        try:
            # Method 1: webbrowser module
            webbrowser.open(url)
        except:
            try:
                # Method 2: subprocess
                if sys.platform == "darwin":
                    subprocess.run(["open", url])
                elif sys.platform == "win32":
                    subprocess.run(["start", url], shell=True)
                else:
                    subprocess.run(["xdg-open", url])
            except:
                print(f"⚠️ Không thể tự động mở browser")
                print(f"👉 Vui lòng mở thủ công: {url}")
        
        print("\n✅ WEBSITE ĐÃ SẴN SÀNG!")
        print(f"🌐 Trang chủ: http://localhost:{port}/")
        print(f"🏛️ 3D Campus: http://localhost:{port}/archive-3d/ai-campus-3d-structure.html")
        print(f"📊 Dashboard: http://localhost:{port}/project-dashboard.html")
        
        print("\n📌 Nếu vẫn không truy cập được:")
        print("1. Kiểm tra firewall/antivirus")
        print("2. Thử browser khác (Chrome, Firefox, Safari)")
        print("3. Xóa cache browser: Cmd+Shift+R")
        print("4. Kiểm tra proxy settings")
        
        print("\n🛑 Nhấn Ctrl+C để dừng server")
        
        # Keep server running
        try:
            server_process.wait()
        except KeyboardInterrupt:
            server_process.terminate()
            print("\n✅ Đã dừng server")
    else:
        print("❌ Không thể khởi động server!")
        print("Thử chạy lệnh sau trong Terminal:")
        print(f"cd {project_dir}")
        print(f"python3 -m http.server {port}")

def create_emergency_index():
    """Tạo trang index khẩn cấp"""
    content = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>HEART Data Center - Emergency Page</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; text-align: center; }
        .status { 
            background: #d4edda; 
            color: #155724; 
            padding: 15px; 
            border-radius: 5px; 
            text-align: center;
            margin: 20px 0;
        }
        .links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 30px;
        }
        .link-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .link-card a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 HEART Data Center Project</h1>
        <div class="status">✅ Server đang hoạt động bình thường!</div>
        
        <h2>Quick Links:</h2>
        <div class="links">
            <div class="link-card">
                <a href="project-dashboard.html">📊 Project Dashboard</a>
            </div>
            <div class="link-card">
                <a href="archive-3d/ai-campus-3d-structure.html">🏛️ 3D Campus</a>
            </div>
            <div class="link-card">
                <a href="facilities.html">🏗️ Facilities</a>
            </div>
            <div class="link-card">
                <a href="about.html">ℹ️ About</a>
            </div>
        </div>
        
        <p style="text-align: center; margin-top: 30px; color: #666;">
            Localhost is working! ✅
        </p>
    </div>
</body>
</html>"""
    
    with open("emergency-index.html", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    # Handle Ctrl+C gracefully
    signal.signal(signal.SIGINT, lambda x, y: sys.exit(0))
    main()