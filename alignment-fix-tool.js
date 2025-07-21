/**
 * Power Grid Alignment Fix Tool
 * Automated tool to detect and fix coordinate alignment issues
 */

class AlignmentFixTool {
    constructor() {
        this.originalCoordinates = new Map();
        this.fixes = [];
        this.testPoints = [
            // Known landmark coordinates for validation
            { name: 'Hydro Plant Icon', expectedSvgX: 54, expectedSvgY: 256, landmark: 'Blue square in water area' },
            { name: '500kV Substation', expectedSvgX: 631, expectedSvgY: 263, landmark: 'Red square with "A" symbol' },
            { name: '110kV Substation', expectedSvgX: 849, expectedSvgY: 114, landmark: 'Orange square top-right' }
        ];
    }

    /**
     * Backup current coordinates before making changes
     */
    backupCoordinates() {
        console.log('💾 Backing up current coordinates...');
        
        const facilities = document.querySelectorAll('.facility-group');
        facilities.forEach(facility => {
            const rect = facility.querySelector('.facility-rect, rect');
            if (rect) {
                const facilityId = facility.getAttribute('data-facility');
                this.originalCoordinates.set(facilityId, {
                    x: rect.getAttribute('x'),
                    y: rect.getAttribute('y'),
                    width: rect.getAttribute('width'),
                    height: rect.getAttribute('height')
                });
            }
        });
        
        console.log(`✅ Backed up ${this.originalCoordinates.size} facility coordinates`);
        return this.originalCoordinates;
    }

