/**
 * SMART CITY 3D - QUICK FIX SCRIPT
 * Giải quyết vấn đề màu sắc và hiệu ứng chồng lên nhau
 * 
 * Cách sử dụng:
 * 1. Mở website 3D Smart City
 * 2. Mở Developer Console (F12)
 * 3. Copy và paste toàn bộ script này
 * 4. Chạy: applyQuickFix()
 */

console.log('🔧 SMART CITY QUICK FIX SCRIPT LOADED');
console.log('📋 Available commands:');
console.log('  🚀 applyQuickFix() - Áp dụng tất cả fixes');
console.log('  💡 fixLighting() - Chỉ sửa lighting');
console.log('  🎨 fixColors() - Chỉ sửa màu sắc');
console.log('  🤖 reduceAIEffects() - Giảm AI effects');
console.log('  📊 getPerformanceInfo() - Kiểm tra performance');
console.log('  🔄 resetToOptimal() - Reset về trạng thái tối ưu');

// ====================================
// 1. FIX LIGHTING SYSTEM
// ====================================
window.fixLighting = function() {
    console.log('💡 Fixing lighting system...');
    
    if (!window.scene) {
        console.error('❌ Scene not found');
        return;
    }
    
    let lightsFixed = 0;
    
    window.scene.traverse((child) => {
        if (child.isLight) {
            const originalIntensity = child.intensity;
            
            switch(child.type) {
                case 'AmbientLight':
                    child.intensity = 0.4; // Giảm từ 0.8
                    break;
                case 'DirectionalLight':
                    child.intensity = 0.8; // Giảm từ 1.5
                    break;
                case 'HemisphereLight':
                    child.intensity = 0.2; // Giảm từ 0.4
                    break;
                default:
                    child.intensity = Math.min(child.intensity, 0.5);
            }
            
            console.log(`  🔆 ${child.type}: ${originalIntensity} → ${child.intensity}`);
            lightsFixed++;
        }
    });
    
    console.log(`✅ Fixed ${lightsFixed} lights`);
    return lightsFixed;
};

// ====================================
// 2. FIX BUILDING COLORS
// ====================================
window.fixColors = function() {
    console.log('🎨 Fixing building colors...');
    
    if (!window.scene) {
        console.error('❌ Scene not found');
        return;
    }
    
    // Màu sắc mới - dễ nhìn và phân biệt
    const improvedColors = [
        0x4a90e2,  // Soft blue
        0x7cb342,  // Green
        0xff7043,  // Soft orange  
        0x8e24aa,  // Purple
        0x26a69a,  // Teal
        0x5d4037,  // Brown
        0x546e7a,  // Blue gray
        0x8bc34a   // Light green
    ];
    
    let buildingsFixed = 0;
    
    window.scene.traverse((child) => {
        if (child.isMesh && child.userData && 
            (child.userData.type === 'building' || child.userData.type === 'special_building')) {
            
            // Áp dụng màu mới
            const newColor = improvedColors[buildingsFixed % improvedColors.length];
            child.material.color.setHex(newColor);
            
            // Giảm emissive intensity nếu có
            if (child.material.emissive) {
                child.material.emissiveIntensity = Math.min(child.material.emissiveIntensity, 0.1);
            }
            
            // Giảm transparency conflicts
            if (child.material.transparent && child.material.opacity > 0.9) {
                child.material.transparent = false;
                child.material.opacity = 1.0;
            }
            
            buildingsFixed++;
        }
    });
    
    console.log(`✅ Fixed colors for ${buildingsFixed} buildings`);
    return buildingsFixed;
};

