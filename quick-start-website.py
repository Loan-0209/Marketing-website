#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import socket
from threading import Timer

# Change to project directory
os.chdir("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")

def find_free_port():
    """Find an available port"""
    ports = [8080, 9000, 7777, 5555, 3333, 8888]
    
    for port in ports:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    
    # Random free port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

def main():
    PORT = find_free_port()
    
    print("🚀 HEART Website - Quick Start")
    print("=" * 40)
    print(f"📁 Directory: {os.getcwd()}")
    print(f"🌐 Port: {PORT}")
    
    class Handler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            super().end_headers()
        
        def log_message(self, format, *args):
            if any(x in format % args for x in ['.html', '3d-smart-city']):
                print(f"✅ {format % args}")
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.allow_reuse_address = True
            
            base_url = f"http://localhost:{PORT}"
            
            print(f"✅ Server started successfully!")
            print(f"🌐 Website: {base_url}")
            print(f"🏙️ 3D Smart City: {base_url}/3d-smart-city.html")
            print("=" * 40)
            
            # Open browser
            Timer(1.5, lambda: webbrowser.open(base_url)).start()
            
            print("🛑 Press Ctrl+C to stop")
            httpd.serve_forever()
            
    except Exception as e:
        print(f"❌ Error: {e}")
        # Fallback: open files directly
        print("🔄 Opening files directly...")
        webbrowser.open(f"file://{os.path.join(os.getcwd(), 'index.html')}")

if __name__ == "__main__":
    main()