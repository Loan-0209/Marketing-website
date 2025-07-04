@echo off
echo 🧹 Cleaning Windsurf cache and MCP data...
rmdir /s /q "%APPDATA%\Windsurf\logs" 2>nul
rmdir /s /q "%APPDATA%\Windsurf\CachedData" 2>nul
rmdir /s /q "%APPDATA%\Windsurf\User\workspaceStorage" 2>nul
echo ✅ Cache cleared

echo 🔧 Disabling MCP services...
taskkill /f /im "mcp-server*" 2>nul
echo ✅ MCP processes stopped

echo 🚀 Ready to restart Windsurf
pause
