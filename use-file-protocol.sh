#!/bin/bash

use_file_protocol() {
    echo "📁 USING FILE PROTOCOL (Bypass Network)"
    echo "======================================"
    
    # Change to project directory
    cd /Users/thuyloan0209/Documents/Test_WEBSITE_2025.06.18/
    
    # Get absolute path
    ABS_PATH=$(pwd)
    
    # Create enhanced HTML file that works with file://
    cat > standalone.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HEART - Data Center (Standalone)</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            min-height: 100vh;
            color: white;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 50px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
        }
        .logo {
            font-size: 1.8em;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .nav {
            display: flex;
            gap: 30px;
        }
        .nav a {
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 25px;
            transition: background 0.3s;
        }
        .nav a:hover, .nav a.active {
            background: rgba(255,255,255,0.2);
        }
        .hero {
            text-align: center;
            padding: 100px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .hero h1 {
            font-size: 4em;
            margin-bottom: 30px;
            font-weight: bold;
        }
        .hero p {
            font-size: 1.3em;
            margin-bottom: 50px;
            opacity: 0.9;
            line-height: 1.6;
        }
        .buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .btn {
            padding: 15px 40px;
            border-radius: 30px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s ease;
            display: inline-block;
        }
        .btn-primary {
            background: #f59e0b;
            color: white;
        }
        .btn-secondary {
            background: transparent;
            color: white;
            border: 2px solid white;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .status {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
        }
        .section {
            padding: 80px 50px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            backdrop-filter: blur(10px);
        }
        .feature h3 {
            font-size: 1.5em;
            margin-bottom: 15px;
        }
        @media (max-width: 768px) {
            .header { padding: 15px 20px; flex-direction: column; gap: 20px; }
            .nav { gap: 15px; }
            .hero h1 { font-size: 2.5em; }
            .buttons { flex-direction: column; align-items: center; }
            .section { padding: 40px 20px; }
        }
    </style>
</head>
<body>
    <div class="status">
        ✅ Standalone Mode<br>
        📁 File Protocol<br>
        🌐 Network Bypass
    </div>
    
    <header class="header">
        <div class="logo">
            🚀 HEART
        </div>
        <nav class="nav">
            <a href="#home" class="active">Home</a>
            <a href="#about">About Us</a>
            <a href="#masterplan">Master Plan</a>
            <a href="#campus">3D Campus</a>
            <a href="#facilities">Facilities</a>
            <a href="#investment">Investment</a>
            <a href="#technology">Technology</a>
            <a href="#news">News</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>
    
    <main id="home" class="hero">
        <h1>HEART</h1>
        <p>
            Vietnam's First 300MW AI-Optimized Hyperscale Data Center<br>
            Strategically positioned in Central Vietnam with 500kV onsite grid and<br>
            international connectivity for global AI workloads
        </p>
        
        <div class="buttons">
            <a href="#about" class="btn btn-primary">Explore Our Vision</a>
            <a href="#masterplan" class="btn btn-secondary">View Master Plan</a>
        </div>
    </main>
    
    <section id="about" class="section">
        <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 30px;">About HEART Project</h2>
        <div class="features">
            <div class="feature">
                <h3>🏗️ 300MW Capacity</h3>
                <p>Massive hyperscale data center designed for AI workloads with unprecedented power capacity for Southeast Asia.</p>
            </div>
            <div class="feature">
                <h3>🤖 AI-Optimized</h3>
                <p>Purpose-built infrastructure optimized for artificial intelligence and machine learning applications.</p>
            </div>
            <div class="feature">
                <h3>🌍 Strategic Location</h3>
                <p>Located in Hue Hi-Tech State-owned Park with excellent connectivity and infrastructure.</p>
            </div>
        </div>
    </section>
    
    <section id="masterplan" class="section">
        <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 30px;">Master Plan</h2>
        <div class="features">
            <div class="feature">
                <h3>Phase 1: Foundation</h3>
                <p>Initial infrastructure, administration buildings, and core data center facilities.</p>
            </div>
            <div class="feature">
                <h3>Phase 2: Expansion</h3>
                <p>Additional data halls, startup incubators, and commercial facilities.</p>
            </div>
            <div class="feature">
                <h3>Phase 3: Integration</h3>
                <p>Complete ecosystem with residential, transport, and energy infrastructure.</p>
            </div>
        </div>
    </section>
    
    <section id="facilities" class="section">
        <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 30px;">World-Class Facilities</h2>
        <div class="features">
            <div class="feature">
                <h3>⚡ 500kV Grid Connection</h3>
                <p>Direct connection to Vietnam's national power grid ensuring reliable electricity supply.</p>
            </div>
            <div class="feature">
                <h3>🌐 International Connectivity</h3>
                <p>Multiple submarine cable landings and terrestrial fiber connections.</p>
            </div>
            <div class="feature">
                <h3>❄️ Advanced Cooling</h3>
                <p>State-of-the-art cooling systems optimized for tropical climate efficiency.</p>
            </div>
        </div>
    </section>
    
    <script>
        console.log('🏠 HEART Standalone Website loaded');
        console.log('📁 Running in file:// protocol mode');
        console.log('✅ Network issues bypassed');
        
        // Smooth scrolling for navigation
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Smooth scroll to section
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Status indicator with live updates
        setInterval(() => {
            const status = document.querySelector('.status');
            const time = new Date().toLocaleTimeString();
            status.innerHTML = `✅ Standalone Mode<br>📁 File Protocol<br>🌐 Network Bypass<br>⏰ ${time}`;
        }, 1000);
        
        // Welcome message
        setTimeout(() => {
            alert('🎉 HEART Website Loading Complete!\n\n✅ Running in standalone mode\n📁 Using file:// protocol\n🌐 Network bypass successful\n\nNo server required!');
        }, 1500);
    </script>
</body>
</html>
EOF
    
    echo "✅ Created standalone website: standalone.html"
    echo "🔗 Opening with file:// protocol..."
    
    # Open with file protocol
    open "file://$ABS_PATH/standalone.html"
    
    echo "✅ Website opened without network server!"
    echo "📁 Full path: file://$ABS_PATH/standalone.html"
    echo ""
    echo "🎯 BENEFITS OF FILE PROTOCOL:"
    echo "   ✅ No server required"
    echo "   ✅ No network dependencies"
    echo "   ✅ No port conflicts"
    echo "   ✅ No firewall issues"
    echo "   ✅ Instant loading"
    echo "   ✅ Works offline"
    echo ""
    echo "📋 TO ACCESS AGAIN:"
    echo "   Double-click: standalone.html"
    echo "   Or use: file://$ABS_PATH/standalone.html"
}

use_file_protocol