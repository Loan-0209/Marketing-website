class HEARTAPI {
  constructor() {
    this.baseURL = 'http://localhost:5001/api';
    this.token = localStorage.getItem('heart_token');
    this.user = this.getStoredUser();
  }

  getStoredUser() {
    const stored = localStorage.getItem('heart_user');
    return stored ? JSON.parse(stored) : null;
  }

  setAuthData(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('heart_token', token);
    localStorage.setItem('heart_user', JSON.stringify(user));
  }

  clearAuthData() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('heart_token');
    localStorage.removeItem('heart_user');
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: this.getAuthHeaders(),
        ...options
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async login(identifier, password) {
    try {
      const data = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });

      if (data.success) {
        this.setAuthData(data.data.token, data.data.user);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      if (this.token) {
        await this.makeRequest('/auth/logout', {
          method: 'POST'
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async getMe() {
    try {
      const data = await this.makeRequest('/auth/me');
      if (data.success) {
        this.user = data.data.user;
        localStorage.setItem('heart_user', JSON.stringify(this.user));
      }
      return data;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  async getNews(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/news${queryString ? `?${queryString}` : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      throw error;
    }
  }

  async getNewsById(id) {
    try {
      return await this.makeRequest(`/news/${id}`);
    } catch (error) {
      throw error;
    }
  }

  async createNews(newsData) {
    try {
      return await this.makeRequest('/news', {
        method: 'POST',
        body: JSON.stringify(newsData)
      });
    } catch (error) {
      throw error;
    }
  }

  async updateNews(id, newsData) {
    try {
      return await this.makeRequest(`/news/${id}`, {
        method: 'PUT',
        body: JSON.stringify(newsData)
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteNews(id) {
    try {
      return await this.makeRequest(`/news/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw error;
    }
  }

  async likeNews(id) {
    try {
      return await this.makeRequest(`/news/${id}/like`, {
        method: 'POST'
      });
    } catch (error) {
      throw error;
    }
  }

  async submitContact(contactData) {
    try {
      return await this.makeRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(contactData)
      });
    } catch (error) {
      throw error;
    }
  }

  async getContacts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/contact${queryString ? `?${queryString}` : ''}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      throw error;
    }
  }

  async uploadImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${this.baseURL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  isAdmin() {
    return this.user && (this.user.role === 'admin' || this.user.role === 'editor');
  }

  canManageNews() {
    return this.user && (this.user.role === 'admin' || this.user.role === 'editor');
  }
}

const api = new HEARTAPI();

const Toast = {
  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
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
  }
};

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