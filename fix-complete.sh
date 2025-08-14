#!/bin/bash

fix_web_server() {
    echo "🛠️ FIXING WEB SERVER CONNECTION ISSUES"
    echo "======================================"
    
    # Step 1: Navigate to correct directory
    echo "📂 Step 1: Navigate to project directory..."
    cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/ || {
        echo "❌ Cannot access project directory"
        echo "📁 Please check if directory exists:"
        echo "   ls -la /Users/thuyloan0209/Documents/"
        return 1
    }
    
    echo "✅ In project directory: $(pwd)"
    
    # Step 2: Kill any existing servers
    echo -e "\n🛑 Step 2: Stopping conflicting servers..."
    
    # Kill Python HTTP servers
    pkill -f "python.*http.server" 2>/dev/null && echo "✅ Stopped Python servers" || echo "ℹ️ No Python servers to stop"
    
    # Kill processes on common ports
    for port in 8080 9999 3000 5500; do
        if lsof -ti:$port > /dev/null 2>&1; then
            echo "🔄 Killing process on port $port..."
            lsof -ti:$port | xargs kill -9 2>/dev/null
            sleep 1
        fi
    done
    
    # Wait for ports to be released
    echo "⏳ Waiting for ports to be released..."
    sleep 3
    
    # Step 3: Create index.html if missing
    echo -e "\n📄 Step 3: Ensuring homepage exists..."
    if [ ! -f "index.html" ]; then
        echo "⚠️ No index.html found, creating basic homepage..."
        cat > index-temp.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HEART - Data Center Project</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 50px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            max-width: 800px;
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        p { font-size: 1.2em; margin-bottom: 30px; }
        .nav-links { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
        .nav-link {
            padding: 15px 30px;
            background: rgba(255,255,255,0.2);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: all 0.3s ease;
        }
        .nav-link:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 HEART</h1>
        <p>Vietnam's First 300MW AI-Optimized Hyperscale Data Center</p>
        <div class="nav-links">
            <a href="archive-3d/ai-campus-3d-structure.html" class="nav-link">🏛️ 3D Campus</a>
            <a href="enhanced-ai-campus-3d.html" class="nav-link">✨ Enhanced Campus</a>
            <a href="perfect-daytime-ai-campus-3d.html" class="nav-link">☀️ Daytime Campus</a>
            <a href="js/master-plan-3d.js" class="nav-link">📜 Master Plan</a>
        </div>
    </div>
    
    <script>
        console.log('🏠 HEART Homepage loaded successfully');
        console.log('✅ Server working correctly');
    </script>
</body>
</html>
EOF
        echo "✅ Created temporary homepage: index-temp.html"
    else
        echo "✅ Homepage exists: index.html"
    fi
    
    # Step 4: Find available port
    echo -e "\n🔌 Step 4: Finding available port..."
    PORT=8080
    for test_port in 8080 9999 3000 5500 8000; do
        if ! lsof -ti:$test_port > /dev/null 2>&1; then
            PORT=$test_port
            echo "✅ Using available port: $PORT"
            break
        fi
    done
    
    # Step 5: Start server with verbose logging
    echo -e "\n🚀 Step 5: Starting web server..."
    echo "📂 Serving from: $(pwd)"
    echo "🔌 Port: $PORT"
    
    # Start server with output capture
    python3 -m http.server $PORT > server_output.log 2>&1 &
    SERVER_PID=$!
    
    # Wait for server startup
    echo "⏳ Starting server (PID: $SERVER_PID)..."
    sleep 4
    
    # Step 6: Verify server is running
    echo -e "\n✅ Step 6: Verifying server status..."
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo "✅ Server process is running (PID: $SERVER_PID)"
        
        # Test HTTP connectivity
        echo "🧪 Testing HTTP connectivity..."
        if curl -s --connect-timeout 10 "http://localhost:$PORT/" > /dev/null; then
            echo "✅ HTTP server responding correctly"
            
            # Step 7: Open browser
            echo -e "\n🌐 Step 7: Opening browser..."
            local url="http://localhost:$PORT/"
            echo "🔗 URL: $url"
            
            # macOS
            if command -v open &> /dev/null; then
                open "$url"
                echo "✅ Browser opened successfully"
            else
                echo "📱 Please manually open: $url"
            fi
            
            # Save server info
            echo $SERVER_PID > .server_pid
            echo $PORT > .server_port
            
            echo -e "\n🎉 SUCCESS! Web server is running"
            echo "📊 Server Information:"
            echo "   🔗 URL: http://localhost:$PORT/"
            echo "   🆔 Process ID: $SERVER_PID"
            echo "   📝 Log file: server_output.log"
            echo "   🛑 Stop command: kill $SERVER_PID"
            
            echo -e "\n🎯 MAIN PAGES TO VISIT:"
            echo "   🏠 Homepage: http://localhost:$PORT/"
            echo "   🏛️ 3D Campus: http://localhost:$PORT/archive-3d/ai-campus-3d-structure.html"
            echo "   📊 Dashboard: http://localhost:$PORT/project-dashboard.html"
            echo "   🧪 Test Page: http://localhost:$PORT/TEST_LOCALHOST.html"
            
            # Show first few lines of server log
            echo -e "\n📋 Server startup log:"
            head -5 server_output.log 2>/dev/null || echo "No log output yet"
            
            echo -e "\n🛑 Press Enter to stop server..."
            read
            kill $SERVER_PID 2>/dev/null
            echo "✅ Server stopped"
            
        else
            echo "❌ Server not responding to HTTP requests"
            echo "📝 Server log:"
            cat server_output.log 2>/dev/null || echo "No log file"
            kill $SERVER_PID 2>/dev/null
            return 1
        fi
    else
        echo "❌ Server process failed to start"
        echo "📝 Server log:"
        cat server_output.log 2>/dev/null || echo "No log file"
        return 1
    fi
}

# Run the complete fix
fix_web_server