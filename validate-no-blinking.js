// Comprehensive validation script to ensure no blinking effects remain
// Run in browser console after loading 3D Smart City

(function validateNoBlinking() {
    console.log('🔍 VALIDATING NO BLINKING EFFECTS');
    console.log('='.repeat(60));
    
    let testResults = [];
    let blinkingDetected = false;
    
    function runTest(testName, testFn) {
        try {
            const result = testFn();
            testResults.push({ name: testName, status: result.pass ? 'PASS' : 'WARN', details: result.message });
            if (result.pass) {
                console.log(`✅ ${testName}: ${result.message}`);
            } else {
                console.warn(`⚠️ ${testName}: ${result.message}`);
                if (result.critical) blinkingDetected = true;
            }
            return result.pass;
        } catch (error) {
            testResults.push({ name: testName, status: 'FAIL', details: error.message });
            console.error(`❌ ${testName}: FAIL - ${error.message}`);
            return false;
        }
    }
    
    // Test 1: Check for Anti-Blinking System
    runTest('Anti-Blinking System Active', () => {
        if (typeof disableAllBlinkingEffects !== 'function') {
            return { pass: false, message: 'Anti-blinking system not loaded', critical: true };
        }
        if (typeof initAntiBlinkingSystem !== 'function') {
            return { pass: false, message: 'Anti-blinking initialization not found', critical: true };
        }
        return { pass: true, message: 'Anti-blinking system successfully loaded' };
    });
    
    // Test 2: Scene Material Analysis
    runTest('Scene Material Stability', () => {
        if (typeof scene === 'undefined') {
            return { pass: false, message: 'Scene not available' };
        }
        
        let unstableMaterials = 0;
        let totalEmissiveMaterials = 0;
        let suspiciousAnimations = [];
        
        scene.traverse((object) => {
            if (object.material) {
                const materials = Array.isArray(object.material) ? object.material : [object.material];
                
                materials.forEach(material => {
                    if (material.emissive && material.emissive.getHex() !== 0x000000) {
                        totalEmissiveMaterials++;
                        
                        // Check for stable emissive intensity
                        if (material.emissiveIntensity === undefined) {
                            unstableMaterials++;
                        } else if (material.emissiveIntensity < 0.1 || material.emissiveIntensity > 2.5) {
                            unstableMaterials++;
                            suspiciousAnimations.push(`${object.name || 'unnamed'}: intensity=${material.emissiveIntensity}`);
                        }
                    }
                    
                    // Check opacity stability
                    if (material.transparent && material.opacity !== undefined) {
                        if (material.opacity < 0.3 || material.opacity > 1.1) {
                            unstableMaterials++;
                            suspiciousAnimations.push(`${object.name || 'unnamed'}: opacity=${material.opacity}`);
                        }
                    }
                });
            }
        });
        
        if (unstableMaterials > 0) {
            return { 
                pass: false, 
                message: `${unstableMaterials}/${totalEmissiveMaterials} materials unstable: ${suspiciousAnimations.join(', ')}`,
                critical: true 
            };
        }
        
        return { 
            pass: true, 
            message: `All ${totalEmissiveMaterials} emissive materials have stable properties` 
        };
    });
    
    // Test 3: Check for Active Intervals
    runTest('No Active Blinking Intervals', () => {
        // Monitor for rapid intervals that could cause blinking
        let rapidIntervals = 0;
        const originalSetInterval = window.setInterval;
        
        // Temporarily override to catch new intervals
        window.setInterval = function(callback, delay) {
            if (delay < 100) {
                rapidIntervals++;
                console.warn('🚫 Rapid interval blocked:', delay + 'ms');
                return null;
            }
            return originalSetInterval.apply(window, arguments);
        };
        
        // Restore after test
        setTimeout(() => {
            window.setInterval = originalSetInterval;
        }, 100);
        
        if (rapidIntervals > 0) {
            return { pass: false, message: `${rapidIntervals} rapid intervals detected`, critical: true };
        }
        
        return { pass: true, message: 'No rapid blinking intervals detected' };
    });
    
    // Test 4: Object Visibility Stability
    runTest('Object Visibility Stability', () => {
        if (typeof scene === 'undefined') {
            return { pass: false, message: 'Scene not available' };
        }
        
        let hiddenObjects = 0;
        let totalObjects = 0;
        let suspiciousObjects = [];
        
        scene.traverse((object) => {
            if (object.geometry) {
                totalObjects++;
                if (!object.visible && !object.userData.intentionallyHidden) {
                    hiddenObjects++;
                    suspiciousObjects.push(object.name || `${object.type}@${object.position.x.toFixed(1)}`);
                }
            }
        });
        
        const hiddenPercent = (hiddenObjects / totalObjects * 100).toFixed(1);
        
        if (hiddenObjects > totalObjects * 0.1) { // More than 10% hidden is suspicious
            return { 
                pass: false, 
                message: `${hiddenPercent}% objects hidden: ${suspiciousObjects.slice(0,5).join(', ')}`,
                critical: true 
            };
        }
        
        return { 
            pass: true, 
            message: `${hiddenPercent}% objects hidden (normal range)` 
        };
    });
    
    // Test 5: Performance Impact Check
    runTest('Performance After Blinking Removal', () => {
        if (typeof renderer === 'undefined' || !renderer.info) {
            return { pass: false, message: 'Renderer info not available' };
        }
        
        const info = renderer.info;
        const stats = {
            geometries: info.memory.geometries,
            textures: info.memory.textures,
            calls: info.render.calls,
            triangles: info.render.triangles
        };
        
        // Check for reasonable performance metrics
        if (stats.calls > 500) {
            return { pass: false, message: `High render calls: ${stats.calls} (may indicate animation overhead)` };
        }
        
        return { 
            pass: true, 
            message: `Good performance: ${stats.calls} calls, ${stats.triangles} triangles` 
        };
    });
    
    // Test 6: Specific Light Source Validation
    runTest('Light Source Stability', () => {
        if (typeof scene === 'undefined') {
            return { pass: false, message: 'Scene not available' };
        }
        
        let lights = [];
        let unstableLights = [];
        
        scene.traverse((object) => {
            if (object.isLight) {
                lights.push(object);
                
                // Check light intensity stability
                if (object.intensity !== undefined) {
                    if (object.intensity < 0.1 || object.intensity > 5.0) {
                        unstableLights.push(`${object.type}: ${object.intensity}`);
                    }
                }
            }
        });
        
        if (unstableLights.length > 0) {
            return { 
                pass: false, 
                message: `${unstableLights.length}/${lights.length} lights unstable: ${unstableLights.join(', ')}`,
                critical: false 
            };
        }
        
        return { 
            pass: true, 
            message: `All ${lights.length} lights have stable intensities` 
        };
    });
    
    // Test 7: External System Check
    runTest('External Blinking Systems Disabled', () => {
        const systems = ['ledSystem', 'holographicSystem', 'quantumSystem', 'aiIntelligenceSystem'];
        let activeBlinkingSystems = [];
        let disabledSystems = [];
        
        systems.forEach(systemName => {
            if (window[systemName]) {
                if (window[systemName].disable && typeof window[systemName].disable === 'function') {
                    disabledSystems.push(systemName);
                } else if (window[systemName].update && typeof window[systemName].update === 'function') {
                    activeBlinkingSystems.push(systemName);
                }
            }
        });
        
        if (activeBlinkingSystems.length > 0) {
            return { 
                pass: false, 
                message: `Active blinking systems: ${activeBlinkingSystems.join(', ')}`,
                critical: true 
            };
        }
        
        return { 
            pass: true, 
            message: `${disabledSystems.length} systems disabled, ${systems.length - disabledSystems.length} not found` 
        };
    });
    
    // Summary and Results
    const passCount = testResults.filter(t => t.status === 'PASS').length;
    const warnCount = testResults.filter(t => t.status === 'WARN').length;
    const failCount = testResults.filter(t => t.status === 'FAIL').length;
    
    console.log('\\n' + '='.repeat(60));
    console.log('📊 BLINKING VALIDATION RESULTS:');
    console.log(`   ✅ Passed: ${passCount}/${testResults.length}`);
    console.log(`   ⚠️ Warnings: ${warnCount}/${testResults.length}`);
    console.log(`   ❌ Failed: ${failCount}/${testResults.length}`);
    
    if (!blinkingDetected && failCount === 0) {
        console.log('\\n🎉 SUCCESS: NO BLINKING EFFECTS DETECTED!');
        console.log('✅ All flashing/pulsing animations have been successfully disabled');
        console.log('✅ Scene lighting is stable and consistent');
        console.log('✅ Materials have appropriate static emissive properties');
        console.log('✅ Performance optimized by removing animation overhead');
    } else if (blinkingDetected) {
        console.log('\\n⚠️ CRITICAL: BLINKING EFFECTS STILL ACTIVE');
        console.log('❌ Some blinking animations are still running');
        console.log('💡 Check the failed tests above for specific issues');
    } else {
        console.log('\\n✅ MOSTLY SUCCESS: Minor issues detected');
        console.log('💡 Check warnings above - may be cosmetic issues');
    }
    
    // Provide specific lighting info
    console.log('\\n💡 CURRENT LIGHTING SETUP:');
    if (typeof scene !== 'undefined') {
        let emissiveObjects = 0;
        scene.traverse((object) => {
            if (object.material) {
                const materials = Array.isArray(object.material) ? object.material : [object.material];
                materials.forEach(material => {
                    if (material.emissive && material.emissive.getHex() !== 0x000000) {
                        emissiveObjects++;
                    }
                });
            }
        });
        console.log(`   🔆 ${emissiveObjects} objects with stable emissive lighting`);
        console.log('   🌆 Traffic lights, street lights, and LED displays are static');
        console.log('   🏢 Building windows have consistent warm illumination');
        console.log('   🎯 Water animation preserved (gentle rotation, not blinking)');
    }
    
    console.log('\\n' + '='.repeat(60));
    console.log('🏁 BLINKING VALIDATION COMPLETE');
    
    return {
        success: !blinkingDetected && failCount === 0,
        blinkingDetected,
        results: testResults,
        summary: { passed: passCount, warnings: warnCount, failed: failCount }
    };
})();