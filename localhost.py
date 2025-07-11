#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import threading
import time
import os

PORT = 3000
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom logging
        print(f"📡 {args[0]} - {args[1]} - {args[2]}")

def open_browser():
    """Open browser after server starts"""
    time.sleep(2)
    print('🌐 Auto-opening browser...')
    
    # Open About page first
    webbrowser.open(f'http://{HOST}:{PORT}/about.html')
    print('✅ About page opened - Nuclear gradient removal will activate')
    
    # Open test page
    time.sleep(1)
    webbrowser.open(f'http://{HOST}:{PORT}/test-nuclear-final.html')
    print('✅ Test page also opened for comparison')

def start_server():
    """Start the HTTP server"""
    os.chdir('/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18')
    
    with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
        print('🚀 HEART Technology Park - Localhost Server Started!')
        print('=' * 60)
        print(f'📍 Server running at: http://{HOST}:{PORT}/')
        print('=' * 60)
        print('🌐 Available Pages:')
        print(f'   🏠 Home Page:        http://{HOST}:{PORT}/')
        print(f'   ℹ️  About Page:       http://{HOST}:{PORT}/about.html')
        print(f'   🏢 Master Plan:      http://{HOST}:{PORT}/master-plan.html')
        print(f'   🎯 3D Campus:        http://{HOST}:{PORT}/ai-campus-3d-structure.html')
        print(f'   📰 News:             http://{HOST}:{PORT}/news.html')
        print(f'   📞 Contact:          http://{HOST}:{PORT}/contact.html')
        print(f'   🔐 Login:            http://{HOST}:{PORT}/login.html')
        print(f'   💰 Investment:       http://{HOST}:{PORT}/investment.html')
        print(f'   🔬 Technology:       http://{HOST}:{PORT}/technology.html')
        print(f'   🏗️  Facilities:       http://{HOST}:{PORT}/facilities.html')
        print('=' * 60)
        print('🧪 Test Pages:')
        print(f'   💥 Nuclear Test:     http://{HOST}:{PORT}/test-nuclear-final.html')
        print('=' * 60)
        print('💡 Features:')
        print('   ✅ Auto CORS headers for local development')
        print('   ✅ Proper MIME types for all assets')
        print('   ✅ No cache for live development')
        print('=' * 60)
        print('🎯 About Page - Nuclear Gradient Removal:')
        print('   💥 Auto-activates after 1 second')
        print('   🎨 Pure white background')
        print('   🏢 Enhanced HEART building with 8% scale')
        print('   ✨ Glow effects and enhanced contrast')
        print('=' * 60)
        print('\n🔧 Press Ctrl+C to stop the server')
        
        # Start browser opening in background
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n🛑 Shutting down server...')
            httpd.shutdown()
            print('✅ Server stopped. Goodbye!')

if __name__ == '__main__':
    start_server()