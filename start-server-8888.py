#!/usr/bin/env python3
"""
Stable HTTP Server for HEART 3D Smart City
Runs on port 8888 with proper error handling and CORS support
"""

import os
import sys
import http.server
import socketserver
import signal
import time
from http import HTTPStatus

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with CORS support"""
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # Cache control for better performance
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom logging with timestamp"""
        sys.stderr.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {format % args}\n")

def signal_handler(sig, frame):
    """Handle shutdown gracefully"""
    print('\n🛑 Server shutting down...')
    sys.exit(0)

def main():
    PORT = 8888
    DIRECTORY = os.path.dirname(os.path.abspath(__file__))
    
    # Change to the script directory
    os.chdir(DIRECTORY)
    
    print(f"📁 Serving directory: {DIRECTORY}")
    print(f"🚀 Starting HTTP server on port {PORT}...")
    
    # Set up signal handler for clean shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        # Create socket with SO_REUSEADDR to avoid "Address already in use" errors
        with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
            httpd.allow_reuse_address = True
            print(f"✅ Server running at http://localhost:{PORT}/")
            print(f"🔗 Access 3D Campus at: http://localhost:{PORT}/ai-campus-3d-structure.html")
            print("📌 Press Ctrl+C to stop the server")
            
            # Serve forever
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {PORT} is already in use!")
            print("💡 Try one of these solutions:")
            print(f"   1. Kill the existing process: lsof -ti:{PORT} | xargs kill -9")
            print(f"   2. Use a different port by editing this script")
            sys.exit(1)
        else:
            raise
    except Exception as e:
        print(f"❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()