#!/bin/bash

echo "🚀 HEART Technology Park - QUICK START"
echo "======================================"

# Step 1: Go to directory
cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/
echo "📁 Directory: $(pwd)"

# Step 2: Check files
if [ -f "about.html" ]; then
    echo "✅ about.html exists"
else
    echo "❌ about.html missing"
    exit 1
fi

# Step 3: Start simple Python server
echo "🐍 Starting Python server on port 8000..."
python3 -m http.server 8000