#!/usr/bin/env python3
"""
Advanced 3D Files Analysis Script
Phân tích chi tiết tất cả file 3D trong project
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime
import re

def analyze_gltf_file(filepath):
    """Analyze GLTF file content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Basic statistics
        stats = {
            'scenes': len(data.get('scenes', [])),
            'nodes': len(data.get('nodes', [])),
            'meshes': len(data.get('meshes', [])),
            'materials': len(data.get('materials', [])),
            'textures': len(data.get('textures', [])),
            'animations': len(data.get('animations', [])),
            'accessors': len(data.get('accessors', [])),
            'bufferViews': len(data.get('bufferViews', [])),
            'buffers': len(data.get('buffers', [])),
        }
        
        # Calculate complexity score
        complexity_score = (
            stats['meshes'] * 5 +      # Meshes are most important
            stats['nodes'] * 3 +       # Nodes show structure
            stats['materials'] * 2 +   # Materials affect visuals
            stats['textures'] * 3 +    # Textures add detail  
            stats['animations'] * 8    # Animations are complex
        )
        
        # Check for campus-related content
        campus_keywords = ['campus', 'building', 'ground', 'tree', 'road', 'landscape', 'facility']
        has_campus_content = False
        campus_score = 0
        
        # Check asset info
        asset_info = data.get('asset', {})
        generator = asset_info.get('generator', 'Unknown')
        
        # Check node names for campus content
        if 'nodes' in data:
            for node in data['nodes']:
                node_name = node.get('name', '').lower()
                for keyword in campus_keywords:
                    if keyword in node_name:
                        has_campus_content = True
                        campus_score += 1
        
        # Check mesh names 
        if 'meshes' in data:
            for mesh in data['meshes']:
                mesh_name = mesh.get('name', '').lower()
                for keyword in campus_keywords:
                    if keyword in mesh_name:
                        has_campus_content = True
                        campus_score += 1
        
        # Analyze geometry complexity
        total_vertices = 0
        total_triangles = 0
        
        if 'accessors' in data:
            for accessor in data['accessors']:
                if accessor.get('type') == 'VEC3':
                    total_vertices += accessor.get('count', 0)
        
        # Estimate triangles from indices
        for accessor in data['accessors']:
            if accessor.get('type') == 'SCALAR':
                total_triangles += accessor.get('count', 0) // 3
        
        return {
            'valid': True,
            'stats': stats,
            'complexity_score': complexity_score,
            'has_campus_content': has_campus_content,
            'campus_score': campus_score,
            'total_vertices': total_vertices,
            'total_triangles': total_triangles,
            'file_size': os.path.getsize(filepath),
            'generator': generator,
            'line_count': sum(1 for line in open(filepath, 'r', encoding='utf-8'))
        }
    except Exception as e:
        return {
            'valid': False,
            'error': str(e),
            'file_size': os.path.getsize(filepath) if os.path.exists(filepath) else 0
        }

