#!/bin/bash

# HEART Technology Park - One-Click Server Start
# Double-click this file to start the development server

echo "🚀 HEART Technology Park - Starting Development Server..."

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

echo "📁 Project Directory: $SCRIPT_DIR"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found!"
    echo "Please install Python 3 from https://python.org"
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Make the Python script executable
chmod +x dev-server.py

echo "🔧 Starting bulletproof development server..."
echo ""

# Run the development server
python3 dev-server.py

echo ""
echo "Server has stopped. Press Enter to close this window..."
read