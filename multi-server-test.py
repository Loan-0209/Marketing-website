#!/usr/bin/env python3
"""
Multi-Server Test - Thử nhiều loại server khác nhau
"""

import os
import sys
import subprocess
import socket
import time
import webbrowser
import threading
from pathlib import Path

def print_method(num, name, color="🔵"):
    print(f"\n{color} Method {num}: {name}")
    print("-" * 50)

def test_port(port):
    """Test if port is available"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex(('localhost', port))
        sock.close()
        return result == 0
    except:
        return False

def method1_nodejs():
    """Node.js http-server"""
    print_method(1, "Node.js http-server", "🟢")
    
    # Check if node exists
    try:
        subprocess.run(["node", "--version"], capture_output=True, check=True)
        print("✅ Node.js found")
    except:
        print("❌ Node.js not available")
        return False
    
    # Try to install and run http-server
    try:
        print("🔄 Installing http-server...")
        subprocess.run(["npm", "install", "-g", "http-server"], 
                      capture_output=True, timeout=30)
        
        print("🚀 Starting Node.js server on port 8000...")
        process = subprocess.Popen([
            "npx", "http-server", "-p", "8000", "--cors"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        time.sleep(3)
        
        if test_port(8000):
            print("✅ Node.js server is running!")
            webbrowser.open("http://localhost:8000/")
            return process
        else:
            process.terminate()
            print("❌ Node.js server failed to start")
            return False
            
    except Exception as e:
        print(f"❌ Node.js server error: {e}")
        return False

def method2_ruby():
    """Ruby WEBrick server"""
    print_method(2, "Ruby WEBrick server", "🔴")
    
    try:
        subprocess.run(["ruby", "--version"], capture_output=True, check=True)
        print("✅ Ruby found")
    except:
        print("❌ Ruby not available")
        return False
    
    try:
        print("🚀 Starting Ruby server on port 8001...")
        process = subprocess.Popen([
            "ruby", "-run", "-ehttpd", ".", "-p8001"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        time.sleep(3)
        
        if test_port(8001):
            print("✅ Ruby server is running!")
            webbrowser.open("http://localhost:8001/")
            return process
        else:
            process.terminate()
            print("❌ Ruby server failed to start")
            return False
            
    except Exception as e:
        print(f"❌ Ruby server error: {e}")
        return False

def method3_php():
    """PHP built-in server"""
    print_method(3, "PHP built-in server", "🟠") 
    
    try:
        subprocess.run(["php", "--version"], capture_output=True, check=True)
        print("✅ PHP found")
    except:
        print("❌ PHP not available")
        return False
    
    try:
        print("🚀 Starting PHP server on port 8002...")
        process = subprocess.Popen([
            "php", "-S", "localhost:8002"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        time.sleep(3)
        
        if test_port(8002):
            print("✅ PHP server is running!")
            webbrowser.open("http://localhost:8002/")
            return process
        else:
            process.terminate()
            print("❌ PHP server failed to start")
            return False
            
    except Exception as e:
        print(f"❌ PHP server error: {e}")
        return False

def method4_python_alt():
    """Python with alternative binding"""
    print_method(4, "Python alternative binding", "🐍")
    
    try:
        import http.server
        import socketserver
        
        class QuietHandler(http.server.SimpleHTTPRequestHandler):
            def log_message(self, format, *args):
                print(f"📄 {format % args}")
        
        print("🚀 Starting Python server on 127.0.0.1:8003...")
        
        def run_server():
            with socketserver.TCPServer(('127.0.0.1', 8003), QuietHandler) as httpd:
                httpd.serve_forever()
        
        server_thread = threading.Thread(target=run_server)
        server_thread.daemon = True
        server_thread.start()
        
        time.sleep(2)
        
        if test_port(8003):
            print("✅ Python alternative server is running!")
            webbrowser.open("http://127.0.0.1:8003/")
            return server_thread
        else:
            print("❌ Python alternative server failed")
            return False
            
    except Exception as e:
        print(f"❌ Python alternative error: {e}")
        return False

def method5_direct_file():
    """Direct file opening"""
    print_method(5, "Direct file opening", "📁")
    
    try:
        # Check if standalone file exists
        standalone_file = Path("heart_standalone.html")
        if standalone_file.exists():
            file_url = f"file://{standalone_file.absolute()}"
            print(f"🚀 Opening file directly: {file_url}")
            webbrowser.open(file_url)
            print("✅ File opened successfully!")
            return True
        else:
            print("❌ Standalone file not found")
            return False
            
    except Exception as e:
        print(f"❌ Direct file error: {e}")
        return False

def main():
    """Main function - try all methods"""
    print("🔄 MULTI-SERVER TEST")
    print("Trying different server approaches")
    print("=" * 60)
    
    # Change to project directory
    project_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    if os.path.exists(project_dir):
        os.chdir(project_dir)
        print(f"📁 Working in: {os.getcwd()}")
    else:
        print(f"❌ Project directory not found: {project_dir}")
        return
    
    # Try each method
    methods = [
        method1_nodejs,
        method2_ruby, 
        method3_php,
        method4_python_alt,
        method5_direct_file
    ]
    
    for method in methods:
        try:
            result = method()
            if result:
                print(f"\n🎉 SUCCESS with {method.__name__}!")
                
                if hasattr(result, 'terminate'):  # It's a process
                    print("🛑 Press Enter to stop server and try next method...")
                    input()
                    result.terminate()
                    print("✅ Server stopped")
                elif isinstance(result, threading.Thread):  # It's a thread
                    print("🛑 Press Enter to continue to next method...")
                    input()
                else:  # Direct file opening
                    print("📱 File opened directly, no server needed")
                    print("🛑 Press Enter to continue...")
                    input()
                
        except KeyboardInterrupt:
            print("\n🛑 Method interrupted by user")
            break
        except Exception as e:
            print(f"❌ Method failed: {e}")
            continue
    
    print("\n🏁 All methods tested!")
    print("If any method worked, you can use it to access your website.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n🛑 Test interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        import traceback
        traceback.print_exc()