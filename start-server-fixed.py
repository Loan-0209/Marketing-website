#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
import signal

# Change to the correct directory
os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')

# Port configuration
PORT = 8000
HOST = '127.0.0.1'

# Custom handler to fix empty reply issue
class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def log_message(self, format, *args):
        print(f"[SERVER] {self.address_string()} - {format % args}")

# Kill any existing process on port
def kill_port(port):
    try:
        import subprocess
        subprocess.run(f"lsof -ti:{port} | xargs kill -9", shell=True, capture_output=True)
        print(f"✅ Cleared port {port}")
    except:
        pass

# Signal handler
def signal_handler(sig, frame):
    print('\n⏹️  Shutting down server...')
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

# Main server
def start_server():
    print(f"🚀 Starting HTTP Server...")
    print(f"📁 Serving directory: {os.getcwd()}")
    
    # Kill any existing process
    kill_port(PORT)
    
    try:
        # Create server with custom handler
        with socketserver.TCPServer((HOST, PORT), MyHTTPRequestHandler) as httpd:
            httpd.allow_reuse_address = True
            print(f"✅ Server running at http://{HOST}:{PORT}")
            print(f"📋 Available files:")
            
            # List HTML files
            for file in os.listdir('.'):
                if file.endswith('.html'):
                    print(f"   → http://{HOST}:{PORT}/{file}")
            
            print("\n🛑 Press Ctrl+C to stop server\n")
            
            # Serve forever
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use!")
            print("🔧 Trying alternative port 8080...")
            PORT = 8080
            start_server()
        else:
            print(f"❌ Server error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    start_server()