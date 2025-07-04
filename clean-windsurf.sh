#!/bin/bash
echo "🧹 Cleaning Windsurf cache and MCP data..."
rm -rf ~/.windsurf/logs/*
rm -rf ~/.windsurf/CachedData/*
rm -rf ~/.windsurf/User/workspaceStorage/*
echo "✅ Cache cleared"

echo "🔧 Disabling MCP services..."
pkill -f "mcp-server" 2>/dev/null || true
echo "✅ MCP processes stopped"

echo "🚀 Ready to restart Windsurf" 
