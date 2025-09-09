/**
 * Cache Busting Utility for HEART Website
 * Prevents browser cache issues with image files
 */

class CacheBuster {
    constructor() {
        this.versionData = null;
        this.init();
    }

    async init() {
        try {
            // Load version data
            const response = await fetch('image-version.json');
            this.versionData = await response.json();
            
            // Apply cache busting to all images
            this.applyImageVersions();
            
            console.log('🎯 Cache busting initialized successfully');
        } catch (error) {
            console.warn('⚠️ Cache busting fallback to timestamp method');
            this.applyTimestampVersions();
        }
    }

    applyImageVersions() {
        // Find all images with map references
        const images = document.querySelectorAll('img[src*="hue-location-map"], source[srcset*="hue-location-map"]');
        
        images.forEach(element => {
            if (element.tagName === 'IMG') {
                this.updateImageSrc(element);
            } else if (element.tagName === 'SOURCE') {
                this.updateSourceSrcset(element);
            }
        });
    }

    updateImageSrc(img) {
        const src = img.getAttribute('src');
        if (src && src.includes('hue-location-map')) {
            const newSrc = this.addVersionToUrl(src);
            img.setAttribute('src', newSrc);
            
            // Update srcset if exists
            const srcset = img.getAttribute('srcset');
            if (srcset) {
                const newSrcset = this.updateSrcsetUrls(srcset);
                img.setAttribute('srcset', newSrcset);
            }
        }
    }

    updateSourceSrcset(source) {
        const srcset = source.getAttribute('srcset');
        if (srcset && srcset.includes('hue-location-map')) {
            const newSrcset = this.updateSrcsetUrls(srcset);
            source.setAttribute('srcset', newSrcset);
        }
    }

    updateSrcsetUrls(srcset) {
        return srcset.replace(/assets\/images\/hue-location-map-([^.\s]+)\.([a-z]+)(\s+\d+w)?/g, (match, variant, extension, size) => {
            const imageKey = `hue-location-map-${variant}`;
            const version = this.getVersionForImage(imageKey);
            return `assets/images/hue-location-map-${variant}.${extension}?v=${version}${size || ''}`;
        });
    }

    addVersionToUrl(url) {
        const imageKey = this.extractImageKey(url);
        const version = this.getVersionForImage(imageKey);
        
        if (url.includes('?')) {
            return `${url}&v=${version}`;
        } else {
            return `${url}?v=${version}`;
        }
    }

    extractImageKey(url) {
        const match = url.match(/hue-location-map-([^.\s]+)/);
        return match ? `hue-location-map-${match[1]}` : 'default';
    }

    getVersionForImage(imageKey) {
        if (this.versionData && this.versionData.images[imageKey]) {
            return this.versionData.images[imageKey].timestamp;
        }
        // Fallback to current timestamp
        return Date.now();
    }

    applyTimestampVersions() {
        const timestamp = Date.now();
        const images = document.querySelectorAll('img[src*="hue-location-map"], source[srcset*="hue-location-map"]');
        
        images.forEach(element => {
            if (element.tagName === 'IMG') {
                const src = element.getAttribute('src');
                if (src) {
                    element.setAttribute('src', `${src}?t=${timestamp}`);
                }
                
                const srcset = element.getAttribute('srcset');
                if (srcset) {
                    const newSrcset = srcset.replace(/assets\/images\/hue-location-map-[^.\s]+\.[a-z]+/g, (match) => {
                        return `${match}?t=${timestamp}`;
                    });
                    element.setAttribute('srcset', newSrcset);
                }
            } else if (element.tagName === 'SOURCE') {
                const srcset = element.getAttribute('srcset');
                if (srcset) {
                    const newSrcset = srcset.replace(/assets\/images\/hue-location-map-[^.\s]+\.[a-z]+/g, (match) => {
                        return `${match}?t=${timestamp}`;
                    });
                    element.setAttribute('srcset', newSrcset);
                }
            }
        });
    }

    // Method to manually refresh cache
    refreshCache() {
        console.log('🔄 Refreshing image cache...');
        this.applyTimestampVersions();
    }

    // Method to preload images with cache busting
    preloadImages() {
        const imageUrls = [
            'assets/images/hue-location-map-mobile.jpg',
            'assets/images/hue-location-map-tablet.jpg', 
            'assets/images/hue-location-map-desktop.jpg',
            'assets/images/hue-location-map-high.jpg'
        ];

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = this.addVersionToUrl(url);
        });
    }
}

// Initialize cache buster when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cacheBuster = new CacheBuster();
});

// Add global method for manual cache refresh
window.refreshImageCache = () => {
    if (window.cacheBuster) {
        window.cacheBuster.refreshCache();
    }
};