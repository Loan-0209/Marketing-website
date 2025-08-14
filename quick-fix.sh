#!/bin/bash

echo "🚀 QUICK FIX - Sửa lỗi localhost nhanh"
echo "===================================="

# Chuyển đến thư mục project
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/

echo "📁 Thư mục: $(pwd)"

# Dừng server cũ
echo "🔧 Dừng server cũ..."
pkill -f "python.*http.server" 2>/dev/null
lsof -ti:8080 | xargs kill -9 2>/dev/null

# Tạo file test nhanh
echo "✅ Tạo file test..."
cat > QUICK_TEST.html << 'EOF'
<!DOCTYPE html>
<html><head><title>Quick Test</title></head>
<body style="font-family:Arial;text-align:center;padding:50px;background:#f0f0f0;">
<h1 style="color:green;">✅ LOCALHOST HOẠT ĐỘNG!</h1>
<p>Server đã khởi động thành công!</p>
<div style="margin:20px;">
<a href="index.html" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;margin:10px;border-radius:5px;">🏠 Home</a>
<a href="project-dashboard.html" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;margin:10px;border-radius:5px;">📊 Dashboard</a>
</div>
<p style="color:#666;">Port: 8080</p>
</body></html>
EOF

# Khởi động server
echo "🌐 Khởi động server trên port 8080..."
python3 -m http.server 8080 &
SERVER_PID=$!

# Đợi server khởi động
sleep 3

# Kiểm tra server
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server đang chạy (PID: $SERVER_PID)"
    
    # Mở browser
    echo "🔄 Mở browser..."
    open "http://localhost:8080/QUICK_TEST.html"
    
    echo ""
    echo "🎯 LINKS:"
    echo "   🧪 Test: http://localhost:8080/QUICK_TEST.html"
    echo "   🏠 Home: http://localhost:8080/index.html"
    echo "   📊 Dashboard: http://localhost:8080/project-dashboard.html"
    echo ""
    echo "✅ THÀNH CÔNG! Localhost đang hoạt động!"
    echo "🛑 Nhấn Enter để dừng server..."
    read
    
    kill $SERVER_PID 2>/dev/null
    echo "✅ Đã dừng server"
else
    echo "❌ Lỗi khởi động server!"
    echo "Thử chạy thủ công:"
    echo "python3 -m http.server 8080"
fi