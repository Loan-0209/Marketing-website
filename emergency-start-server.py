#!/usr/bin/env python3
"""
Emergency Server Starter - Khởi động server khẩn cấp
"""

import os
import sys
import subprocess
import socket
import webbrowser
import time
import threading

def find_free_port():
    """Tìm port trống để sử dụng"""
    for port in [8000, 8080, 8888, 9000, 9999]:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            if result != 0:  # Port is free
                return port
        except:
            continue
    return 8000

def kill_existing_servers():
    """Dừng các server đang chạy"""
    try:
        subprocess.run(["pkill", "-f", "python.*http.server"], capture_output=True)
        print("✅ Cleaned up existing servers")
    except:
        pass

def open_browser_delayed(url):
    """Mở browser sau khi server khởi động"""
    time.sleep(3)
    try:
        webbrowser.open(url)
        print(f"🌐 Browser opened: {url}")
    except:
        print(f"📋 Please manually open: {url}")

def main():
    print("🚑 EMERGENCY LOCALHOST SERVER")
    print("=" * 40)
    
    # Change to correct directory
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    os.chdir(project_dir)
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Kill existing servers
    kill_existing_servers()
    
    # Find free port
    port = find_free_port()
    print(f"🎯 Using port: {port}")
    
    # Show URLs
    base_url = f"http://localhost:{port}"
    print(f"\n🌐 Available URLs:")
    print(f"   🏠 Main site: {base_url}/")
    print(f"   ❤️ Heart standalone: {base_url}/heart_standalone.html")
    print(f"   🎮 3D Campus: {base_url}/3d-campus-interactive.html")
    print(f"   📄 About: {base_url}/about.html")
    print(f"   🏗️ Facilities: {base_url}/facilities.html")
    
    # Start browser opener thread
    threading.Thread(target=open_browser_delayed, args=(base_url,), daemon=True).start()
    
    # Start server
    print(f"\n🚀 Starting HTTP server on port {port}...")
    print("⏹️ Press Ctrl+C to stop server")
    print("=" * 40)
    
    try:
        # Use subprocess to start server
        cmd = [sys.executable, "-m", "http.server", str(port)]
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped!")
        print("Thank you for using Emergency Server!")

if __name__ == "__main__":
    main()