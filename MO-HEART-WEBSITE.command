#!/bin/bash

echo "🌐 MỞ HEART WEBSITE TRONG BROWSER"
echo "================================="

# Chuyển đến thư mục project
cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "📁 Thư mục hiện tại: $(pwd)"
echo ""

# Kiểm tra files
echo "🔍 Kiểm tra files..."
FILES_OK=0

if [ -f "heart_standalone.html" ]; then
    echo "✅ heart_standalone.html - Tồn tại"
    FILES_OK=$((FILES_OK + 1))
else
    echo "❌ heart_standalone.html - Không tìm thấy"
fi

if [ -f "3d-campus-interactive.html" ]; then
    echo "✅ 3d-campus-interactive.html - Tồn tại"  
    FILES_OK=$((FILES_OK + 1))
else
    echo "❌ 3d-campus-interactive.html - Không tìm thấy"
fi

echo ""

if [ $FILES_OK -eq 2 ]; then
    echo "🚀 Đang mở websites trong browser..."
    echo ""
    
    # Mở HEART Standalone
    open "heart_standalone.html"
    echo "✅ Đã mở: HEART Standalone Website"
    
    # Đợi 2 giây rồi mở 3D Campus
    sleep 2
    open "3d-campus-interactive.html"  
    echo "✅ Đã mở: 3D Campus Interactive"
    
    echo ""
    echo "📊 KẾT QUẢ: Đã mở 2/2 trang thành công!"
    echo ""
    echo "🎯 HƯỚNG DẪN KIỂM TRA:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📄 TRANG 1: HEART Standalone Website"
    echo "   • Trang chính của website HEART Data Center"
    echo "   • Navigation menu và hero section"
    echo "   • Responsive design"
    echo ""
    echo "🎮 TRANG 2: 3D Campus Interactive"  
    echo "   • Stats panel với FPS counter"
    echo "   • Phase controls (Phase 1, 2, 3)"
    echo "   • View controls (Overview, Aerial, Ground)"
    echo "   • Interactive buildings (click để xem thông tin)"
    echo "   • Animated particles background"
    echo "   • Real-time 3D rendering"
    echo ""
    echo "✅ CẢ HAI TRANG ĐÃ MỞ THÀNH CÔNG TRONG BROWSER!"
    echo "🎉 Bạn có thể test các tính năng interactive ngay bây giờ"
    
else
    echo "❌ Không thể mở website - thiếu files"
    echo "Cần cả 2 files: heart_standalone.html và 3d-campus-interactive.html"  
fi

echo ""
echo "Nhấn Enter để đóng cửa sổ này..."
read