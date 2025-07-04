#!/bin/bash
echo "🚀 Starting HEART AI Campus Server..."
echo "📁 Directory: $(pwd)"
echo "📋 Files available:"
ls *.html | head -5

echo ""
echo "🌐 Starting server on port 4000..."
python3 -m http.server 4000