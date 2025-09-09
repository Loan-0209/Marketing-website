// Authentication Manager - Complete Logout System
// Handles login/logout state, UI updates, and session management

class AuthenticationManager {
    constructor() {
        this.currentUser = null;
        this.authToken = null;
        this.API_BASE_URL = 'http://localhost:5001/api';
        this.init();
    }
    
    init() {
        this.loadAuthState();
        this.updateUI();
        this.setupEventListeners();
        
        // Check authentication status periodically
        setInterval(() => this.checkAuthStatus(), 60000); // Every minute
    }
    
    setupEventListeners() {
        // Listen for storage changes (logout from other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'authToken' || e.key === 'currentUser') {
                this.loadAuthState();
                this.updateUI();
            }
        });
        
        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkAuthStatus();
            }
        });
    }
    
    loadAuthState() {
        try {
            // Check multiple possible storage keys for compatibility
            this.authToken = localStorage.getItem('authToken') || 
                           localStorage.getItem('heart_auth_token') || 
                           sessionStorage.getItem('authToken');
            
            const userDataString = localStorage.getItem('currentUser') || 
                                 localStorage.getItem('heart_current_user') || 
                                 sessionStorage.getItem('currentUser');
            
            if (userDataString) {
                this.currentUser = JSON.parse(userDataString);
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
            this.clearAuthState();
        }
    }
    
    isAuthenticated() {
        return !!(this.authToken && this.currentUser);
    }
    
    async checkAuthStatus() {
        if (!this.authToken) {
            this.updateUI();
            return;
        }
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                // Token is invalid, clear auth state
                this.clearAuthState();
                this.updateUI();
                this.showNotification('Session expired. Please login again.', 'warning');
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            // Don't clear auth on network errors, just log
        }
    }
    
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');
        
        if (this.isAuthenticated()) {
            // Show user info, hide login button
            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) {
                userInfo.classList.remove('auth-hidden');
                userInfo.classList.add('auth-visible');
            }
            if (userName) {
                const displayName = this.currentUser.firstName || 
                                  this.currentUser.username || 
                                  this.currentUser.email || 
                                  'User';
                userName.textContent = `Welcome, ${displayName}`;
            }
            
            // Show admin/editor specific elements
            this.updateRoleBasedUI();
        } else {
            // Show login button, hide user info
            if (loginBtn) loginBtn.style.display = '';
            if (userInfo) {
                userInfo.classList.add('auth-hidden');
                userInfo.classList.remove('auth-visible');
            }
            
            // Hide admin/editor elements
            this.hideRoleBasedUI();
        }
    }
    
    updateRoleBasedUI() {
        const userRole = this.currentUser?.role;
        
        // Show/hide admin elements
        const adminElements = document.querySelectorAll('[data-role="admin"]');
        adminElements.forEach(el => {
            el.style.display = (userRole === 'admin') ? '' : 'none';
        });
        
        // Show/hide editor elements  
        const editorElements = document.querySelectorAll('[data-role="editor"]');
        editorElements.forEach(el => {
            el.style.display = (userRole === 'editor' || userRole === 'admin') ? '' : 'none';
        });
    }
    
    hideRoleBasedUI() {
        const roleElements = document.querySelectorAll('[data-role]');
        roleElements.forEach(el => {
            el.style.display = 'none';
        });
    }
    
    async logout() {
        // Show confirmation dialog
        const userName = this.currentUser?.firstName || 
                        this.currentUser?.username || 
                        'User';
        
        if (!confirm(`Are you sure you want to logout, ${userName}?`)) {
            return false;
        }
        
        try {
            // Show logout in progress
            this.showNotification('Logging out...', 'info');
            
            // Call backend logout if token exists
            if (this.authToken) {
                try {
                    await fetch(`${this.API_BASE_URL}/auth/logout`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.authToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (error) {
                    console.warn('Backend logout failed:', error);
                    // Continue with local logout even if backend fails
                }
            }
            
            // Clear all authentication data
            this.clearAuthState();
            
            // Update UI
            this.updateUI();
            
            // Show success message
            this.showNotification('Logged out successfully!', 'success');
            
            // Redirect to home page after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
            return true;
            
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Logout failed. Please try again.', 'error');
            return false;
        }
    }
    
    clearAuthState() {
        // Clear all possible authentication storage
        const authKeys = [
            'authToken',
            'heart_auth_token',
            'currentUser', 
            'heart_current_user',
            'rememberedEmail',
            'heart-news-draft',
            'sessionId'
        ];
        
        authKeys.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
        
        // Reset instance variables
        this.currentUser = null;
        this.authToken = null;
    }
    
    setAuthState(user, token) {
        this.currentUser = user;
        this.authToken = token;
        
        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        this.updateUI();
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `auth-notification auth-notification-${type}`;
        notification.innerHTML = `
            <div class="auth-notification-content">
                <span class="auth-notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="auth-notification-message">${message}</span>
            </div>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            font-weight: 500;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            background: ${this.getNotificationColor(type)};
            color: white;
            font-family: 'Inter', sans-serif;
        `;
        
        // Add animation styles if not already present
        if (!document.getElementById('auth-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'auth-notification-styles';
            styles.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .auth-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .auth-notification-icon {
                    font-size: 1.2rem;
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after delay
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌', 
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }
    
    getNotificationColor(type) {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b', 
            'info': '#3b82f6'
        };
        return colors[type] || '#3b82f6';
    }
    
    // Utility methods
    getUserRole() {
        return this.currentUser?.role || null;
    }
    
    getUserName() {
        return this.currentUser?.firstName || 
               this.currentUser?.username || 
               this.currentUser?.email || 
               null;
    }
    
    hasRole(role) {
        const userRole = this.getUserRole();
        if (role === 'admin') {
            return userRole === 'admin';
        } else if (role === 'editor') {
            return userRole === 'editor' || userRole === 'admin';
        }
        return false;
    }
}

// Global logout function for onclick handlers
function logout() {
    if (window.authManager) {
        return window.authManager.logout();
    } else {
        console.error('Auth manager not initialized');
        return false;
    }
}

// Initialize authentication manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Create global auth manager instance
    window.authManager = new AuthenticationManager();
    
    console.log('🔐 Authentication Manager initialized');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthenticationManager;
}