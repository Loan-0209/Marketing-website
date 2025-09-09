// Public Access System - No Login Required for Viewing Content
// Only Editors and Admins need authentication for content management

class PublicAccessManager {
    constructor() {
        this.API_BASE_URL = 'http://localhost:5001/api';
        this.currentUser = this.getCurrentUser();
        this.init();
    }
    
    init() {
        this.setupPublicNavigation();
        this.setupContentAccess();
        this.setupAdminAccessButton();
    }
    
    getCurrentUser() {
        try {
            const token = localStorage.getItem('authToken') || localStorage.getItem('heart_auth_token');
            const user = localStorage.getItem('currentUser') || localStorage.getItem('heart_current_user');
            
            if (token && user) {
                return JSON.parse(user);
            }
        } catch (error) {
            console.log('No valid user session');
        }
        return null;
    }
    
    isLoggedIn() {
        return !!this.currentUser;
    }
    
    isEditor() {
        return this.currentUser && (this.currentUser.role === 'editor' || this.currentUser.role === 'admin');
    }
    
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
    
    setupPublicNavigation() {
        // Remove any login requirements from navigation
        const navLinks = document.querySelectorAll('nav a, .nav-link');
        navLinks.forEach(link => {
            link.removeAttribute('onclick');
            link.style.pointerEvents = 'auto';
        });
        
        // Update user status in navigation if present
        this.updateUserStatus();
    }
    
    updateUserStatus() {
        // Update navigation buttons based on login status
        this.updateNavigationButtons();
        
        const userStatusEl = document.getElementById('userStatus');
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        
        if (this.isLoggedIn()) {
            // Show logged-in user info
            if (userStatusEl) {
                userStatusEl.innerHTML = `
                    <span class="user-welcome">Welcome, ${this.currentUser.firstName || this.currentUser.username}</span>
                    <span class="user-role" data-role="${this.currentUser.role}">${this.currentUser.role}</span>
                `;
            }
            
            if (loginBtn) {
                loginBtn.style.display = 'none';
            }
            
            if (userMenu) {
                userMenu.style.display = 'block';
                userMenu.innerHTML = this.getUserMenuHTML();
            }
        } else {
            // Show public access status
            if (userStatusEl) {
                userStatusEl.innerHTML = '<span class="public-access">Public Access</span>';
            }
            
            if (loginBtn) {
                loginBtn.style.display = 'block'; // Show login button for public users
            }
            
            if (userMenu) {
                userMenu.style.display = 'none';
            }
        }
    }
    
