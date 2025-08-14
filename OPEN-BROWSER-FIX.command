#!/bin/bash

echo "🔧 OPENING BROWSER FIX TEST..."

# Chuyển đến thư mục dự án
cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "📂 Current directory: $(pwd)"

# Kiểm tra file test có tồn tại
if [ -f "browser-fix-test.html" ]; then
    echo "✅ Found browser-fix-test.html"
    
    # Thử mở với open command
    echo "🚀 Opening browser..."
    open browser-fix-test.html
    
    if [ $? -eq 0 ]; then
        echo "✅ Browser opened successfully!"
    else
        echo "❌ Direct open failed, trying Safari..."
        open -a Safari browser-fix-test.html
        
        if [ $? -eq 0 ]; then
            echo "✅ Safari opened successfully!"
        else
            echo "❌ Safari failed, opening Finder..."
            open .
            echo "📁 Finder opened - please double-click browser-fix-test.html"
        fi
    fi
else
    echo "❌ browser-fix-test.html not found!"
    echo "📋 Available HTML files:"
    ls -la *.html | head -5
fi

echo ""
echo "🎉 Browser fix test completed!"
echo "If browser opened, the fix was successful."

# Keep terminal open
read -n 1 -s -r -p "Press any key to continue..."