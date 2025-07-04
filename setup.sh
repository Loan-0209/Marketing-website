#!/bin/bash

# HEART Website Setup Script
# Script này giúp setup nhanh environment cho dự án

echo "🚀 HEART Website Setup Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Make sure you're in the project directory."
    exit 1
fi

echo "✅ Found index.html"

# Check if node is installed
if command -v node &> /dev/null; then
    echo "✅ Node.js is installed ($(node --version))"
    
    # Check if package.json exists
    if [ -f "package.json" ]; then
        echo "✅ Found package.json"
        
        # Install dependencies if node_modules doesn't exist
        if [ ! -d "node_modules" ]; then
            echo "📦 Installing dependencies..."
            npm install
            echo "✅ Dependencies installed"
        else
            echo "✅ Dependencies already installed"
        fi
        
        echo ""
        echo "🎉 Setup complete! You can now run:"
        echo "   npm start     # Start development server"
        echo "   npm run serve # Start server accessible from other devices"
        echo ""
    else
        echo "⚠️  package.json not found, but that's okay for static website"
    fi
else
    echo "ℹ️  Node.js not installed - you can still run the website directly in browser"
fi

# Check for common editors/IDEs
echo ""
echo "📝 Editor/IDE Detection:"
if command -v code &> /dev/null; then
    echo "✅ VS Code detected"
    echo "   Run: code . (to open project in VS Code)"
fi

echo ""
echo "🌐 How to run the website:"
echo "1. Open index.html directly in your browser, OR"
echo "2. Use Live Server extension in your editor, OR"
echo "3. Run 'npm start' if you have Node.js installed"
echo ""

# Create a simple server script for those without Live Server
cat > start-server.py << 'EOF'
#!/usr/bin/env python3
"""
Simple HTTP server for development
Run: python3 start-server.py
"""
import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        print(f"🚀 Server running at http://localhost:{PORT}")
        print("Press Ctrl+C to stop")
        
        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped")
EOF

echo "📄 Created start-server.py for Python users"
echo "   Run: python3 start-server.py"
echo ""

echo "🎯 Quick Start Commands:"
echo "   Live Server:    Open index.html → Right-click → 'Open with Live Server'"
echo "   Direct Browser: Open index.html → Right-click → 'Open with Browser'"
echo "   Python Server:  python3 start-server.py"
echo "   Node.js:        npm start"
echo ""

echo "🔑 Demo Login Credentials:"
echo "   Username: admin"
echo "   Password: heart2024"
echo ""

echo "✨ Setup completed successfully!"
echo "Happy coding! 🎉"
