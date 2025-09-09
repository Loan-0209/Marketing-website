// FIND DATACENTER OBJECTS - Complete search script
// Copy and paste into browser console at http://localhost:8080/3d-smart-city.html

(function findDatacenterObjects() {
    console.log('🔍 SEARCHING FOR DATACENTER OBJECTS');
    console.log('==================================\n');
    
    // 1. SEARCH BY NAME - DATACENTER
    console.log('1️⃣ Searching by name containing "datacenter"...');
    const datacenterObjects = [];
    
    scene.traverse(obj => {
        if (obj.name && obj.name.toLowerCase().includes('datacenter')) {
            datacenterObjects.push({
                object: obj,
                name: obj.name,
                type: obj.type,
                position: obj.position.clone(),
                worldPosition: obj.getWorldPosition(new THREE.Vector3()),
                userData: obj.userData,
                material: obj.material ? {
                    color: obj.material.color ? `#${obj.material.color.getHexString()}` : 'none',
                    name: obj.material.name || 'unnamed'
                } : null
            });
            
            console.log(`🏢 ${obj.name}:`);
            console.log(`   Position: (${obj.position.x.toFixed(1)}, ${obj.position.y.toFixed(1)}, ${obj.position.z.toFixed(1)})`);
            console.log(`   World: (${obj.getWorldPosition(new THREE.Vector3()).x.toFixed(1)}, ${obj.getWorldPosition(new THREE.Vector3()).z.toFixed(1)})`);
            console.log(`   Type: ${obj.type}`);
            if (obj.userData && Object.keys(obj.userData).length > 0) {
                console.log(`   UserData:`, obj.userData);
            }
            console.log('');
        }
    });
    
    console.log(`✅ Found ${datacenterObjects.length} objects with "datacenter" in name\n`);
    
    // 2. SEARCH BY NAME - DATA, CENTER, SERVER
    console.log('2️⃣ Searching for related terms (data, center, server)...');
    const relatedObjects = [];
    const searchTerms = ['data', 'center', 'centre', 'server', 'building', 'complex'];
    
    scene.traverse(obj => {
        if (obj.name) {
            const nameLower = obj.name.toLowerCase();
            const hasRelatedTerm = searchTerms.some(term => nameLower.includes(term));
            
            if (hasRelatedTerm && !nameLower.includes('datacenter')) {
                relatedObjects.push({
                    name: obj.name,
                    position: obj.position.clone(),
                    userData: obj.userData
                });
                
                console.log(`🏗️ ${obj.name}: (${obj.position.x.toFixed(1)}, ${obj.position.z.toFixed(1)})`);
            }
        }
    });
    
    console.log(`✅ Found ${relatedObjects.length} related objects\n`);
    
    // 3. SEARCH BY GREEN COLOR
    console.log('3️⃣ Searching for green areas (datacenter complex)...');
    const greenObjects = [];
    
    scene.traverse(obj => {
        if (obj.material && obj.material.color) {
            const color = obj.material.color;
            // Kiểm tra màu xanh lá (green > 0.7, red < 0.3)
            if (color.g > 0.7 && color.r < 0.3) {
                greenObjects.push({
                    object: obj,
                    name: obj.name || 'unnamed',
                    position: obj.position.clone(),
                    color: `rgb(${Math.round(color.r*255)}, ${Math.round(color.g*255)}, ${Math.round(color.b*255)})`,
                    hex: `#${color.getHexString()}`
                });
                
                console.log(`🟢 ${obj.name || 'unnamed'}:`);
                console.log(`   Position: (${obj.position.x.toFixed(1)}, ${obj.position.z.toFixed(1)})`);
                console.log(`   Color: ${`#${color.getHexString()}`} | RGB(${Math.round(color.r*255)}, ${Math.round(color.g*255)}, ${Math.round(color.b*255)})`);
            }
        }
    });
    
    console.log(`✅ Found ${greenObjects.length} green objects\n`);
    
    // 4. SEARCH BY USERDATA
    console.log('4️⃣ Searching by userData for building types...');
    const buildingObjects = [];
    
    scene.traverse(obj => {
        if (obj.userData && obj.userData.buildingType) {
            buildingObjects.push({
                name: obj.name || 'unnamed',
                buildingType: obj.userData.buildingType,
                position: obj.position.clone(),
                userData: obj.userData
            });
            
            console.log(`🏢 ${obj.userData.buildingType}:`);
            console.log(`   Name: ${obj.name || 'unnamed'}`);
            console.log(`   Position: (${obj.position.x.toFixed(1)}, ${obj.position.z.toFixed(1)})`);
            if (obj.userData.phase) console.log(`   Phase: ${obj.userData.phase}`);
            console.log('');
        }
    });
    
    console.log(`✅ Found ${buildingObjects.length} objects with buildingType\n`);
    
    // 5. SEARCH BY POSITION - CENTRAL AREA
    console.log('5️⃣ Searching in central area (-300 to 0, -300 to 0)...');
    const centralObjects = [];
    
    scene.traverse(obj => {
        const pos = obj.position;
        // Khu vực trung tâm có thể chứa datacenter
        if (pos.x >= -300 && pos.x <= 0 && pos.z >= -300 && pos.z <= 0) {
            // Chỉ lấy objects có kích thước đáng kể (có thể là building)
            if (obj.geometry && (obj.type === 'Mesh' || obj.type === 'Group')) {
                centralObjects.push({
                    name: obj.name || 'unnamed',
                    type: obj.type,
                    position: pos.clone(),
                    hasUserData: obj.userData && Object.keys(obj.userData).length > 0
                });
            }
        }
    });
    
    // Group by approximate position to reduce noise
    const groupedCentral = {};
    centralObjects.forEach(obj => {
        const key = `${Math.round(obj.position.x/20)*20}_${Math.round(obj.position.z/20)*20}`;
        if (!groupedCentral[key]) {
            groupedCentral[key] = [];
        }
        groupedCentral[key].push(obj);
    });
    
    Object.keys(groupedCentral).forEach(key => {
        const group = groupedCentral[key];
        const avgPos = {
            x: group.reduce((sum, obj) => sum + obj.position.x, 0) / group.length,
            z: group.reduce((sum, obj) => sum + obj.position.z, 0) / group.length
        };
        
        console.log(`📍 Area (~${avgPos.x.toFixed(0)}, ~${avgPos.z.toFixed(0)}): ${group.length} objects`);
        group.slice(0, 3).forEach(obj => {
            console.log(`   - ${obj.name} (${obj.type})`);
        });
    });
    
    console.log(`✅ Found ${centralObjects.length} objects in central area\n`);
    
    // 6. SMART DETECTION - DATACENTER CHARACTERISTICS
    console.log('6️⃣ Smart detection by datacenter characteristics...');
    const datacenterCandidates = [];
    
    scene.traverse(obj => {
        if (obj.type === 'Mesh' || obj.type === 'Group') {
            let score = 0;
            const reasons = [];
            
            // Check name
            if (obj.name) {
                const nameLower = obj.name.toLowerCase();
                if (nameLower.includes('datacenter') || nameLower.includes('data')) {
                    score += 10;
                    reasons.push('name contains datacenter/data');
                }
                if (nameLower.includes('server') || nameLower.includes('rack')) {
                    score += 8;
                    reasons.push('name suggests server equipment');
                }
                if (nameLower.includes('building') && (nameLower.includes('tech') || nameLower.includes('it'))) {
                    score += 6;
                    reasons.push('tech building name');
                }
            }
            
            // Check userData
            if (obj.userData) {
                if (obj.userData.buildingType && obj.userData.buildingType.includes('datacenter')) {
                    score += 15;
                    reasons.push('userData buildingType is datacenter');
                }
                if (obj.userData.phase) {
                    score += 3;
                    reasons.push('has phase data');
                }
            }
            
            // Check material (tech buildings often have blue/grey colors)
            if (obj.material && obj.material.color) {
                const color = obj.material.color;
                if ((color.b > 0.6 && color.r < 0.4) || // Blue
                    (color.r > 0.4 && color.r < 0.7 && color.g > 0.4 && color.g < 0.7 && color.b > 0.4 && color.b < 0.7)) { // Grey
                    score += 2;
                    reasons.push('tech-like color scheme');
                }
            }
            
            // Check position (datacenters often in specific zones)
            const pos = obj.position;
            if (pos.x >= -250 && pos.x <= -50 && pos.z >= -200 && pos.z <= 0) {
                score += 3;
                reasons.push('in likely datacenter zone');
            }
            
            if (score >= 5) {
                datacenterCandidates.push({
                    object: obj,
                    name: obj.name || 'unnamed',
                    score: score,
                    reasons: reasons,
                    position: pos.clone()
                });
            }
        }
    });
    
    // Sort by score
    datacenterCandidates.sort((a, b) => b.score - a.score);
    
    console.log(`🎯 Top datacenter candidates:`);
    datacenterCandidates.slice(0, 10).forEach((candidate, index) => {
        console.log(`${index + 1}. ${candidate.name} (Score: ${candidate.score})`);
        console.log(`   Position: (${candidate.position.x.toFixed(1)}, ${candidate.position.z.toFixed(1)})`);
        console.log(`   Reasons: ${candidate.reasons.join(', ')}`);
        console.log('');
    });
    
    // 7. CREATE VISUAL MARKERS
    console.log('7️⃣ Creating visual markers...');
    
    // Remove existing markers
    const existingMarkers = scene.getObjectByName('datacenter-markers');
    if (existingMarkers) scene.remove(existingMarkers);
    
    const markersGroup = new THREE.Group();
    markersGroup.name = 'datacenter-markers';
    
    // Mark top datacenter candidates
    datacenterCandidates.slice(0, 5).forEach((candidate, index) => {
        const marker = new THREE.Mesh(
            new THREE.SphereGeometry(5, 16, 16),
            new THREE.MeshBasicMaterial({
                color: index === 0 ? 0xff0000 : 0xffff00, // Red for top candidate, yellow for others
                emissive: index === 0 ? 0xff0000 : 0xffff00,
                emissiveIntensity: 0.5
            })
        );
        
        marker.position.copy(candidate.position);
        marker.position.y += 20; // Above the object
        marker.name = `marker-${candidate.name}`;
        markersGroup.add(marker);
        
        // Add label
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = index === 0 ? '#ff0000' : '#ffff00';
        ctx.font = 'Bold 24px Arial';
        ctx.fillText(`DC${index + 1}: ${candidate.name}`, 10, 50);
        ctx.fillText(`Score: ${candidate.score}`, 10, 80);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(candidate.position);
        sprite.position.y += 30;
        sprite.scale.set(20, 10, 1);
        markersGroup.add(sprite);
    });
    
    scene.add(markersGroup);
    console.log('✅ Visual markers added (red = best candidate)\n');
    
    // 8. SUMMARY & RECOMMENDATIONS
    console.log('📊 SUMMARY & RECOMMENDATIONS');
    console.log('============================');
    console.log(`Datacenter objects by name: ${datacenterObjects.length}`);
    console.log(`Green area objects: ${greenObjects.length}`);
    console.log(`Building type objects: ${buildingObjects.length}`);
    console.log(`Smart detection candidates: ${datacenterCandidates.length}`);
    
    if (datacenterCandidates.length > 0) {
        const best = datacenterCandidates[0];
        console.log(`\n🎯 BEST DATACENTER CANDIDATE:`);
        console.log(`Name: ${best.name}`);
        console.log(`Position: (${best.position.x.toFixed(1)}, ${best.position.z.toFixed(1)})`);
        console.log(`Confidence: ${best.score}/20`);
        console.log(`Reasons: ${best.reasons.join(', ')}`);
    }
    
    console.log('\n💡 HELPFUL COMMANDS:');
    console.log('window.datacenterData.markersGroup - Access markers');
    console.log('window.datacenterData.candidates - All candidates');
    console.log('window.datacenterData.removeMarkers() - Remove markers');
    console.log('window.datacenterData.goToDatacenter(index) - Move camera to datacenter');
    
    // Store data globally
    window.datacenterData = {
        byName: datacenterObjects,
        green: greenObjects,
        buildings: buildingObjects,
        candidates: datacenterCandidates,
        markersGroup: markersGroup,
        
        removeMarkers: function() {
            scene.remove(markersGroup);
            console.log('✅ Markers removed');
        },
        
        goToDatacenter: function(index) {
            if (index < datacenterCandidates.length && camera && controls) {
                const pos = datacenterCandidates[index].position;
                camera.position.set(pos.x + 50, 30, pos.z + 50);
                camera.lookAt(pos.x, 0, pos.z);
                if (controls.update) controls.update();
                console.log(`📹 Camera moved to datacenter ${index + 1}`);
            }
        }
    };
    
    console.log('\n✅ SEARCH COMPLETE! Check visual markers in scene.');
})();