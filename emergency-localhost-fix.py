#!/usr/bin/env python3
"""
🚑 EMERGENCY LOCALHOST FIX - One-command solution
Giải pháp khẩn cấp cho lỗi localhost connection refused
"""

import os
import sys
import subprocess
import socket
import webbrowser
import time
import threading

def emergency_localhost_fix():
    print("🚑 EMERGENCY LOCALHOST FIX")
    print("=" * 30)
    
    # Change to website directory
    os.chdir("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")
    print(f"📁 Directory: {os.getcwd()}")
    
    # Kill any existing servers
    print("🛑 Killing existing servers...")
    try:
        subprocess.run(["pkill", "-f", "python.*http.server"], capture_output=True)
        for port in [8000, 8080, 8888]:
            subprocess.run(["lsof", "-ti", f":{port}"], capture_output=True)
        print("✅ Cleanup complete")
    except:
        pass
    
    # Find working port
    working_port = 8000
    for port in [8000, 8080, 8888, 9000, 9999]:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            if result != 0:  # Port is free
                working_port = port
                break
        except:
            continue
    
    print(f"🎯 Using port: {working_port}")
    
    # Create emergency index if needed
    if not os.path.exists("index.html"):
        print("🚑 Creating emergency index...")
        with open("index.html", "w") as f:
            f.write("""<!DOCTYPE html>
<html><head><title>HEART Emergency</title>
<style>body{font-family:Arial;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;text-align:center;padding:50px;}
h1{font-size:3em;}</style></head>
<body><h1>🚀 HEART</h1><h2>✅ Emergency Server Active</h2>
<p>Localhost connection fixed!</p>
<a href="heart_standalone.html" style="color:yellow;">❤️ Standalone</a> | 
<a href="3d-campus-interactive.html" style="color:yellow;">🎮 3D Campus</a>
</body></html>""")
    
    # URLs
    base_url = f"http://localhost:{working_port}"
    print(f"\n🌐 URLs:")
    print(f"   🏠 Main: {base_url}/")
    print(f"   ❤️ Standalone: {base_url}/heart_standalone.html")
    print(f"   🎮 3D Campus: {base_url}/3d-campus-interactive.html")
    
    # Open browser automatically
    def open_browser():
        time.sleep(2)
        try:
            webbrowser.open(base_url)
            print(f"\n🌐 Browser opened: {base_url}")
        except:
            print(f"\n📋 Manual: Open {base_url} in browser")
    
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Start server
    print(f"\n🚀 Starting server on port {working_port}...")
    print("⏹️ Press Ctrl+C to stop")
    print("=" * 30)
    
    try:
        os.system(f"python3 -m http.server {working_port}")
    except KeyboardInterrupt:
        print("\n👋 Server stopped!")

if __name__ == "__main__":
    emergency_localhost_fix()