// QUICK RIVER FIX - Paste into console

// Find datacenter center
const dcs = [];
scene.traverse(o => {
    if(o.userData?.buildingType?.includes('datacenter_')) {
        dcs.push(o.position);
        console.log('Found DC:', o.userData.buildingType, o.position.x, o.position.z);
    }
});

const dcCenter = {
    x: dcs.reduce((s,p) => s+p.x, 0) / dcs.length || -200,
    z: dcs.reduce((s,p) => s+p.z, 0) / dcs.length || -100
};

console.log('DC Center:', dcCenter);

// Find and move river
let riverFound = false;
scene.traverse(o => {
    if(o.name?.includes('river-segment')) {
        // Move to 50 units east of datacenter
        o.position.x = dcCenter.x + 50;
        riverFound = true;
        console.log('Moved river segment to x=', o.position.x);
    }
});

// If no river found, create one
if(!riverFound) {
    console.log('Creating new river...');
    const river = new THREE.Group();
    
    for(let i = 0; i < 8; i++) {
        const segment = new THREE.Mesh(
            new THREE.BoxGeometry(20, 1.5, 25),
            new THREE.MeshPhongMaterial({color: 0x006994, transparent: true, opacity: 0.85})
        );
        segment.position.set(dcCenter.x + 50, 0.5, dcCenter.z - 100 + i * 25);
        segment.name = `new-river-${i}`;
        river.add(segment);
    }
    
    scene.add(river);
    console.log('✅ New river created at x=', dcCenter.x + 50);
}

// Check distances
dcs.forEach((pos, i) => {
    const dist = Math.abs(pos.x - (dcCenter.x + 50));
    console.log(`DC${i+1} distance to river: ${dist.toFixed(1)}m ${dist < 100 ? '✅' : '❌'}`);
});