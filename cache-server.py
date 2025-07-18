#!/usr/bin/env python3
"""
HEART Website Cache-Optimized Server
Implements proper HTTP headers for cache management
"""

import http.server
import socketserver
import os
import mimetypes
import json
import time
from urllib.parse import urlparse, parse_qs
from datetime import datetime, timedelta

class CacheOptimizedHandler(http.server.SimpleHTTPRequestHandler):
    
    def __init__(self, *args, **kwargs):
        # Load version data
        self.version_data = self.load_version_data()
        super().__init__(*args, **kwargs)
    
    def load_version_data(self):
        try:
            with open('image-version.json', 'r') as f:
                return json.load(f)
        except:
            return {"images": {}, "version": "1.0.0"}
    
    def end_headers(self):
        self.send_cache_headers()
        super().end_headers()
    
    def send_cache_headers(self):
        path = self.path.split('?')[0]  # Remove query parameters
        
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-XSS-Protection', '1; mode=block')
        
        # Cache headers based on file type
        if path.endswith('.html'):
            self.send_html_headers()
        elif path.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg')):
            self.send_image_headers(path)
        elif path.endswith(('.css', '.js')):
            self.send_static_headers()
        elif path.endswith('.json'):
            self.send_json_headers()
        else:
            self.send_default_headers()
    
    def send_html_headers(self):
        self.send_header('Cache-Control', 'public, max-age=3600, must-revalidate')
        self.send_header('ETag', f'W/"heart-html-v{self.version_data["version"]}"')
    
    def send_image_headers(self, path):
        # Check if it's a versioned request
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)
        
        if 'v' in query_params or 't' in query_params:
            # Versioned files can be cached longer
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        else:
            # Regular image caching
            if 'hue-location-map' in path:
                self.send_header('Cache-Control', 'public, max-age=604800, must-revalidate')
                self.send_header('ETag', f'W/"heart-map-v1.1.0"')
            else:
                self.send_header('Cache-Control', 'public, max-age=2592000')
        
        self.send_header('Vary', 'Accept-Encoding')
    
    def send_static_headers(self):
        self.send_header('Cache-Control', 'public, max-age=2592000, must-revalidate')
        self.send_header('Vary', 'Accept-Encoding')
    
    def send_json_headers(self):
        if 'image-version.json' in self.path:
            self.send_header('Cache-Control', 'public, max-age=300, must-revalidate')
        else:
            self.send_header('Cache-Control', 'no-cache')
    
    def send_default_headers(self):
        self.send_header('Cache-Control', 'public, max-age=3600')
    
    def log_message(self, format, *args):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")

def run_server(port=3000):
    """Run the cache-optimized server"""
    try:
        with socketserver.TCPServer(("", port), CacheOptimizedHandler) as httpd:
            print(f"🚀 HEART Cache-Optimized Server starting on port {port}")
            print(f"🌐 Access your website at: http://localhost:{port}")
            print(f"📊 Cache headers will be automatically applied")
            print(f"⚡ Press Ctrl+C to stop the server")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    import sys
    
    port = 3000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Invalid port number. Using default port 3000.")
    
    run_server(port)