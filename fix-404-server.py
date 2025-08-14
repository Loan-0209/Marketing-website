#\!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import socket
import time
import threading

PROJECT_DIR = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
os.chdir(PROJECT_DIR)

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()
    
    def do_GET(self):
        path = self.path.split('?')[0]
        if path == '/':
            path = '/index.html'
        
        file_path = os.path.join(PROJECT_DIR, path.lstrip('/'))
        
        if os.path.exists(file_path) and os.path.isfile(file_path):
            super().do_GET()
        else:
            self.send_custom_404(path)
    
    def send_custom_404(self, path):
        self.send_response(404)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        
        html = f"""
<\!DOCTYPE html>
<html>
<head><title>404 - File Not Found</title></head>
<body style="font-family: Arial; background: #001122; color: white; padding: 40px; text-align: center;">
    <h1 style="color: #fbbf24;">🚫 404 - File Not Found</h1>
    <p>File: <code>{path}</code></p>
    <div style="margin: 20px;">
        <a href="/index.html" style="color: #60a5fa; margin: 10px;">🏠 Home</a>
        <a href="/3d-campus-smart-city.html" style="color: #60a5fa; margin: 10px;">🏙️ 3D Smart City</a>
    </div>
</body>
</html>"""
        self.wfile.write(html.encode())

def find_free_port():
    for port in [8091, 8092, 8093, 9000, 7777]:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except:
            continue
    return 8091

PORT = find_free_port()
print(f"🚀 Starting server on port {PORT}")
print(f"📁 Serving: {PROJECT_DIR}")
print(f"🌐 URL: http://localhost:{PORT}")

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    httpd.allow_reuse_address = True
    
    def open_browser():
        time.sleep(1)
        webbrowser.open(f"http://localhost:{PORT}/index.html")
    
    threading.Thread(target=open_browser, daemon=True).start()
    
    print("✅ Server running\! Press Ctrl+C to stop")
    httpd.serve_forever()
EOF < /dev/null