/**
 * Power Grid Coordinate System Analyzer
 * Comprehensive debugging tool for alignment issues
 */

class CoordinateSystemAnalyzer {
    constructor() {
        this.facilities = [
            { 
                id: 'hydro-plant', 
                name: 'Ta Trach Hydro Power Plant',
                svgX: 54, 
                svgY: 256,
                expectedLocation: 'Left water area',
                color: '#3498db'
            },
            { 
                id: '500kv-substation', 
                name: '500kV Main Substation',
                svgX: 631, 
                svgY: 263,
                expectedLocation: 'Center substation',
                color: '#e74c3c'
            },
            { 
                id: '110kv-substation', 
                name: '110kV La Son Substation',
                svgX: 849, 
                svgY: 114,
                expectedLocation: 'Top-right substation',
                color: '#f39c12'
            }
        ];
        
        this.debugLog = [];
        this.measurements = {};
    }

    /**
     * 1. Analyze Coordinate System
     */
    analyzeCoordinateSystem() {
        console.log('🎯 COORDINATE SYSTEM ANALYSIS');
        console.log('================================');
        
        const container = document.querySelector('.grid-background-map') || document.getElementById('powerGridMap');
        const image = document.querySelector('.grid-map-image');
        const svgOverlay = document.querySelector('.svg-icon-overlay svg');
        
        if (!container || !image || !svgOverlay) {
            console.error('❌ Required elements not found');
            return this.logError('Missing container, image, or SVG overlay');
        }

        // Get dimensions
        const containerRect = container.getBoundingClientRect();
        const imageRect = image.getBoundingClientRect();
        const svgViewBox = svgOverlay.getAttribute('viewBox') || '0 0 1000 600';
        const preserveAspectRatio = svgOverlay.getAttribute('preserveAspectRatio') || 'xMidYMid slice';
        
        this.measurements = {
            container: {
                width: containerRect.width,
                height: containerRect.height,
                position: 'relative'
            },
            image: {
                naturalWidth: image.naturalWidth,
                naturalHeight: image.naturalHeight,
                displayWidth: imageRect.width,
                displayHeight: imageRect.height,
                objectFit: getComputedStyle(image).objectFit
            },
            svg: {
                viewBox: svgViewBox,
                preserveAspectRatio: preserveAspectRatio,
                width: '100%',
                height: '100%'
            }
        };

        console.log('📐 Container:', this.measurements.container);
        console.log('🖼️ Image:', this.measurements.image);
        console.log('📊 SVG:', this.measurements.svg);
        
        // Calculate scale factors
        const [vbX, vbY, vbWidth, vbHeight] = svgViewBox.split(' ').map(Number);
        this.measurements.scale = {
            svgToScreenX: containerRect.width / vbWidth,
            svgToScreenY: containerRect.height / vbHeight,
            imageToSvgX: vbWidth / image.naturalWidth,
            imageToSvgY: vbHeight / image.naturalHeight
        };
        
        console.log('⚖️ Scale Factors:', this.measurements.scale);
        
        return this.measurements;
    }

    /**
     * 2. Analyze CSS/Styling Issues
     */
    analyzeCSSIssues() {
        console.log('\n🎨 CSS/STYLING ANALYSIS');
        console.log('========================');
        
        const container = document.querySelector('.grid-background-map') || document.getElementById('powerGridMap');
        const svgOverlay = document.querySelector('.svg-icon-overlay');
        const image = document.querySelector('.grid-map-image');
        
        // Check positioning
        const containerStyle = getComputedStyle(container);
        const overlayStyle = getComputedStyle(svgOverlay);
        const imageStyle = getComputedStyle(image);
        
        const cssIssues = {
            container: {
                position: containerStyle.position,
                width: containerStyle.width,
                height: containerStyle.height,
                overflow: containerStyle.overflow,
                margin: containerStyle.margin,
                padding: containerStyle.padding,
                border: containerStyle.border,
                boxSizing: containerStyle.boxSizing
            },
            overlay: {
                position: overlayStyle.position,
                top: overlayStyle.top,
                left: overlayStyle.left,
                width: overlayStyle.width,
                height: overlayStyle.height,
                pointerEvents: overlayStyle.pointerEvents,
                zIndex: overlayStyle.zIndex
            },
            image: {
                width: imageStyle.width,
                height: imageStyle.height,
                objectFit: imageStyle.objectFit,
                objectPosition: imageStyle.objectPosition,
                display: imageStyle.display
            }
        };
        
        console.log('🏗️ Container CSS:', cssIssues.container);
        console.log('📱 Overlay CSS:', cssIssues.overlay);
        console.log('🖼️ Image CSS:', cssIssues.image);
        
        // Detect potential issues
        const issues = [];
        
        if (containerStyle.position !== 'relative') {
            issues.push('⚠️ Container should have position: relative');
        }
        
        if (overlayStyle.position !== 'absolute') {
            issues.push('⚠️ SVG overlay should have position: absolute');
        }
        
        if (overlayStyle.top !== '0px' || overlayStyle.left !== '0px') {
            issues.push('⚠️ SVG overlay should have top: 0, left: 0');
        }
        
        if (imageStyle.objectFit !== 'cover' && imageStyle.objectFit !== 'contain') {
            issues.push('⚠️ Consider using object-fit: cover or contain for image');
        }
        
        if (issues.length > 0) {
            console.log('🚨 CSS Issues Found:');
            issues.forEach(issue => console.log(issue));
        } else {
            console.log('✅ No obvious CSS issues detected');
        }
        
        return { cssIssues, issues };
    }