// ====================================
// 3. REDUCE AI EFFECTS
// ====================================
window.reduceAIEffects = function() {
    console.log('🤖 Reducing AI effects...');
    
    let effectsReduced = 0;
    
    // Giảm Neural Networks
    if (window.neuralSystem) {
        console.log('  🧠 Reducing neural networks...');
        if (window.neuralSystem.networks) {
            // Chỉ giữ lại 30% neural networks
            const networksToKeep = Math.floor(window.neuralSystem.networks.length * 0.3);
            for (let i = networksToKeep; i < window.neuralSystem.networks.length; i++) {
                const network = window.neuralSystem.networks[i];
                if (network && network.group) {
                    window.scene.remove(network.group);
                }
            }
            window.neuralSystem.networks = window.neuralSystem.networks.slice(0, networksToKeep);
            effectsReduced += 20;
        }
    }
    
    // Giảm Data Flow
    if (window.dataFlowSystem) {
        console.log('  📊 Reducing data flows...');
        if (window.dataFlowSystem.streams) {
            // Chỉ giữ lại 40% data streams
            const streamsToKeep = Math.floor(window.dataFlowSystem.streams.length * 0.4);
            for (let i = streamsToKeep; i < window.dataFlowSystem.streams.length; i++) {
                const stream = window.dataFlowSystem.streams[i];
                if (stream && stream.particles) {
                    stream.particles.forEach(particle => {
                        if (particle.parent) particle.parent.remove(particle);
                    });
                }
            }
            window.dataFlowSystem.streams = window.dataFlowSystem.streams.slice(0, streamsToKeep);
            effectsReduced += 15;
        }
    }
    
    // Giảm Holograms  
    if (window.hologramSystem) {
        console.log('  🎭 Reducing holograms...');
        if (window.hologramSystem.holograms) {
            // Chỉ giữ lại 50% holograms
            const hologramsToKeep = Math.floor(window.hologramSystem.holograms.length * 0.5);
            for (let i = hologramsToKeep; i < window.hologramSystem.holograms.length; i++) {
                const hologram = window.hologramSystem.holograms[i];
                if (hologram && hologram.group) {
                    window.scene.remove(hologram.group);
                }
            }
            window.hologramSystem.holograms = window.hologramSystem.holograms.slice(0, hologramsToKeep);
            effectsReduced += 10;
        }
    }
    
    // Tắt Quantum Effects tạm thời (quá heavy)
    if (window.quantumSystem) {
        console.log('  ⚛️ Temporarily disabling quantum effects...');
        if (window.quantumSystem.quantumBuildings) {
            window.quantumSystem.quantumBuildings.forEach(qb => {
                if (qb.rings) {
                    qb.rings.forEach(ring => {
                        ring.visible = false;
                    });
                }
                if (qb.particles) {
                    qb.particles.forEach(particle => {
                        particle.visible = false;
                    });
                }
            });
            effectsReduced += 25;
        }
    }
    
    console.log(`✅ Reduced ${effectsReduced} AI effects`);
    return effectsReduced;
};

// ====================================
// 4. OPTIMIZE MATERIALS
// ====================================
window.optimizeMaterials = function() {
    console.log('🔧 Optimizing materials...');
    
    let materialsOptimized = 0;
    
    window.scene.traverse((child) => {
        if (child.isMesh && child.material) {
            const material = child.material;
            
            // Giảm material complexity
            if (material.transmission) {
                material.transmission = 0;
                materialsOptimized++;
            }
            
            if (material.roughness && material.roughness < 0.3) {
                material.roughness = 0.3;
                materialsOptimized++;
            }
            
            if (material.metalness && material.metalness > 0.5) {
                material.metalness = 0.5;
                materialsOptimized++;
            }
            
            // Tắt expensive transparency
            if (material.transparent && material.opacity > 0.8) {
                material.transparent = false;
                material.opacity = 1.0;
                materialsOptimized++;
            }
            
            // Giảm emissive intensity
            if (material.emissiveIntensity && material.emissiveIntensity > 0.2) {
                material.emissiveIntensity = 0.1;
                materialsOptimized++;
            }
        }
    });
    
    console.log(`✅ Optimized ${materialsOptimized} material properties`);
    return materialsOptimized;
};

