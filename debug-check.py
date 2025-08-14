#!/usr/bin/env python3
"""
COMPREHENSIVE DIAGNOSIS - Chẩn đoán toàn diện lỗi server
"""

import os
import sys
import subprocess
import socket
import platform
from pathlib import Path

def print_section(title):
    print(f"\n{'='*60}")
    print(f"🔍 {title}")
    print(f"{'='*60}")

def check_directory():
    """Kiểm tra thư mục hiện tại"""
    print_section("KIỂM TRA THỦ MỤC")
    
    current_dir = os.getcwd()
    expected_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    
    print(f"📂 Thư mục hiện tại: {current_dir}")
    print(f"📍 Thư mục mong muốn: {expected_dir}")
    
    if current_dir != expected_dir:
        print("❌ SAI THỦ MỤC!")
        if os.path.exists(expected_dir):
            os.chdir(expected_dir)
            print(f"✅ Đã chuyển đến: {expected_dir}")
        else:
            print(f"❌ Thư mục không tồn tại: {expected_dir}")
            return False
    else:
        print("✅ Đúng thư mục")
    
    return True

def check_files():
    """Kiểm tra các file HTML"""
    print_section("KIỂM TRA FILES")
    
    html_files = list(Path('.').glob('*.html'))
    
    if html_files:
        print(f"✅ Tìm thấy {len(html_files)} file HTML:")
        for file in html_files[:10]:  # Show first 10
            size = file.stat().st_size
            print(f"   📄 {file.name} ({size} bytes)")
        if len(html_files) > 10:
            print(f"   ... và {len(html_files) - 10} files khác")
    else:
        print("❌ Không tìm thấy file HTML nào!")
        return False
    
    # Check important files
    important_files = ['index.html', 'project-dashboard.html']
    for file in important_files:
        if os.path.exists(file):
            print(f"✅ {file} tồn tại")
        else:
            print(f"⚠️ {file} không tồn tại")
    
    return True

def check_ports():
    """Kiểm tra ports"""
    print_section("KIỂM TRA PORTS")
    
    ports_to_check = [8080, 8888, 9999, 3000, 5000, 8000]
    available_ports = []
    busy_ports = []
    
    for port in ports_to_check:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            
            if result == 0:
                busy_ports.append(port)
                print(f"❌ Port {port}: ĐANG SỬ DỤNG")
                
                # Try to find what's using the port
                try:
                    cmd = f"lsof -i :{port}"
                    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                    if result.stdout:
                        lines = result.stdout.strip().split('\n')[1:]  # Skip header
                        for line in lines:
                            parts = line.split()
                            if len(parts) >= 2:
                                print(f"   🔍 Process: {parts[0]} (PID: {parts[1]})")
                except:
                    pass
            else:
                available_ports.append(port)
                print(f"✅ Port {port}: SẴN SÀNG")
                
        except Exception as e:
            print(f"⚠️ Port {port}: Lỗi kiểm tra - {e}")
    
    print(f"\n📊 Tổng kết: {len(available_ports)} ports sẵn sàng, {len(busy_ports)} ports bận")
    return available_ports

def check_python_servers():
    """Kiểm tra Python HTTP servers đang chạy"""
    print_section("KIỂM TRA PYTHON SERVERS")
    
    try:
        cmd = "ps aux | grep 'python.*http.server' | grep -v grep"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        
        if result.stdout.strip():
            print("🐍 Python servers đang chạy:")
            for line in result.stdout.strip().split('\n'):
                parts = line.split()
                if len(parts) >= 2:
                    print(f"   PID: {parts[1]} - {' '.join(parts[10:])}")
        else:
            print("❌ Không có Python HTTP server nào đang chạy")
    except Exception as e:
        print(f"⚠️ Lỗi khi kiểm tra Python servers: {e}")

