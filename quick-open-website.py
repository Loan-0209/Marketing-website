#!/usr/bin/env python3
"""
Quick website opener - Opens immediately without waiting
"""

import webbrowser
import subprocess
import os
import time

# Project directory
PROJECT_DIR = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
os.chdir(PROJECT_DIR)

def start_server_background():
    """Start server in background"""
    try:
        # Start server in background, don't wait
        subprocess.Popen([
            'python3', '-m', 'http.server', '8090'
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except:
        return False

print("🚀 Opening HEART Website...")

# Try to start server in background
if start_server_background():
    # Wait just a bit for server to start
    time.sleep(1)
    
    # Open in browser
    url = "http://localhost:8090/index.html"
    print(f"✅ Opening: {url}")
    webbrowser.open(url)
    
    # Also open 3D Smart City
    time.sleep(0.5)
    webbrowser.open("http://localhost:8090/3d-campus-smart-city.html")
    
    print("\n✅ Website opened!")
    print("🛑 Server running in background on port 8090")
    print("📌 To stop server: pkill -f 'python.*http.server'")
else:
    # Fallback: Open files directly
    print("⚠️ Could not start server, opening files directly...")
    webbrowser.open(f"file://{PROJECT_DIR}/index.html")
    time.sleep(0.5)
    webbrowser.open(f"file://{PROJECT_DIR}/3d-campus-smart-city.html")

print("\n✅ Done!")