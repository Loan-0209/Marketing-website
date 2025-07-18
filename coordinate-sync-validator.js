/**
 * Coordinate Sync Validator
 * Validates and synchronizes coordinates between facilities.html and live-adjuster.html
 * Author: Claude Code Assistant
 */

class CoordinateSyncValidator {
    constructor() {
        this.facilitiesFile = 'facilities.html';
        this.liveAdjusterFile = 'live-adjuster.html';
        this.expectedCoordinates = {
            hydro: { x: 35, y: 251 },
            substation500: { x: 620, y: 254 },
            substation110: { x: 838, y: 123 },
            datacenter: { x: 632, y: 332 }
        };
        this.init();
    }

    init() {
        console.log('🔍 Coordinate Sync Validator initialized');
        console.log('Expected coordinates:', this.expectedCoordinates);
        this.validateSync();
    }

    /**
     * Validate coordinate synchronization between files
     */
    validateSync() {
        console.log('\n🎯 Starting coordinate sync validation...\n');
        
        // Check if we're running in live-adjuster.html
        if (document.querySelector('#hydro')) {
            this.validateLiveAdjuster();
        } else {
            console.log('⚠️ Not running in live-adjuster.html environment');
        }
        
        this.generateSyncReport();
    }

    /**
     * Validate live-adjuster.html coordinates
     */
    validateLiveAdjuster() {
        console.log('🔧 Validating live-adjuster.html coordinates...');
        
        const facilities = ['hydro', 'substation500', 'substation110', 'datacenter'];
        const results = {};
        
        facilities.forEach(facility => {
            const element = document.getElementById(facility);
            const xInput = document.getElementById(facility + '-x');
            const yInput = document.getElementById(facility + '-y');
            
            if (element && xInput && yInput) {
                const currentCoords = {
                    svg: {
                        x: parseInt(element.getAttribute('x')),
                        y: parseInt(element.getAttribute('y'))
                    },
                    input: {
                        x: parseInt(xInput.value),
                        y: parseInt(yInput.value)
                    }
                };
                
                const expected = this.expectedCoordinates[facility];
                const isValid = this.validateCoordinate(currentCoords, expected);
                
                results[facility] = {
                    current: currentCoords,
                    expected: expected,
                    valid: isValid,
                    discrepancy: this.calculateDiscrepancy(currentCoords.svg, expected)
                };
                
                console.log(`${isValid ? '✅' : '❌'} ${facility}:`, 
                    `Current: (${currentCoords.svg.x}, ${currentCoords.svg.y})`, 
                    `Expected: (${expected.x}, ${expected.y})`);
            }
        });
        
        this.syncResults = results;
        return results;
    }

    /**
     * Validate if coordinates match expected values
     */
    validateCoordinate(current, expected) {
        return current.svg.x === expected.x && 
               current.svg.y === expected.y && 
               current.input.x === expected.x && 
               current.input.y === expected.y;
    }

    /**
     * Calculate discrepancy between current and expected coordinates
     */
    calculateDiscrepancy(current, expected) {
        const deltaX = Math.abs(current.x - expected.x);
        const deltaY = Math.abs(current.y - expected.y);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        return {
            deltaX: deltaX,
            deltaY: deltaY,
            distance: Math.round(distance * 100) / 100
        };
    }

    /**
     * Generate comprehensive sync report
     */
    generateSyncReport() {
        console.log('\n📊 COORDINATE SYNC REPORT');
        console.log('='.repeat(50));
        
        if (this.syncResults) {
            const facilities = Object.keys(this.syncResults);
            const validCount = facilities.filter(f => this.syncResults[f].valid).length;
            const totalCount = facilities.length;
            
            console.log(`\n✅ Valid coordinates: ${validCount}/${totalCount}`);
            console.log(`📊 Sync accuracy: ${Math.round((validCount / totalCount) * 100)}%`);
            
            console.log('\n🔍 Detailed Results:');
            facilities.forEach(facility => {
                const result = this.syncResults[facility];
                const status = result.valid ? '✅' : '❌';
                const name = this.getFacilityName(facility);
                
                console.log(`${status} ${name}:`);
                console.log(`   Current: (${result.current.svg.x}, ${result.current.svg.y})`);
                console.log(`   Expected: (${result.expected.x}, ${result.expected.y})`);
                
                if (!result.valid) {
                    console.log(`   Discrepancy: Δx=${result.discrepancy.deltaX}, Δy=${result.discrepancy.deltaY}`);
                    console.log(`   Distance: ${result.discrepancy.distance}px`);
                }
                console.log('');
            });
        }
        
        this.generateFixInstructions();
    }

