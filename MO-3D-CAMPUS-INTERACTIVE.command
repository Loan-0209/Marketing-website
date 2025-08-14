#!/bin/bash

echo "🎮 MỞ 3D CAMPUS INTERACTIVE - HEART WEBSITE"
echo "==========================================="

cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "📁 Thư mục hiện tại: $(pwd)"
echo ""

echo "🔍 Kiểm tra files..."
if [ -f "3d-campus-interactive.html" ]; then
    echo "✅ 3d-campus-interactive.html - Tồn tại"
    file_size=$(wc -c < "3d-campus-interactive.html")
    echo "📏 Kích thước file: $file_size bytes"
else
    echo "❌ 3d-campus-interactive.html - Không tìm thấy"
    exit 1
fi

echo ""
echo "🚀 Đang mở Interactive 3D Campus..."

# Mở trang 3D Campus interactive
open "3d-campus-interactive.html"

echo ""
echo "✅ INTERACTIVE 3D CAMPUS ĐÃ MỞ THÀNH CÔNG!"
echo ""
echo "🎮 TÍNH NĂNG CỦA TRANG 3D CAMPUS:"
echo "   📊 Stats Panel (góc phải trên) - FPS, Objects, Triangles"
echo "   🏛️ AI Campus Panel (góc trái dưới) - Thông tin và hướng dẫn"
echo "   🎯 Phase Controls (giữa) - Phase 1, 2, 3 development"
echo "   👁️ View Controls (góc phải) - Overview, Aerial, Ground"
echo "   ✨ Animated Particles - Background với hiệu ứng bay"
echo "   🏢 Interactive Buildings - Click để khám phá từng tòa nhà"
echo "   📈 Real-time Stats - Thống kê cập nhật theo thời gian thực"
echo ""
echo "🎯 HƯỚNG DẪN SỬ DỤNG:"
echo "   1. 🎮 Click các nút Phase 1, 2, 3 để xem các giai đoạn phát triển"
echo "   2. 👁️ Thử các chế độ xem: Overview, Aerial View, Ground Level"
echo "   3. 🏢 Click vào các tòa nhà để khám phá thông tin chi tiết"
echo "   4. 📊 Quan sát stats panel để xem hiệu suất rendering"
echo "   5. ← Click 'Back to HEART' để quay về trang chính"
echo ""
echo "🎊 THIẾT KẾ INTERACTIVE HOÀN CHỈNH!"
echo "   Trang này thay thế hoàn toàn phiên bản cũ trong archive-3d/"
echo ""
echo "Nhấn Enter để đóng cửa sổ này..."
read