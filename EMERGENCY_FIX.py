#!/usr/bin/env python3
"""
HEART Technology Park - EMERGENCY FIX for ERR_CONNECTION_REFUSED
Bulletproof server startup with complete error handling
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import os
import sys
import subprocess
import signal
from pathlib import Path

# Configuration
PROJECT_DIR = Path('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')
PORTS_TO_TRY = [8000, 3000, 8080, 5000, 9000, 4000, 7000, 6000]
HOST = 'localhost'

class EmergencyHTTPHandler(http.server.SimpleHTTPRequestHandler):
    """Ultra-reliable HTTP handler"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_DIR), **kwargs)
    
    def end_headers(self):
        # Add all necessary headers for modern browsers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()
    
    def guess_type(self, path):
        """Fix MIME types"""
        mime_map = {
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.html': 'text/html; charset=utf-8',
            '.json': 'application/json'
        }
        
        for ext, mime in mime_map.items():
            if path.endswith(ext):
                return mime, None
        
        return super().guess_type(path)
    
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"🌐 {time.strftime('%H:%M:%S')} - {args[0]} - {args[1]}")

def print_banner():
    """Print emergency fix banner"""
    print("🚨" * 30)
    print("🚨 HEART TECHNOLOGY PARK - EMERGENCY FIX")
    print("🚨 Fixing ERR_CONNECTION_REFUSED")
    print("🚨" * 30)
    print()

