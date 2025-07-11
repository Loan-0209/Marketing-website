#!/bin/bash

# HEART Technology Park - EMERGENCY SERVER START
# Fixes ERR_CONNECTION_REFUSED with bulletproof startup

echo "🚨 EMERGENCY FIX - Starting HEART Technology Park Server..."
echo "🎯 Goal: Fix ERR_CONNECTION_REFUSED and enable nuclear mode testing"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

echo "📁 Project Directory: $SCRIPT_DIR"
echo "🔧 Running emergency fix..."
echo ""

# Check if Python 3 exists
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    echo "✅ Python 3 found: $(python3 --version)"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    echo "✅ Python found: $(python --version)"
else
    echo "❌ Python not found!"
    echo "🔧 Please install Python from https://python.org"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "🚀 Launching emergency fix script..."
echo ""

# Make emergency fix executable
chmod +x EMERGENCY_FIX.py

# Run emergency fix
$PYTHON_CMD EMERGENCY_FIX.py

echo ""
echo "Emergency fix completed. Press Enter to close..."
read