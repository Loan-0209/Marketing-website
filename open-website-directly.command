#!/bin/bash

# 🌐 Open HEART Website Directly (No Server Required)
# This script opens the website files directly in browser using file:// protocol

echo "🚀 Opening HEART Website directly..."
echo "=================================="

# Navigate to project directory
cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

# Open main index.html
echo "📂 Opening index.html..."
open "file:///Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/index.html"

# Wait a moment
sleep 2

# Also open 3D Smart City
echo "🏙️ Opening 3D Smart City..."
open "file:///Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/3d-campus-smart-city.html"

echo ""
echo "✅ Files opened in browser!"
echo "=================================="
echo ""
echo "📌 Note: Some features may not work properly without a server:"
echo "  • AJAX requests"
echo "  • Fetch API calls"
echo "  • Module imports"
echo ""
echo "💡 For full functionality, use start-heart-website.py instead"
echo ""