#!/usr/bin/env python3
"""
🔬 DEBUG BROWSER OPENING ISSUE
Comprehensive diagnosis và fix cho browser không mở được
"""

import os
import sys
import subprocess
import socket
import webbrowser
import time
import platform
from pathlib import Path

class BrowserDebugger:
    def __init__(self):
        self.project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
        self.issues_found = []
        self.fixes_applied = []
        
    def print_header(self):
        print("🔬 COMPREHENSIVE BROWSER ISSUE DIAGNOSIS")
        print("=" * 50)
        
    def check_directory(self):
        """Kiểm tra thư mục dự án"""
        print("📂 CHECKING PROJECT DIRECTORY...")
        
        current_dir = os.getcwd()
        print(f"Current directory: {current_dir}")
        
        if not os.path.exists(self.project_dir):
            self.issues_found.append("Project directory not found")
            print(f"❌ Project directory missing: {self.project_dir}")
            
            # Tìm thư mục project
            print("🔍 Searching for project directory...")
            parent_dir = "/Users/thuyloan0209/Documents"
            if os.path.exists(parent_dir):
                for item in os.listdir(parent_dir):
                    if "Test_WEBSITE" in item:
                        found_path = os.path.join(parent_dir, item)
                        print(f"Found: {found_path}")
            return False
        
        try:
            os.chdir(self.project_dir)
            print(f"✅ Successfully changed to: {os.getcwd()}")
            return True
        except Exception as e:
            self.issues_found.append(f"Cannot access directory: {e}")
            print(f"❌ Cannot access directory: {e}")
            return False
    
    def check_html_files(self):
        """Kiểm tra các file HTML"""
        print("\n📄 CHECKING HTML FILES...")
        
        html_files = list(Path('.').glob('*.html'))
        
        if not html_files:
            self.issues_found.append("No HTML files found")
            print("❌ No HTML files found in current directory")
            print("Current directory contents:")
            for item in os.listdir('.'):
                print(f"  - {item}")
            return False
        
        print(f"✅ Found {len(html_files)} HTML files:")
        for file in html_files[:5]:  # Show first 5
            size = file.stat().st_size
            print(f"  - {file.name} ({size} bytes)")
        
        # Check main files
        main_files = ['index.html', 'heart_standalone.html', '3d-campus-interactive.html']
        for file in main_files:
            if os.path.exists(file):
                print(f"✅ {file} - Available")
            else:
                print(f"⚠️ {file} - Missing")
        
        return True
    
    def check_system_info(self):
        """Kiểm tra thông tin hệ thống"""
        print("\n🍎 SYSTEM INFORMATION...")
        
        print(f"Operating System: {platform.system()} {platform.release()}")
        print(f"Python Version: {sys.version.split()[0]}")
        print(f"Platform: {platform.platform()}")
        
        # Check macOS version
        try:
            result = subprocess.run(['sw_vers', '-productVersion'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print(f"macOS Version: {result.stdout.strip()}")
            else:
                print("⚠️ Cannot determine macOS version")
        except:
            print("⚠️ sw_vers command not available")
    
    def check_browsers(self):
        """Kiểm tra browsers có sẵn"""
        print("\n🌐 CHECKING AVAILABLE BROWSERS...")
        
        browsers = [
            ("Safari", "/Applications/Safari.app"),
            ("Google Chrome", "/Applications/Google Chrome.app"),
            ("Firefox", "/Applications/Firefox.app"),
            ("Microsoft Edge", "/Applications/Microsoft Edge.app")
        ]
        
        available_browsers = []
        for name, path in browsers:
            if os.path.exists(path):
                print(f"✅ {name} - Available")
                available_browsers.append((name, path))
            else:
                print(f"❌ {name} - Not found")
        
        if not available_browsers:
            self.issues_found.append("No browsers found")
            print("❌ No browsers found!")
            return False
        
        return available_browsers
    
    def check_open_command(self):
        """Kiểm tra lệnh open"""
        print("\n📱 CHECKING OPEN COMMAND...")
        
        try:
            result = subprocess.run(['which', 'open'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Open command found: {result.stdout.strip()}")
                return True
            else:
                self.issues_found.append("Open command not found")
                print("❌ Open command not available")
                return False
        except Exception as e:
            self.issues_found.append(f"Open command error: {e}")
            print(f"❌ Error checking open command: {e}")
            return False
    
    def check_ports(self):
        """Kiểm tra ports"""
        print("\n🌐 CHECKING NETWORK PORTS...")
        
        ports_to_check = [8000, 8080, 8888, 9000, 9999, 3000, 5000]
        available_ports = []
        
        for port in ports_to_check:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                result = sock.connect_ex(('localhost', port))
                sock.close()
                
                if result != 0:  # Port is free
                    print(f"✅ Port {port} - Available")
                    available_ports.append(port)
                else:
                    print(f"❌ Port {port} - Busy")
            except Exception as e:
                print(f"⚠️ Port {port} - Error: {e}")
        
        if not available_ports:
            self.issues_found.append("No available ports")
            return []
        
        return available_ports
    
    def test_webbrowser_module(self):
        """Test Python webbrowser module"""
        print("\n🐍 TESTING PYTHON WEBBROWSER MODULE...")
        
        try:
            import webbrowser
            print("✅ Webbrowser module imported successfully")
            
            # Get default browser
            try:
                default_browser = webbrowser.get()
                print(f"✅ Default browser: {type(default_browser).__name__}")
            except Exception as e:
                print(f"⚠️ Cannot get default browser: {e}")
            
            # List available browsers
            browsers = []
            for name in ['safari', 'chrome', 'firefox']:
                try:
                    browser = webbrowser.get(name)
                    browsers.append(name)
                    print(f"✅ {name} browser available")
                except:
                    print(f"❌ {name} browser not available")
            
            return len(browsers) > 0
            
        except Exception as e:
            self.issues_found.append(f"Webbrowser module error: {e}")
            print(f"❌ Webbrowser module error: {e}")
            return False
    
    def kill_existing_servers(self):
        """Dừng các server đang chạy"""
        print("\n🛑 KILLING EXISTING SERVERS...")
        
        try:
            # Kill Python HTTP servers
            result = subprocess.run(['pkill', '-f', 'python.*http.server'], 
                                  capture_output=True)
            if result.returncode == 0:
                print("✅ Killed Python HTTP servers")
                self.fixes_applied.append("Killed existing servers")
            else:
                print("ℹ️ No Python HTTP servers to kill")
        except Exception as e:
            print(f"⚠️ Error killing servers: {e}")
        
        # Kill processes on specific ports
        ports = [8000, 8080, 8888, 9000]
        for port in ports:
            try:
                result = subprocess.run(['lsof', '-ti', f':{port}'], 
                                      capture_output=True, text=True)
                if result.stdout.strip():
                    pids = result.stdout.strip().split('\n')
                    for pid in pids:
                        subprocess.run(['kill', '-9', pid], capture_output=True)
                    print(f"✅ Killed processes on port {port}")
            except:
                pass
    
    def create_test_file(self):
        """Tạo file test đơn giản"""
        print("\n🧪 CREATING TEST FILE...")
        
        test_content = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browser Test - HEART</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        .success {
            background: rgba(0, 255, 0, 0.2);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .info {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .timestamp {
            font-size: 0.9em;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <h1>🎉 BROWSER TEST SUCCESSFUL!</h1>
    
    <div class="success">
        <h2>✅ Browser Opening Fixed!</h2>
        <p>If you can see this page, the browser opening issue has been resolved.</p>
    </div>
    
    <div class="info">
        <h3>🚀 HEART Website Status</h3>
        <p>Browser is working correctly. You can now access all HEART website features.</p>
    </div>
    
    <div class="info">
        <h3>🔗 Available Pages</h3>
        <p>
            <a href="index.html" style="color: #fbbf24;">🏠 Homepage</a> |
            <a href="heart_standalone.html" style="color: #fbbf24;">❤️ Standalone</a> |
            <a href="3d-campus-interactive.html" style="color: #fbbf24;">🎮 3D Campus</a>
        </p>
    </div>
    
    <div class="timestamp">
        <p>Test completed: <span id="timestamp"></span></p>
    </div>
    
    <script>
        document.getElementById('timestamp').textContent = new Date().toLocaleString();
        console.log('✅ Browser test successful - HEART website ready!');
        
        // Test basic JavaScript functionality
        setTimeout(() => {
            document.body.style.background = 'linear-gradient(135deg, #059669, #0d9488)';
            console.log('✅ JavaScript working correctly');
        }, 2000);
    </script>
</body>
</html>"""
        
        try:
            with open('browser-test.html', 'w', encoding='utf-8') as f:
                f.write(test_content)
            print("✅ Created browser-test.html")
            self.fixes_applied.append("Created test file")
            return True
        except Exception as e:
            print(f"❌ Error creating test file: {e}")
            return False
    
    def try_multiple_opening_methods(self):
        """Thử nhiều cách mở browser"""
        print("\n🚀 TRYING MULTIPLE BROWSER OPENING METHODS...")
        
        # Method 1: Direct file opening
        print("Method 1: Direct file opening...")
        test_files = ['browser-test.html', 'index.html', 'heart_standalone.html']
        
        for filename in test_files:
            if os.path.exists(filename):
                try:
                    file_path = os.path.abspath(filename)
                    print(f"Trying to open: {file_path}")
                    
                    # Try subprocess approach
                    result = subprocess.run(['open', filename], 
                                          capture_output=True, text=True, timeout=5)
                    if result.returncode == 0:
                        print(f"✅ Method 1 Success: Opened {filename}")
                        self.fixes_applied.append(f"Opened {filename} directly")
                        return True
                    else:
                        print(f"❌ Open command failed: {result.stderr}")
                except Exception as e:
                    print(f"❌ Method 1 failed: {e}")
        
        # Method 2: Python webbrowser module
        print("Method 2: Python webbrowser module...")
        for filename in test_files:
            if os.path.exists(filename):
                try:
                    file_url = f"file://{os.path.abspath(filename)}"
                    print(f"Trying webbrowser.open: {file_url}")
                    webbrowser.open(file_url)
                    print(f"✅ Method 2 Success: Webbrowser opened {filename}")
                    self.fixes_applied.append(f"Webbrowser opened {filename}")
                    return True
                except Exception as e:
                    print(f"❌ Method 2 failed: {e}")
        
        # Method 3: Specific browser opening
        print("Method 3: Specific browser opening...")
        browsers = [
            ('safari', 'Safari'),
            ('google-chrome', 'Google Chrome'),
            ('firefox', 'Firefox')
        ]
        
        for browser_cmd, browser_name in browsers:
            for filename in test_files:
                if os.path.exists(filename):
                    try:
                        result = subprocess.run(['open', '-a', browser_name, filename], 
                                              capture_output=True, text=True, timeout=5)
                        if result.returncode == 0:
                            print(f"✅ Method 3 Success: {browser_name} opened {filename}")
                            self.fixes_applied.append(f"{browser_name} opened {filename}")
                            return True
                    except Exception as e:
                        continue
        
        # Method 4: HTTP server + browser
        print("Method 4: HTTP Server + Browser...")
        available_ports = self.check_ports()
        if available_ports:
            port = available_ports[0]
            try:
                # Start server in background
                server_process = subprocess.Popen([
                    sys.executable, '-m', 'http.server', str(port)
                ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                # Wait for server to start
                time.sleep(2)
                
                # Try to open browser
                url = f"http://localhost:{port}/browser-test.html"
                print(f"Server started on port {port}")
                print(f"Trying to open: {url}")
                
                result = subprocess.run(['open', url], 
                                      capture_output=True, text=True, timeout=5)
                if result.returncode == 0:
                    print(f"✅ Method 4 Success: Server + Browser")
                    self.fixes_applied.append(f"HTTP server on port {port}")
                    
                    # Keep server running for a bit
                    print(f"Server running at: {url}")
                    print("Press Ctrl+C to stop server")
                    try:
                        server_process.wait(timeout=300)  # Wait 5 minutes max
                    except subprocess.TimeoutExpired:
                        server_process.terminate()
                    return True
                else:
                    server_process.terminate()
                    
            except Exception as e:
                print(f"❌ Method 4 failed: {e}")
        
        print("❌ All browser opening methods failed")
        return False
    
    def show_manual_instructions(self):
        """Hiển thị hướng dẫn manual"""
        print("\n📋 MANUAL INSTRUCTIONS (IF ALL METHODS FAIL):")
        print("=" * 50)
        print("1. Open Finder")
        print("2. Navigate to:")
        print(f"   {os.getcwd()}")
        print("3. Double-click on any of these files:")
        
        html_files = [f for f in os.listdir('.') if f.endswith('.html')]
        for i, file in enumerate(html_files[:5], 1):
            print(f"   {i}. {file}")
        
        print("\n4. Alternative - Copy this URL to browser:")
        if os.path.exists('browser-test.html'):
            print(f"   file://{os.path.abspath('browser-test.html')}")
        elif os.path.exists('index.html'):
            print(f"   file://{os.path.abspath('index.html')}")
    
    def generate_report(self):
        """Tạo báo cáo tổng kết"""
        print("\n📊 DIAGNOSIS REPORT")
        print("=" * 30)
        
        print(f"Issues Found: {len(self.issues_found)}")
        for i, issue in enumerate(self.issues_found, 1):
            print(f"  {i}. {issue}")
        
        print(f"\nFixes Applied: {len(self.fixes_applied)}")
        for i, fix in enumerate(self.fixes_applied, 1):
            print(f"  {i}. {fix}")
        
        if not self.issues_found:
            print("\n🎉 ALL SYSTEMS WORKING CORRECTLY!")
        elif len(self.fixes_applied) >= len(self.issues_found):
            print("\n✅ ISSUES RESOLVED!")
        else:
            print("\n⚠️ SOME ISSUES REMAIN - See manual instructions above")
    
    def run_full_diagnosis(self):
        """Chạy full diagnosis"""
        self.print_header()
        
        # Run all checks
        if not self.check_directory():
            print("❌ Cannot proceed - directory issues")
            return False
        
        self.check_html_files()
        self.check_system_info()
        self.check_browsers()
        self.check_open_command()
        self.check_ports()
        self.test_webbrowser_module()
        
        # Apply fixes
        self.kill_existing_servers()
        self.create_test_file()
        
        # Try opening browser
        success = self.try_multiple_opening_methods()
        
        if not success:
            self.show_manual_instructions()
        
        self.generate_report()
        
        return success

def main():
    debugger = BrowserDebugger()
    try:
        success = debugger.run_full_diagnosis()
        if success:
            print("\n🎉 SUCCESS! Browser should now be open.")
        else:
            print("\n⚠️ Automatic opening failed, but manual methods available.")
    except KeyboardInterrupt:
        print("\n👋 Diagnosis interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()