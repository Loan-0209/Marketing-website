#!/usr/bin/env python3
"""
LAUNCH NOW - Khởi động website ngay lập tức
"""

import os
import sys
import subprocess
import socket
import time
import webbrowser

def main():
    print("🚀 LAUNCH NOW - HEART Website")
    print("=" * 40)
    
    # Change to project directory
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    os.chdir(project_dir)
    print(f"📁 Directory: {os.getcwd()}")
    
    # Kill old servers
    print("🛑 Stopping old servers...")
    subprocess.run("pkill -f 'python.*http.server'", shell=True, stderr=subprocess.DEVNULL)
    time.sleep(2)
    
    # Find port
    port = 8080
    for test_port in [8080, 8888, 9999]:
        try:
            sock = socket.socket()
            sock.bind(('', test_port))
            sock.close()
            port = test_port
            break
        except:
            continue
    
    print(f"🔌 Using port: {port}")
    
    # Create simple homepage if needed
    if not os.path.exists("index.html"):
        print("📄 Creating homepage...")
        with open("index.html", "w") as f:
            f.write("""<!DOCTYPE html>
<html><head><title>HEART Project</title>
<style>
body{font-family:Arial;text-align:center;padding:50px;background:linear-gradient(135deg,#667eea,#764ba2);color:white;margin:0;}
.container{background:rgba(255,255,255,0.1);padding:50px;border-radius:20px;max-width:800px;margin:0 auto;}
h1{font-size:3em;margin-bottom:20px;}
a{display:inline-block;background:rgba(255,255,255,0.2);color:white;padding:15px 30px;margin:10px;text-decoration:none;border-radius:25px;}
a:hover{background:rgba(255,255,255,0.3);}
</style></head>
<body>
<div class="container">
<h1>🚀 HEART</h1>
<p>Vietnam's First 300MW AI-Optimized Data Center</p>
<div>
<a href="archive-3d/ai-campus-3d-structure.html">🏛️ 3D Campus</a>
<a href="project-dashboard.html">📊 Dashboard</a>
<a href="facilities.html">🏗️ Facilities</a>
</div>
</div>
</body></html>""")
        print("✅ Homepage created")
    
    # Start server
    print("🚀 Starting server...")
    process = subprocess.Popen([sys.executable, "-m", "http.server", str(port)])
    time.sleep(3)
    
    # Test connection
    try:
        sock = socket.socket()
        sock.connect(('localhost', port))
        sock.close()
        print("✅ Server is running!")
    except:
        print("❌ Server connection failed")
        return
    
    # Open browser
    url = f"http://localhost:{port}/"
    print(f"🌐 Opening: {url}")
    
    try:
        webbrowser.open(url)
        print("✅ Browser opened!")
    except:
        print(f"Please open: {url}")
    
    print(f"\n🎉 SUCCESS!")
    print(f"🔗 URL: {url}")
    print(f"📋 PID: {process.pid}")
    print("🛑 Press Ctrl+C to stop")
    
    try:
        process.wait()
    except KeyboardInterrupt:
        process.terminate()
        print("\n✅ Server stopped")

if __name__ == "__main__":
    main()