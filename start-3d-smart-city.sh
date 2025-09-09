#!/bin/bash

# Script khởi động 3D Smart City
# Created on: $(date)

echo "🚀 Khởi động 3D Smart City Server..."
echo "=================================="

# Kiểm tra Python 3
if ! command -v python3 &> /dev/null; then
    echo "❌ Lỗi: Python 3 chưa được cài đặt!"
    echo "Vui lòng cài đặt Python 3 để tiếp tục."
    exit 1
fi

# Hiển thị thông tin
echo "📍 Thư mục làm việc: $(pwd)"
echo "📄 File: 3d-smart-city.html"
echo "🔧 Python version: $(python3 --version)"

# Kiểm tra file tồn tại
if [ ! -f "3d-smart-city.html" ]; then
    echo "❌ Lỗi: Không tìm thấy file 3d-smart-city.html"
    exit 1
fi

# Khởi động server
echo ""
echo "🌐 Đang khởi động server tại http://localhost:8000"
echo "📱 Truy cập: http://localhost:8000/3d-smart-city.html"
echo ""
echo "💡 Tips:"
echo "   - Nhấn Ctrl+C để dừng server"
echo "   - Sử dụng Chrome/Firefox/Safari mới nhất để có trải nghiệm tốt nhất"
echo "   - Đảm bảo kết nối internet để tải Three.js library"
echo ""
echo "=================================="

# Khởi động Python HTTP Server
python3 -m http.server 8000

echo ""
echo "✅ Server đã dừng."