// ====================================
// 5. PERFORMANCE INFO
// ====================================
window.getPerformanceInfo = function() {
    console.log('📊 PERFORMANCE INFO');
    console.log('==================');
    
    if (!window.scene || !window.renderer) {
        console.error('❌ Scene or renderer not found');
        return;
    }
    
    // Scene statistics
    let totalObjects = 0;
    let meshCount = 0;
    let lightCount = 0;
    let materialCount = 0;
    let triangleCount = 0;
    
    const materials = new Set();
    
    window.scene.traverse((child) => {
        totalObjects++;
        
        if (child.isMesh) {
            meshCount++;
            if (child.geometry) {
                const positions = child.geometry.attributes.position;
                if (positions) {
                    triangleCount += positions.count / 3;
                }
            }
            if (child.material) {
                materials.add(child.material.uuid);
            }
        }
        
        if (child.isLight) {
            lightCount++;
        }
    });
    
    materialCount = materials.size;
    
    console.log(`🏢 Total Objects: ${totalObjects}`);
    console.log(`🎯 Meshes: ${meshCount}`);
    console.log(`💡 Lights: ${lightCount}`);
    console.log(`🎨 Unique Materials: ${materialCount}`);
    console.log(`📐 Triangles: ${Math.round(triangleCount)}`);
    console.log(`🖥️ Renderer Info:`, window.renderer.info.render);
    
    // AI Systems status
    console.log('\n🤖 AI SYSTEMS STATUS:');
    console.log(`🧠 Neural System: ${window.neuralSystem ? '✅ Active' : '❌ Inactive'}`);
    console.log(`📊 Data Flow: ${window.dataFlowSystem ? '✅ Active' : '❌ Inactive'}`);
    console.log(`🎭 Holograms: ${window.hologramSystem ? '✅ Active' : '❌ Inactive'}`);
    console.log(`⚛️ Quantum: ${window.quantumSystem ? '✅ Active' : '❌ Inactive'}`);
    console.log(`🤖 AI Intelligence: ${window.aiIntelligenceSystem ? '✅ Active' : '❌ Inactive'}`);
    
    return {
        totalObjects,
        meshCount,
        lightCount,
        materialCount,
        triangleCount: Math.round(triangleCount),
        rendererInfo: window.renderer.info.render
    };
};

// ====================================
// 6. COMPREHENSIVE QUICK FIX
// ====================================
window.applyQuickFix = function() {
    console.log('🚀 APPLYING COMPREHENSIVE QUICK FIX');
    console.log('===================================');
    
    const startTime = Date.now();
    
    // Get initial performance info
    console.log('\n📊 BEFORE optimization:');
    const beforeStats = window.getPerformanceInfo();
    
    console.log('\n🔧 Applying fixes...');
    
    // Apply all fixes
    const lightsFixed = window.fixLighting();
    const colorsFixed = window.fixColors();
    const effectsReduced = window.reduceAIEffects();
    const materialsOptimized = window.optimizeMaterials();
    
    // Force canvas resize
    if (window.campus && window.campus.onWindowResize) {
        window.campus.onWindowResize();
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n✅ QUICK FIX COMPLETED!');
    console.log(`⏱️ Duration: ${duration}ms`);
    console.log(`💡 Lights fixed: ${lightsFixed}`);
    console.log(`🎨 Colors fixed: ${colorsFixed}`);
    console.log(`🤖 AI effects reduced: ${effectsReduced}`);
    console.log(`🔧 Materials optimized: ${materialsOptimized}`);
    
    // Show visual feedback
    if (document.body) {
        const feedback = document.createElement('div');
        feedback.innerHTML = `
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">
                ✅ Smart City Optimized!
            </div>
            <div style="font-size: 14px;">
                💡 Lights: ${lightsFixed} | 🎨 Colors: ${colorsFixed}<br>
                🤖 AI Effects: -${effectsReduced} | 🔧 Materials: ${materialsOptimized}<br>
                ⏱️ Applied in ${duration}ms
            </div>
        `;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(16, 185, 129, 0.95);
            color: white;
            padding: 25px 35px;
            border-radius: 15px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
            text-align: center;
            animation: fadeInOut 4s ease;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 4000);
    }
    
    console.log('\n📊 AFTER optimization:');
    setTimeout(() => {
        window.getPerformanceInfo();
    }, 1000);
    
    return {
        duration,
        lightsFixed,
        colorsFixed,
        effectsReduced,
        materialsOptimized,
        beforeStats
    };
};

