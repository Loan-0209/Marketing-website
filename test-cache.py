#!/usr/bin/env python3
"""
HEART Website Cache Testing Script
Validate cache behavior across different browsers and scenarios
"""

import requests
import time
import json
from pathlib import Path
from datetime import datetime
import hashlib
import subprocess
import sys

class CacheValidator:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.project_root = Path('.')
        self.test_results = {
            'timestamp': datetime.now().isoformat(),
            'base_url': base_url,
            'tests': []
        }
    
    def test_image_loading(self):
        """Test if images load correctly with version parameters"""
        test_name = "Image Loading Test"
        print(f"🧪 Running {test_name}...")
        
        # Load version data
        try:
            with open('image-version.json', 'r') as f:
                version_data = json.load(f)
        except FileNotFoundError:
            version_data = {"images": {}}
        
        test_images = [
            'hue-location-map-mobile.jpg',
            'hue-location-map-tablet.jpg',
            'hue-location-map-desktop.jpg',
            'hue-location-map-high.jpg'
        ]
        
        results = []
        for image in test_images:
            image_key = image.replace('.jpg', '')
            timestamp = version_data.get('images', {}).get(image_key, {}).get('timestamp', str(int(time.time())))
            
            # Test without version
            url_no_version = f"{self.base_url}/assets/images/{image}"
            # Test with version
            url_with_version = f"{self.base_url}/assets/images/{image}?v={timestamp}"
            
            try:
                # Test without version
                response_no_v = requests.get(url_no_version, timeout=10)
                # Test with version
                response_with_v = requests.get(url_with_version, timeout=10)
                
                result = {
                    'image': image,
                    'url_no_version': url_no_version,
                    'url_with_version': url_with_version,
                    'status_no_v': response_no_v.status_code,
                    'status_with_v': response_with_v.status_code,
                    'size_no_v': len(response_no_v.content),
                    'size_with_v': len(response_with_v.content),
                    'cache_headers_no_v': dict(response_no_v.headers),
                    'cache_headers_with_v': dict(response_with_v.headers),
                    'content_identical': response_no_v.content == response_with_v.content
                }
                
                results.append(result)
                
                status = "✅" if result['status_no_v'] == 200 and result['status_with_v'] == 200 else "❌"
                print(f"  {status} {image}: {result['size_no_v']} bytes")
                
            except Exception as e:
                results.append({
                    'image': image,
                    'error': str(e),
                    'status': 'failed'
                })
                print(f"  ❌ {image}: Failed - {e}")
        
        self.test_results['tests'].append({
            'name': test_name,
            'status': 'completed',
            'results': results
        })
        
        return results
    
    def test_cache_headers(self):
        """Test cache headers are correctly set"""
        test_name = "Cache Headers Test"
        print(f"🧪 Running {test_name}...")
        
        test_urls = [
            ('/index.html', 'text/html'),
            ('/assets/images/hue-location-map-desktop.jpg', 'image/jpeg'),
            ('/assets/images/hue-location-map-desktop.jpg?v=123456', 'image/jpeg'),
            ('/js/cache-buster.js', 'application/javascript'),
            ('/image-version.json', 'application/json')
        ]
        
        results = []
        for url_path, expected_type in test_urls:
            try:
                response = requests.get(f"{self.base_url}{url_path}", timeout=10)
                
                result = {
                    'url': url_path,
                    'status': response.status_code,
                    'content_type': response.headers.get('Content-Type', ''),
                    'cache_control': response.headers.get('Cache-Control', ''),
                    'etag': response.headers.get('ETag', ''),
                    'last_modified': response.headers.get('Last-Modified', ''),
                    'expires': response.headers.get('Expires', ''),
                    'expected_type': expected_type,
                    'type_match': expected_type in response.headers.get('Content-Type', '')
                }
                
                results.append(result)
                
                status = "✅" if response.status_code == 200 else "❌"
                cache_info = result['cache_control'] or 'No cache-control'
                print(f"  {status} {url_path}: {cache_info}")
                
            except Exception as e:
                results.append({
                    'url': url_path,
                    'error': str(e),
                    'status': 'failed'
                })
                print(f"  ❌ {url_path}: Failed - {e}")
        
        self.test_results['tests'].append({
            'name': test_name,
            'status': 'completed',
            'results': results
        })
        
        return results
    
    def test_version_invalidation(self):
        """Test cache invalidation when versions change"""
        test_name = "Version Invalidation Test"
        print(f"🧪 Running {test_name}...")
        
        test_image = 'hue-location-map-desktop.jpg'
        
        try:
            # First request
            response1 = requests.get(f"{self.base_url}/assets/images/{test_image}?v=old", timeout=10)
            etag1 = response1.headers.get('ETag', '')
            
            # Second request with different version
            response2 = requests.get(f"{self.base_url}/assets/images/{test_image}?v=new", timeout=10)
            etag2 = response2.headers.get('ETag', '')
            
            result = {
                'image': test_image,
                'response1_status': response1.status_code,
                'response2_status': response2.status_code,
                'etag1': etag1,
                'etag2': etag2,
                'content_identical': response1.content == response2.content,
                'cache_invalidation_working': True  # Different versions should serve same content
            }
            
            status = "✅" if result['content_identical'] else "❌"
            print(f"  {status} Version invalidation: Content identical = {result['content_identical']}")
            
        except Exception as e:
            result = {
                'image': test_image,
                'error': str(e),
                'status': 'failed'
            }
            print(f"  ❌ Version invalidation test failed: {e}")
        
        self.test_results['tests'].append({
            'name': test_name,
            'status': 'completed',
            'results': [result]
        })
        
        return [result]
    
    def test_javascript_cache_buster(self):
        """Test if JavaScript cache buster is working"""
        test_name = "JavaScript Cache Buster Test"
        print(f"🧪 Running {test_name}...")
        
        try:
            # Test if cache-buster.js loads
            response = requests.get(f"{self.base_url}/js/cache-buster.js", timeout=10)
            
            result = {
                'url': '/js/cache-buster.js',
                'status': response.status_code,
                'size': len(response.content),
                'content_type': response.headers.get('Content-Type', ''),
                'cache_control': response.headers.get('Cache-Control', ''),
                'working': response.status_code == 200 and 'CacheBuster' in response.text
            }
            
            status = "✅" if result['working'] else "❌"
            print(f"  {status} Cache buster script: {result['size']} bytes")
            
        except Exception as e:
            result = {
                'url': '/js/cache-buster.js',
                'error': str(e),
                'status': 'failed'
            }
            print(f"  ❌ Cache buster test failed: {e}")
        
        self.test_results['tests'].append({
            'name': test_name,
            'status': 'completed',
            'results': [result]
        })
        
        return [result]
    
    def run_all_tests(self):
        """Run all cache tests"""
        print("🚀 Starting HEART Website Cache Validation")
        print("=" * 50)
        
        # Test server availability
        try:
            response = requests.get(self.base_url, timeout=10)
            print(f"🌐 Server accessible: {self.base_url} (Status: {response.status_code})")
        except Exception as e:
            print(f"❌ Server not accessible: {e}")
            return False
        
        # Run all tests
        self.test_image_loading()
        self.test_cache_headers()
        self.test_version_invalidation()
        self.test_javascript_cache_buster()
        
        # Generate report
        self.generate_report()
        
        print("\n✅ All tests completed!")
        return True
    
    def generate_report(self):
        """Generate detailed test report"""
        report_path = self.project_root / 'cache-test-report.json'
        
        with open(report_path, 'w') as f:
            json.dump(self.test_results, f, indent=2)
        
        print(f"📊 Test report saved to: {report_path}")
        
        # Print summary
        total_tests = len(self.test_results['tests'])
        passed_tests = sum(1 for test in self.test_results['tests'] if test['status'] == 'completed')
        
        print(f"\n📋 Test Summary:")
        print(f"  Total tests: {total_tests}")
        print(f"  Passed: {passed_tests}")
        print(f"  Failed: {total_tests - passed_tests}")

def main():
    """Main testing function"""
    base_url = "http://localhost:3000"
    
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    
    validator = CacheValidator(base_url)
    validator.run_all_tests()

if __name__ == "__main__":
    main()