    /**
     * 3. Debug Container and Viewport
     */
    debugContainerViewport() {
        console.log('\n📱 CONTAINER & VIEWPORT DEBUG');
        console.log('==============================');
        
        const container = document.querySelector('.grid-background-map') || document.getElementById('powerGridMap');
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1
        };
        
        console.log('🖥️ Viewport:', viewport);
        
        // Check for zoom/transform
        const containerMatrix = getComputedStyle(container).transform;
        if (containerMatrix && containerMatrix !== 'none') {
            console.log('🔄 Container Transform:', containerMatrix);
        }
        
        // Monitor resize events
        let resizeCount = 0;
        const originalResize = window.onresize;
        window.addEventListener('resize', () => {
            resizeCount++;
            console.log(`📏 Resize event #${resizeCount}: ${window.innerWidth}x${window.innerHeight}`);
            
            setTimeout(() => {
                this.analyzeCoordinateSystem();
            }, 100);
        });
        
        return { viewport, containerMatrix };
    }

    /**
     * 4. Check Icon Positioning Logic
     */
    checkIconPositioning() {
        console.log('\n📍 ICON POSITIONING ANALYSIS');
        console.log('=============================');
        
        this.facilities.forEach(facility => {
            const element = document.querySelector(`[data-facility="${facility.id}"]`);
            if (!element) {
                console.error(`❌ Facility element not found: ${facility.id}`);
                return;
            }
            
            const rect = element.querySelector('.facility-rect') || element.querySelector('rect');
            if (!rect) {
                console.error(`❌ Rect element not found for: ${facility.id}`);
                return;
            }
            
            const actualX = parseFloat(rect.getAttribute('x'));
            const actualY = parseFloat(rect.getAttribute('y'));
            const width = parseFloat(rect.getAttribute('width'));
            const height = parseFloat(rect.getAttribute('height'));
            
            // Convert to screen coordinates
            const screenPos = this.svgToScreen(actualX, actualY);
            
            console.log(`🎯 ${facility.name}:`);
            console.log(`   SVG: (${actualX}, ${actualY}) ${width}x${height}`);
            console.log(`   Screen: (${Math.round(screenPos.x)}, ${Math.round(screenPos.y)})`);
            console.log(`   Expected: ${facility.expectedLocation}`);
            
            // Check if position matches expected
            this.validateFacilityPosition(facility, actualX, actualY);
        });
    }

    /**
     * 5. Map Library Integration Check
     */
    checkMapLibraryIntegration() {
        console.log('\n🗺️ MAP LIBRARY INTEGRATION');
        console.log('===========================');
        
        // Check for common map libraries
        const libraries = {
            leaflet: typeof L !== 'undefined',
            mapbox: typeof mapboxgl !== 'undefined',
            openlayers: typeof ol !== 'undefined',
            googleMaps: typeof google !== 'undefined' && google.maps
        };
        
        console.log('📚 Detected Libraries:', libraries);
        
        // Check for coordinate projection functions
        const projectionFunctions = [];
        if (window.proj4) projectionFunctions.push('proj4');
        if (window.turf) projectionFunctions.push('turf');
        
        console.log('🌍 Projection Libraries:', projectionFunctions);
        
        // Look for custom coordinate conversion functions
        const customFunctions = [];
        ['convertCoordinates', 'projectCoordinates', 'transformCoordinates', 'latLngToPixel', 'pixelToLatLng']
            .forEach(funcName => {
                if (typeof window[funcName] === 'function') {
                    customFunctions.push(funcName);
                }
            });
        
        console.log('🔧 Custom Coordinate Functions:', customFunctions);
        
        return { libraries, projectionFunctions, customFunctions };
    }

    /**
     * Utility Methods
     */
    svgToScreen(svgX, svgY) {
        if (!this.measurements.scale) {
            this.analyzeCoordinateSystem();
        }
        
        return {
            x: svgX * this.measurements.scale.svgToScreenX,
            y: svgY * this.measurements.scale.svgToScreenY
        };
    }

    validateFacilityPosition(facility, actualX, actualY) {
        const issues = [];
        
        // Validate based on expected location
        switch (facility.expectedLocation) {
            case 'Left water area':
                if (actualX > 200) {
                    issues.push(`X coordinate too far right (${actualX} > 200)`);
                }
                break;
            case 'Center substation':
                if (actualX < 400 || actualX > 700) {
                    issues.push(`X coordinate not in center range (${actualX} not in 400-700)`);
                }
                break;
            case 'Top-right substation':
                if (actualX < 800 || actualY > 200) {
                    issues.push(`Position not in top-right (X:${actualX} should be >800, Y:${actualY} should be <200)`);
                }
                break;
        }
        
        if (issues.length > 0) {
            console.log(`   ⚠️ Issues: ${issues.join(', ')}`);
        } else {
            console.log(`   ✅ Position looks correct`);
        }
        
        return issues;
    }

    logError(message) {
        this.debugLog.push({ type: 'error', message, timestamp: new Date() });
        console.error(`❌ ${message}`);
        return false;
    }

    logWarning(message) {
        this.debugLog.push({ type: 'warning', message, timestamp: new Date() });
        console.warn(`⚠️ ${message}`);
    }

    logSuccess(message) {
        this.debugLog.push({ type: 'success', message, timestamp: new Date() });
        console.log(`✅ ${message}`);
    }

    /**
     * Generate comprehensive debug report
     */
    generateReport() {
        console.log('\n📋 COMPREHENSIVE DEBUG REPORT');
        console.log('==============================');
        
        const report = {
            timestamp: new Date().toISOString(),
            coordinates: this.analyzeCoordinateSystem(),
            css: this.analyzeCSSIssues(),
            viewport: this.debugContainerViewport(),
            positioning: this.checkIconPositioning(),
            mapLibrary: this.checkMapLibraryIntegration(),
            debugLog: this.debugLog
        };
        
        // Generate recommendations
        const recommendations = this.generateRecommendations(report);
        console.log('\n💡 RECOMMENDATIONS:');
        recommendations.forEach(rec => console.log(`   ${rec}`));
        
        return { ...report, recommendations };
    }

    generateRecommendations(report) {
        const recommendations = [];
        
        // Check scale consistency
        const { svgToScreenX, svgToScreenY } = report.coordinates.scale;
        if (Math.abs(svgToScreenX - svgToScreenY) > 0.01) {
            recommendations.push('🔧 Consider using preserveAspectRatio="xMidYMid meet" for uniform scaling');
        }
        
        // Check CSS issues
        if (report.css.issues.length > 0) {
            recommendations.push('🎨 Fix CSS positioning issues found in analysis');
        }
        
        // Check coordinate ranges
        this.facilities.forEach(facility => {
            if (facility.svgX > 1000 || facility.svgY > 600) {
                recommendations.push(`📍 ${facility.name} coordinates exceed SVG viewBox bounds`);
            }
        });
        
        return recommendations;
    }

    /**
     * Real-time coordinate tracking
     */
    enableRealTimeTracking() {
        console.log('\n🎯 REAL-TIME TRACKING ENABLED');
        console.log('==============================');
        
        const container = document.querySelector('.grid-background-map') || document.getElementById('powerGridMap');
        
        if (!container) {
            return this.logError('Container not found for real-time tracking');
        }
        
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;
            
            // Convert to SVG coordinates
            const svgX = (screenX / rect.width) * 1000;
            const svgY = (screenY / rect.height) * 600;
            
            // Update display if debug element exists
            const debugDisplay = document.getElementById('realTimeCoordinates');
            if (debugDisplay) {
                debugDisplay.innerHTML = `
                    Screen: (${Math.round(screenX)}, ${Math.round(screenY)})
                    SVG: (${Math.round(svgX)}, ${Math.round(svgY)})
                `;
            }
        });
        
        container.addEventListener('click', (e) => {
            const rect = container.getBoundingClientRect();
            const screenX = e.clientX - rect.left;
            const screenY = e.clientY - rect.top;
            const svgX = (screenX / rect.width) * 1000;
            const svgY = (screenY / rect.height) * 600;
            
            console.log(`🎯 CLICK: Screen(${Math.round(screenX)}, ${Math.round(screenY)}) → SVG(${Math.round(svgX)}, ${Math.round(svgY)})`);
        });
        
        this.logSuccess('Real-time coordinate tracking enabled');
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoordinateSystemAnalyzer;
} else {
    window.CoordinateSystemAnalyzer = CoordinateSystemAnalyzer;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
    window.analyzer = new CoordinateSystemAnalyzer();
    
    // Add convenient global functions
    window.debugCoordinates = () => window.analyzer.generateReport();
    window.trackCoordinates = () => window.analyzer.enableRealTimeTracking();
    
    console.log('🚀 Coordinate System Analyzer ready!');
    console.log('📌 Use debugCoordinates() to run full analysis');
    console.log('📌 Use trackCoordinates() to enable real-time tracking');
}