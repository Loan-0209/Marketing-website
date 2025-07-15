#!/bin/bash

# HEART Backend Server Status & Management Script
# This script provides comprehensive server monitoring and management

echo "🚀 HEART Backend Server Status Report"
echo "======================================"
echo "Timestamp: $(date)"
echo ""

# Check PM2 status
echo "📊 PM2 Process Status:"
echo "----------------------"
pm2 status 2>/dev/null || echo "❌ PM2 not running or not installed"
echo ""

# Check server connectivity
echo "🌐 Server Connectivity Test:"
echo "----------------------------"
HEALTH_URL="http://localhost:5001/api/health"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" --connect-timeout 5)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Server is responding (HTTP $HTTP_CODE)"
    HEALTH_DATA=$(curl -s "$HEALTH_URL" 2>/dev/null)
    echo "📋 Health Check Response: $HEALTH_DATA"
else
    echo "❌ Server not responding (HTTP $HTTP_CODE)"
fi
echo ""

# Check port status
echo "🔌 Port Status:"
echo "---------------"
PORT_CHECK=$(lsof -i :5001 2>/dev/null)
if [ -n "$PORT_CHECK" ]; then
    echo "✅ Port 5001 is in use:"
    echo "$PORT_CHECK"
else
    echo "❌ Port 5001 is not in use"
fi
echo ""

# Check Node.js processes
echo "🔧 Node.js Processes:"
echo "--------------------"
NODE_PROCESSES=$(ps aux | grep "node" | grep -v grep)
if [ -n "$NODE_PROCESSES" ]; then
    echo "$NODE_PROCESSES"
else
    echo "❌ No Node.js processes found"
fi
echo ""

# Check MongoDB connectivity (if applicable)
echo "🗄️  Database Connectivity:"
echo "--------------------------"
MONGO_CHECK=$(netstat -an 2>/dev/null | grep ":27017" | grep LISTEN)
if [ -n "$MONGO_CHECK" ]; then
    echo "✅ MongoDB appears to be running on port 27017"
else
    echo "⚠️  MongoDB not detected on port 27017"
fi
echo ""

# System resources
echo "💻 System Resources:"
echo "-------------------"
echo "Memory Usage:"
if command -v free &> /dev/null; then
    free -h
elif command -v vm_stat &> /dev/null; then
    # macOS memory info
    vm_stat | head -5
fi

echo ""
echo "Disk Usage:"
df -h / 2>/dev/null | tail -1

echo ""
echo "Load Average:"
uptime
echo ""

# Check logs for errors
echo "📝 Recent Error Logs (last 5 lines):"
echo "------------------------------------"
if [ -f "./logs/err.log" ]; then
    tail -5 ./logs/err.log 2>/dev/null || echo "No recent errors in PM2 error log"
else
    echo "No PM2 error log found"
fi
echo ""

# PM2 logs summary
echo "📋 Recent Server Logs (last 5 lines):"
echo "-------------------------------------"
if [ -f "./logs/out.log" ]; then
    tail -5 ./logs/out.log 2>/dev/null || echo "No recent output in PM2 output log"
else
    echo "No PM2 output log found"
fi
echo ""

# Restart commands help
echo "🛠️  Management Commands:"
echo "------------------------"
echo "To restart the server: pm2 restart heart-backend"
echo "To stop the server: pm2 stop heart-backend"
echo "To view logs: pm2 logs heart-backend"
echo "To monitor: pm2 monit"
echo "To check this status: ./scripts/server-status.sh"
echo ""

# Auto-restart check
echo "🔄 Auto-restart Configuration:"
echo "------------------------------"
if pm2 describe heart-backend &>/dev/null; then
    echo "✅ PM2 is managing the heart-backend process"
    pm2 describe heart-backend | grep -E "(restart time|uptime|status)"
else
    echo "❌ PM2 is not managing the heart-backend process"
fi
echo ""

echo "Report complete. For real-time monitoring, run: pm2 monit"