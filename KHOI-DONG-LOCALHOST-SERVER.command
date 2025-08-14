#!/bin/bash

echo "🚀 Đang khởi động HEART Website Localhost Server..."
echo "📁 Chuyển đến thư mục website..."

cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "✅ Đã chuyển đến: $(pwd)"
echo "🌐 Khởi động HTTP Server trên port 8000..."

# Check if port 8000 is available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8000 đang được sử dụng, thử port 8001..."
    PORT=8001
else
    PORT=8000
fi

echo "📍 Server sẽ chạy tại: http://localhost:$PORT"
echo ""
echo "🌐 CÁC URL AVAILABLE:"
echo "   • Trang chính: http://localhost:$PORT/"
echo "   • Homepage: http://localhost:$PORT/index.html"
echo "   • Heart Standalone: http://localhost:$PORT/heart_standalone.html"
echo "   • 3D Campus Interactive: http://localhost:$PORT/3d-campus-interactive.html"
echo "   • About: http://localhost:$PORT/about.html"
echo "   • Facilities: http://localhost:$PORT/facilities.html"
echo "   • Master Plan: http://localhost:$PORT/master-plan.html"
echo "   • Contact: http://localhost:$PORT/contact.html"
echo ""
echo "🚀 Đang mở browser tự động..."

# Open browser automatically
sleep 2 && open "http://localhost:$PORT" &

echo "✅ Server đang chạy! Nhấn Ctrl+C để dừng"
echo "📱 Bạn có thể truy cập từ browser bằng URL: http://localhost:$PORT"

# Start the server
python3 -m http.server $PORT