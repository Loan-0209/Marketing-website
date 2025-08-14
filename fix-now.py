#!/usr/bin/env python3
import os
import sys
import subprocess
import socket
import webbrowser
import time

def main():
    print("🚑 EMERGENCY LOCALHOST FIX")
    print("=" * 30)
    
    # Change directory
    os.chdir("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")
    print(f"📁 Working in: {os.getcwd()}")
    
    # Kill existing servers
    print("🛑 Cleaning up existing servers...")
    try:
        os.system("pkill -f 'python.*http.server' 2>/dev/null")
        for port in [8000, 8080, 8888, 9000, 9999]:
            os.system(f"lsof -ti :{port} | xargs kill -9 2>/dev/null")
        print("✅ Cleanup complete")
    except:
        print("⚠️ Cleanup attempted")
    
    # Find available port
    working_port = 8000
    for port in [8000, 8080, 8888, 9000, 9999]:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            if result != 0:
                working_port = port
                print(f"✅ Port {port} is available")
                break
        except:
            working_port = port
            break
    
    print(f"🎯 Using port: {working_port}")
    
    # Create emergency index if needed
    if not os.path.exists("index.html"):
        print("🚑 Creating emergency index.html...")
        with open("index.html", "w") as f:
            f.write("""<!DOCTYPE html>
<html><head><title>HEART Emergency</title>
<style>
body{font-family:Arial;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;text-align:center;padding:50px;}
h1{font-size:3em;margin-bottom:20px;}
.links{margin:30px 0;}
.links a{color:yellow;text-decoration:none;margin:0 15px;font-size:1.2em;}
.links a:hover{text-decoration:underline;}
</style></head>
<body>
<h1>🚀 HEART WEBSITE</h1>
<h2>✅ Emergency Server Active</h2>
<p>Localhost connection has been fixed!</p>
<div class="links">
<a href="heart_standalone.html">❤️ Heart Standalone</a>
<a href="3d-campus-interactive.html">🎮 3D Campus</a>
<a href="facilities.html">🏢 Facilities</a>
</div>
<p><small>Server running on port {}</small></p>
</body></html>""".format(working_port))
        print("✅ Emergency index.html created")
    else:
        print("✅ index.html already exists")
    
    # Display URLs
    base_url = f"http://localhost:{working_port}"
    print(f"\n🌐 AVAILABLE URLs:")
    print(f"   🏠 Main: {base_url}/")
    print(f"   ❤️ Standalone: {base_url}/heart_standalone.html")
    print(f"   🎮 3D Campus: {base_url}/3d-campus-interactive.html")
    print(f"   🏢 Facilities: {base_url}/facilities.html")
    
    # Open browser
    print(f"\n🌐 Opening browser...")
    try:
        webbrowser.open(base_url)
        print(f"✅ Browser opened: {base_url}")
    except:
        print(f"📋 Manual: Open {base_url} in your browser")
    
    # Start server
    print(f"\n🚀 Starting Python HTTP server on port {working_port}...")
    print("⏹️ Press Ctrl+C to stop server")
    print("=" * 50)
    
    try:
        os.system(f"python3 -m http.server {working_port}")
    except KeyboardInterrupt:
        print(f"\n👋 Server stopped!")

if __name__ == "__main__":
    main()