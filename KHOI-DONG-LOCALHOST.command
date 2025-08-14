#!/bin/bash

echo "🌐 KHỞI ĐỘNG LOCALHOST SERVER - HEART WEBSITE"
echo "============================================="

cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "📁 Thư mục: $(pwd)"
echo ""

echo "🔍 Kiểm tra Python..."
if command -v python3 &> /dev/null; then
    echo "✅ Python3 available"
    python3 --version
else
    echo "❌ Python3 not found"
    echo "📋 Please install Python3 to run localhost server"
    exit 1
fi

echo ""
echo "🔍 Kiểm tra các file website chính..."

main_files=("index.html" "heart_standalone.html" "3d-campus-interactive.html")
found_files=0

for file in "${main_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - Ready"
        ((found_files++))
    else
        echo "❌ $file - Missing"
    fi
done

if [ $found_files -eq 0 ]; then
    echo "❌ Không tìm thấy file website nào!"
    exit 1
fi

echo ""
echo "🚀 Đang khởi động localhost server..."
echo "📋 Sẽ mở browser tự động sau 2 giây"
echo "⏹️  Nhấn Ctrl+C để dừng server"
echo ""

# Chạy Python server
python3 start-localhost-server.py