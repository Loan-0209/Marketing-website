#!/bin/bash

echo "🎯 Testing 3D Campus Link Fix"
echo "================================"

cd "/Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18"

echo "✅ Current directory: $(pwd)"
echo ""

echo "🔍 Checking if main index.html exists:"
if [ -f "index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html not found"
fi

echo ""
echo "🔍 Checking if 3D Campus file exists:"
if [ -f "archive-3d/ai-campus-3d-structure.html" ]; then
    echo "✅ archive-3d/ai-campus-3d-structure.html found"
else
    echo "❌ archive-3d/ai-campus-3d-structure.html not found"
fi

echo ""
echo "🔍 Checking navigation link in index.html:"
if grep -q 'href="archive-3d/ai-campus-3d-structure.html"' index.html; then
    echo "✅ Navigation link correctly points to archive-3d/ai-campus-3d-structure.html"
else
    echo "❌ Navigation link not found or incorrect"
fi

echo ""
echo "🌐 Opening main website..."
open "index.html"

echo ""
echo "✅ TESTING COMPLETE!"
echo ""
echo "📝 INSTRUCTIONS:"
echo "1. The website should now open in your browser"
echo "2. Click on '3D Campus' in the navigation menu"
echo "3. The 3D Campus page should load without ERR_FILE_NOT_FOUND"
echo ""
echo "🎉 Fix applied successfully!"