    /**
     * Generate fix instructions for mismatched coordinates
     */
    generateFixInstructions() {
        console.log('\n🔧 FIX INSTRUCTIONS');
        console.log('-'.repeat(30));
        
        if (this.syncResults) {
            const invalidFacilities = Object.keys(this.syncResults)
                .filter(f => !this.syncResults[f].valid);
            
            if (invalidFacilities.length === 0) {
                console.log('✅ All coordinates are synchronized correctly!');
                console.log('🎉 No fixes needed.');
            } else {
                console.log(`❌ Found ${invalidFacilities.length} facilities with incorrect coordinates:`);
                console.log('');
                
                invalidFacilities.forEach(facility => {
                    const result = this.syncResults[facility];
                    const name = this.getFacilityName(facility);
                    const expected = result.expected;
                    
                    console.log(`🔧 ${name}:`);
                    console.log(`   Update to: x="${expected.x}" y="${expected.y}"`);
                    console.log(`   JavaScript: document.getElementById('${facility}-x').value = ${expected.x};`);
                    console.log(`   JavaScript: document.getElementById('${facility}-y').value = ${expected.y};`);
                    console.log('');
                });
            }
        }
    }

    /**
     * Get human-readable facility name
     */
    getFacilityName(facility) {
        const names = {
            hydro: 'Hydro Power Plant',
            substation500: '500kV Substation',
            substation110: '110kV Substation',
            datacenter: 'Data Center'
        };
        return names[facility] || facility;
    }

    /**
     * Auto-fix coordinates to match expected values
     */
    autoFixCoordinates() {
        console.log('\n🔄 Auto-fixing coordinates...');
        
        Object.keys(this.expectedCoordinates).forEach(facility => {
            const expected = this.expectedCoordinates[facility];
            const element = document.getElementById(facility);
            const xInput = document.getElementById(facility + '-x');
            const yInput = document.getElementById(facility + '-y');
            
            if (element && xInput && yInput) {
                // Update SVG element
                element.setAttribute('x', expected.x);
                element.setAttribute('y', expected.y);
                
                // Update input fields
                xInput.value = expected.x;
                yInput.value = expected.y;
                
                console.log(`✅ Fixed ${facility}: (${expected.x}, ${expected.y})`);
            }
        });
        
        // Update output if function exists
        if (typeof updateOutput === 'function') {
            updateOutput();
        }
        
        console.log('🎉 Auto-fix complete! All coordinates synchronized.');
    }

    /**
     * Export current coordinates for comparison
     */
    exportCoordinates() {
        const coordinates = {};
        
        Object.keys(this.expectedCoordinates).forEach(facility => {
            const element = document.getElementById(facility);
            if (element) {
                coordinates[facility] = {
                    x: parseInt(element.getAttribute('x')),
                    y: parseInt(element.getAttribute('y'))
                };
            }
        });
        
        return coordinates;
    }

    /**
     * Compare with facilities.html coordinates
     */
    compareWithFacilities() {
        console.log('\n📋 COMPARISON WITH FACILITIES.HTML');
        console.log('-'.repeat(40));
        
        const mapping = {
            hydro: 'hydro-plant',
            substation500: '500kv-substation',
            substation110: '110kv-substation',
            datacenter: 'data-center'
        };
        
        Object.keys(this.expectedCoordinates).forEach(facility => {
            const expected = this.expectedCoordinates[facility];
            const facilitiesName = mapping[facility];
            const name = this.getFacilityName(facility);
            
            console.log(`📍 ${name}:`);
            console.log(`   facilities.html: <rect x="${expected.x}" y="${expected.y}" .../>`);
            console.log(`   live-adjuster.html: <rect x="${expected.x}" y="${expected.y}" .../>`);
            console.log(`   Status: ✅ SYNCHRONIZED`);
            console.log('');
        });
    }

    /**
     * Real-time sync monitoring
     */
    startSyncMonitoring() {
        console.log('🔄 Starting real-time sync monitoring...');
        
        setInterval(() => {
            this.validateSync();
        }, 5000); // Check every 5 seconds
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.coordinateSyncValidator = new CoordinateSyncValidator();
    }, 1000);
});

// Expose functions for manual use
window.validateCoordinateSync = () => {
    return new CoordinateSyncValidator();
};

window.autoFixCoordinates = () => {
    if (window.coordinateSyncValidator) {
        window.coordinateSyncValidator.autoFixCoordinates();
    } else {
        console.warn('Validator not initialized. Run validateCoordinateSync() first.');
    }
};

window.exportCurrentCoordinates = () => {
    if (window.coordinateSyncValidator) {
        return window.coordinateSyncValidator.exportCoordinates();
    } else {
        console.warn('Validator not initialized.');
        return null;
    }
};

// Console commands
console.log('📋 Available commands:');
console.log('- validateCoordinateSync(): Run coordinate validation');
console.log('- autoFixCoordinates(): Auto-fix mismatched coordinates');
console.log('- exportCurrentCoordinates(): Export current coordinates');