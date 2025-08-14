#!/bin/bash

# 🚑 KHỞI ĐỘNG LOCALHOST NGAY LẬP TỨC
# Emergency Localhost Fix - One-click solution

clear
echo "🚑 KHỞI ĐỘNG LOCALHOST NGAY LẬP TỨC"
echo "=================================="

# Navigate to project directory
cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
echo "📁 Directory: $(pwd)"

# Stop existing servers
echo "🛑 Dừng các server cũ..."
pkill -f "python.*http.server" 2>/dev/null
pkill -f "SimpleHTTPServer" 2>/dev/null
echo "✅ Cleaned up!"

# Find available port
PORT=8000
echo "🔍 Tìm port khả dụng..."
for port in 8000 8080 8888 9000 9999; do
    if ! lsof -ti :$port >/dev/null 2>&1; then
        PORT=$port
        echo "✅ Found free port: $PORT"
        break
    fi
done

# Show available URLs
echo ""
echo "🌐 CÁC URL SẼ HOẠT ĐỘNG:"
echo "   🏠 Trang chủ: http://localhost:$PORT/"
echo "   ❤️ Heart Standalone: http://localhost:$PORT/heart_standalone.html"
echo "   🎮 3D Campus: http://localhost:$PORT/3d-campus-interactive.html"
echo "   📄 About: http://localhost:$PORT/about.html"
echo "   🏗️ Facilities: http://localhost:$PORT/facilities.html"
echo ""

# Auto-open browser
echo "🌐 Mở browser tự động sau 3 giây..."
(sleep 3 && open "http://localhost:$PORT/") &

# Start the server
echo "🚀 KHỞI ĐỘNG SERVER TRÊN PORT $PORT"
echo "⏹️ Nhấn Ctrl+C để dừng server"
echo "=================================="

# Start Python HTTP server
python3 -m http.server $PORT