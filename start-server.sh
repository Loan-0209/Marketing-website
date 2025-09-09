#\!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting local server..."
echo "📍 URL will be: http://localhost:8080/3d-smart-city.html"
echo "🔄 Server starting in 3 seconds..."
sleep 3
python3 -m http.server 8080
