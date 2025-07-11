#!/usr/bin/env python3
"""
HEART Technology Park - Fixed Local Server
Giải pháp đơn giản để sửa lỗi không thể truy cập trang web
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import os
import sys

# Configuration
PORT = 3000
HOST = 'localhost'
DIRECTORY = '/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18'

class FixedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler with proper headers and error handling"""
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def guess_type(self, path):
        """Override to fix MIME types"""
        mimetype, encoding = super().guess_type(path)
        if path.endswith('.js'):
            return 'application/javascript', encoding
        elif path.endswith('.css'):
            return 'text/css', encoding
        elif path.endswith('.html'):
            return 'text/html', encoding
        return mimetype, encoding
    
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"📡 {self.client_address[0]} - {args[0]} - {args[1]}")

def check_files():
    """Check if required files exist"""
    required_files = ['about.html', 'index.html', 'test-nuclear-final.html']
    missing_files = []
    
    for file in required_files:
        file_path = os.path.join(DIRECTORY, file)
        if not os.path.exists(file_path):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing files: {', '.join(missing_files)}")
        return False
    return True

def open_browser_delayed():
    """Open browser after server starts"""
    time.sleep(3)
    
    urls_to_open = [
        f'http://{HOST}:{PORT}/about.html',
        f'http://{HOST}:{PORT}/test-nuclear-final.html'
    ]
    
    print('🌐 Auto-opening browser tabs...')
    
    for i, url in enumerate(urls_to_open, 1):
        try:
            webbrowser.open(url)
            print(f'✅ Tab {i}: {url}')
            time.sleep(1)  # Delay between tabs
        except Exception as e:
            print(f'❌ Could not open {url}: {e}')
    
    print('🎯 Focus on About page to see Nuclear Gradient Removal!')

def start_server():
    """Start the HTTP server with error handling"""
    
    # Change to project directory
    if not os.path.exists(DIRECTORY):
        print(f"❌ Directory not found: {DIRECTORY}")
        sys.exit(1)
    
    os.chdir(DIRECTORY)
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Check files
    if not check_files():
        print("❌ Some required files are missing!")
        return
    
    # Try to start server with different ports if needed
    for port in [PORT, PORT + 1, PORT + 2, 8000, 8080]:
        try:
            with socketserver.TCPServer((HOST, port), FixedHTTPRequestHandler) as httpd:
                print('🚀 HEART Technology Park - Fixed Server Started!')
                print('=' * 70)
                print(f'📍 Server URL: http://{HOST}:{port}/')
                print('=' * 70)
                print('🌐 Available Pages:')
                print(f'   🏠 Home Page:        http://{HOST}:{port}/')
                print(f'   💥 About Page:       http://{HOST}:{port}/about.html')
                print(f'   🧪 Nuclear Test:     http://{HOST}:{port}/test-nuclear-final.html')
                print(f'   🏢 Master Plan:      http://{HOST}:{port}/master-plan.html')
                print(f'   🔐 Login:            http://{HOST}:{port}/login.html')
                print(f'   📰 News:             http://{HOST}:{port}/news.html')
                print(f'   📞 Contact:          http://{HOST}:{port}/contact.html')
                print('=' * 70)
                print('🎯 Nuclear Gradient Removal Features:')
                print('   💥 Auto-activates after 1 second on About page')
                print('   🎨 Pure white background')
                print('   🏢 Enhanced HEART building with 8% scale')
                print('   ✨ Glow effects and enhanced contrast')
                print('   🔧 Manual controls via browser console')
                print('=' * 70)
                print('💡 Browser Console Commands:')
                print('   window.nuclearGradientRemoval() - Apply nuclear mode')
                print('   window.toggleNuclearMode() - Toggle on/off')
                print('   window.debugBuilding() - Check building state')
                print('=' * 70)
                print(f'🔧 Server running on port {port} - Press Ctrl+C to stop')
                print('=' * 70)
                
                # Start browser opening in background thread
                browser_thread = threading.Thread(target=open_browser_delayed)
                browser_thread.daemon = True
                browser_thread.start()
                
                # Start server
                httpd.serve_forever()
                
        except OSError as e:
            if e.errno == 48:  # Address already in use
                print(f"⚠️  Port {port} is busy, trying {port + 1}...")
                continue
            else:
                print(f"❌ Server error on port {port}: {e}")
                continue
        except KeyboardInterrupt:
            print('\n🛑 Server stopped by user')
            break
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            break
    else:
        print("❌ Could not start server on any port!")

if __name__ == '__main__':
    print("🔧 HEART Technology Park - Server Fix Tool")
    print("🎯 Fixing website access issues...")
    print()
    
    try:
        start_server()
    except KeyboardInterrupt:
        print('\n✅ Server shutdown complete. Goodbye!')
    except Exception as e:
        print(f'❌ Fatal error: {e}')