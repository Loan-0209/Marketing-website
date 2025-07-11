#!/bin/bash

echo "🚀 Opening HEART Technology Park - About Page"
echo "============================================"

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Define the HTML file path
HTML_FILE="$DIR/about.html"

echo "📁 Project directory: $DIR"
echo "📄 HTML file: $HTML_FILE"

# Open the file
open "$HTML_FILE"

echo "✅ Opening About page with white sidebar and blue building!"
echo "🎨 New features:"
echo "   - White sidebar background"
echo "   - Dark text for better readability"
echo "   - Blue building with orange windows"
echo "   - Modern purple CTA button"
echo "   - Clean professional look"