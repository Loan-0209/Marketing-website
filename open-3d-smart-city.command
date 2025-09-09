#!/bin/bash
# Open 3D Smart City in default browser
cd "$(dirname "$0")"
open "3d-smart-city.html"
echo "✅ Opening 3D Smart City in your default browser..."
echo "📋 After it loads, you can:"
echo "   • Press F12 to open Developer Console"
echo "   • Copy/paste the comprehensive-test.js script to validate everything"
echo "   • Check for any remaining errors in the Console tab"