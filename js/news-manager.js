// News Management System
// File: js/news-manager.js

class NewsManager {
    constructor() {
        this.newsData = this.loadFromStorage();
        this.currentEditId = null;
        this.isAdmin = false;
        this.initializeEventListeners();
    }

    // Load news from localStorage
    loadFromStorage() {
        const stored = localStorage.getItem('heart_news');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Default news data
        return [
            {
                id: 1,
                title: "HEART Officially Launches Phase 1 Development",
                excerpt: "We are excited to announce the official groundbreaking ceremony for Phase 1 of HEART technology park. This milestone marks the beginning of Vietnam's most ambitious AI and technology hub.",
                content: "We are excited to announce the official groundbreaking ceremony for Phase 1 of HEART technology park. This milestone marks the beginning of Vietnam's most ambitious AI and technology hub. The ceremony was attended by government officials, international investors, and technology leaders from across the region.",
                date: "December 15, 2024",
                icon: "🚀",
                category: "Development",
                status: "published",
                author: "HEART Team",
                image: null,
                tags: ["development", "phase1", "announcement"]
            },
            {
                id: 2,
                title: "Strategic Partnership with MIT Announced",
                excerpt: "HEART has formed a groundbreaking partnership with MIT's Computer Science and Artificial Intelligence Laboratory (CSAIL) to advance AI research and education in Southeast Asia.",
                content: "HEART has formed a groundbreaking partnership with MIT's Computer Science and Artificial Intelligence Laboratory (CSAIL) to advance AI research and education in Southeast Asia. This collaboration will bring world-class AI research and educational programs to Vietnam.",
                date: "December 10, 2024",
                icon: "🤝",
                category: "Partnership",
                status: "published",
                author: "HEART Team",
                image: null,
                tags: ["partnership", "MIT", "AI", "education"]
            },
            {
                id: 3,
                title: "$500M Series A Funding Successfully Raised",
                excerpt: "Leading international investors including Sequoia Capital, Andreessen Horowitz, and GIC have invested $500M to accelerate HEART's development timeline.",
                content: "Leading international investors including Sequoia Capital, Andreessen Horowitz, and GIC have invested $500M to accelerate HEART's development timeline. This funding will support infrastructure development, talent acquisition, and technology advancement.",
                date: "December 5, 2024",
                icon: "💰",
                category: "Investment",
                status: "published",
                author: "HEART Team",
                image: null,
                tags: ["funding", "investment", "series-a"]
            }
        ];
    }

    // Save to localStorage
    saveToStorage() {
        localStorage.setItem('heart_news', JSON.stringify(this.newsData));
    }

