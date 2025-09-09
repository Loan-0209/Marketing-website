// 🏢 SCRIPT DI CHUYỂN DATA CENTERS VỀ ĐẤT LIỀN AN TOÀN
// Mục tiêu: Di chuyển tất cả data centers xa khỏi sông, nằm hoàn toàn trên đất liền

console.log("🏢 Bắt đầu di chuyển Data Centers về đất liền...");

// Vị trí mới an toàn cho Data Centers (xa sông hơn)
const safeDataCenterPositions = [
    {
        name: "DATA CENTER 01",
        position: { x: 600, y: 0, z: 0 },    // Di chuyển xa về phía đông
        size: { width: 60, height: 45, depth: 40 }
    },
    {
        name: "DATA CENTER 02", 
        position: { x: 550, y: 0, z: 80 },   // Phía đông bắc
        size: { width: 55, height: 40, depth: 35 }
    },
    {
        name: "DATA CENTER 03",
        position: { x: 650, y: 0, z: 60 },   // Phía đông nam  
        size: { width: 45, height: 35, depth: 30 }
    }
];

// Hàm di chuyển Data Centers
function moveDataCentersToLand() {
    try {
        // Tìm và xóa data centers hiện tại
        const datacentersToRemove = scene.children.filter(child => 
            child.userData && child.userData.type === 'datacenter'
        );
        
        console.log(`🗑️ Tìm thấy ${datacentersToRemove.length} data centers cần di chuyển`);
        
        datacentersToRemove.forEach(datacenter => {
            scene.remove(datacenter);
            console.log(`✅ Đã xóa ${datacenter.userData.name || 'datacenter'}`);
        });

        // Xóa cooling towers cũ
        const coolersToRemove = scene.children.filter(child => 
            child.userData && child.userData.type === 'cooling-tower'
        );
        
        coolersToRemove.forEach(cooler => {
            scene.remove(cooler);
        });

        // Xóa water systems cũ
        const waterToRemove = scene.children.filter(child => 
            child.userData && child.userData.type === 'water-system'
        );
        
        waterToRemove.forEach(water => {
            scene.remove(water);
        });

        console.log("🧹 Đã dọn dẹp các data centers cũ");

        // Tạo lại data centers ở vị trí mới
        safeDataCenterPositions.forEach((dcConfig, index) => {
            createSafeDataCenter(dcConfig, index + 1);
        });

        console.log("✅ Hoàn thành di chuyển Data Centers về đất liền!");
        
    } catch (error) {
        console.error("❌ Lỗi khi di chuyển data centers:", error);
    }
}

// Hàm tạo Data Center ở vị trí an toàn
function createSafeDataCenter(config, dcNumber) {
    const { position, size, name } = config;
    
    // Tạo nhóm data center
    const datacenterGroup = new THREE.Group();
    datacenterGroup.userData = { 
        type: 'datacenter', 
        name: name,
        phase: 1,
        safe: true 
    };

    // Tòa nhà chính
    const buildingGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
    const buildingMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xf0f0f0,
        transparent: true,
        opacity: 0.9
    });
    
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(0, size.height/2, 0);
    datacenterGroup.add(building);

    // Thêm chi tiết Data Center
    addDataCenterDetails(datacenterGroup, size);
    
    // Đặt vị trí nhóm
    datacenterGroup.position.set(position.x, position.y, position.z);
    
    // Thêm vào scene
    scene.add(datacenterGroup);
    
    console.log(`🏢 ${name} đã được tạo tại vị trí an toàn: x=${position.x}, z=${position.z}`);
    
    // Tạo cooling towers xung quanh
    createSafeCoolingTowers(position, size.width);
    
    // Tạo water system
    createSafeWaterSystem(position);
    
    return datacenterGroup;
}

