/**
 * THREE.js Loader Module
 * Handles loading THREE.js from multiple CDN sources with fallbacks
 */

// THREE.js CDN URLs with fallbacks
window.THREE_CDN_URLS = [
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://unpkg.com/three@0.128.0/build/three.min.js', 
    'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js',
    'https://threejs.org/build/three.min.js'
];

window.THREE_LOADED = false;

/**
 * Load THREE.js from CDN with fallback support
 */
function loadThreeJS(index = 0) {
    return new Promise((resolve, reject) => {
        if (typeof THREE !== 'undefined') {
            window.THREE_LOADED = true;
            console.log('✅ THREE.js already available');
            resolve(THREE);
            return;
        }

        if (index >= window.THREE_CDN_URLS.length) {
            const error = new Error('All THREE.js CDN attempts failed');
            console.error('❌', error.message);
            reject(error);
            return;
        }

        console.log(`🔄 Loading THREE.js from CDN ${index + 1}...`);
        const script = document.createElement('script');
        script.src = window.THREE_CDN_URLS[index];

        script.onload = function() {
            if (typeof THREE !== 'undefined') {
                window.THREE_LOADED = true;
                console.log(`✅ THREE.js loaded successfully from CDN ${index + 1}`);
                console.log(`📦 THREE.js Version: ${THREE.REVISION}`);
                
                // Test basic functionality
                try {
                    const testScene = new THREE.Scene();
                    console.log('✅ THREE.js functionality test passed');
                    resolve(THREE);
                } catch (testError) {
                    console.error('❌ THREE.js functionality test failed:', testError);
                    reject(new Error('THREE.js loaded but not functional'));
                }
            } else {
                console.error(`❌ THREE.js script loaded but THREE is undefined from CDN ${index + 1}`);
                loadThreeJS(index + 1).then(resolve).catch(reject);
            }
        };

        script.onerror = function() {
            console.error(`❌ Failed to load THREE.js from CDN ${index + 1}: ${window.THREE_CDN_URLS[index]}`);
            loadThreeJS(index + 1).then(resolve).catch(reject);
        };

        document.head.appendChild(script);
    });
}

/**
 * Enhanced THREE.js loader with timeout and multiple attempts
 */
window.ensureThreeJSLoaded = function(timeout = 10000) {
    return new Promise((resolve, reject) => {
        // If already loaded, return immediately
        if (window.THREE_LOADED && typeof THREE !== 'undefined') {
            resolve(THREE);
            return;
        }

        // Set timeout
        const timeoutId = setTimeout(() => {
            reject(new Error('THREE.js loading timeout'));
        }, timeout);

        // Load THREE.js
        loadThreeJS()
            .then((THREE) => {
                clearTimeout(timeoutId);
                resolve(THREE);
            })
            .catch((error) => {
                clearTimeout(timeoutId);
                reject(error);
            });
    });
};

console.log('📦 THREE.js Loader Module initialized');