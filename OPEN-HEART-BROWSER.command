#!/bin/bash

echo "🌐 MỞ HEART WEBSITE TRONG BROWSER"
echo "=" * 40

cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
echo "📁 Thư mục hiện tại: $(pwd)"
echo ""

echo "🔍 Kiểm tra files..."

# Kiểm tra heart_standalone.html
if [ -f "heart_standalone.html" ]; then
    echo "✅ heart_standalone.html - Tồn tại"
    HEART_FILE_EXISTS=true
else
    echo "❌ heart_standalone.html - Không tìm thấy"
    HEART_FILE_EXISTS=false
fi

# Kiểm tra 3d-campus-interactive.html
if [ -f "3d-campus-interactive.html" ]; then
    echo "✅ 3d-campus-interactive.html - Tồn tại"
    CAMPUS_FILE_EXISTS=true
else
    echo "❌ 3d-campus-interactive.html - Không tìm thấy"
    CAMPUS_FILE_EXISTS=false
fi

echo ""
echo "🚀 Đang mở website trong browser..."

OPENED_COUNT=0

# Mở heart_standalone.html
if [ "$HEART_FILE_EXISTS" = true ]; then
    open "heart_standalone.html"
    echo "✅ Đã mở: HEART Standalone Website"
    ((OPENED_COUNT++))
fi

# Mở 3d-campus-interactive.html
if [ "$CAMPUS_FILE_EXISTS" = true ]; then
    open "3d-campus-interactive.html"
    echo "✅ Đã mở: 3D Campus Interactive"
    ((OPENED_COUNT++))
fi

echo ""
echo "📊 KẾT QUẢ: Đã mở $OPENED_COUNT/2 trang"
echo ""

if [ $OPENED_COUNT -gt 0 ]; then
    echo "🎯 HƯỚNG DẪN KIỂM TRA:"
    echo "1. HEART Standalone - Trang chính của website HEART"
    echo "2. 3D Campus Interactive - Trang 3D campus với:"
    echo "   • Stats panel với FPS counter"
    echo "   • Phase controls (1,2,3)"
    echo "   • View controls (Overview, Aerial, Ground)"
    echo "   • Interactive buildings"
    echo "   • Animated particles background"
    echo ""
    echo "✅ CẢ HAI TRANG ĐÃ MỞ THÀNH CÔNG!"
else
    echo "❌ Không thể mở được trang nào!"
fi

echo ""
echo "Nhấn Enter để đóng cửa sổ này..."
read