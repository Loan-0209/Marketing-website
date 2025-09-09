#!/bin/bash
# Script hiển thị tất cả backup có sẵn với thông tin chi tiết

echo "📋 DANH SÁCH TẤT CẢ BACKUP CỦA 3D SMART CITY"
echo "=============================================="
echo ""

echo "🔍 Tìm kiếm tất cả file backup..."
echo ""

# Backup files chính
echo "📁 BACKUP CHÍNH:"
ls -lah *smart-city*backup*.html 2>/dev/null | while read line; do
    filename=$(echo "$line" | awk '{print $9}')
    size=$(echo "$line" | awk '{print $5}')
    date=$(echo "$line" | awk '{print $6, $7, $8}')
    echo "  ✅ $filename ($size) - $date"
done

echo ""
echo "📁 BACKUP KHÁC:"
ls -lah *3d*backup*.html 2>/dev/null | while read line; do
    filename=$(echo "$line" | awk '{print $9}')
    size=$(echo "$line" | awk '{print $5}')
    date=$(echo "$line" | awk '{print $6, $7, $8}')
    echo "  📄 $filename ($size) - $date"
done

echo ""
echo "📁 BACKUP TRONG THU MUC:"
find backup-*/ -name "*smart-city*.html" 2>/dev/null | while read file; do
    stat_info=$(stat -f "%Sm %z" -t "%Y-%m-%d %H:%M" "$file" 2>/dev/null)
    echo "  🗂️  $file - $stat_info bytes"
done

echo ""
echo "🎯 KHUYẾN NGHỊ:"
echo "  1. 3d-smart-city-restored.html (đã khôi phục)"
echo "  2. 3d-smart-city-backup-20250820_113736.html (20/08/2025)"
echo "  3. 3d-smart-city-broken-backup-20250828_143000.html (28/08/2025)"
echo ""
echo "💡 Để khôi phục file cụ thể:"
echo "   cp [tên-file-backup] 3d-smart-city.html"
