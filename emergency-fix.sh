#!/bin/bash

echo "🚑 EMERGENCY LOCALHOST FIX"
echo "=========================="

# Change to website directory
cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"
echo "📁 Directory: $(pwd)"

# Kill existing servers
echo "🛑 Killing existing servers..."
pkill -f "python.*http.server" 2>/dev/null || true
for port in 8000 8080 8888 9000 9999; do
    lsof -ti :$port | xargs kill -9 2>/dev/null || true
done
echo "✅ Cleanup complete"

# Find working port
working_port=8000
for port in 8000 8080 8888 9000 9999; do
    if ! lsof -i :$port >/dev/null 2>&1; then
        working_port=$port
        break
    fi
done

echo "🎯 Using port: $working_port"

# Create emergency index if needed
if [ ! -f "index.html" ]; then
    echo "🚑 Creating emergency index..."
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html><head><title>HEART Emergency</title>
<style>body{font-family:Arial;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;text-align:center;padding:50px;}
h1{font-size:3em;}</style></head>
<body><h1>🚀 HEART</h1><h2>✅ Emergency Server Active</h2>
<p>Localhost connection fixed!</p>
<a href="heart_standalone.html" style="color:yellow;">❤️ Standalone</a> | 
<a href="3d-campus-interactive.html" style="color:yellow;">🎮 3D Campus</a>
</body></html>
EOF
fi

# Display URLs
base_url="http://localhost:$working_port"
echo ""
echo "🌐 AVAILABLE URLs:"
echo "   🏠 Main: $base_url/"
echo "   ❤️ Standalone: $base_url/heart_standalone.html"
echo "   🎮 3D Campus: $base_url/3d-campus-interactive.html"
echo "   🏢 Facilities: $base_url/facilities.html"
echo ""

# Open browser automatically
echo "🌐 Opening browser automatically..."
open "$base_url" 2>/dev/null || echo "📋 Manual: Open $base_url in browser"

# Start server
echo "🚀 Starting server on port $working_port..."
echo "⏹️ Press Ctrl+C to stop"
echo "=========================="

python3 -m http.server $working_port