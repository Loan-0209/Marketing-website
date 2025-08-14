#!/usr/bin/env python3
"""
🚑 EMERGENCY LOCALHOST FIX BACKUP
Alternative solution for localhost connection issues
"""
import os
import subprocess
import socket

def emergency_fix():
    print("🚑 EMERGENCY LOCALHOST BACKUP FIX")
    print("=" * 40)
    
    # Set working directory
    target_dir = "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
    os.chdir(target_dir)
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Kill existing processes
    print("\n🛑 Killing existing servers...")
    kill_commands = [
        "pkill -f 'python.*http.server'",
        "pkill -f 'SimpleHTTPServer'",
        "lsof -ti :8000 | xargs kill -9",
        "lsof -ti :8080 | xargs kill -9", 
        "lsof -ti :8888 | xargs kill -9"
    ]
    
    for cmd in kill_commands:
        try:
            os.system(f"{cmd} 2>/dev/null")
        except:
            pass
    print("✅ Process cleanup completed")
    
    # Find available port
    print("\n🔍 Finding available port...")
    available_port = None
    test_ports = [8000, 8080, 8888, 9000, 9999, 3000, 5000, 8001]
    
    for port in test_ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex(('127.0.0.1', port))
            sock.close()
            
            if result != 0:  # Port is available
                available_port = port
                print(f"✅ Port {port} is available")
                break
            else:
                print(f"❌ Port {port} is in use")
        except Exception as e:
            # If there's an error, assume port is available
            available_port = port
            print(f"✅ Port {port} assumed available")
            break
    
    if not available_port:
        available_port = 8000
        print(f"⚠️ Using default port {available_port}")
    
    # Create emergency HTML if index.html doesn't exist
    if not os.path.exists("index.html"):
        print("\n🚑 Creating emergency index.html...")
        emergency_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HEART - Emergency Server</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }}
        
        .container {{
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            max-width: 600px;
            width: 90%;
        }}
        
        h1 {{
            font-size: 3.5em;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }}
        
        h2 {{
            font-size: 1.5em;
            margin-bottom: 30px;
            color: #90EE90;
        }}
        
        .status {{
            background: rgba(144, 238, 144, 0.2);
            border: 2px solid #90EE90;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }}
        
        .links {{
            margin: 30px 0;
        }}
        
        .links a {{
            display: inline-block;
            color: #FFD700;
            text-decoration: none;
            margin: 10px 15px;
            font-size: 1.3em;
            font-weight: bold;
            padding: 10px 20px;
            border: 2px solid #FFD700;
            border-radius: 25px;
            transition: all 0.3s ease;
        }}
        
        .links a:hover {{
            background: #FFD700;
            color: #333;
            transform: scale(1.05);
        }}
        
        .server-info {{
            margin-top: 30px;
            font-size: 0.9em;
            opacity: 0.8;
        }}
        
        .pulse {{
            animation: pulse 2s infinite;
        }}
        
        @keyframes pulse {{
            0% {{ transform: scale(1); }}
            50% {{ transform: scale(1.05); }}
            100% {{ transform: scale(1); }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1 class="pulse">🚀 HEART WEBSITE</h1>
        <h2>✅ Emergency Server Active</h2>
        
        <div class="status">
            <p><strong>Status:</strong> Localhost connection has been successfully restored!</p>
            <p><strong>Port:</strong> {available_port}</p>
        </div>
        
        <div class="links">
            <a href="heart_standalone.html">❤️ Heart Standalone</a>
            <a href="3d-campus-interactive.html">🎮 3D Campus Interactive</a>
            <a href="facilities.html">🏢 Facilities</a>
        </div>
        
        <div class="server-info">
            <p>Server is running on port {available_port}</p>
            <p>Emergency fix applied successfully</p>
        </div>
    </div>
</body>
</html>"""
        
        with open("index.html", "w", encoding="utf-8") as f:
            f.write(emergency_html)
        print("✅ Emergency index.html created successfully")
    
    # Display available URLs
    base_url = f"http://localhost:{available_port}"
    print(f"\n🌐 SERVER URLS:")
    print("=" * 40)
    print(f"🏠 Main Page:     {base_url}/")
    print(f"❤️ Heart:         {base_url}/heart_standalone.html")
    print(f"🎮 3D Campus:     {base_url}/3d-campus-interactive.html")
    print(f"🏢 Facilities:    {base_url}/facilities.html")
    print("=" * 40)
    
    # Instructions
    print(f"\n📋 INSTRUCTIONS:")
    print(f"1. Copy this command and run in Terminal:")
    print(f"   cd '{target_dir}' && python3 -m http.server {available_port}")
    print(f"2. Or open browser manually to: {base_url}")
    print(f"3. Press Ctrl+C to stop server when done")
    
    # Try to start server automatically
    print(f"\n🚀 Attempting to start server automatically...")
    print(f"⏹️ Press Ctrl+C to stop server")
    print("=" * 40)
    
    try:
        # Open browser
        import webbrowser
        webbrowser.open(base_url)
        print(f"🌐 Browser opened to {base_url}")
    except:
        print(f"📋 Please open {base_url} manually in browser")
    
    # Start HTTP server
    try:
        os.system(f"python3 -m http.server {available_port}")
    except KeyboardInterrupt:
        print(f"\n\n👋 Server stopped successfully!")
        print("Emergency fix completed.")

if __name__ == "__main__":
    emergency_fix()