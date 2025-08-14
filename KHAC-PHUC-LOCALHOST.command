#!/bin/bash

echo "🔧 KHẮC PHỤC LỖI LOCALHOST - HEART WEBSITE"
echo "=========================================="

cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "📁 Thư mục: $(pwd)"
echo ""

# Bước 1: Dừng tất cả server cũ
echo "🛑 DỪNG TẤT CẢ SERVER CŨ..."
echo "Killing Python HTTP servers..."
pkill -f "python.*http.server" 2>/dev/null || echo "No Python servers to kill"

echo "Checking and killing processes on common ports..."
for port in 8000 8080 8888 9000 9999; do
    if lsof -ti:$port >/dev/null 2>&1; then
        echo "Killing process on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
    fi
done

echo "✅ Server cleanup complete"
echo ""

# Bước 2: Tìm port trống
echo "🔍 TÌM PORT TRỐNG..."
WORKING_PORT=""

for port in 8000 8080 8888 9000 9999 3000 5000; do
    if ! lsof -i:$port >/dev/null 2>&1; then
        echo "✅ Port $port is available"
        WORKING_PORT=$port
        break
    else
        echo "❌ Port $port is busy"
    fi
done

if [ -z "$WORKING_PORT" ]; then
    echo "⚠️ All common ports busy, using 8000 anyway"
    WORKING_PORT=8000
fi

echo "🎯 Selected port: $WORKING_PORT"
echo ""

# Bước 3: Kiểm tra files
echo "🔍 KIỂM TRA FILES WEBSITE..."
main_files=("index.html" "heart_standalone.html" "3d-campus-interactive.html")
found_files=0

for file in "${main_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - Found"
        ((found_files++))
    else
        echo "❌ $file - Missing"
    fi
done

if [ $found_files -eq 0 ]; then
    echo "❌ Không tìm thấy file website!"
    echo "🚑 Creating emergency index.html..."
    
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>HEART - Emergency Server</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            margin: 0;
            padding: 40px;
            text-align: center;
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        .status {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .links a {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 25px;
            margin: 5px;
        }
    </style>
</head>
<body>
    <h1>🚀 HEART</h1>
    <div class="status">
        <h3>✅ Localhost Server Active</h3>
        <p>Emergency server running successfully!</p>
    </div>
    <div class="links">
        <a href="heart_standalone.html">❤️ Standalone</a>
        <a href="3d-campus-interactive.html">🎮 3D Campus</a>
    </div>
</body>
</html>
EOF
    
    echo "✅ Emergency index.html created"
fi

echo ""

# Bước 4: Khởi động server
echo "🚀 KHỞI ĐỘNG SERVER..."
echo "Port: $WORKING_PORT"
echo "URL: http://localhost:$WORKING_PORT"
echo ""
echo "🌐 WEBSITE URLs:"
echo "   🏠 Main: http://localhost:$WORKING_PORT/"
echo "   📱 Homepage: http://localhost:$WORKING_PORT/index.html"
echo "   ❤️ Standalone: http://localhost:$WORKING_PORT/heart_standalone.html"
echo "   🎮 3D Campus: http://localhost:$WORKING_PORT/3d-campus-interactive.html"
echo ""
echo "✅ SERVER STARTING..."
echo "🌐 Browser sẽ mở tự động sau 3 giây"
echo "⏹️ Nhấn Ctrl+C để dừng server"
echo "=" * 50

# Mở browser tự động
(sleep 3 && open "http://localhost:$WORKING_PORT") &

# Khởi động server
python3 -m http.server $WORKING_PORT