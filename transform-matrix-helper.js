/**
 * Transform Matrix Helper for Power Grid Alignment
 * Công cụ tính toán và áp dụng transform matrix động
 */

class TransformMatrixHelper {
    constructor() {
        this.facilities = new Map();
        this.baseTransforms = {
            'hydro-plant': { x: 2, y: 3, scale: 1, rotation: 0 },
            '500kv-substation': { x: -5, y: 2, scale: 1.05, rotation: 0 },
            '110kv-substation': { x: 3, y: -2, scale: 1, rotation: 2 }
        };
    }

    /**
     * Tạo matrix từ các thông số transform
     * @param {number} scaleX - Scale theo trục X
     * @param {number} scaleY - Scale theo trục Y  
     * @param {number} rotation - Góc xoay (độ)
     * @param {number} translateX - Dịch chuyển X
     * @param {number} translateY - Dịch chuyển Y
     * @param {number} skewX - Skew theo trục X (độ)
     * @param {number} skewY - Skew theo trục Y (độ)
     */
    createMatrix(scaleX = 1, scaleY = 1, rotation = 0, translateX = 0, translateY = 0, skewX = 0, skewY = 0) {
        // Chuyển đổi độ sang radian
        const rotRad = rotation * Math.PI / 180;
        const skewXRad = skewX * Math.PI / 180;
        const skewYRad = skewY * Math.PI / 180;
        
        // Tính toán matrix components
        const cosRot = Math.cos(rotRad);
        const sinRot = Math.sin(rotRad);
        
        // Matrix multiplication for combined transforms
        // [scaleX * cos(rot) - skewY * sin(rot), scaleX * sin(rot) + skewY * cos(rot), translateX]
        // [skewX * cos(rot) - scaleY * sin(rot), skewX * sin(rot) + scaleY * cos(rot), translateY]
        
        const a = scaleX * cosRot + skewY * sinRot;
        const b = scaleX * sinRot - skewY * cosRot;
        const c = -scaleY * sinRot + skewX * cosRot;
        const d = scaleY * cosRot + skewX * sinRot;
        const e = translateX;
        const f = translateY;
        
        return { a, b, c, d, e, f };
    }

    /**
     * Chuyển matrix object thành string CSS
     */
    matrixToString(matrix) {
        return `matrix(${matrix.a.toFixed(4)}, ${matrix.b.toFixed(4)}, ${matrix.c.toFixed(4)}, ${matrix.d.toFixed(4)}, ${matrix.e.toFixed(4)}, ${matrix.f.toFixed(4)})`;
    }

    /**
     * Parse matrix string thành object
     */
    parseMatrix(matrixString) {
        const match = matrixString.match(/matrix\((.*)\)/);
        if (!match) return null;
        
        const values = match[1].split(',').map(v => parseFloat(v.trim()));
        if (values.length !== 6) return null;
        
        return {
            a: values[0], b: values[1], c: values[2],
            d: values[3], e: values[4], f: values[5]
        };
    }

    /**
     * Decompose matrix thành các transform components
     */
    decomposeMatrix(matrix) {
        const { a, b, c, d, e, f } = matrix;
        
        // Calculate scale
        const scaleX = Math.sqrt(a * a + b * b);
        const scaleY = Math.sqrt(c * c + d * d);
        
        // Calculate rotation
        const rotation = Math.atan2(b, a) * 180 / Math.PI;
        
        // Calculate skew
        const skewX = Math.atan2(c, d) * 180 / Math.PI - rotation;
        
        return {
            scaleX,
            scaleY,
            rotation,
            translateX: e,
            translateY: f,
            skewX,
            skewY: 0 // Simplified, actual calculation is more complex
        };
    }