def check_python_version():
    """Verify Python version"""
    version = sys.version_info
    print(f"🐍 Python Version: {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3:
        print("❌ Python 3 required! Current version is too old.")
        return False
    
    print("✅ Python version OK")
    return True

def check_project_directory():
    """Verify project directory exists"""
    print(f"📁 Checking project directory: {PROJECT_DIR}")
    
    if not PROJECT_DIR.exists():
        print(f"❌ Project directory not found: {PROJECT_DIR}")
        return False
    
    # Check key files
    key_files = ['about.html', 'index.html']
    missing_files = []
    
    for file in key_files:
        file_path = PROJECT_DIR / file
        if file_path.exists():
            print(f"✅ {file} found")
        else:
            missing_files.append(file)
            print(f"❌ {file} missing")
    
    if missing_files:
        print(f"⚠️  Warning: {len(missing_files)} files missing")
        print("Server will still work, but some pages may not load")
    
    return True

def kill_existing_servers():
    """Aggressively kill existing servers"""
    print("🧹 Killing existing servers on all ports...")
    
    for port in PORTS_TO_TRY:
        try:
            # Use lsof to find processes
            result = subprocess.run(
                ['lsof', '-ti', f':{port}'], 
                capture_output=True, 
                text=True,
                timeout=5
            )
            
            if result.stdout.strip():
                pids = result.stdout.strip().split('\n')
                for pid in pids:
                    try:
                        subprocess.run(['kill', '-9', pid], timeout=2)
                        print(f"🔪 Killed process {pid} on port {port}")
                    except:
                        pass
        except:
            pass
    
    print("✅ Port cleanup complete")

def test_port_availability(port):
    """Test if port is truly available"""
    import socket
    
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            s.bind((HOST, port))
            return True
    except OSError:
        return False

def find_working_port():
    """Find the first available port"""
    print("🔍 Finding available port...")
    
    for port in PORTS_TO_TRY:
        if test_port_availability(port):
            print(f"✅ Port {port} is available")
            return port
        else:
            print(f"❌ Port {port} is busy")
    
    print("💥 No ports available! This is a critical error.")
    return None

def start_server_safely(port):
    """Start server with complete error handling"""
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            print(f"🚀 Starting server on port {port} (attempt {attempt + 1}/{max_retries})...")
            
            # Create server
            httpd = socketserver.TCPServer((HOST, port), EmergencyHTTPHandler)
            httpd.allow_reuse_address = True
            
            print("✅ Server created successfully")
            return httpd, port
            
        except OSError as e:
            print(f"❌ Server start failed: {e}")
            
            if attempt < max_retries - 1:
                print("🔄 Retrying in 2 seconds...")
                time.sleep(2)
                kill_existing_servers()
            else:
                print("💥 All retry attempts failed!")
                return None, None
        
        except Exception as e:
            print(f"💥 Unexpected error: {e}")
            return None, None
    
    return None, None

def open_browser_emergency(port):
    """Emergency browser opening with multiple attempts"""
    def delayed_open():
        print("⏳ Waiting for server to stabilize...")
        time.sleep(4)  # Extra time for server stability
        
        test_urls = [
            f'http://{HOST}:{port}/QUICK_TEST.html',
            f'http://{HOST}:{port}/about.html',
            f'http://{HOST}:{port}/test-nuclear-final.html'
        ]
        
        print("🌐 Opening browser tabs...")
        
        for i, url in enumerate(test_urls, 1):
            try:
                print(f"Opening tab {i}: {url}")
                webbrowser.open(url)
                time.sleep(1.5)  # Stagger opening
                print(f"✅ Tab {i} opened")
            except Exception as e:
                print(f"❌ Failed to open tab {i}: {e}")
        
        print()
        print("🎯 NUCLEAR GRADIENT REMOVAL TEST:")
        print("   💥 About page - Auto-activates after 1 second")
        print("   🧪 Quick test page - Interactive buttons")
        print()
        print("🔧 Browser Console Commands:")
        print("   window.nuclearGradientRemoval() - Apply nuclear mode")
        print("   window.toggleNuclearMode() - Toggle mode")
        print("   window.debugBuilding() - Debug info")
        print()
        print("🎨 Expected Results:")
        print("   ✅ Pure white background (no gradients)")
        print("   ✅ Enhanced HEART building with blue glow")
        print("   ✅ Building 8% larger with enhanced contrast")
    
    # Start browser opening in background thread
    browser_thread = threading.Thread(target=delayed_open)
    browser_thread.daemon = True
    browser_thread.start()

def test_server_connectivity(port):
    """Test if server is actually accessible"""
    import urllib.request
    import urllib.error
    
    test_url = f'http://{HOST}:{port}/'
    
    print(f"🧪 Testing server connectivity: {test_url}")
    
    max_attempts = 10
    for attempt in range(max_attempts):
        try:
            response = urllib.request.urlopen(test_url, timeout=3)
            if response.status == 200:
                print("✅ Server is accessible!")
                return True
        except urllib.error.URLError:
            if attempt < max_attempts - 1:
                print(f"⏳ Attempt {attempt + 1}/{max_attempts} - waiting...")
                time.sleep(1)
            else:
                print("❌ Server connectivity test failed!")
                return False
        except Exception as e:
            print(f"❌ Connectivity test error: {e}")
            return False
    
    return False

def emergency_fix_main():
    """Main emergency fix function"""
    print_banner()
    
    # Step 1: Check Python
    if not check_python_version():
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Step 2: Check project directory
    if not check_project_directory():
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Step 3: Navigate to project directory
    try:
        os.chdir(PROJECT_DIR)
        print(f"✅ Changed to directory: {os.getcwd()}")
    except Exception as e:
        print(f"❌ Cannot change directory: {e}")
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Step 4: Kill existing servers
    kill_existing_servers()
    
    # Step 5: Find working port
    port = find_working_port()
    if not port:
        print("💥 CRITICAL: No available ports found!")
        print("🔧 Manual fix: Close other applications using ports 3000-9000")
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Step 6: Start server
    httpd, final_port = start_server_safely(port)
    if not httpd:
        print("💥 CRITICAL: Cannot start server!")
        print("🔧 Try running as administrator or check firewall settings")
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Step 7: Test connectivity
    if not test_server_connectivity(final_port):
        print("💥 CRITICAL: Server started but not accessible!")
        print("🔧 Check firewall or network settings")
        httpd.server_close()
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Step 8: Success! Open browser
    print("🎉" * 30)
    print("🎉 SUCCESS! Server is running and accessible!")
    print("🎉" * 30)
    print()
    print(f"📍 Server URL: http://{HOST}:{final_port}/")
    print("🌐 Browser will open automatically...")
    print()
    print("💥 NUCLEAR GRADIENT REMOVAL READY!")
    print("🎯 Test on About page - auto-activates after 1 second")
    print("🧪 Manual testing available on Quick Test page")
    print()
    print(f"🔧 Server running on port {final_port} - Press Ctrl+C to stop")
    print("=" * 60)
    
    # Open browser
    open_browser_emergency(final_port)
    
    # Start serving
    try:
        print("📡 Server logs:")
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"\n💥 Server error: {e}")
    finally:
        httpd.server_close()
        print("✅ Server shutdown complete")

if __name__ == '__main__':
    try:
        emergency_fix_main()
    except KeyboardInterrupt:
        print("\n✅ Emergency fix interrupted. Goodbye!")
    except Exception as e:
        print(f"\n💥 Emergency fix failed: {e}")
        print("🔧 Try running with administrator privileges")
    finally:
        input("\nPress Enter to close...")
        sys.exit(0)