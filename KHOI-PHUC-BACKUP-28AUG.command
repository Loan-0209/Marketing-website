#!/bin/bash
# Script để khôi phục backup từ ngày 28/08/2025

echo "🔄 Khôi phục backup từ ngày 28/08/2025..."
echo "📁 Thư mục: $(pwd)"

# Backup file hiện tại trước khi khôi phục
if [ -f "3d-smart-city.html" ]; then
    cp "3d-smart-city.html" "3d-smart-city.html.backup-before-restore-$(date +%Y%m%d_%H%M%S)"
    echo "✅ Đã backup file hiện tại"
fi

# Khôi phục từ backup ngày 28/08/2025
cp "3d-smart-city-broken-backup-20250828_143000.html" "3d-smart-city.html"

echo "✅ Khôi phục thành công!"
echo "📄 File: 3d-smart-city-broken-backup-20250828_143000.html"
echo "📅 Ngày backup: 28/08/2025"
echo "📊 Kích thước: 174KB (4,602 dòng)"
echo ""
echo "🚀 Khởi động website:"
echo "python3 -m http.server 8000"
echo ""
echo "🌐 Truy cập: http://localhost:8000/3d-smart-city.html"