def analyze_js_file(filepath):
    """Analyze JavaScript file for 3D content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for 3D-related patterns
        patterns = {
            'three_js_usage': len(re.findall(r'THREE\.\w+', content)),
            'gltf_loading': len(re.findall(r'GLTFLoader|gltf|\.load\(', content)),
            'geometry_creation': len(re.findall(r'Geometry\(|createGeometry|BoxGeometry|PlaneGeometry', content)),
            'material_creation': len(re.findall(r'Material\(|MeshBasic|MeshPhong|MeshStandard', content)),
            'scene_management': len(re.findall(r'scene\.add|scene\.remove|new.*Scene', content)),
            'camera_controls': len(re.findall(r'PerspectiveCamera|OrbitControls|camera\.position', content)),
            'lighting': len(re.findall(r'Light\(|DirectionalLight|AmbientLight|PointLight', content)),
            'animation': len(re.findall(r'requestAnimationFrame|animate\(|\.rotation\.|\.position\.', content)),
            'campus_keywords': len(re.findall(r'campus|building|facility|structure', content, re.IGNORECASE))
        }
        
        # Calculate 3D complexity score
        complexity_score = (
            patterns['three_js_usage'] * 2 +
            patterns['gltf_loading'] * 5 +
            patterns['geometry_creation'] * 3 +
            patterns['material_creation'] * 3 +
            patterns['scene_management'] * 4 +
            patterns['camera_controls'] * 2 +
            patterns['lighting'] * 3 +
            patterns['animation'] * 2 +
            patterns['campus_keywords'] * 1
        )
        
        # Check for specific 3D frameworks/features
        has_advanced_features = any([
            'WebGLRenderer' in content,
            'postprocessing' in content.lower(),
            'shader' in content.lower(),
            'uniform' in content.lower(),
            'buffer' in content.lower() and 'geometry' in content.lower()
        ])
        
        return {
            'valid': True,
            'patterns': patterns,
            'complexity_score': complexity_score,
            'has_advanced_features': has_advanced_features,
            'file_size': os.path.getsize(filepath),
            'line_count': sum(1 for line in open(filepath, 'r', encoding='utf-8')),
            'is_3d_related': complexity_score > 10
        }
    except Exception as e:
        return {
            'valid': False,
            'error': str(e),
            'file_size': os.path.getsize(filepath) if os.path.exists(filepath) else 0
        }

def main():
    project_dir = Path('.')
    
    print("🔍 COMPREHENSIVE 3D FILES ANALYSIS")
    print("=" * 80)
    
    # Find all potential 3D files
    extensions_3d = ['.gltf', '.glb', '.fbx', '.obj', '.dae', '.3ds', '.blend']
    extensions_js = ['.js']
    
    files_3d = []
    files_js = []
    
    # Scan for 3D model files
    for ext in extensions_3d:
        files_3d.extend(list(project_dir.glob(f'**/*{ext}')))
    
    # Scan for JavaScript files
    for ext in extensions_js:
        files_js.extend(list(project_dir.glob(f'**/*{ext}')))
    
    print(f"📁 Found {len(files_3d)} 3D model files")
    print(f"📄 Found {len(files_js)} JavaScript files")
    print("=" * 80)
    
    # Analyze 3D model files
    print("\n🎯 3D MODEL FILES ANALYSIS:")
    print("-" * 50)
    
    model_results = []
    
    for filepath in files_3d:
        print(f"\n📁 FILE: {filepath}")
        print(f"📅 Modified: {datetime.fromtimestamp(filepath.stat().st_mtime)}")
        print(f"📏 Size: {filepath.stat().st_size / 1024:.1f} KB")
        
        if filepath.suffix.lower() == '.gltf':
            analysis = analyze_gltf_file(filepath)
            
            if analysis['valid']:
                stats = analysis['stats']
                print(f"✅ Valid GLTF")
                print(f"🏗️  Complexity Score: {analysis['complexity_score']}")
                print(f"🎯 Campus Content: {'Yes' if analysis['has_campus_content'] else 'No'} (score: {analysis['campus_score']})")
                print(f"📦 Scenes: {stats['scenes']}, Nodes: {stats['nodes']}, Meshes: {stats['meshes']}")
                print(f"🎨 Materials: {stats['materials']}, Textures: {stats['textures']}")
                print(f"🎬 Animations: {stats['animations']}")
                print(f"📐 Vertices: {analysis['total_vertices']}, Triangles: {analysis['total_triangles']}")
                print(f"🔧 Generator: {analysis['generator']}")
                print(f"📄 Lines: {analysis['line_count']}")
                
                model_results.append({
                    'file': str(filepath),
                    'type': 'gltf',
                    'score': analysis['complexity_score'],
                    'size': analysis['file_size'],
                    'campus_content': analysis['has_campus_content'],
                    'meshes': stats['meshes'],
                    'nodes': stats['nodes'],
                    'triangles': analysis['total_triangles'],
                    'modified': filepath.stat().st_mtime
                })
            else:
                print(f"❌ Invalid: {analysis['error']}")
        else:
            print(f"📦 {filepath.suffix.upper()} file (binary/unsupported format)")
            model_results.append({
                'file': str(filepath),
                'type': filepath.suffix[1:],
                'score': 0,
                'size': filepath.stat().st_size,
                'campus_content': 'unknown',
                'meshes': '?',
                'nodes': '?',
                'triangles': '?',
                'modified': filepath.stat().st_mtime
            })
    
    # Analyze JavaScript files for 3D content
    print("\n\n🎮 JAVASCRIPT 3D CONTENT ANALYSIS:")
    print("-" * 50)
    
    js_results = []
    
    for filepath in files_js:
        # Skip node_modules and other irrelevant directories
        if any(part in str(filepath) for part in ['node_modules', '.git', 'vendor', 'dist/lib']):
            continue
            
        analysis = analyze_js_file(filepath)
        
        if analysis['valid'] and analysis['is_3d_related']:
            print(f"\n📄 3D-RELATED JS: {filepath}")
            print(f"📅 Modified: {datetime.fromtimestamp(filepath.stat().st_mtime)}")
            print(f"📏 Size: {filepath.stat().st_size / 1024:.1f} KB")
            print(f"🏗️  3D Complexity Score: {analysis['complexity_score']}")
            print(f"📄 Lines: {analysis['line_count']}")
            print(f"⚡ Advanced Features: {'Yes' if analysis['has_advanced_features'] else 'No'}")
            
            patterns = analysis['patterns']
            if patterns['three_js_usage'] > 0:
                print(f"   🎯 THREE.js usage: {patterns['three_js_usage']} times")
            if patterns['gltf_loading'] > 0:
                print(f"   📦 GLTF loading: {patterns['gltf_loading']} references")
            if patterns['geometry_creation'] > 0:
                print(f"   📐 Geometry creation: {patterns['geometry_creation']} instances")
            if patterns['campus_keywords'] > 0:
                print(f"   🏛️  Campus keywords: {patterns['campus_keywords']} times")
            
            js_results.append({
                'file': str(filepath),
                'type': 'javascript',
                'score': analysis['complexity_score'],
                'size': analysis['file_size'],
                'line_count': analysis['line_count'],
                'advanced_features': analysis['has_advanced_features'],
                'modified': filepath.stat().st_mtime
            })
    
    # Final rankings
    print("\n" + "=" * 80)
    print("🏆 FINAL RANKINGS & RECOMMENDATIONS:")
    print("=" * 80)
    
    # Rank JavaScript files by complexity
    js_ranked = sorted(js_results, key=lambda x: x['score'], reverse=True)
    
    print("\n🥇 TOP JAVASCRIPT 3D IMPLEMENTATIONS:")
    for i, file_info in enumerate(js_ranked[:5], 1):
        print(f"\n{i}. {file_info['file']}")
        print(f"   🏗️  Complexity Score: {file_info['score']}")
        print(f"   📏 Size: {file_info['size'] / 1024:.1f} KB")
        print(f"   📄 Lines: {file_info['line_count']}")
        print(f"   ⚡ Advanced: {'Yes' if file_info['advanced_features'] else 'No'}")
        print(f"   📅 Modified: {datetime.fromtimestamp(file_info['modified'])}")
        
        if i == 1:
            print("   ⭐ RECOMMENDED: Best JavaScript implementation")
    
    # Rank 3D model files
    if model_results:
        model_ranked = sorted(model_results, key=lambda x: (x['score'], x['size'], x['modified']), reverse=True)
        
        print("\n🎯 3D MODEL FILES:")
        for i, file_info in enumerate(model_ranked, 1):
            print(f"\n{i}. {file_info['file']}")
            print(f"   🏗️  Score: {file_info['score']}")
            print(f"   📏 Size: {file_info['size'] / 1024:.1f} KB")
            print(f"   🏛️  Campus: {file_info['campus_content']}")
            print(f"   🔺 Triangles: {file_info['triangles']}")
            print(f"   📅 Modified: {datetime.fromtimestamp(file_info['modified'])}")
    
    # Final recommendation
    print("\n" + "🎯" * 20)
    print("FINAL RECOMMENDATION:")
    print("🎯" * 20)
    
    if js_ranked:
        best_js = js_ranked[0]
        print(f"\n✅ BEST 3D IMPLEMENTATION: {best_js['file']}")
        print(f"   Reason: Highest complexity score ({best_js['score']})")
        print(f"   Advanced features: {'Yes' if best_js['advanced_features'] else 'No'}")
        print(f"   File size: {best_js['size'] / 1024:.1f} KB")
    
    if model_results:
        best_model = max(model_results, key=lambda x: x['score'])
        print(f"\n✅ BEST 3D MODEL: {best_model['file']}")
        print(f"   Reason: Most complex 3D model available")
        print(f"   Content score: {best_model['score']}")
    
    print(f"\n📋 IMPLEMENTATION STRATEGY:")
    print(f"   1. Use the best JavaScript implementation for 3D engine")
    print(f"   2. Use available 3D models as references/fallbacks")
    print(f"   3. Consider creating more detailed 3D models for better visuals")

if __name__ == "__main__":
    main()