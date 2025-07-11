#!/bin/bash
cd "$(dirname "$0")"

echo "🚀 Mở HEART Technology Park Website..."

# Thử các port có thể
PORTS=(3000 8080 8000 9000 9001 9002)

for port in "${PORTS[@]}"; do
    if curl -s --max-time 2 http://localhost:$port > /dev/null 2>&1; then
        echo "✅ Tìm thấy website đang chạy trên port $port"
        open http://localhost:$port
        exit 0
    fi
done

echo "⚠️ Không tìm thấy website đang chạy!"
echo "🔧 Khởi động server..."

# Khởi động server
./start-heart-website.sh &
SERVER_PID=$!

# Đợi server khởi động
sleep 3

# Thử mở lại
for port in "${PORTS[@]}"; do
    if curl -s --max-time 2 http://localhost:$port > /dev/null 2>&1; then
        echo "✅ Website đã sẵn sàng trên port $port"
        open http://localhost:$port
        exit 0
    fi
done

echo "❌ Không thể khởi động website. Vui lòng kiểm tra lỗi."