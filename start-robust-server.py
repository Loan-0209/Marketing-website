#!/usr/bin/env python3
"""Robust HTTP Server for 3D Smart City"""

import os
import sys
import http.server
import socketserver
import webbrowser
from threading import Timer

def start_server():
    # Change to the directory containing the HTML file
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Try different ports if 8080 is busy
    ports = [8080, 8081, 8082, 8083, 9000, 9001]
    server = None
    port_used = None
    
    for port in ports:
        try:
            handler = http.server.SimpleHTTPRequestHandler
            server = socketserver.TCPServer(("127.0.0.1", port), handler)
            port_used = port
            print(f"🚀 Server starting on port {port}")
            break
        except OSError as e:
            if e.errno == 48:  # Address already in use
                print(f"⚠️ Port {port} already in use, trying next...")
                continue
            else:
                raise
    
    if not server:
        print("❌ Could not find available port!")
        sys.exit(1)
    
    url = f"http://localhost:{port_used}/3d-smart-city.html"
    print(f"📍 3D Smart City available at: {url}")
    print(f"🌐 Server running on localhost:{port_used}")
    print(f"📁 Serving files from: {os.getcwd()}")
    print("🔄 Press Ctrl+C to stop server")
    
    # Auto-open browser after 2 seconds
    def open_browser():
        print(f"🌐 Opening browser: {url}")
        webbrowser.open(url)
    
    Timer(2.0, open_browser).start()
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        server.shutdown()

if __name__ == "__main__":
    start_server()