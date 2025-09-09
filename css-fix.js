// SOLUTION 4: Simple CSS Transform (Dễ nhất)
function cssTransformFix() {
    // Tìm canvas element
    const canvas = document.querySelector('canvas');
    if (canvas) {
        // Thêm CSS transform để di chuyển toàn bộ scene
        canvas.style.transform = 'translateX(100px) translateZ(50px)';
    }
}

// SOLUTION 4B: Specific object CSS fix
function applyCSSSolutionToObjects() {
    // Get all DOM elements của data center (nếu có)
    const elements = document.querySelectorAll('[data-type="datacenter"]');
    elements.forEach(el => {
        el.style.transform = 'translate3d(100px, 0, 50px)';
    });
}
