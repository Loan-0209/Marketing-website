// Hệ thống hạt và hiệu ứng cho AI Campus 3D
function createParticleSystem(scene) {
    const particleSystem = {
        particles: [],
        update: null
    };
    
    // Tạo hệ thống hạt xung quanh campus
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x88CCFF,
        size: 0.2,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    // Tạo vị trí cho các hạt
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Vị trí ngẫu nhiên trong không gian
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = Math.random() * 50;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
        
        // Vận tốc ngẫu nhiên
        velocities.push({
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1,
            z: (Math.random() - 0.5) * 0.1
        });
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Tạo hệ thống hạt
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.name = "ParticleSystem";
    scene.add(particles);
    
    particleSystem.particles = particles;
    
    // Hàm cập nhật hệ thống hạt
    particleSystem.update = function(deltaTime) {
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Cập nhật vị trí dựa trên vận tốc
            positions[i3] += velocities[i].x;
            positions[i3 + 1] += velocities[i].y;
            positions[i3 + 2] += velocities[i].z;
            
            // Giới hạn không gian
            if (positions[i3] < -50 || positions[i3] > 50) velocities[i].x *= -1;
            if (positions[i3 + 1] < 0 || positions[i3 + 1] > 50) velocities[i].y *= -1;
            if (positions[i3 + 2] < -50 || positions[i3 + 2] > 50) velocities[i].z *= -1;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
    };
    
    return particleSystem;
}

// Tạo hiệu ứng sương mù
function createFogEffect(scene) {
    // Thêm sương mù vào scene
    const fog = new THREE.FogExp2(0x000033, 0.005);
    scene.fog = fog;
    
    return fog;
}

// Tạo hiệu ứng ánh sáng volumetric
function createVolumetricLights(scene) {
    const volumetricLights = [];
    
    // Vị trí đặt đèn volumetric
    const positions = [
        { x: 0, y: 10, z: 0 },
        { x: -20, y: 15, z: -20 },
        { x: 20, y: 15, z: 20 }
    ];
    
    positions.forEach(pos => {
        // Tạo đèn spotlight
        const light = new THREE.SpotLight(0x4488ff, 10, 50, Math.PI / 6, 0.5, 1);
        light.position.set(pos.x, pos.y, pos.z);
        light.lookAt(pos.x, 0, pos.z);
        scene.add(light);
        
        // Tạo hình trụ để mô phỏng tia sáng
        const geometry = new THREE.CylinderGeometry(0.2, 5, pos.y, 32, 20, true);
        const material = new THREE.MeshBasicMaterial({
            color: 0x4488ff,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(pos.x, pos.y / 2, pos.z);
        cylinder.rotation.x = Math.PI;
        scene.add(cylinder);
        
        volumetricLights.push({ light, cylinder });
    });
    
    return volumetricLights;
}
