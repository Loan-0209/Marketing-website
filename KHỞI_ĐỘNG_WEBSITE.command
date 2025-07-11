#!/bin/bash
cd "$(dirname "$0")"

echo "🚀 HEART Technology Park - Khởi động Website"
echo "=============================================="

# Kill any existing processes on common ports
for port in 3000 8000 8080 9000; do
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "🔄 Đóng process cũ trên port $port..."
        kill -9 $(lsof -ti:$port) 2>/dev/null || true
    fi
done

sleep 2

echo "📡 Khởi động server..."

# Try to use live-server first
if command -v live-server &> /dev/null; then
    echo "✅ Sử dụng live-server"
    live-server --port=3000 --host=localhost --open=/ --no-browser &
    SERVER_PID=$!
    sleep 3
    if ps -p $SERVER_PID > /dev/null; then
        echo "🟢 Server đang chạy (PID: $SERVER_PID)"
        echo "🌐 Mở http://localhost:3000"
        open http://localhost:3000
        wait
    else
        echo "❌ Live-server thất bại, thử Python..."
    fi
fi

# Fallback to Python
echo "🐍 Sử dụng Python HTTP Server"
python3 -m http.server 3000 &
PYTHON_PID=$!
sleep 3

if ps -p $PYTHON_PID > /dev/null; then
    echo "✅ Python server đang chạy (PID: $PYTHON_PID)"
    echo "🌐 Mở http://localhost:3000"
    open http://localhost:3000
    echo ""
    echo "🔧 Để dừng server: Ctrl+C hoặc kill $PYTHON_PID"
    wait
else
    echo "❌ Không thể khởi động server!"
    echo "🔧 Hãy thử chạy thủ công:"
    echo "   npm start"
    echo "   hoặc: python3 -m http.server 3000"
fi