    /**
     * Áp dụng transform matrix cho facility
     */
    applyTransform(facilityId, transforms) {
        const element = document.querySelector(`[data-facility="${facilityId}"]`);
        if (!element) {
            console.error(`Facility không tìm thấy: ${facilityId}`);
            return false;
        }

        const { scaleX = 1, scaleY = 1, rotation = 0, translateX = 0, translateY = 0, skewX = 0, skewY = 0 } = transforms;
        const matrix = this.createMatrix(scaleX, scaleY, rotation, translateX, translateY, skewX, skewY);
        const matrixString = this.matrixToString(matrix);
        
        element.style.transform = matrixString;
        
        // Lưu transform cho tracking
        this.facilities.set(facilityId, { element, transforms, matrix, matrixString });
        
        console.log(`✅ Applied transform to ${facilityId}:`, matrixString);
        return true;
    }

    /**
     * Điều chỉnh vị trí dựa trên screen size
     */
    getResponsiveTransform(facilityId, screenWidth) {
        const baseTransform = this.baseTransforms[facilityId] || { x: 0, y: 0, scale: 1, rotation: 0 };
        let adjustedTransform = { ...baseTransform };
        
        if (screenWidth <= 768) {
            // Mobile adjustments
            adjustedTransform.scale *= 0.75;
            adjustedTransform.x *= 0.75;
            adjustedTransform.y *= 0.75;
        } else if (screenWidth <= 1024) {
            // Tablet adjustments
            adjustedTransform.scale *= 0.9;
            adjustedTransform.x *= 0.9;
            adjustedTransform.y *= 0.9;
        }
        
        return adjustedTransform;
    }

    /**
     * Auto-adjust tất cả facilities theo screen size
     */
    autoAdjustAll() {
        const screenWidth = window.innerWidth;
        console.log(`🖥️ Auto-adjusting for screen width: ${screenWidth}px`);
        
        Object.keys(this.baseTransforms).forEach(facilityId => {
            const responsiveTransform = this.getResponsiveTransform(facilityId, screenWidth);
            
            this.applyTransform(facilityId, {
                scaleX: responsiveTransform.scale,
                scaleY: responsiveTransform.scale,
                rotation: responsiveTransform.rotation,
                translateX: responsiveTransform.x,
                translateY: responsiveTransform.y
            });
        });
    }

    /**
     * Animate transform với transition
     */
    animateTransform(facilityId, targetTransforms, duration = 300) {
        const element = document.querySelector(`[data-facility="${facilityId}"]`);
        if (!element) return false;
        
        // Set transition
        element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        
        // Apply transform
        this.applyTransform(facilityId, targetTransforms);
        
        // Remove transition after animation
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
        
        return true;
    }

    /**
     * Interactive adjustment mode
     */
    enableInteractiveAdjustment(facilityId) {
        const element = document.querySelector(`[data-facility="${facilityId}"]`);
        if (!element) return false;
        
        let isDragging = false;
        let startX, startY;
        let currentTransform = this.facilities.get(facilityId)?.transforms || this.baseTransforms[facilityId] || {};
        
        const handleMouseDown = (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        };
        
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newTransform = {
                ...currentTransform,
                translateX: (currentTransform.translateX || 0) + deltaX,
                translateY: (currentTransform.translateY || 0) + deltaY
            };
            
            this.applyTransform(facilityId, newTransform);
            
            // Update display
            this.displayTransformInfo(facilityId, newTransform);
        };
        
        const handleMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';
                
                // Update stored transform
                const facilityData = this.facilities.get(facilityId);
                if (facilityData) {
                    currentTransform = facilityData.transforms;
                }
                
