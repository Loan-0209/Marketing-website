#!/bin/bash
# 🏢 SCRIPT MỞ HƯỚNG DẪN DI CHUYỂN DATA CENTERS

echo "🏢 DI CHUYỂN DATA CENTERS VỀ ĐẤT LIỀN"
echo "===================================="
echo ""

# Kiểm tra files
if [ ! -f "move-datacenters-guide.html" ]; then
    echo "❌ Không tìm thấy file hướng dẫn"
    exit 1
fi

if [ ! -f "3d-smart-city.html" ]; then
    echo "❌ Không tìm thấy file 3d-smart-city.html"
    exit 1
fi

echo "📋 HƯỚNG DẪN NHANH:"
echo ""
echo "1. 🌐 Mở 3D Smart City: http://localhost:8000/3d-smart-city.html"
echo "2. 🔧 Nhấn F12 để mở Console"
echo "3. 📋 Copy script từ hướng dẫn"
echo "4. ✅ Paste vào Console và nhấn Enter"
echo ""

# Mở hướng dẫn
echo "📖 Mở hướng dẫn chi tiết..."
open move-datacenters-guide.html

# Khởi động server
echo "🚀 Khởi động server..."
echo "📡 Server sẽ chạy tại: http://localhost:8000"
echo "🎯 Truy cập: http://localhost:8000/3d-smart-city.html"
echo ""
echo "🛑 Nhấn Ctrl+C để dừng server"
echo ""

python3 -m http.server 8000
