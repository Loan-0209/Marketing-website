#!/bin/bash

# HEART AI Campus - Auto Start Server Script
echo "🚀 Khởi động HEART AI Campus..."

# Kiểm tra xem đã có server chạy chưa
if lsof -i :8000 >/dev/null 2>&1; then
    echo "❌ Port 8000 đang được sử dụng. Dừng server cũ..."
    pkill -f "python3 -m http.server 8000"
    sleep 2
fi

# Chuyển đến thư mục project
cd "$(dirname "$0")"
echo "📁 Thư mục hiện tại: $(pwd)"

# Khởi động server
echo "🌐 Khởi động server trên http://localhost:8000"
python3 -m http.server 8000 &
SERVER_PID=$!

# Chờ server khởi động
sleep 2

# Kiểm tra server có chạy không
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server đã khởi động thành công!"
    echo "🌍 Truy cập: http://localhost:8000"
    echo "📱 3D Campus: http://localhost:8000/3d-campus-with-navigation.html"
    
    # Mở browser tự động
    open http://localhost:8000
    
    echo ""
    echo "💡 Để dừng server, nhấn Ctrl+C hoặc chạy:"
    echo "   pkill -f 'python3 -m http.server 8000'"
    
    # Giữ script chạy
    wait $SERVER_PID
else
    echo "❌ Không thể khởi động server!"
    exit 1
fi
