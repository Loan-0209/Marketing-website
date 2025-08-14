#!/bin/bash

echo "🌐 KHỞI ĐỘNG HEART WEBSITE TRONG BROWSER"
echo "========================================"

cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "📁 Thư mục hiện tại: $(pwd)"
echo ""

# Mở HEART Standalone Website
echo "🚀 Đang mở HEART Standalone Website..."
if [ -f "heart_standalone.html" ]; then
    open "heart_standalone.html"
    echo "✅ HEART Standalone - Đã mở"
else
    echo "❌ heart_standalone.html - Không tìm thấy"
fi

# Đợi 2 giây
sleep 2

# Mở 3D Campus Interactive
echo "🎮 Đang mở 3D Campus Interactive..."
if [ -f "3d-campus-interactive.html" ]; then
    open "3d-campus-interactive.html"
    echo "✅ 3D Campus Interactive - Đã mở"
else
    echo "❌ 3d-campus-interactive.html - Không tìm thấy"
fi

echo ""
echo "🎉 CẢ HAI WEBSITE ĐÃ MỞ TRONG BROWSER!"
echo ""
echo "🎯 HƯỚNG DẪN KIỂM TRA:"
echo ""
echo "📱 HEART STANDALONE WEBSITE:"
echo "  • Trang chính với navigation menu"
echo "  • Hero section với HEART branding"
echo "  • Location map và các tính năng"
echo "  • Click '3D Campus' để test navigation"
echo ""
echo "🎮 3D CAMPUS INTERACTIVE:"
echo "  • 📊 Stats Panel (góc phải trên) - FPS, Objects, Triangles"
echo "  • 🏛️ AI Campus Panel (góc trái dưới) - Thông tin hướng dẫn"
echo "  • 🎯 Phase Controls (giữa) - Phase 1, 2, 3 buttons"
echo "  • 👁️ View Controls (góc phải) - Overview, Aerial, Ground"
echo "  • 🏢 Interactive Buildings - Click để khám phá"
echo "  • ✨ Animated Particles - Background bay lơ lửng"
echo ""
echo "🔗 TEST NAVIGATION:"
echo "  1. Từ HEART website → Click '3D Campus'"
echo "  2. Từ 3D Campus → Click '← Back to HEART'"
echo "  3. Kiểm tra tất cả links hoạt động"
echo ""
echo "🎊 WEBSITE HEART HOÀN TOÀN SẴN SÀNG!"
echo ""
echo "Nhấn Enter để đóng cửa sổ này..."
read