// ====================================
// 7. RESET TO OPTIMAL STATE
// ====================================
window.resetToOptimal = function() {
    console.log('🔄 Resetting to optimal state...');
    
    // Set optimal camera view
    if (window.campus && window.campus.animateToView) {
        window.campus.animateToView('overview');
    }
    
    // Set optimal phase (Phase 2 - balanced)
    if (window.campus && window.campus.switchPhase) {
        window.campus.switchPhase(2);
    }
    
    // Apply quick fix after phase change
    setTimeout(() => {
        window.applyQuickFix();
    }, 2000);
    
    console.log('✅ Reset completed - Phase 2 with optimizations');
};

// ====================================
// 8. EMERGENCY VISIBILITY MODE
// ====================================
window.extremeVisibilityMode = function() {
    console.log('🔥 EXTREME VISIBILITY MODE - EMERGENCY FIX');
    
    // Turn off ALL AI effects
    if (window.neuralSystem) window.neuralSystem.removeAllNetworks();
    if (window.dataFlowSystem) window.dataFlowSystem.removeAllDataStreams();
    if (window.hologramSystem) window.hologramSystem.removeAllHolograms();
    if (window.quantumSystem) window.quantumSystem.removeAllQuantumEffects();
    
    // Minimal lighting
    window.scene.traverse((child) => {
        if (child.isLight) {
            child.intensity = child.type === 'AmbientLight' ? 0.6 : 0.3;
        }
    });
    
    // High contrast colors
    const contrastColors = [0x000080, 0x800000, 0x008000, 0x800080, 0x808000, 0x008080];
    let buildingIndex = 0;
    
    window.scene.traverse((child) => {
        if (child.isMesh && child.userData && child.userData.type === 'building') {
            child.material.color.setHex(contrastColors[buildingIndex % contrastColors.length]);
            child.material.emissive.setHex(0x000000);
            child.material.emissiveIntensity = 0;
            child.material.transparent = false;
            child.material.opacity = 1.0;
            buildingIndex++;
        }
    });
    
    console.log('🔥 Extreme visibility mode applied - minimal effects, high contrast');
    
    // Show dramatic feedback
    const feedback = document.createElement('div');
    feedback.innerHTML = '🔥 EXTREME VISIBILITY MODE ACTIVATED';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(220, 38, 127, 0.95);
        color: white;
        padding: 30px 50px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        text-align: center;
        animation: fadeInOut 3s ease;
    `;
    
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 3000);
};

// ====================================
// 9. AUTO-OPTIMIZATION
// ====================================
let autoOptimizationInterval;

window.startAutoOptimization = function() {
    console.log('🤖 Starting auto-optimization...');
    
    let frameCount = 0;
    let lastTime = Date.now();
    let fps = 60;
    
    autoOptimizationInterval = setInterval(() => {
        frameCount++;
        const currentTime = Date.now();
        
        if (currentTime - lastTime >= 1000) {
            fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            frameCount = 0;
            lastTime = currentTime;
            
            // Auto-optimize if FPS drops below 30
            if (fps < 30) {
                console.log(`📉 FPS dropped to ${fps}, applying optimization...`);
                window.reduceAIEffects();
            }
            
            console.log(`📊 FPS: ${fps}`);
        }
    }, 100);
    
    console.log('✅ Auto-optimization started');
};

window.stopAutoOptimization = function() {
    if (autoOptimizationInterval) {
        clearInterval(autoOptimizationInterval);
        autoOptimizationInterval = null;
        console.log('⏹️ Auto-optimization stopped');
    }
};

// ====================================
// INITIALIZATION
// ====================================
console.log('');
console.log('🎯 READY TO OPTIMIZE!');
console.log('Run: applyQuickFix() để áp dụng tất cả optimizations');
console.log('Run: extremeVisibilityMode() nếu vẫn có vấn đề');
console.log('Run: startAutoOptimization() để bật auto-tuning');
console.log('');

// Auto-apply quick fix after 3 seconds if scene is ready
setTimeout(() => {
    if (window.scene && window.camera && window.renderer) {
        console.log('🚀 Auto-applying quick fix...');
        window.applyQuickFix();
    } else {
        console.log('⏳ Scene not ready yet. Run applyQuickFix() manually when ready.');
    }
}, 3000);