// Hàm thêm chi tiết cho Data Center
function addDataCenterDetails(datacenterGroup, size) {
    // Logo/sign
    const signGeometry = new THREE.PlaneGeometry(15, 8);
    const signMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x4a9eff,
        transparent: true,
        opacity: 0.8
    });
    const sign = new THREE.Mesh(signGeometry, signMaterial);
    sign.position.set(0, size.height * 0.8, size.depth/2 + 0.1);
    datacenterGroup.add(sign);

    // Ventilation systems
    for (let i = 0; i < 3; i++) {
        const ventGeometry = new THREE.CylinderGeometry(2, 2, 3);
        const ventMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        const vent = new THREE.Mesh(ventGeometry, ventMaterial);
        vent.position.set(-size.width/3 + (i * size.width/3), size.height + 1.5, 0);
        datacenterGroup.add(vent);
    }
}

// Hàm tạo cooling towers ở vị trí an toàn
function createSafeCoolingTowers(centerPos, dcWidth) {
    const towerRadius = dcWidth * 0.8;
    const towerPositions = [
        { x: centerPos.x + towerRadius, z: centerPos.z },
        { x: centerPos.x, z: centerPos.z + towerRadius },
        { x: centerPos.x - towerRadius, z: centerPos.z },
        { x: centerPos.x, z: centerPos.z - towerRadius }
    ];

    towerPositions.forEach((pos, index) => {
        const towerGeometry = new THREE.CylinderGeometry(8, 12, 25);
        const towerMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xe0e0e0,
            transparent: true,
            opacity: 0.9
        });
        
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.set(pos.x, 12.5, pos.z);
        tower.userData = { type: 'cooling-tower', safe: true };
        
        scene.add(tower);
        
        console.log(`⚪ Cooling tower ${index + 1} tại: x=${pos.x}, z=${pos.z}`);
    });
}

// Hàm tạo water system an toàn
function createSafeWaterSystem(position) {
    // Underground water system (pipes)
    const pipeGeometry = new THREE.CylinderGeometry(0.5, 0.5, 30);
    const pipeMaterial = new THREE.MeshLambertMaterial({ color: 0x0066cc });
    
    const pipe1 = new THREE.Mesh(pipeGeometry, pipeMaterial);
    pipe1.position.set(position.x, -0.5, position.z);
    pipe1.rotation.z = Math.PI / 2;
    pipe1.userData = { type: 'water-system', safe: true };
    
    scene.add(pipe1);
    
    console.log(`💧 Water system cho data center tại: x=${position.x}, z=${position.z}`);
}

// Hàm kiểm tra va chạm với sông
function checkRiverCollision(position) {
    // Sông nằm khoảng x: 200-400, z: -100 đến 300
    const riverBounds = {
        minX: 200,
        maxX: 400,
        minZ: -100,
        maxZ: 300
    };
    
    return (position.x >= riverBounds.minX && position.x <= riverBounds.maxX &&
            position.z >= riverBounds.minZ && position.z <= riverBounds.maxZ);
}

// Hàm validation
function validateDataCenterPositions() {
    let allSafe = true;
    
    safeDataCenterPositions.forEach(config => {
        if (checkRiverCollision(config.position)) {
            console.warn(`⚠️ Data center ${config.name} vẫn gần sông!`);
            allSafe = false;
        } else {
            console.log(`✅ ${config.name} ở vị trí an toàn`);
        }
    });
    
    return allSafe;
}

// Thực thi
console.log("🎯 Bắt đầu di chuyển Data Centers về đất liền...");
console.log("📍 Vị trí mới:");
safeDataCenterPositions.forEach(config => {
    console.log(`   ${config.name}: x=${config.position.x}, z=${config.position.z}`);
});

// Validation trước khi thực hiện
if (validateDataCenterPositions()) {
    console.log("✅ Tất cả vị trí mới đều an toàn");
    moveDataCentersToLand();
    
    // Render lại scene
    if (typeof renderer !== 'undefined') {
        renderer.render(scene, camera);
    }
    
    console.log("🎉 Hoàn thành! Data Centers đã nằm an toàn trên đất liền");
} else {
    console.error("❌ Một số vị trí không an toàn, vui lòng kiểm tra lại");
}