                console.log(`📍 Final position for ${facilityId}:`, currentTransform);
            }
        };
        
        element.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        element.style.cursor = 'grab';
        
        console.log(`🎮 Interactive adjustment enabled for ${facilityId}`);
        return true;
    }

    /**
     * Display transform info overlay
     */
    displayTransformInfo(facilityId, transforms) {
        let infoElement = document.getElementById(`transform-info-${facilityId}`);
        
        if (!infoElement) {
            infoElement = document.createElement('div');
            infoElement.id = `transform-info-${facilityId}`;
            infoElement.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: #00ff00;
                padding: 10px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 12px;
                z-index: 1000;
            `;
            document.body.appendChild(infoElement);
        }
        
        infoElement.innerHTML = `
            <strong>${facilityId}</strong><br>
            X: ${transforms.translateX?.toFixed(1) || 0}<br>
            Y: ${transforms.translateY?.toFixed(1) || 0}<br>
            Scale: ${transforms.scaleX?.toFixed(2) || 1}<br>
            Rotation: ${transforms.rotation?.toFixed(1) || 0}°
        `;
    }

    /**
     * Calculate alignment offset từ expected position
     */
    calculateAlignmentOffset(facilityId, expectedX, expectedY) {
        const element = document.querySelector(`[data-facility="${facilityId}"]`);
        if (!element) return null;
        
        const rect = element.querySelector('.facility-rect, rect');
        if (!rect) return null;
        
        const currentX = parseFloat(rect.getAttribute('x'));
        const currentY = parseFloat(rect.getAttribute('y'));
        
        const offsetX = expectedX - currentX;
        const offsetY = expectedY - currentY;
        
        console.log(`📏 Alignment offset for ${facilityId}: (${offsetX.toFixed(1)}, ${offsetY.toFixed(1)})`);
        
        return { offsetX, offsetY, currentX, currentY, expectedX, expectedY };
    }

    /**
     * Export current transforms
     */
    exportTransforms() {
        const transforms = {};
        
        this.facilities.forEach((data, facilityId) => {
            transforms[facilityId] = {
                transforms: data.transforms,
                matrixString: data.matrixString,
                decomposed: this.decomposeMatrix(data.matrix)
            };
        });
        
        return transforms;
    }

    /**
     * Import và apply transforms
     */
    importTransforms(transforms) {
        Object.keys(transforms).forEach(facilityId => {
            const data = transforms[facilityId];
            if (data.transforms) {
                this.applyTransform(facilityId, data.transforms);
            }
        });
        
        console.log(`✅ Imported transforms for ${Object.keys(transforms).length} facilities`);
    }

    /**
     * Reset về base transforms
     */
    resetToBase() {
        Object.keys(this.baseTransforms).forEach(facilityId => {
            const baseTransform = this.baseTransforms[facilityId];
            this.applyTransform(facilityId, {
                scaleX: baseTransform.scale,
                scaleY: baseTransform.scale,
                rotation: baseTransform.rotation,
                translateX: baseTransform.x,
                translateY: baseTransform.y
            });
        });
        
        console.log('🔄 Reset to base transforms');
    }
}

// Export và auto-initialize
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransformMatrixHelper;
} else {
    window.TransformMatrixHelper = TransformMatrixHelper;
}

// Tạo instance global
if (typeof window !== 'undefined') {
    window.matrixHelper = new TransformMatrixHelper();
    
    // Add convenient functions
    window.adjustMatrix = (facilityId, x, y, scale = 1, rotation = 0) => {
        return window.matrixHelper.applyTransform(facilityId, {
            translateX: x,
            translateY: y,
            scaleX: scale,
            scaleY: scale,
            rotation: rotation
        });
    };
    
    window.autoAdjust = () => window.matrixHelper.autoAdjustAll();
    window.resetTransforms = () => window.matrixHelper.resetToBase();
    window.enableDrag = (facilityId) => window.matrixHelper.enableInteractiveAdjustment(facilityId);
    
    // Auto-adjust on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            window.matrixHelper.autoAdjustAll();
        }, 250);
    });
    
    console.log('🎯 Transform Matrix Helper loaded!');
    console.log('📌 Use adjustMatrix(facilityId, x, y, scale, rotation) to adjust');
    console.log('📌 Use autoAdjust() to auto-adjust all facilities');
    console.log('📌 Use enableDrag(facilityId) for interactive adjustment');
}