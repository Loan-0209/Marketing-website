#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os

# Change to project directory
os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/')

PORT = 9999
Handler = http.server.SimpleHTTPRequestHandler

print(f"🚀 Starting server on port {PORT}...")
print(f"📁 Serving directory: {os.getcwd()}")

# Start server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"✅ Server running at http://localhost:{PORT}/")
    print(f"🌐 Opening browser...")
    
    # Open browser
    webbrowser.open(f'http://localhost:{PORT}/quick-index.html')
    
    print("🛑 Press Ctrl+C to stop server")
    httpd.serve_forever()