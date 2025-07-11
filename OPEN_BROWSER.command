#!/bin/bash

echo "🚀 HEART Technology Park - Browser Launcher"
echo "============================================"

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Define the HTML file path
HTML_FILE="$DIR/index.html"

echo "📁 Project directory: $DIR"
echo "📄 HTML file: $HTML_FILE"

# Check if the HTML file exists
if [ ! -f "$HTML_FILE" ]; then
    echo "❌ Error: index.html not found!"
    echo "📍 Expected location: $HTML_FILE"
    exit 1
fi

echo ""
echo "🔄 Attempting to open browser..."

# Try multiple methods to open the browser
if command -v open >/dev/null 2>&1; then
    echo "🍎 Using macOS 'open' command..."
    open "$HTML_FILE"
    if [ $? -eq 0 ]; then
        echo "✅ Success! Browser should open now."
        echo "📱 You should see the HEART Technology Park website"
        echo ""
        echo "🔗 Direct file URL:"
        echo "file://$HTML_FILE"
        exit 0
    else
        echo "❌ 'open' command failed"
    fi
fi

# Fallback method
echo ""
echo "❌ Automatic browser opening failed"
echo ""
echo "📋 Manual Instructions:"
echo "1. Open Finder"
echo "2. Navigate to: $DIR"
echo "3. Double-click on 'index.html'"
echo ""
echo "🔗 Or copy this URL to your browser:"
echo "file://$HTML_FILE"
echo ""
echo "Press any key to close this window..."
read -n 1