    // Get all published news
    getPublishedNews() {
        return this.newsData.filter(news => news.status === 'published')
                          .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Get all news (admin only)
    getAllNews() {
        return this.newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Get news by ID
    getNewsById(id) {
        return this.newsData.find(news => news.id === parseInt(id));
    }

    // Create new news
    createNews(newsData) {
        const newNews = {
            id: this.generateId(),
            title: newsData.title,
            excerpt: newsData.excerpt,
            content: newsData.content,
            date: newsData.date || new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            icon: newsData.icon || '📰',
            category: newsData.category || 'General',
            status: newsData.status || 'published',
            author: newsData.author || 'HEART Team',
            image: newsData.image || null,
            tags: newsData.tags || []
        };

        this.newsData.unshift(newNews);
        this.saveToStorage();
        return newNews;
    }

    // Update news
    updateNews(id, newsData) {
        const index = this.newsData.findIndex(news => news.id === parseInt(id));
        if (index !== -1) {
            this.newsData[index] = { ...this.newsData[index], ...newsData };
            this.saveToStorage();
            return this.newsData[index];
        }
        return null;
    }

    // Delete news
    deleteNews(id) {
        const index = this.newsData.findIndex(news => news.id === parseInt(id));
        if (index !== -1) {
            const deleted = this.newsData.splice(index, 1)[0];
            this.saveToStorage();
            return deleted;
        }
        return null;
    }

    // Generate unique ID
    generateId() {
        return Math.max(...this.newsData.map(news => news.id), 0) + 1;
    }

    // Render news grid
    renderNewsGrid() {
        const newsGrid = document.getElementById('newsGrid');
        if (!newsGrid) return;

        const news = this.isAdmin ? this.getAllNews() : this.getPublishedNews();
        
        if (news.length === 0) {
            newsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.2rem; color: var(--gray);">No news articles yet.</p>';
            return;
        }

        newsGrid.innerHTML = news.map(item => this.createNewsCard(item)).join('');
    }

    // Create news card HTML
    createNewsCard(newsItem) {
        const statusBadge = this.isAdmin && newsItem.status === 'draft' 
            ? '<div class="status-badge draft">Draft</div>' 
            : '';
            
        const adminActions = this.isAdmin 
            ? `<div class="admin-actions">
                <button onclick="newsManager.editNews(${newsItem.id})" class="edit-btn">✏️ Edit</button>
                <button onclick="newsManager.deleteNews(${newsItem.id})" class="delete-btn">🗑️ Delete</button>
               </div>` 
            : '';

        return `
            <div class="news-card" data-id="${newsItem.id}">
                ${statusBadge}
                <div class="news-image">
                    ${newsItem.image ? 
                        `<img src="${newsItem.image}" alt="${newsItem.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">` 
                        : newsItem.icon}
                </div>
                <div class="news-content">
                    <div class="news-meta">
                        <span class="news-category">${newsItem.category}</span>
                        <span class="news-date">${newsItem.date}</span>
                    </div>
                    <div class="news-title">${newsItem.title}</div>
                    <div class="news-excerpt">${newsItem.excerpt}</div>
                    <div class="news-footer">
                        <a href="#" class="read-more" onclick="newsManager.showFullNews(${newsItem.id})">Read more →</a>
                        <div class="news-tags">
                            ${newsItem.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                        </div>
                    </div>
                    ${adminActions}
                </div>
            </div>
        `;
    }

    // Show full news in modal
    showFullNews(id) {
        const news = this.getNewsById(id);
        if (!news) return;

        const modal = document.createElement('div');
        modal.className = 'news-modal';
        modal.innerHTML = `
            <div class="news-modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <div class="news-full">
                    <div class="news-header">
                        <div class="news-icon">
                            ${news.image ? 
                                `<img src="${news.image}" alt="${news.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` 
                                : news.icon}
                        </div>
                        <div class="news-meta">
                            <span class="category">${news.category}</span>
                            <span class="date">${news.date}</span>
                            <span class="author">By ${news.author}</span>
                        </div>
                    </div>
                    <h1>${news.title}</h1>
                    <div class="news-content">${news.content}</div>
                    <div class="news-tags">
                        ${news.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Show add/edit form
    showNewsForm(newsId = null) {
        this.currentEditId = newsId;
        const news = newsId ? this.getNewsById(newsId) : null;
        const isEdit = !!news;

        const formTitle = isEdit ? 'Edit Article' : 'Add New Article';
        const submitText = isEdit ? 'Update Article' : 'Publish Article';

        const formHTML = `
            <div class="news-form-modal">
                <div class="news-form-content">
                    <div class="form-header">
                        <h3>${formTitle}</h3>
                        <span class="close" onclick="newsManager.hideNewsForm()">&times;</span>
                    </div>
                    <form id="newsForm" class="news-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="newsTitle">Title *</label>
                                <input type="text" id="newsTitle" value="${news?.title || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="newsCategory">Category</label>
                                <select id="newsCategory">
                                    <option value="General" ${news?.category === 'General' ? 'selected' : ''}>General</option>
                                    <option value="Development" ${news?.category === 'Development' ? 'selected' : ''}>Development</option>
                                    <option value="Partnership" ${news?.category === 'Partnership' ? 'selected' : ''}>Partnership</option>
                                    <option value="Investment" ${news?.category === 'Investment' ? 'selected' : ''}>Investment</option>
                                    <option value="Technology" ${news?.category === 'Technology' ? 'selected' : ''}>Technology</option>
                                    <option value="Event" ${news?.category === 'Event' ? 'selected' : ''}>Event</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="newsExcerpt">Excerpt *</label>
                            <textarea id="newsExcerpt" rows="3" required>${news?.excerpt || ''}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="newsContent">Full Content *</label>
                            <textarea id="newsContent" rows="8" required>${news?.content || ''}</textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="newsIcon">Icon (emoji)</label>
                                <input type="text" id="newsIcon" value="${news?.icon || '📰'}" maxlength="2">
                            </div>
                            <div class="form-group">
                                <label for="newsStatus">Status</label>
                                <select id="newsStatus">
                                    <option value="published" ${news?.status === 'published' ? 'selected' : ''}>Published</option>
                                    <option value="draft" ${news?.status === 'draft' ? 'selected' : ''}>Draft</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="newsTags">Tags (comma separated)</label>
                            <input type="text" id="newsTags" value="${news?.tags?.join(', ') || ''}" placeholder="technology, ai, innovation">
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="submit-btn">${submitText}</button>
                            <button type="button" onclick="newsManager.hideNewsForm()" class="cancel-btn">Cancel</button>
                            ${isEdit ? '<button type="button" onclick="newsManager.deleteNews(' + newsId + ')" class="delete-btn">Delete</button>' : ''}
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Remove existing form if any
        const existingForm = document.querySelector('.news-form-modal');
        if (existingForm) existingForm.remove();

        document.body.insertAdjacentHTML('beforeend', formHTML);
        
        // Add form submit listener
        document.getElementById('newsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    // Hide news form
    hideNewsForm() {
        const formModal = document.querySelector('.news-form-modal');
        if (formModal) formModal.remove();
        this.currentEditId = null;
    }

    // Handle form submission
    handleFormSubmit() {
        const formData = {
            title: document.getElementById('newsTitle').value,
            excerpt: document.getElementById('newsExcerpt').value,
            content: document.getElementById('newsContent').value,
            icon: document.getElementById('newsIcon').value,
            category: document.getElementById('newsCategory').value,
            status: document.getElementById('newsStatus').value,
            tags: document.getElementById('newsTags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        try {
            if (this.currentEditId) {
                this.updateNews(this.currentEditId, formData);
                this.showToast('Article updated successfully!', 'success');
            } else {
                this.createNews(formData);
                this.showToast('Article published successfully!', 'success');
            }

            this.hideNewsForm();
            this.renderNewsGrid();
        } catch (error) {
            this.showToast('Error saving article: ' + error.message, 'error');
        }
    }

    // Edit news
    editNews(id) {
        this.showNewsForm(id);
    }

    // Delete news with confirmation
    deleteNews(id) {
        const news = this.getNewsById(id);
        if (!news) return;

        if (confirm(`Are you sure you want to delete "${news.title}"?`)) {
            this.deleteNews(id);
            this.showToast('Article deleted successfully!', 'success');
            this.renderNewsGrid();
        }
    }

    // Set admin status
    setAdminStatus(isAdmin) {
        this.isAdmin = isAdmin;
        this.updateAdminUI();
        this.renderNewsGrid();
    }

    // Update admin UI
    updateAdminUI() {
        const addNewsBtn = document.getElementById('addNewsBtn');
        if (addNewsBtn) {
            addNewsBtn.style.display = this.isAdmin ? 'block' : 'none';
        }
    }

    // Show toast notification
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Add news button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'addNewsBtn') {
                this.showNewsForm();
            }
        });
    }
}

// Initialize news manager
const newsManager = new NewsManager();

// Export for global use
window.newsManager = newsManager;
