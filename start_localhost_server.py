#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys
import threading
import time

def start_server():
    """Start the HTTP server"""
    PORT = 8000
    
    # Change to the website directory
    os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')
    
    # Create server
    Handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"✅ HEART Website Server is running!")
            print(f"📍 Serving at: http://localhost:{PORT}")
            print("\n🌐 Available URLs:")
            print(f"   • Main site: http://localhost:{PORT}/")
            print(f"   • Homepage: http://localhost:{PORT}/index.html")
            print(f"   • Standalone: http://localhost:{PORT}/heart_standalone.html")
            print(f"   • 3D Campus: http://localhost:{PORT}/3d-campus-interactive.html")
            print(f"   • About: http://localhost:{PORT}/about.html")
            print(f"   • Facilities: http://localhost:{PORT}/facilities.html")
            print(f"   • Master Plan: http://localhost:{PORT}/master-plan.html")
            print(f"   • Contact: http://localhost:{PORT}/contact.html")
            print("\n🚀 Server is ready! Press Ctrl+C to stop")
            
            # Auto-open browser after a short delay
            def open_browser():
                time.sleep(2)
                webbrowser.open(f'http://localhost:{PORT}')
            
            browser_thread = threading.Thread(target=open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            httpd.serve_forever()
            
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Port {PORT} is already in use!")
            print("Trying port 8001...")
            try:
                PORT = 8001
                with socketserver.TCPServer(("", PORT), Handler) as httpd:
                    print(f"✅ HEART Website Server is running on port {PORT}!")
                    print(f"📍 Serving at: http://localhost:{PORT}")
                    print("\n🌐 Available URLs:")
                    print(f"   • Main site: http://localhost:{PORT}/")
                    print(f"   • Homepage: http://localhost:{PORT}/index.html")
                    print(f"   • Standalone: http://localhost:{PORT}/heart_standalone.html")
                    print(f"   • 3D Campus: http://localhost:{PORT}/3d-campus-interactive.html")
                    
                    # Auto-open browser
                    def open_browser():
                        time.sleep(2)
                        webbrowser.open(f'http://localhost:{PORT}')
                    
                    browser_thread = threading.Thread(target=open_browser)
                    browser_thread.daemon = True
                    browser_thread.start()
                    
                    httpd.serve_forever()
            except:
                print("❌ Could not start server on any port!")
                sys.exit(1)
        else:
            print(f"❌ Error starting server: {e}")
            sys.exit(1)

if __name__ == "__main__":
    start_server()