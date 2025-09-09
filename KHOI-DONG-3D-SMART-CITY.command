#!/bin/bash
# Khởi động 3D Smart City đã được khôi phục

echo "🚀 Khởi động 3D Smart City - Đã khôi phục thành công!"
echo "📁 Thư mục: $(pwd)"

# Kiểm tra file đã khôi phục
if [ -f "3d-smart-city.html" ]; then
    echo "✅ File 3d-smart-city.html đã được khôi phục"
else
    echo "❌ Không tìm thấy file 3d-smart-city.html"
    exit 1
fi

# Khởi động server Python
echo "🌐 Khởi động server tại http://localhost:8000"
echo "📋 Truy cập: http://localhost:8000/3d-smart-city.html"
echo ""
echo "🛑 Nhấn Ctrl+C để dừng server"

python3 -m http.server 8000
