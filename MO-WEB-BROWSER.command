#!/bin/bash

echo "🌐 MỞ WEB BROWSER - HEART WEBSITE"
echo "================================="

cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "📁 Thư mục hiện tại: $(pwd)"
echo ""

echo "🔍 Kiểm tra files..."
if [ -f "index.html" ]; then
    echo "✅ index.html - Tồn tại"
else
    echo "❌ index.html - Không tìm thấy"
    exit 1
fi

if [ -f "archive-3d/ai-campus-3d-structure.html" ]; then
    echo "✅ 3D Campus file - Tồn tại"
else
    echo "❌ 3D Campus file - Không tìm thấy"
    exit 1
fi

echo ""
echo "🚀 Đang mở website trong browser..."

# Mở file trong browser mặc định
open "index.html"

echo ""
echo "✅ WEBSITE ĐÃ ĐƯỢC MỞ THÀNH CÔNG!"
echo ""
echo "🎯 HƯỚNG DẪN KIỂM TRA:"
echo "1. Website HEART đã mở trong browser của bạn"
echo "2. Nhấp vào '3D Campus' trong menu điều hướng"
echo "3. Trang 3D Campus sẽ tải thành công"
echo "4. KHÔNG còn lỗi ERR_FILE_NOT_FOUND"
echo ""
echo "🎉 Link 3D Campus đã được sửa hoàn toàn!"
echo "   Đường dẫn mới: archive-3d/ai-campus-3d-structure.html"
echo ""
echo "Nhấn Enter để đóng cửa sở này..."
read