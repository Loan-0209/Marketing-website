#!/bin/bash

echo "🚀 OPENING PROJECT BROWSER"
echo "========================="
echo ""

# Open project dashboard directly
DASHBOARD_FILE="file:///Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/project-dashboard.html"

echo "📊 Opening Project Dashboard..."
echo "📁 Location: project-dashboard.html"
echo ""

# Open the dashboard
open "$DASHBOARD_FILE"

echo "✅ Dashboard opened in browser!"
echo ""
echo "🔍 FEATURES:"
echo "   - Browse all HTML pages"
echo "   - Access 3D Campus versions"
echo "   - View JavaScript files"
echo "   - Navigate to assets & models"
echo ""
echo "⚠️  NOTE: Some features work better with HTTP server"
echo "   To start server, run: python3 start-project-server.py"
echo ""
echo "Press Enter to close..."
read