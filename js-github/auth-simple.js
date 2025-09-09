// Simple Authentication System (LocalStorage-based)
// For testing without MongoDB

class SimpleAuth {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        // Create admin user if it doesn't exist
        if (!this.users.find(u => u.username === 'admin')) {
            this.users.push({
                id: '1',
                username: 'admin',
                email: 'admin@heart.com',
                password: 'heart2024', // In production, this would be hashed
                firstName: 'HEART',
                lastName: 'Administrator',
                role: 'admin',
                isActive: true,
                createdAt: new Date().toISOString(),
                lastLogin: null
            });
            this.saveUsers();
        }
    }

    loadUsers() {
        const stored = localStorage.getItem('heart_users');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('heart_users', JSON.stringify(this.users));
    }

    getCurrentUser() {
        const stored = localStorage.getItem('heart_current_user');
        return stored ? JSON.parse(stored) : null;
    }

    generateToken() {
        // Simple token generation (not secure, for demo only)
        return btoa(JSON.stringify({
            timestamp: Date.now(),
            random: Math.random().toString(36).substr(2, 9)
        }));
    }

    async login(identifier, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Find user by username or email
                    const user = this.users.find(u => 
                        u.username === identifier || u.email === identifier
                    );

                    if (!user) {
                        reject(new Error('User not found'));
                        return;
                    }

                    if (!user.isActive) {
                        reject(new Error('Account is deactivated'));
                        return;
                    }

                    // Check password (in production, this would be hashed comparison)
                    if (user.password !== password) {
                        reject(new Error('Invalid credentials'));
                        return;
                    }

                    // Update last login
                    user.lastLogin = new Date().toISOString();
                    this.saveUsers();

                    // Generate token
                    const token = this.generateToken();

                    // Store current user and token
                    const userData = {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        fullName: `${user.firstName} ${user.lastName}`.trim()
                    };

                    localStorage.setItem('heart_current_user', JSON.stringify(userData));
                    localStorage.setItem('heart_auth_token', token);
                    this.currentUser = userData;

                    resolve({
                        success: true,
                        message: 'Login successful',
                        data: {
                            user: userData,
                            token: token
                        }
                    });

                } catch (error) {
                    reject(new Error('Login failed'));
                }
            }, 500); // Simulate network delay
        });
    }

    async logout() {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.removeItem('heart_current_user');
                localStorage.removeItem('heart_auth_token');
                this.currentUser = null;

                resolve({
                    success: true,
                    message: 'Logout successful'
                });
            }, 200);
        });
    }

    async getMe() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const token = localStorage.getItem('heart_auth_token');
                const user = this.getCurrentUser();

                if (!token || !user) {
                    reject(new Error('Not authenticated'));
                    return;
                }

                resolve({
                    success: true,
                    data: {
                        user: user
                    }
                });
            }, 200);
        });
    }

    isAuthenticated() {
        const token = localStorage.getItem('heart_auth_token');
        const user = this.getCurrentUser();
        return !!(token && user);
    }

    isAdmin() {
        return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'editor');
    }

    canManageNews() {
        return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.role === 'editor');
    }

    getUser() {
        return this.currentUser;
    }
}

// Create global instance
const simpleAuth = new SimpleAuth();

// Toast notification system
const Toast = {
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10001;
            font-weight: 500;
            max-width: 400px;
            word-wrap: break-word;
            animation: slideInRight 0.3s ease-out;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    },

    success(message, duration) {
        this.show(message, 'success', duration);
    },

    error(message, duration) {
        this.show(message, 'error', duration);
    },

    info(message, duration) {
        this.show(message, 'info', duration);
    },

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }
};

// Add CSS for animations
const styles = document.createElement('style');
styles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styles);

// Export for global use
window.simpleAuth = simpleAuth;
window.Toast = Toast;