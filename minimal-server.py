#!/usr/bin/env python3
"""
MINIMAL SERVER - Giải pháp tối giản nhất
"""

import os
import http.server
import socketserver
import webbrowser
import time

# Chuyển đến thư mục project
os.chdir("/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18")

# Tạo trang test tối giản
with open("MINIMAL_TEST.html", "w") as f:
    f.write("""<!DOCTYPE html>
<html><head><title>MINIMAL TEST</title></head>
<body style="text-align:center;padding:100px;font-family:Arial;">
<h1 style="color:green;">✅ MINIMAL SERVER WORKS!</h1>
<p>Localhost đang hoạt động!</p>
<a href="index.html" style="background:blue;color:white;padding:10px;text-decoration:none;">Go to Home</a>
</body></html>""")

print("🔥 MINIMAL SERVER - Giải pháp tối giản")
print("=" * 40)

PORT = 8080

# Khởi động server đơn giản nhất
with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    print(f"✅ Server running at http://localhost:{PORT}/")
    print(f"🌐 Test page: http://localhost:{PORT}/MINIMAL_TEST.html")
    
    # Mở browser
    webbrowser.open(f"http://localhost:{PORT}/MINIMAL_TEST.html")
    
    print("🛑 Press Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✅ Server stopped")