    /**
     * Detect alignment issues automatically
     */
    detectAlignmentIssues() {
        console.log('🔍 Detecting alignment issues...');
        
        const issues = [];
        const container = document.querySelector('.grid-background-map') || document.getElementById('powerGridMap');
        const image = document.querySelector('.grid-map-image');
        
        if (!container || !image) {
            issues.push({ type: 'critical', message: 'Container or image not found' });
            return issues;
        }

        // Check CSS positioning
        const containerStyle = getComputedStyle(container);
        const svgOverlay = document.querySelector('.svg-icon-overlay');
        const overlayStyle = getComputedStyle(svgOverlay);

        if (containerStyle.position !== 'relative') {
            issues.push({ 
                type: 'css', 
                message: 'Container should have position: relative',
                fix: () => container.style.position = 'relative'
            });
        }

        if (overlayStyle.position !== 'absolute') {
            issues.push({ 
                type: 'css', 
                message: 'SVG overlay should have position: absolute',
                fix: () => svgOverlay.style.position = 'absolute'
            });
        }

        // Check SVG viewBox vs image aspect ratio
        const svg = document.querySelector('.svg-icon-overlay svg');
        const viewBox = svg.getAttribute('viewBox') || '0 0 1000 600';
        const [vbX, vbY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
        const svgAspectRatio = vbWidth / vbHeight;
        
        const containerRect = container.getBoundingClientRect();
        const containerAspectRatio = containerRect.width / containerRect.height;
        
        if (Math.abs(svgAspectRatio - containerAspectRatio) > 0.1) {
            issues.push({ 
                type: 'aspect', 
                message: `Aspect ratio mismatch: SVG=${svgAspectRatio.toFixed(2)}, Container=${containerAspectRatio.toFixed(2)}`,
                fix: () => this.fixAspectRatio(svg, containerAspectRatio)
            });
        }

        // Check individual facility positions
        this.testPoints.forEach(testPoint => {
            const facility = document.querySelector(`[data-facility*="${testPoint.name.toLowerCase().replace(/\s+/g, '-')}"]`);
            if (facility) {
                const rect = facility.querySelector('.facility-rect, rect');
                if (rect) {
                    const actualX = parseFloat(rect.getAttribute('x'));
                    const actualY = parseFloat(rect.getAttribute('y'));
                    
                    const deltaX = Math.abs(actualX - testPoint.expectedSvgX);
                    const deltaY = Math.abs(actualY - testPoint.expectedSvgY);
                    
                    if (deltaX > 50 || deltaY > 50) {
                        issues.push({
                            type: 'position',
                            message: `${testPoint.name} position off by ${deltaX.toFixed(1)}, ${deltaY.toFixed(1)}`,
                            facility: facility,
                            expectedX: testPoint.expectedSvgX,
                            expectedY: testPoint.expectedSvgY,
                            actualX: actualX,
                            actualY: actualY,
                            fix: () => this.fixFacilityPosition(facility, testPoint.expectedSvgX, testPoint.expectedSvgY)
                        });
                    }
                }
            }
        });

        console.log(`🔍 Found ${issues.length} alignment issues:`);
        issues.forEach(issue => console.log(`   ${issue.type.toUpperCase()}: ${issue.message}`));
        
        return issues;
    }

    /**
     * Fix aspect ratio issues
     */
    fixAspectRatio(svg, targetAspectRatio) {
        const currentViewBox = svg.getAttribute('viewBox') || '0 0 1000 600';
        const [vbX, vbY, vbWidth, vbHeight] = currentViewBox.split(' ').map(Number);
        
        let newWidth = vbWidth;
        let newHeight = vbHeight;
        
        const currentAspectRatio = vbWidth / vbHeight;
        
        if (currentAspectRatio > targetAspectRatio) {
            // SVG is wider than container, adjust height
            newHeight = vbWidth / targetAspectRatio;
        } else {
            // SVG is taller than container, adjust width
            newWidth = vbHeight * targetAspectRatio;
        }
        
        const newViewBox = `${vbX} ${vbY} ${newWidth} ${newHeight}`;
        svg.setAttribute('viewBox', newViewBox);
        
        console.log(`🔧 Fixed aspect ratio: ${currentViewBox} → ${newViewBox}`);
        return newViewBox;
    }

    /**
     * Fix individual facility position
     */
    fixFacilityPosition(facility, expectedX, expectedY) {
        const rect = facility.querySelector('.facility-rect, rect');
        if (!rect) return false;
        
        const oldX = rect.getAttribute('x');
        const oldY = rect.getAttribute('y');
        
        rect.setAttribute('x', expectedX);
        rect.setAttribute('y', expectedY);
        
        console.log(`🔧 Fixed ${facility.getAttribute('data-name') || 'facility'}: (${oldX}, ${oldY}) → (${expectedX}, ${expectedY})`);
        
        this.fixes.push({
            facility: facility.getAttribute('data-facility'),
            oldPosition: { x: oldX, y: oldY },
            newPosition: { x: expectedX, y: expectedY },
            timestamp: new Date()
        });
        
        return true;
    }

    /**
     * Auto-fix all detected issues
     */
    autoFix() {
        console.log('🔨 Starting auto-fix process...');
        
        this.backupCoordinates();
        const issues = this.detectAlignmentIssues();
        
        if (issues.length === 0) {
            console.log('✅ No issues detected, alignment is good!');
            return { success: true, fixesApplied: 0 };
        }
        
        let fixesApplied = 0;
        let fixesFailed = 0;
        
        issues.forEach(issue => {
            if (issue.fix && typeof issue.fix === 'function') {
                try {
                    issue.fix();
                    fixesApplied++;
                    console.log(`✅ Applied fix: ${issue.message}`);
                } catch (error) {
                    fixesFailed++;
                    console.error(`❌ Failed to apply fix: ${issue.message}`, error);
                }
            }
        });
        
        console.log(`🎉 Auto-fix complete: ${fixesApplied} fixes applied, ${fixesFailed} failed`);
        
        // Verify fixes
        setTimeout(() => this.verifyFixes(), 100);
        
        return { 
            success: fixesFailed === 0, 
            fixesApplied, 
            fixesFailed,
            fixes: this.fixes 
        };
    }

    /**
     * Verify that fixes were applied correctly
     */
    verifyFixes() {
        console.log('🔍 Verifying fixes...');
        
        const remainingIssues = this.detectAlignmentIssues();
        
        if (remainingIssues.length === 0) {
            console.log('✅ All alignment issues resolved!');
        } else {
            console.log(`⚠️ ${remainingIssues.length} issues still remain:`);
            remainingIssues.forEach(issue => console.log(`   ${issue.message}`));
        }
        
        return remainingIssues.length === 0;
    }

    /**
     * Restore original coordinates
     */
    restoreOriginal() {
        console.log('🔄 Restoring original coordinates...');
        
        let restored = 0;
        
        this.originalCoordinates.forEach((coords, facilityId) => {
            const facility = document.querySelector(`[data-facility="${facilityId}"]`);
            if (facility) {
                const rect = facility.querySelector('.facility-rect, rect');
                if (rect) {
                    rect.setAttribute('x', coords.x);
                    rect.setAttribute('y', coords.y);
                    rect.setAttribute('width', coords.width);
                    rect.setAttribute('height', coords.height);
                    restored++;
                }
            }
        });
        
        console.log(`✅ Restored ${restored} facility coordinates`);
        this.fixes = [];
        return restored;
    }

    /**
     * Interactive coordinate adjuster
     */
    enableInteractiveAdjustment() {
        console.log('🎮 Enabling interactive coordinate adjustment...');
        
        const facilities = document.querySelectorAll('.facility-group');
        let selectedFacility = null;
        let isDragging = false;
        
        facilities.forEach(facility => {
            const rect = facility.querySelector('.facility-rect, rect');
            if (!rect) return;
            
            // Make facility selectable
            facility.style.cursor = 'move';
            
            facility.addEventListener('mousedown', (e) => {
                selectedFacility = facility;
                isDragging = true;
                facility.style.opacity = '0.7';
                console.log(`🎯 Selected: ${facility.getAttribute('data-name')}`);
                e.preventDefault();
            });
        });
        
        // Global mouse move handler
        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !selectedFacility) return;
            
            const container = document.querySelector('.grid-background-map');
            const rect = container.getBoundingClientRect();
            
            const relativeX = e.clientX - rect.left;
            const relativeY = e.clientY - rect.top;
            
            // Convert to SVG coordinates
            const svgX = (relativeX / rect.width) * 1000;
            const svgY = (relativeY / rect.height) * 600;
            
            // Update facility position
            const facilityRect = selectedFacility.querySelector('.facility-rect, rect');
            facilityRect.setAttribute('x', Math.max(0, Math.min(1000, svgX - 15))); // Center on cursor
            facilityRect.setAttribute('y', Math.max(0, Math.min(600, svgY - 10)));
            
            // Show coordinates
            this.showCoordinateTooltip(e.clientX, e.clientY, svgX, svgY);
        });
        
        // Global mouse up handler
        document.addEventListener('mouseup', () => {
            if (selectedFacility) {
                selectedFacility.style.opacity = '1';
                const rect = selectedFacility.querySelector('.facility-rect, rect');
                const finalX = rect.getAttribute('x');
                const finalY = rect.getAttribute('y');
                
                console.log(`✅ Positioned ${selectedFacility.getAttribute('data-name')} at (${finalX}, ${finalY})`);
                
                this.hideCoordinateTooltip();
            }
            
            selectedFacility = null;
            isDragging = false;
        });
        
        console.log('🎮 Interactive adjustment enabled. Click and drag facilities to reposition.');
    }

    /**
     * Show coordinate tooltip during dragging
     */
    showCoordinateTooltip(screenX, screenY, svgX, svgY) {
        let tooltip = document.getElementById('coordinateTooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'coordinateTooltip';
            tooltip.style.cssText = `
                position: fixed;
                background: rgba(0, 0, 0, 0.8);
                color: #00ff00;
                padding: 5px 10px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
            `;
            document.body.appendChild(tooltip);
        }
        
        tooltip.style.left = (screenX + 10) + 'px';
        tooltip.style.top = (screenY - 30) + 'px';
        tooltip.innerHTML = `SVG: (${Math.round(svgX)}, ${Math.round(svgY)})`;
        tooltip.style.display = 'block';
    }

    /**
     * Hide coordinate tooltip
     */
    hideCoordinateTooltip() {
        const tooltip = document.getElementById('coordinateTooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    /**
     * Export current coordinates for backup
     */
    exportCoordinates() {
        const coordinates = {};
        const facilities = document.querySelectorAll('.facility-group');
        
        facilities.forEach(facility => {
            const rect = facility.querySelector('.facility-rect, rect');
            if (rect) {
                const facilityId = facility.getAttribute('data-facility');
                coordinates[facilityId] = {
                    name: facility.getAttribute('data-name'),
                    x: parseFloat(rect.getAttribute('x')),
                    y: parseFloat(rect.getAttribute('y')),
                    width: parseFloat(rect.getAttribute('width')),
                    height: parseFloat(rect.getAttribute('height'))
                };
            }
        });
        
        const exportData = {
            timestamp: new Date().toISOString(),
            coordinates: coordinates,
            svgViewBox: document.querySelector('.svg-icon-overlay svg').getAttribute('viewBox')
        };
        
        console.log('📄 Current coordinates:', exportData);
        
        // Create downloadable file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `power-grid-coordinates-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        return exportData;
    }

    /**
     * Generate summary report
     */
    generateReport() {
        return {
            timestamp: new Date().toISOString(),
            originalCoordinates: Object.fromEntries(this.originalCoordinates),
            fixes: this.fixes,
            currentIssues: this.detectAlignmentIssues(),
            recommendations: this.generateRecommendations()
        };
    }

    generateRecommendations() {
        const recommendations = [];
        
        recommendations.push('🔧 Use browser developer tools to inspect element positioning');
        recommendations.push('📏 Verify SVG viewBox matches image aspect ratio');
        recommendations.push('🎯 Test coordinates on different screen sizes');
        recommendations.push('💾 Always backup coordinates before making changes');
        recommendations.push('🔍 Use real-time tracking to validate positioning');
        
        return recommendations;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlignmentFixTool;
} else {
    window.AlignmentFixTool = AlignmentFixTool;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
    window.alignmentTool = new AlignmentFixTool();
    
    // Add convenient global functions
    window.fixAlignment = () => window.alignmentTool.autoFix();
    window.adjustInteractive = () => window.alignmentTool.enableInteractiveAdjustment();
    window.exportCoords = () => window.alignmentTool.exportCoordinates();
    window.restoreCoords = () => window.alignmentTool.restoreOriginal();
    
    console.log('🔧 Alignment Fix Tool ready!');
    console.log('📌 Use fixAlignment() to auto-fix issues');
    console.log('📌 Use adjustInteractive() to enable drag-and-drop positioning');
    console.log('📌 Use exportCoords() to save current coordinates');
    console.log('📌 Use restoreCoords() to restore original positions');
}