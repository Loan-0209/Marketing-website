/**
 * Cache Clearer - Utility to force clear browser caches and reload
 * This helps ensure that model files and other resources are freshly loaded
 */

class CacheClearer {
    /**
     * Initialize the cache clearer
     */
    static init() {
        console.log('🧹 Initializing cache clearer...');
        
        // Add a button to the UI for manual cache clearing
        CacheClearer.addClearCacheButton();
        
        // Automatically clear cache on page load
        CacheClearer.clearAllCaches().then(() => {
            console.log('✅ Initial cache clear complete');
        });
    }
    
    /**
     * Add a clear cache button to the UI
     */
    static addClearCacheButton() {
        const button = document.createElement('button');
        button.textContent = '🧹 Xóa bộ nhớ đệm & Tải lại';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#ff5722';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        
        button.addEventListener('click', () => {
            CacheClearer.clearAllCaches().then(() => {
                window.location.reload(true);
            });
        });
        
        document.body.appendChild(button);
        console.log('✅ Cache clear button added to UI');
    }
    
    /**
     * Clear all browser caches including service workers
     */
    static async clearAllCaches() {
        console.log('🧹 Clearing all caches...');
        
        // Unregister service workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
                await registration.unregister();
                console.log('✅ Service worker unregistered');
            }
        }
        
        // Clear cache storage
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            for (let name of cacheNames) {
                await caches.delete(name);
                console.log(`✅ Cache "${name}" deleted`);
            }
        }
        
        // Clear local storage
        localStorage.clear();
        console.log('✅ Local storage cleared');
        
        // Clear session storage
        sessionStorage.clear();
        console.log('✅ Session storage cleared');
        
        console.log('✅ All caches cleared successfully');
        return true;
    }
    
    /**
     * Force reload current page bypassing cache
     */
    static forceReload() {
        console.log('🔄 Force reloading page...');
        window.location.reload(true);
    }
}

// Auto-initialize when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
    CacheClearer.init();
});
