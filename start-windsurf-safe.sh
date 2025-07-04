#!/bin/bash
echo "🚀 Starting Windsurf with optimized settings..."

# Apply MCP disable flag
export WINDSURF_DISABLE_MCP=true
export WINDSURF_OFFLINE_MODE=true

# Start Windsurf with safe parameters
windsurf --disable-mcp --disable-telemetry --disable-updates . &

echo "✅ Windsurf started with MCP disabled"
