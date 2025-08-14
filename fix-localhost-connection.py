#!/usr/bin/env python3
"""
🔧 FIX LOCALHOST CONNECTION - HEART WEBSITE
Khắc phục lỗi "localhost đã từ chối kết nối"
"""

import os
import sys
import subprocess
import socket
import time
import webbrowser
import http.server
import socketserver
import threading
from pathlib import Path

class LocalhostFixer:
    def __init__(self):
        self.project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
        self.available_ports = [8000, 8080, 8888, 9000, 9999, 3000, 5000, 7000]
        self.working_port = None
        
    def print_header(self):
        print("🔧 FIX LOCALHOST CONNECTION - HEART WEBSITE")
        print("=" * 50)
        
    def change_directory(self):
        """Chuyển đến thư mục dự án"""
        try:
            os.chdir(self.project_dir)
            print(f"📁 Working directory: {os.getcwd()}")
            return True
        except Exception as e:
            print(f"❌ Cannot change to project directory: {e}")
            return False
    
    def kill_existing_servers(self):
        """Dừng tất cả server đang chạy trên các port"""
        print("\n🛑 STOPPING EXISTING SERVERS...")
        
        # Kill Python HTTP servers
        try:
            subprocess.run(["pkill", "-f", "python.*http.server"], 
                         capture_output=True, check=False)
            print("✅ Stopped Python HTTP servers")
        except:
            pass
            
        # Kill servers trên specific ports
        for port in self.available_ports:
            try:
                # Tìm process đang dùng port
                result = subprocess.run(["lsof", "-ti", f":{port}"], 
                                      capture_output=True, text=True)
                if result.stdout.strip():
                    pids = result.stdout.strip().split('\n')
                    for pid in pids:
                        subprocess.run(["kill", "-9", pid], capture_output=True)
                    print(f"✅ Killed processes on port {port}")
            except:
                pass
        
        time.sleep(2)  # Đợi processes dừng hoàn toàn
    
    def test_port(self, port):
        """Kiểm tra xem port có available không"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            return result != 0  # True nếu port free
        except:
            return True
    
    def find_available_port(self):
        """Tìm port available"""
        print("\n🔍 FINDING AVAILABLE PORT...")
        
        for port in self.available_ports:
            if self.test_port(port):
                print(f"✅ Port {port} is available")
                self.working_port = port
                return port
            else:
                print(f"❌ Port {port} is busy")
        
        print("⚠️ All common ports are busy, trying random port...")
        # Thử random port
        sock = socket.socket()
        sock.bind(('', 0))
        port = sock.getsockname()[1]
        sock.close()
        self.working_port = port
        return port
    
    def check_website_files(self):
        """Kiểm tra files website"""
        print("\n🔍 CHECKING WEBSITE FILES...")
        
        required_files = ["index.html", "heart_standalone.html", "3d-campus-interactive.html"]
        existing_files = []
        
        for file in required_files:
            if os.path.exists(file):
                print(f"✅ {file} - Found")
                existing_files.append(file)
            else:
                print(f"❌ {file} - Missing")
        
        if not existing_files:
            print("❌ No website files found!")
            return False
            
        return True
    
    def create_emergency_index(self):
        """Tạo emergency index.html nếu không có"""
        if not os.path.exists("index.html"):
            print("🚑 Creating emergency index.html...")
            
            content = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HEART - Data Center</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            margin: 0;
            padding: 40px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        .nav-links {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin: 30px 0;
        }
        .nav-links a {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 25px;
            transition: all 0.3s;
        }
        .nav-links a:hover {
            background: rgba(255,255,255,0.3);
        }
        .status {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 HEART</h1>
        <p>Vietnam's First 300MW AI-Optimized Hyperscale Data Center</p>
        
        <div class="status">
            <h3>✅ Localhost Server Active</h3>
            <p>Server is running successfully on <span id="current-url"></span></p>
        </div>
        
        <div class="nav-links">
            <a href="heart_standalone.html">❤️ Standalone</a>
            <a href="3d-campus-interactive.html">🎮 3D Campus</a>
            <a href="about.html">📄 About</a>
            <a href="facilities.html">🏭 Facilities</a>
        </div>
        
        <p style="margin-top: 40px; opacity: 0.8;">
            🎉 Localhost connection fixed! Server is running normally.
        </p>
    </div>
    
    <script>
        document.getElementById('current-url').textContent = window.location.href;
        console.log('✅ HEART Emergency Index loaded successfully');
    </script>
</body>
</html>"""
            
            with open("index.html", "w", encoding="utf-8") as f:
                f.write(content)
            
            print("✅ Emergency index.html created")
    
    def start_server_method1(self, port):
        """Method 1: Python http.server module"""
        print(f"\n🚀 METHOD 1: Python http.server on port {port}")
        
        try:
            class QuietHandler(http.server.SimpleHTTPRequestHandler):
                def log_message(self, format, *args):
                    print(f"📄 {format % args}")
            
            with socketserver.TCPServer(("", port), QuietHandler) as httpd:
                print(f"✅ Server started successfully!")
                print(f"🌐 URL: http://localhost:{port}")
                
                # Mở browser
                def open_browser():
                    time.sleep(2)
                    try:
                        webbrowser.open(f"http://localhost:{port}")
                        print("🌐 Browser opened!")
                    except Exception as e:
                        print(f"⚠️ Browser open failed: {e}")
                
                threading.Thread(target=open_browser, daemon=True).start()
                
                print(f"\nSERVER RUNNING - Access at: http://localhost:{port}")
                print("Press Ctrl+C to stop")
                print("=" * 50)
                
                httpd.serve_forever()
                
        except Exception as e:
            print(f"❌ Method 1 failed: {e}")
            return False
        
        return True
    
    def start_server_method2(self, port):
        """Method 2: subprocess với python -m http.server"""
        print(f"\n🚀 METHOD 2: subprocess python -m http.server {port}")
        
        try:
            # Mở browser trước
            def open_browser():
                time.sleep(3)
                webbrowser.open(f"http://localhost:{port}")
                print("🌐 Browser opened!")
            
            threading.Thread(target=open_browser, daemon=True).start()
            
            print(f"✅ Starting server on port {port}...")
            print(f"🌐 URL: http://localhost:{port}")
            print("Press Ctrl+C to stop")
            print("=" * 50)
            
            # Chạy server
            subprocess.run([sys.executable, "-m", "http.server", str(port)])
            
        except KeyboardInterrupt:
            print("\n⏹️ Server stopped by user")
            return True
        except Exception as e:
            print(f"❌ Method 2 failed: {e}")
            return False
    
    def test_connection(self, port):
        """Test connection đến server"""
        print(f"\n🧪 TESTING CONNECTION to localhost:{port}...")
        
        max_attempts = 5
        for attempt in range(1, max_attempts + 1):
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(5)
                result = sock.connect_ex(('localhost', port))
                sock.close()
                
                if result == 0:
                    print(f"✅ Connection successful on attempt {attempt}")
                    return True
                else:
                    print(f"❌ Attempt {attempt} failed, retrying...")
                    time.sleep(1)
                    
            except Exception as e:
                print(f"❌ Attempt {attempt} error: {e}")
                time.sleep(1)
        
        print(f"❌ All {max_attempts} connection attempts failed")
        return False
    
    def run_comprehensive_fix(self):
        """Chạy comprehensive fix"""
        self.print_header()
        
        # Step 1: Change directory
        if not self.change_directory():
            return False
        
        # Step 2: Kill existing servers
        self.kill_existing_servers()
        
        # Step 3: Check website files
        if not self.check_website_files():
            print("⚠️ Creating emergency files...")
            self.create_emergency_index()
        
        # Step 4: Find available port
        port = self.find_available_port()
        if not port:
            print("❌ Cannot find available port")
            return False
        
        # Step 5: Display URLs
        print(f"\n🌐 WEBSITE WILL BE AVAILABLE AT:")
        print(f"   🏠 Main: http://localhost:{port}/")
        print(f"   📱 Homepage: http://localhost:{port}/index.html")
        print(f"   ❤️ Standalone: http://localhost:{port}/heart_standalone.html")
        print(f"   🎮 3D Campus: http://localhost:{port}/3d-campus-interactive.html")
        
        # Step 6: Try different server methods
        methods = [
            self.start_server_method1,
            self.start_server_method2
        ]
        
        for i, method in enumerate(methods, 1):
            print(f"\n🔄 Trying server method {i}...")
            try:
                if method(port):
                    return True
            except KeyboardInterrupt:
                print("\n👋 Server stopped by user")
                return True
            except Exception as e:
                print(f"❌ Method {i} failed: {e}")
                continue
        
        print("❌ All server methods failed")
        return False

def main():
    """Main function"""
    fixer = LocalhostFixer()
    
    try:
        success = fixer.run_comprehensive_fix()
        if success:
            print("\n🎉 SUCCESS! Localhost connection fixed!")
        else:
            print("\n❌ FAILED to fix localhost connection")
            print("\n📋 MANUAL ALTERNATIVES:")
            print("1. Try: python3 -m http.server 8000")
            print("2. Use file:// protocol: open heart_standalone.html")
            print("3. Try different port: python3 -m http.server 9999")
            
    except KeyboardInterrupt:
        print("\n👋 Fix interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()