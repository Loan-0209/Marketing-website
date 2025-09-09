#!/usr/bin/env python3
"""
Emergency Server Fix for localhost not sending data
"""
import http.server
import socketserver
import os
import sys
import signal
import time

# Change to project directory
os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')

print("🚨 EMERGENCY SERVER FIX")
print("======================")

# Kill any existing process on port 8080
print("🔧 Step 1: Cleaning up port 8080...")
try:
    import subprocess
    subprocess.run(["lsof", "-ti:8080"], capture_output=True)
    subprocess.run(["lsof", "-ti:8080", "|", "xargs", "kill", "-9"], shell=True, capture_output=True)
    time.sleep(1)
except:
    pass

# Try different ports
ports = [8080, 8081, 8082, 8000, 3000]
server = None

for port in ports:
    try:
        print(f"\n🔧 Trying port {port}...")
        
        # Create custom handler with proper headers
        class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
            def end_headers(self):
                self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
                self.send_header('Access-Control-Allow-Origin', '*')
                super().end_headers()
            
            def do_GET(self):
                if self.path == '/':
                    self.path = '/3d-smart-city.html'
                return super().do_GET()
        
        # Create server
        handler = MyHTTPRequestHandler
        server = socketserver.TCPServer(("", port), handler)
        server.allow_reuse_address = True
        
        print(f"✅ SUCCESS! Server started on port {port}")
        print(f"🌐 Open browser to: http://localhost:{port}/3d-smart-city.html")
        print(f"📁 Serving files from: {os.getcwd()}")
        print("\n💡 Press Ctrl+C to stop server")
        print("=" * 50)
        
        # Start serving
        server.serve_forever()
        break
        
    except OSError as e:
        print(f"❌ Port {port} failed: {e}")
        if server:
            server.server_close()
        continue
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
        if server:
            server.server_close()
        sys.exit(0)

if not server:
    print("\n❌ ERROR: Could not start server on any port!")
    print("Try running with sudo: sudo python3 emergency-server-fix.py")