def check_network():
    """Kiểm tra kết nối mạng"""
    print_section("KIỂM TRA MẠNG")
    
    # Test localhost resolution
    try:
        ip = socket.gethostbyname('localhost')
        print(f"✅ localhost resolves to: {ip}")
    except Exception as e:
        print(f"❌ Localhost resolution error: {e}")
    
    # Test port binding
    test_ports = [8080, 8888, 9999]
    for port in test_ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.bind(('localhost', port))
            sock.close()
            print(f"✅ Có thể bind port {port}")
            break
        except Exception as e:
            print(f"❌ Không thể bind port {port}: {e}")

def check_system_info():
    """Kiểm tra thông tin hệ thống"""
    print_section("THÔNG TIN HỆ THỐNG")
    
    print(f"💻 Hệ điều hành: {platform.system()} {platform.release()}")
    print(f"🐍 Python: {sys.version.split()[0]}")
    print(f"📍 Python path: {sys.executable}")
    print(f"👤 User: {os.getenv('USER', 'Unknown')}")

def test_simple_server():
    """Test khởi động server đơn giản"""
    print_section("TEST KHỞI ĐỘNG SERVER")
    
    test_port = 8080
    
    # Find available port
    for port in [8080, 8888, 9999, 8000]:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.bind(('', port))
            sock.close()
            test_port = port
            print(f"✅ Sẽ test trên port {port}")
            break
        except:
            continue
    
    # Try to start simple server
    try:
        import http.server
        import socketserver
        import threading
        import time
        
        print(f"🚀 Thử khởi động server trên port {test_port}...")
        
        handler = http.server.SimpleHTTPRequestHandler
        
        with socketserver.TCPServer(("", test_port), handler) as httpd:
            # Start server in thread
            server_thread = threading.Thread(target=httpd.serve_forever)
            server_thread.daemon = True
            server_thread.start()
            
            time.sleep(1)
            
            # Test connection
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(2)
                result = sock.connect_ex(('localhost', test_port))
                sock.close()
                
                if result == 0:
                    print("✅ Server test THÀNH CÔNG!")
                    print(f"🌐 Test URL: http://localhost:{test_port}/")
                    return True
                else:
                    print("❌ Không thể kết nối đến server test")
                    return False
                    
            except Exception as e:
                print(f"❌ Lỗi test kết nối: {e}")
                return False
            
    except Exception as e:
        print(f"❌ Không thể khởi động server test: {e}")
        return False

def main():
    """Main diagnosis function"""
    print("🔍 COMPREHENSIVE SERVER DIAGNOSIS")
    print("Chẩn đoán toàn diện lỗi web server")
    print("=" * 80)
    
    # Run all checks
    results = {}
    results['directory'] = check_directory()
    results['files'] = check_files()
    results['ports'] = check_ports()
    check_python_servers()
    check_network()
    check_system_info()
    results['server_test'] = test_simple_server()
    
    # Summary
    print_section("TỔNG KẾT CHẨN ĐOÁN")
    
    issues = []
    if not results['directory']:
        issues.append("🔴 Sai thư mục project")
    if not results['files']:
        issues.append("🔴 Thiếu file HTML")
    if not results['ports']:
        issues.append("🔴 Không có port nào sẵn sàng")
    if not results['server_test']:
        issues.append("🔴 Không thể khởi động test server")
    
    if issues:
        print("❌ VẤN ĐỀ PHÁT HIỆN:")
        for issue in issues:
            print(f"   {issue}")
        
        print("\n🔧 GIẢI PHÁP:")
        print("   1. Khởi động lại Terminal")
        print("   2. Dừng tất cả Python process: pkill -f python")
        print("   3. Thử port khác: python3 -m http.server 8888")
        print("   4. Kiểm tra firewall/antivirus")
        
    else:
        print("✅ TẤT CẢ KIỂM TRA THÀNH CÔNG!")
        print("\n🎯 KHUYẾN NGHỊ:")
        print("   1. Chạy: python3 minimal-server.py")
        print("   2. Hoặc: python3 -m http.server 8080")
        print("   3. Mở: http://localhost:8080/")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Chẩn đoán bị dừng")
    except Exception as e:
        print(f"\n💥 Lỗi: {e}")