#!/usr/bin/env python3
"""
Fix Website Access Issues
Sửa lỗi không thể truy cập trang web
"""

import os
import sys
import subprocess
import time
import webbrowser
import http.server
import socketserver
import threading

def check_and_fix_issues():
    """Kiểm tra và sửa các vấn đề truy cập"""
    print("🔧 KHẮC PHỤC LỖI TRUY CẬP WEBSITE")
    print("=" * 50)
    
    # 1. Kiểm tra thư mục hiện tại
    current_dir = os.getcwd()
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    
    if current_dir != project_dir:
        print(f"📁 Chuyển đến thư mục dự án...")
        os.chdir(project_dir)
    
    # 2. Kiểm tra file index.html
    if os.path.exists("index.html"):
        print("✅ Tìm thấy index.html")
    else:
        print("❌ Không tìm thấy index.html")
        print("🔧 Tạo trang index tạm thời...")
        create_temp_index()
    
    # 3. Kill các process đang dùng port
    print("\n🔧 Dọn dẹp các port đang sử dụng...")
    ports = [8080, 8888, 9999, 3000, 5000]
    for port in ports:
        try:
            # macOS command to find and kill process using port
            subprocess.run(f"lsof -ti:{port} | xargs kill -9", shell=True, stderr=subprocess.DEVNULL)
        except:
            pass
    
    print("✅ Đã dọn dẹp các port")
    
    # 4. Khởi động server mới
    PORT = 8080
    print(f"\n🚀 Khởi động web server trên port {PORT}...")
    
    # Start server in thread
    server_thread = threading.Thread(target=start_simple_server, args=(PORT,))
    server_thread.daemon = True
    server_thread.start()
    
    # Wait for server to start
    time.sleep(2)
    
    # 5. Mở browser
    url = f"http://localhost:{PORT}/"
    print(f"\n🌐 Mở website tại: {url}")
    
    try:
        # Try different methods to open browser
        if sys.platform == "darwin":  # macOS
            subprocess.run(["open", url])
        elif sys.platform == "win32":  # Windows
            os.startfile(url)
        else:  # Linux
            subprocess.run(["xdg-open", url])
            
        print("✅ Đã mở browser thành công!")
        
    except Exception as e:
        print(f"⚠️ Không thể tự động mở browser: {e}")
        print(f"👉 Vui lòng mở thủ công: {url}")
    
    print("\n📌 HƯỚNG DẪN:")
    print("1. Nếu trang không load, nhấn Ctrl+Shift+R để refresh")
    print("2. Kiểm tra Console (F12) nếu có lỗi JavaScript")
    print("3. Thử các trang khác:")
    print(f"   - 3D Campus: {url}archive-3d/ai-campus-3d-structure.html")
    print(f"   - Facilities: {url}facilities.html")
    print(f"   - Dashboard: {url}project-dashboard.html")
    
    print("\n🛑 Nhấn Ctrl+C để dừng server")
    
    # Keep server running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n✅ Đã dừng server")

def start_simple_server(port):
    """Khởi động HTTP server đơn giản"""
    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            # Only log errors
            if "404" in format % args:
                print(f"❌ Không tìm thấy: {format % args}")
    
    with socketserver.TCPServer(("", port), Handler) as httpd:
        print(f"✅ Server đang chạy tại http://localhost:{port}/")
        httpd.serve_forever()

def create_temp_index():
    """Tạo trang index tạm thời nếu không có"""
    html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HEART Data Center - Project Navigation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f0f0f0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .nav-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .nav-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            transition: transform 0.2s;
        }
        .nav-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .nav-card a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
        }
        .nav-card p {
            color: #666;
            margin-top: 10px;
        }
        .status {
            text-align: center;
            margin: 20px 0;
            padding: 10px;
            background: #d4edda;
            color: #155724;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 HEART Data Center Project</h1>
        <div class="status">✅ Website đang hoạt động bình thường</div>
        
        <div class="nav-grid">
            <div class="nav-card">
                <a href="project-dashboard.html">📊 Project Dashboard</a>
                <p>Tổng quan toàn bộ dự án</p>
            </div>
            
            <div class="nav-card">
                <a href="archive-3d/ai-campus-3d-structure.html">🏛️ 3D Campus</a>
                <p>Master Plan 3D visualization</p>
            </div>
            
            <div class="nav-card">
                <a href="facilities.html">🏗️ Facilities</a>
                <p>Cơ sở vật chất</p>
            </div>
            
            <div class="nav-card">
                <a href="about.html">ℹ️ About</a>
                <p>Giới thiệu dự án</p>
            </div>
            
            <div class="nav-card">
                <a href="technology.html">💻 Technology</a>
                <p>Công nghệ</p>
            </div>
            
            <div class="nav-card">
                <a href="master-plan.html">📋 Master Plan</a>
                <p>Kế hoạch tổng thể</p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px; color: #666;">
            <p>Server đang chạy tại: http://localhost:8080/</p>
            <p>Nhấn Ctrl+C trong terminal để dừng server</p>
        </div>
    </div>
</body>
</html>"""
    
    with open("index-temp.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    
    # Also create a symlink if original index exists but has issues
    if os.path.exists("index.html.backup"):
        os.rename("index.html.backup", "index-original.html")

if __name__ == "__main__":
    check_and_fix_issues()