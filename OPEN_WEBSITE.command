#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Opening HEART Technology Park..."
python3 -m http.server 8000 &
sleep 2
open http://localhost:8000/about.html
echo "✅ Website opened at http://localhost:8000/about.html"
echo "💥 Nuclear gradient removal will activate automatically"
wait