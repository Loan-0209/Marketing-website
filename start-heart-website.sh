#!/bin/bash

echo "🚀 Khởi động HEART Technology Park Website..."

# Kiểm tra các ports khả dụng
PORTS=(3000 8080 8000 9000 9001 9002)
AVAILABLE_PORT=""

for port in "${PORTS[@]}"; do
    if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        AVAILABLE_PORT=$port
        break
    fi
done

if [ -z "$AVAILABLE_PORT" ]; then
    echo "❌ Không tìm thấy port khả dụng!"
    exit 1
fi

echo "✅ Sử dụng port: $AVAILABLE_PORT"

# Kiểm tra nếu live-server có sẵn
if command -v live-server &> /dev/null; then
    echo "🟢 Khởi động bằng live-server..."
    live-server --port=$AVAILABLE_PORT --host=localhost --open=/ &
    SERVER_PID=$!
    echo "📡 Live-server đang chạy với PID: $SERVER_PID"
    echo "🌐 Website có thể truy cập tại: http://localhost:$AVAILABLE_PORT"
    echo "📂 Thư mục gốc: $(pwd)"
    echo ""
    echo "🔧 Để dừng server, nhấn Ctrl+C hoặc chạy: kill $SERVER_PID"
    wait
else
    echo "🟡 Live-server không khả dụng, sử dụng Python server..."
    echo "📡 Python server đang khởi động trên port $AVAILABLE_PORT..."
    echo "🌐 Website có thể truy cập tại: http://localhost:$AVAILABLE_PORT"
    echo ""
    echo "🔧 Để dừng server, nhấn Ctrl+C"
    python3 -m http.server $AVAILABLE_PORT
fi