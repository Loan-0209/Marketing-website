#!/usr/bin/env python3
"""
🚀 Start Localhost Server
Khởi động server localhost nhanh chóng
"""

import os
import sys
import subprocess
import webbrowser
import time
import socket
from pathlib import Path

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
    try:
        # Kill Python HTTP servers
        subprocess.run("pkill -f 'python.*http.server'", shell=True, stderr=subprocess.DEVNULL)
        subprocess.run("pkill -f 'python3.*http.server'", shell=True, stderr=subprocess.DEVNULL)
        time.sleep(1)
    except:
        pass

def main():
    print("🚀 STARTING LOCALHOST SERVER")
    print("=" * 40)
    
    # Chuyển đến thư mục project
    project_dir = Path("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")
    os.chdir(project_dir)
    print(f"📂 Working directory: {os.getcwd()}")
    
    # Dừng server cũ
    print("🔄 Stopping old servers...")
    kill_existing_servers()
    
    # Tìm port trống
    port = find_free_port()
    if not port:
        print("❌ Cannot find free port!")
        return False
    
    print(f"✅ Found free port: {port}")
    
    # URL để mở
    urls = {
        "Homepage": f"http://localhost:{port}",
        "3D Campus": f"http://localhost:{port}/3d-campus-with-navigation.html",
        "Facilities": f"http://localhost:{port}/facilities.html"
    }
    
    # Khởi động server
    print(f"\n🌐 Starting server on port {port}...")
    server_process = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Đợi server khởi động
    time.sleep(2)
    
    # Kiểm tra server
    if server_process.poll() is None:
        print("✅ Server started successfully!")
        
        print("\n📋 LOCALHOST URLs:")
        print("-" * 40)
        for name, url in urls.items():
            print(f"{name}: {url}")
        
        print("\n🎯 QUICK ACCESS:")
        print(f"Main URL: http://localhost:{port}")
        
        # Mở browser
        print("\n🌐 Opening browser...")
        try:
            webbrowser.open(f"http://localhost:{port}")
            print("✅ Browser opened!")
        except:
            print("⚠️ Please open browser manually")
        
        print("\n⚡ SERVER IS RUNNING!")
        print("Press Ctrl+C to stop the server")
        
        try:
            # Giữ server chạy
            server_process.wait()
        except KeyboardInterrupt:
            print("\n👋 Stopping server...")
            server_process.terminate()
            
    else:
        print("❌ Failed to start server!")
        return False
    
    return True

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n💥 Error: {e}")