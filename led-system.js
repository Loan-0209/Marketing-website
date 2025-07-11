// Hệ thống đèn LED động cho AI Campus 3D
function createLEDSystem(scene, buildings) {
    const ledSystem = {
        lights: [],
        update: null
    };
    
    // Tạo các đèn LED cho mỗi tòa nhà
    if (buildings && buildings.length > 0) {
        buildings.forEach(building => {
            const buildingPos = building.position.clone();
            const buildingHeight = building.geometry.parameters.height;
            
            // Tạo đèn LED xung quanh mỗi tòa nhà
            const ledCount = 8;
            const ledRadius = Math.max(
                building.geometry.parameters.width,
                building.geometry.parameters.depth
            ) * 0.7;
            
            for (let i = 0; i < ledCount; i++) {
                const angle = (i / ledCount) * Math.PI * 2;
                const x = buildingPos.x + Math.cos(angle) * ledRadius;
                const z = buildingPos.z + Math.sin(angle) * ledRadius;
                
                // Tạo đèn LED với màu ngẫu nhiên
                const led = createLED(x, buildingHeight * 0.7, z, getRandomLEDColor(), scene);
                ledSystem.lights.push(led);
            }
            
            // Tạo đèn LED trên đỉnh tòa nhà
            const topLED = createLED(
                buildingPos.x,
                buildingPos.y + buildingHeight + 2,
                buildingPos.z,
                0xFF0000, // Đèn đỏ trên đỉnh
                scene,
                1.5 // Kích thước lớn hơn
            );
            ledSystem.lights.push(topLED);
        });
    }
    
    // Hàm cập nhật đèn LED
    ledSystem.update = function(deltaTime) {
        const time = performance.now() * 0.001;
        
        this.lights.forEach((led, index) => {
            // Nhấp nháy với tốc độ khác nhau
            const blinkSpeed = 0.5 + index * 0.1;
            const intensity = 0.5 + Math.sin(time * blinkSpeed) * 0.5;
            
            // Cập nhật cường độ ánh sáng
            led.intensity = intensity * 2;
            
            // Thay đổi màu sắc theo thời gian (chỉ áp dụng cho một số đèn)
            if (index % 3 === 0) {
                const hue = (time * 0.1 + index * 0.05) % 1;
                led.color.setHSL(hue, 1, 0.5);
            }
        });
    };
    
    return ledSystem;
}

// Tạo một đèn LED
function createLED(x, y, z, color, scene, size = 0.5) {
    // Tạo ánh sáng điểm
    const light = new THREE.PointLight(color, 2, 10);
    light.position.set(x, y, z);
    scene.add(light);
    
    // Tạo khối phát sáng
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(light.position);
    scene.add(mesh);
    
    // Gắn mesh vào light để dễ quản lý
    light.userData.mesh = mesh;
    
    return light;
}

// Tạo màu ngẫu nhiên cho LED
function getRandomLEDColor() {
    const colors = [
        0x00FF00, // Xanh lá
        0x0000FF, // Xanh dương
        0xFFFF00, // Vàng
        0xFF00FF, // Tím
        0x00FFFF  // Xanh ngọc
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
}
