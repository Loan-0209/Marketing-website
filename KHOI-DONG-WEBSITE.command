#!/bin/bash

echo "🚀 KHỞI ĐỘNG WEBSITE HEART DATA CENTER"
echo "====================================="
echo ""

# Chuyển đến thư mục dự án
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/

# Dừng các server cũ
echo "🔧 Dọn dẹp các server cũ..."
pkill -f "python.*http.server" 2>/dev/null
lsof -ti:8080 | xargs kill -9 2>/dev/null
lsof -ti:8888 | xargs kill -9 2>/dev/null
lsof -ti:9999 | xargs kill -9 2>/dev/null

echo "✅ Đã dọn dẹp xong"
echo ""

# Kiểm tra file index.html
if [ -f "index.html" ]; then
    echo "✅ Tìm thấy homepage: index.html"
    HOMEPAGE="index.html"
elif [ -f "project-dashboard.html" ]; then
    echo "📊 Sử dụng project dashboard"
    HOMEPAGE="project-dashboard.html"
else
    echo "⚠️ Không tìm thấy trang chủ, hiển thị danh sách file"
    HOMEPAGE=""
fi

# Khởi động server
PORT=8080
echo "🌐 Khởi động web server trên port $PORT..."
python3 -m http.server $PORT &
SERVER_PID=$!

# Đợi server khởi động
sleep 2

# Kiểm tra server
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server đang chạy (PID: $SERVER_PID)"
    echo ""
    
    # URL của website
    URL="http://localhost:$PORT/"
    
    echo "🌐 WEBSITE URLS:"
    echo "   🏠 Trang chủ: ${URL}${HOMEPAGE}"
    echo "   🏛️ 3D Campus: ${URL}archive-3d/ai-campus-3d-structure.html"
    echo "   📊 Dashboard: ${URL}project-dashboard.html"
    echo "   🏗️ Facilities: ${URL}facilities.html"
    echo ""
    
    # Mở browser
    echo "🔄 Mở website trong browser..."
    if [ -n "$HOMEPAGE" ]; then
        open "${URL}${HOMEPAGE}"
    else
        open "${URL}"
    fi
    
    echo "✅ Website đã được mở!"
    echo ""
    echo "📌 LƯU Ý:"
    echo "   - Nếu trang không load, nhấn Cmd+Shift+R để refresh"
    echo "   - Server đang chạy với PID: $SERVER_PID"
    echo "   - Để dừng server: kill $SERVER_PID"
    echo ""
    echo "Nhấn Enter để dừng server..."
    read
    
    # Dừng server
    kill $SERVER_PID 2>/dev/null
    echo "🛑 Đã dừng server"
else
    echo "❌ Không thể khởi động server"
    echo "Vui lòng thử lại hoặc kiểm tra cổng $PORT"
fi