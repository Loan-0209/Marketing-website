#!/bin/bash

echo "🚀 HEART Technology Park - Final About Page"
echo "=========================================="

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Define the HTML file path
HTML_FILE="$DIR/about.html"

echo "📁 Project directory: $DIR"
echo "📄 HTML file: $HTML_FILE"

echo ""
echo "🔄 Opening final About page..."

# Open the file
open "$HTML_FILE"

echo "✅ Final About page opened!"
echo ""
echo "🎯 What you should see:"
echo "   ✅ Blue building with 'HEART TECHNOLOGY' title"
echo "   ✅ Building is straight (no rotation)"
echo "   ✅ Orange/white/yellow windows on blue background"
echo "   ✅ Building occupies full right sidebar"
echo "   ✅ Features cards at bottom (no CTA button)"
echo "   ✅ Clean professional layout"
echo ""
echo "🏢 Building Features:"
echo "   - Size: 90% x 85% of sidebar"
echo "   - Color: Blue background #3b82f6"
echo "   - Title: HEART TECHNOLOGY"
echo "   - Animation: Float up/down only (no rotation)"
echo "   - Windows: 50px x 25px each"
echo ""
echo "📱 Layout Structure:"
echo "   - Top: Main content + Building sidebar"
echo "   - Bottom: 6 feature cards (no CTA button)"
echo "   - Clean ending without extra buttons"