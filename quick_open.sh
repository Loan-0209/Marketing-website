#!/bin/bash

echo "🌐 OPENING HEART WEBSITE IN BROWSER"
echo "=================================="

cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

# Method 1: Try using `open` command (macOS)
echo "🚀 Method 1: Using macOS 'open' command..."
open heart_standalone.html 2>/dev/null && echo "✅ Opened heart_standalone.html" || echo "❌ Failed to open heart_standalone.html"
sleep 2
open 3d-campus-interactive.html 2>/dev/null && echo "✅ Opened 3d-campus-interactive.html" || echo "❌ Failed to open 3d-campus-interactive.html"

echo ""
echo "🎯 HƯỚNG DẪN KIỂM TRA:"
echo "1. HEART Standalone - Trang chính của website HEART"
echo "2. 3D Campus Interactive - Trang 3D campus với:"
echo "   • Stats panel với FPS counter"
echo "   • Phase controls (1,2,3)" 
echo "   • View controls (Overview, Aerial, Ground)"
echo "   • Interactive buildings"
echo "   • Animated particles background"
echo ""
echo "✅ WEBSITE ĐÃ ĐƯỢC MỞ TRONG BROWSER!"