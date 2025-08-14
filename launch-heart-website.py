#!/usr/bin/env python3
"""
HEART Data Center Website Launcher
Complete website with all navigation pages
"""

import http.server
import socketserver
import webbrowser
import threading
import time
import os
import sys

# Configuration
PORT = 8080
PROJECT_DIR = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

def check_website_structure():
    """Check if all main website files exist"""
    print("🔍 Checking website structure...")
    
    pages = {
        "index.html": "🏠 Homepage",
        "about.html": "ℹ️ About Us",
        "master-plan.html": "📋 Master Plan", 
        "facilities.html": "🏗️ Facilities",
        "investment.html": "💰 Investment",
        "technology.html": "💻 Technology",
        "news.html": "📰 News",
        "contact.html": "📞 Contact"
    }
    
    found_pages = []
    missing_pages = []
    
    for page, name in pages.items():
        if os.path.exists(os.path.join(PROJECT_DIR, page)):
            found_pages.append(f"✅ {name}: {page}")
        else:
            missing_pages.append(f"❌ {name}: {page}")
    
    print("\n📄 Website pages found:")
    for page in found_pages:
        print(f"   {page}")
    
    if missing_pages:
        print("\n⚠️ Missing pages:")
        for page in missing_pages:
            print(f"   {page}")
    
    return len(found_pages) > 0

def start_server():
    """Start HTTP server for the website"""
    os.chdir(PROJECT_DIR)
    
    Handler = http.server.SimpleHTTPRequestHandler
    
    class QuietHandler(Handler):
        def log_message(self, format, *args):
            # Only log important requests
            if ".html" in format % args or "/" == (format % args).split()[1]:
                print(f"📄 {format % args}")
    
    print(f"\n🚀 Starting HEART Data Center Website Server...")
    print("=" * 60)
    print(f"📂 Project Directory: {PROJECT_DIR}")
    print(f"🌐 Server Port: {PORT}")
    print("=" * 60)
    
    with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
        print(f"✅ Server running successfully!")
        print(f"\n🌐 HEART Website URLs:")
        print(f"   🏠 Homepage:     http://localhost:{PORT}/")
        print(f"   ℹ️  About Us:     http://localhost:{PORT}/about.html")
        print(f"   📋 Master Plan:  http://localhost:{PORT}/master-plan.html")
        print(f"   🏗️ Facilities:   http://localhost:{PORT}/facilities.html")
        print(f"   💰 Investment:   http://localhost:{PORT}/investment.html")
        print(f"   💻 Technology:   http://localhost:{PORT}/technology.html")
        print(f"   📰 News:         http://localhost:{PORT}/news.html")
        print(f"   📞 Contact:      http://localhost:{PORT}/contact.html")
        
        print(f"\n🏛️ 3D Campus Pages:")
        print(f"   🎯 Master Plan 3D: http://localhost:{PORT}/archive-3d/ai-campus-3d-structure.html")
        print(f"   ✨ Enhanced 3D:    http://localhost:{PORT}/enhanced-ai-campus-3d.html")
        print(f"   ☀️ Daytime 3D:     http://localhost:{PORT}/perfect-daytime-ai-campus-3d.html")
        
        # Open browser after delay
        def open_browser():
            time.sleep(2)
            url = f"http://localhost:{PORT}/"
            print(f"\n🔄 Opening HEART website in browser...")
            try:
                webbrowser.open(url)
                print("✅ Website opened successfully!")
                print("\n📊 Navigate through:")
                print("   Home → About Us → Master Plan → 3D Campus → Facilities")
                print("   Investment → Technology → News → Contact")
            except Exception as e:
                print(f"⚠️ Could not open browser: {e}")
                print(f"Please manually open: {url}")
        
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        print("\n🛑 Press Ctrl+C to stop server")
        print("=" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")
            sys.exit(0)

def main():
    print("🚀 HEART DATA CENTER - WEBSITE LAUNCHER")
    print("======================================")
    print("📊 Project: Vietnam's First 300MW AI-Optimized Data Center")
    print("🌐 Location: Hue Hi-Tech State-owned Park")
    print()
    
    # Check website structure
    if check_website_structure():
        # Start server
        start_server()
    else:
        print("\n❌ No website pages found!")
        print("Please ensure you're in the correct directory.")

if __name__ == "__main__":
    main()