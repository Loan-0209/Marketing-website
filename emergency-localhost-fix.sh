#!/bin/bash
# 🚨 EMERGENCY LOCALHOST FIX
# Sửa lỗi localhost từ chối kết nối

echo "🚨 EMERGENCY LOCALHOST FIX"
echo "=========================="

# Dừng tất cả servers
echo "🔄 Stopping all servers..."
killall python3 2>/dev/null
killall Python 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null

sleep 2

# Chuyển đến thư mục project
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18

# Tìm port trống
echo "🔍 Finding available port..."
PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; do
    PORT=$((PORT + 1))
done

echo "✅ Using port: $PORT"

# Khởi động server
echo "🌐 Starting server..."
python3 -m http.server $PORT &
SERVER_PID=$!

sleep 3

# Mở browser
echo "🌐 Opening browser..."
open "http://localhost:$PORT"
open "http://localhost:$PORT/3d-campus-with-navigation.html"

echo ""
echo "✅ SERVER IS RUNNING!"
echo "===================="
echo "URLs:"
echo "  Homepage: http://localhost:$PORT"
echo "  3D Campus: http://localhost:$PORT/3d-campus-with-navigation.html"
echo "  Facilities: http://localhost:$PORT/facilities.html"
echo ""
echo "Press Ctrl+C to stop server"

# Giữ script chạy
wait $SERVER_PID