    updateNavigationButtons() {
        // Find and update login/logout buttons in navigation
        const navContainer = document.querySelector('.nav, .navbar nav, nav');
        if (!navContainer) return;
        
        // Remove existing logout button
        const existingLogoutBtn = navContainer.querySelector('.logout-btn');
        if (existingLogoutBtn) {
            existingLogoutBtn.remove();
        }
        
        // Find login button
        const loginBtn = navContainer.querySelector('.login-btn, a[href*="login"]');
        
        if (this.isLoggedIn()) {
            // Hide login button and add logout button
            if (loginBtn) {
                loginBtn.style.display = 'none';
            }
            
            // Add logout button
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.className = 'logout-btn';
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                this.confirmLogout();
            };
            logoutBtn.innerHTML = '🚪 Logout';
            logoutBtn.title = `Logout ${this.currentUser.firstName || this.currentUser.username}`;
            
            // Add user indicator
            const userIndicator = document.createElement('span');
            userIndicator.className = 'user-indicator';
            userIndicator.innerHTML = `👤 ${this.currentUser.firstName || this.currentUser.username}`;
            userIndicator.title = `Logged in as ${this.currentUser.role}`;
            
            // Insert before existing contact/login buttons
            const contactBtn = navContainer.querySelector('.contact-btn');
            if (contactBtn) {
                navContainer.insertBefore(userIndicator, contactBtn);
                navContainer.insertBefore(logoutBtn, contactBtn);
            } else {
                navContainer.appendChild(userIndicator);
                navContainer.appendChild(logoutBtn);
            }
            
        } else {
            // Show login button
            if (loginBtn) {
                loginBtn.style.display = '';
            }
            
            // Remove user indicator
            const userIndicator = navContainer.querySelector('.user-indicator');
            if (userIndicator) {
                userIndicator.remove();
            }
        }
    }
    
    getUserMenuHTML() {
        let menuItems = [];
        
        if (this.isEditor()) {
            menuItems.push('<a href="/admin/post-news.html">Create News Post</a>');
        }
        
        if (this.isAdmin()) {
            menuItems.push('<a href="/admin/users.html">User Management</a>');
            menuItems.push('<a href="/admin/content.html">Content Management</a>');
        }
        
        menuItems.push('<a href="#" onclick="publicAccess.logout()">Logout</a>');
        
        return menuItems.join('');
    }
    
    setupContentAccess() {
        // Enable all public content access
        this.enablePublicContent();
        
        // Setup restricted content protection
        this.protectRestrictedContent();
    }
    
    enablePublicContent() {
        // Ensure all public content is accessible
        const publicContentSelectors = [
            '.news-list',
            '.news-article',
            '.contact-form',
            '.about-content',
            '.facilities-content',
            '.investment-content',
            '.technology-content',
            '.master-plan-content',
            '.campus-3d'
        ];
        
        publicContentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'block';
                el.style.visibility = 'visible';
                el.removeAttribute('data-auth-required');
            });
        });
    }
    
    protectRestrictedContent() {
        // Protect admin/editor-only content
        const restrictedSelectors = [
            '.admin-panel',
            '.editor-tools',
            '.content-management',
            '.user-management',
            '[data-role-required="admin"]',
            '[data-role-required="editor"]'
        ];
        
        restrictedSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (!this.hasRequiredRole(el)) {
                    el.style.display = 'none';
                }
            });
        });
    }
    
    hasRequiredRole(element) {
        const requiredRole = element.getAttribute('data-role-required');
        
        if (!requiredRole) return true; // No role required
        
        if (requiredRole === 'editor') {
            return this.isEditor();
        }
        
        if (requiredRole === 'admin') {
            return this.isAdmin();
        }
        
        return false;
    }
    
    setupAdminAccessButton() {
        // Add discrete admin access button to footer or bottom of page
        this.addAdminAccessButton();
    }
    
    addAdminAccessButton() {
        // Don't add button if already logged in
        if (this.isLoggedIn()) return;
        
        // Don't add button if it already exists
        if (document.getElementById('adminAccessBtn')) return;
        
        const adminAccessHTML = `
            <div id="adminAccessBtn" class="admin-access-button">
                <a href="production-login.html" title="Admin & Editor Login">
                    🔑 Staff Login
                </a>
            </div>
        `;
        
        // Try to add to footer first
        let footer = document.querySelector('footer');
        if (!footer) {
            // If no footer, add to bottom of body
            footer = document.body;
        }
        
        footer.insertAdjacentHTML('beforeend', adminAccessHTML);
        this.styleAdminAccessButton();
    }
    
    styleAdminAccessButton() {
        const style = document.createElement('style');
        style.textContent = `
            .admin-access-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                opacity: 0.7;
                transition: opacity 0.3s ease;
            }
            
            .admin-access-button:hover {
                opacity: 1;
            }
            
            .admin-access-button a {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-size: 0.9rem;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
            }
            
            .admin-access-button a:hover {
                background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }
            
            @media (max-width: 768px) {
                .admin-access-button {
                    bottom: 15px;
                    right: 15px;
                }
                
                .admin-access-button a {
                    padding: 0.6rem 0.8rem;
                    font-size: 0.8rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Content management functions
    async loadPublicNews() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/news`);
            if (!response.ok) throw new Error('Failed to load news');
            
            const data = await response.json();
            return data.data.news;
        } catch (error) {
            console.error('Error loading news:', error);
            return [];
        }
    }
    
    async submitPublicContact(formData) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error submitting contact:', error);
            throw error;
        }
    }
    
    // Authentication management
    checkRestrictedAccess(requiredRole = 'editor') {
        if (!this.isLoggedIn()) {
            this.redirectToLogin('Access to this feature requires authentication.');
            return false;
        }
        
        if (requiredRole === 'admin' && !this.isAdmin()) {
            this.showAccessDenied('Administrator privileges required.');
            return false;
        }
        
        if (requiredRole === 'editor' && !this.isEditor()) {
            this.showAccessDenied('Editor or Administrator privileges required.');
            return false;
        }
        
        return true;
    }
    
    redirectToLogin(message = 'Please login to access this feature.') {
        const currentPage = encodeURIComponent(window.location.pathname);
        this.showNotification(message, 'info');
        
        setTimeout(() => {
            window.location.href = `production-login.html?redirect=${currentPage}`;
        }, 2000);
    }
    
    showAccessDenied(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = message;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    confirmLogout() {
        const userName = this.currentUser?.firstName || this.currentUser?.username || 'User';
        
        if (confirm(`Are you sure you want to logout, ${userName}?`)) {
            this.logout();
        }
    }
    
    async logout() {
        try {
            // Show logging out notification
            this.showNotification('Logging out...', 'info');
            
            const token = localStorage.getItem('authToken') || localStorage.getItem('heart_auth_token');
            
            if (token) {
                // Call backend logout endpoint
                await fetch(`${this.API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.log('Logout API call failed:', error);
            // Continue with local logout even if API fails
        }
        
        // Clear all authentication data
        const authKeys = [
            'authToken',
            'heart_auth_token', 
            'currentUser',
            'heart_current_user',
            'heart-news-draft',
            'sessionId'
        ];
        
        authKeys.forEach(key => {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        });
        
        // Reset current user
        this.currentUser = null;
        
        // Show success notification
        this.showNotification('Logged out successfully!', 'success');
        
        // Update UI immediately
        this.updateUserStatus();
        this.protectRestrictedContent();
        this.addAdminAccessButton();
        
        // Redirect to login page with logout confirmation after a brief delay
        setTimeout(() => {
            window.location.href = 'production-login.html?logout=true';
        }, 1500);
    }
    
    // Utility functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    formatDateTime(dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Create global instance
const publicAccess = new PublicAccessManager();

// Export for use in other scripts
window.publicAccess = publicAccess;

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .user-welcome {
        color: #1f2937;
        font-weight: 600;
    }
    
    .user-role {
        background: #e5e7eb;
        color: #374151;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        text-transform: uppercase;
        font-weight: 600;
        margin-left: 0.5rem;
    }
    
    .user-role[data-role="admin"] {
        background: #fee2e2;
        color: #dc2626;
    }
    
    .user-role[data-role="editor"] {
        background: #fef3c7;
        color: #d97706;
    }
    
    .public-access {
        color: #6b7280;
        font-size: 0.9rem;
        font-style: italic;
    }
    
    .user-indicator {
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        background: rgba(255, 255, 255, 0.1);
        margin-right: 0.5rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .logout-btn {
        color: white !important;
        background: rgba(239, 68, 68, 0.8) !important;
        padding: 0.6rem 1.2rem !important;
        border-radius: 6px !important;
        font-weight: 600 !important;
        font-size: 0.9rem !important;
        transition: all 0.3s ease !important;
        text-decoration: none !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        margin-left: 0.5rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .logout-btn:hover {
        background: rgba(239, 68, 68, 1) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
    }
`;
document.head.appendChild(animationStyles);