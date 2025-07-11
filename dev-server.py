#!/usr/bin/env python3
"""
HEART Technology Park - Bulletproof Development Server
Fixes all browser access issues and local server problems
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import os
import sys
import urllib.parse
from pathlib import Path

# Configuration
DEFAULT_PORT = 8000
PROJECT_DIR = Path('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')
HOST = 'localhost'

class DevHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Enhanced HTTP handler that fixes all browser access issues"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_DIR), **kwargs)
    
    def end_headers(self):
        """Add security headers to fix CORS and browser restrictions"""
        # CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        
        # Security headers for modern browsers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        
        # Cache control for development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        
        super().end_headers()
    
    def guess_type(self, path):
        """Fix MIME types for proper browser handling"""
        base, ext = os.path.splitext(path)
        
        # Override MIME types for modern browsers
        mime_types = {
            '.js': 'application/javascript',
            '.mjs': 'application/javascript',
            '.css': 'text/css',
            '.html': 'text/html; charset=utf-8',
            '.json': 'application/json',
            '.svg': 'image/svg+xml',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.otf': 'font/otf',
            '.eot': 'application/vnd.ms-fontobject'
        }
        
        if ext.lower() in mime_types:
            return mime_types[ext.lower()], None
        
        return super().guess_type(path)
    
    def do_OPTIONS(self):
        """Handle preflight requests for CORS"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom logging with better formatting"""
        timestamp = time.strftime('%H:%M:%S')
        client_ip = self.client_address[0]
        
        # Color codes for better visibility
        if '200' in str(args):
            status_color = '\033[92m'  # Green
        elif '404' in str(args):
            status_color = '\033[91m'  # Red
        else:
            status_color = '\033[93m'  # Yellow
        
        reset_color = '\033[0m'
        
        print(f"📡 {timestamp} - {client_ip} - {status_color}{args[0]}{reset_color} - {args[1]} - {args[2]}")

def check_project_structure():
    """Verify project files exist"""
    print("🔍 Checking project structure...")
    
    required_files = [
        'about.html',
        'index.html', 
        'test-nuclear-final.html',
        'js/building-parallax-manager.js'
    ]
    
    missing_files = []
    existing_files = []
    
    for file_path in required_files:
        full_path = PROJECT_DIR / file_path
        if full_path.exists():
            existing_files.append(file_path)
            print(f"✅ {file_path}")
        else:
            missing_files.append(file_path)
            print(f"❌ {file_path} - MISSING")
    
    if missing_files:
        print(f"\n⚠️  Warning: {len(missing_files)} files missing, but server will still work")
    
    print(f"\n📊 Project Status: {len(existing_files)}/{len(required_files)} files found")
    return len(existing_files) > 0

def kill_existing_servers():
    """Kill any existing servers on common ports"""
    import subprocess
    
    ports = [8000, 3000, 8080, 5000]
    
    for port in ports:
        try:
            # Find processes using the port
            result = subprocess.run(['lsof', '-ti', f':{port}'], 
                                  capture_output=True, text=True)
            
            if result.stdout.strip():
                pids = result.stdout.strip().split('\n')
                for pid in pids:
                    subprocess.run(['kill', '-9', pid], capture_output=True)
                print(f"🧹 Cleared port {port}")
        except:
            pass

def find_available_port(start_port=8000):
    """Find an available port starting from the given port"""
    import socket
    
    for port in range(start_port, start_port + 100):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((HOST, port))
                return port
        except OSError:
            continue
    
    raise Exception("No available ports found")

def open_browser_tabs(port):
    """Open browser tabs with proper timing"""
    def delayed_open():
        time.sleep(3)  # Wait for server to fully start
        
        urls = [
            f'http://{HOST}:{port}/about.html',
            f'http://{HOST}:{port}/test-nuclear-final.html'
        ]
        
        print('\n🌐 Opening browser tabs...')
        
        for i, url in enumerate(urls, 1):
            try:
                webbrowser.open(url)
                print(f'✅ Tab {i}: {url}')
                time.sleep(1.5)  # Stagger tab opening
            except Exception as e:
                print(f'❌ Failed to open tab {i}: {e}')
        
        print('\n🎯 Nuclear Gradient Removal Test:')
        print('   💥 About page - Auto-activates after 1 second')
        print('   🧪 Test page - Manual controls available')
        print('\n🔧 Browser Console Commands:')
        print('   window.nuclearGradientRemoval() - Apply nuclear mode')
        print('   window.toggleNuclearMode() - Toggle on/off')
        print('   window.debugBuilding() - Check building state')
    
    # Start browser opening in background
    browser_thread = threading.Thread(target=delayed_open)
    browser_thread.daemon = True
    browser_thread.start()

def start_development_server():
    """Start the bulletproof development server"""
    
    print('🚀 HEART Technology Park - Development Server')
    print('=' * 60)
    
    # Change to project directory
    if not PROJECT_DIR.exists():
        print(f"❌ Project directory not found: {PROJECT_DIR}")
        sys.exit(1)
    
    os.chdir(PROJECT_DIR)
    print(f"📁 Working directory: {PROJECT_DIR}")
    
    # Check project structure
    if not check_project_structure():
        print("❌ No required files found!")
        sys.exit(1)
    
    # Clean up existing servers
    print("\n🧹 Cleaning up existing servers...")
    kill_existing_servers()
    
    # Find available port
    try:
        port = find_available_port(DEFAULT_PORT)
        print(f"\n🔌 Using port: {port}")
    except Exception as e:
        print(f"❌ Cannot find available port: {e}")
        sys.exit(1)
    
    # Start server
    try:
        with socketserver.TCPServer((HOST, port), DevHTTPRequestHandler) as httpd:
            print('=' * 60)
            print(f'📍 Server URL: http://{HOST}:{port}/')
            print('=' * 60)
            print('🌐 Available Pages:')
            print(f'   🏠 Home Page:        http://{HOST}:{port}/')
            print(f'   💥 About Page:       http://{HOST}:{port}/about.html')
            print(f'   🧪 Nuclear Test:     http://{HOST}:{port}/test-nuclear-final.html')
            print(f'   🏢 Master Plan:      http://{HOST}:{port}/master-plan.html')
            print(f'   📰 News:             http://{HOST}:{port}/news.html')
            print(f'   📞 Contact:          http://{HOST}:{port}/contact.html')
            print(f'   🔐 Login:            http://{HOST}:{port}/login.html')
            print('=' * 60)
            print('🔧 Server Features:')
            print('   ✅ CORS headers enabled')
            print('   ✅ Modern browser support')
            print('   ✅ No cache for development')
            print('   ✅ Proper MIME types')
            print('   ✅ Security headers')
            print('=' * 60)
            print('💥 Nuclear Gradient Removal:')
            print('   🎯 Auto-activates on About page after 1 second')
            print('   🎨 Pure white background')
            print('   🏢 Enhanced building with 8% scale increase')
            print('   ✨ Glow effects and enhanced contrast')
            print('=' * 60)
            print(f'🔧 Server running - Press Ctrl+C to stop')
            print('=' * 60)
            
            # Open browser tabs
            open_browser_tabs(port)
            
            # Start serving
            print('\n📡 Server logs:')
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print('\n🛑 Server stopped by user')
    except Exception as e:
        print(f'❌ Server error: {e}')
    finally:
        print('✅ Development server shutdown complete')

if __name__ == '__main__':
    try:
        start_development_server()
    except KeyboardInterrupt:
        print('\n✅ Goodbye!')
    except Exception as e:
        print(f'❌ Fatal error: {e}')
        sys.exit(1)