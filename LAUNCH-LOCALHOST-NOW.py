#!/usr/bin/env python3
"""
🚑 INSTANT LOCALHOST LAUNCHER
Khởi động localhost ngay lập tức - không cần terminal phức tạp
"""

import os
import subprocess
import socket
import webbrowser
import time
import sys

def main():
    print("🚑 INSTANT LOCALHOST LAUNCHER")
    print("=" * 35)
    
    # Change directory
    os.chdir("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")
    print(f"📁 Working in: {os.getcwd()}")
    
    # Kill existing servers
    print("🛑 Cleaning up...")
    subprocess.run("pkill -f 'python.*http.server'", shell=True, capture_output=True)
    
    # Find free port
    port = 8000
    for test_port in [8000, 8080, 8888, 9000, 9999]:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex(('localhost', test_port))
            sock.close()
            if result != 0:
                port = test_port
                break
        except:
            continue
    
    print(f"🎯 Port: {port}")
    
    # URLs
    base_url = f"http://localhost:{port}"
    print(f"\n🌐 URLs:")
    print(f"   🏠 {base_url}/")
    print(f"   ❤️ {base_url}/heart_standalone.html")
    print(f"   🎮 {base_url}/3d-campus-interactive.html")
    
    # Open browser in 2 seconds
    def open_browser():
        time.sleep(2)
        webbrowser.open(base_url)
        print(f"\n✅ Browser opened: {base_url}")
    
    import threading
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Start server
    print(f"\n🚀 Server starting on port {port}...")
    print("Press Ctrl+C to stop")
    print("=" * 35)
    
    try:
        subprocess.run([sys.executable, "-m", "http.server", str(port)])
    except KeyboardInterrupt:
        print("\n👋 Server stopped!")

if __name__ == "__main__":
    main()