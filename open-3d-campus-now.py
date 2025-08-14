#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys
import socket
import time
from threading import Timer

# Change to project directory
project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
os.chdir(project_dir)

def find_free_port():
    """Find an available port"""
    # Try common ports first
    preferred_ports = [8888, 9999, 7777, 5555, 4444, 3333]
    
    for port in preferred_ports:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    
    # If all preferred ports are taken, get a random free port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        return s.getsockname()[1]

def kill_existing_servers():
    """Try to kill existing Python servers"""
    import subprocess
    try:
        # Kill Python processes running http.server
        subprocess.run(['pkill', '-f', 'python.*http.server'], capture_output=True)
        time.sleep(0.5)
    except:
        pass

def main():
    # Kill any existing servers
    kill_existing_servers()
    
    # Find available port
    PORT = find_free_port()
    
    print("🚀 3D SMART CITY CAMPUS - BULLETPROOF LAUNCHER")
    print("=" * 50)
    print(f"📁 Directory: {os.getcwd()}")
    print(f"🌐 Port: {PORT}")
    print("=" * 50)
    
    # Create simple HTTP handler
    class Handler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header('Expires', '0')
            super().end_headers()
        
        def log_message(self, format, *args):
            # Minimal logging
            if '/3d-campus' in format % args:
                print(f"✅ Serving: {format % args}")
    
    # Start server
    try:
        with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
            httpd.allow_reuse_address = True
            
            # URLs to open
            urls = [
                f"http://localhost:{PORT}/3d-campus-smart-city-complete.html",
                f"http://127.0.0.1:{PORT}/3d-campus-smart-city-complete.html"
            ]
            
            print(f"✅ Server started successfully!")
            print(f"🌐 Opening browser...")
            
            # Try opening with different URLs
            opened = False
            for url in urls:
                try:
                    webbrowser.open(url)
                    print(f"✅ Opened: {url}")
                    opened = True
                    break
                except Exception as e:
                    print(f"⚠️  Failed to open {url}: {e}")
            
            if not opened:
                print("\n❌ Could not open browser automatically")
                print("📋 Please copy and paste this URL:")
                print(f"   {urls[0]}")
            
            print("\n🛑 Press Ctrl+C to stop server")
            print("=" * 50)
            
            # Serve forever
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use!")
            print("🔧 Trying alternative method...")
            
            # Try opening file directly
            file_path = os.path.join(project_dir, "3d-campus-smart-city-complete.html")
            file_url = f"file://{file_path}"
            
            print(f"📂 Opening file directly: {file_url}")
            webbrowser.open(file_url)
            print("✅ Opened in browser (file mode)")
            
        else:
            print(f"❌ Server error: {e}")
            
    except KeyboardInterrupt:
        print("\n⏹️  Server stopped by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        
        # Fallback: open file directly
        file_path = os.path.join(project_dir, "3d-campus-smart-city-complete.html")
        file_url = f"file://{file_path}"
        print(f"\n🔄 Fallback: Opening file directly...")
        webbrowser.open(file_url)

if __name__ == "__main__":
    main()