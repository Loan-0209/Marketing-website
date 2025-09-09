// HEART Technology Website - Admin Dashboard

class AdminDashboard {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.createDashboard();
        this.setupEventListeners();
        this.loadDashboardData();
    }

    createDashboard() {
        const dashboardHTML = `
            <div id="adminDashboard" class="modal">
                <div class="modal-content" style="max-width: 1200px; max-height: 95vh;">
                    <div class="modal-header">
                        <h2>🔧 Admin Dashboard</h2>
                        <span class="close" onclick="adminDashboard.closeDashboard()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="dashboard-tabs">
                            <button class="tab-btn active" onclick="adminDashboard.switchTab('overview')">📊 Overview</button>
                            <button class="tab-btn" onclick="adminDashboard.switchTab('news')">📰 News</button>
                            <button class="tab-btn" onclick="adminDashboard.switchTab('contacts')">📞 Contacts</button>
                            <button class="tab-btn" onclick="adminDashboard.switchTab('users')">👥 Users</button>
                        </div>
                        
                        <div id="overviewTab" class="tab-content active">
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <div class="stat-icon">📰</div>
                                    <div class="stat-info">
                                        <div class="stat-number" id="totalNews">-</div>
                                        <div class="stat-label">Total News</div>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">📞</div>
                                    <div class="stat-info">
                                        <div class="stat-number" id="totalContacts">-</div>
                                        <div class="stat-label">Total Contacts</div>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">👥</div>
                                    <div class="stat-info">
                                        <div class="stat-number" id="totalUsers">-</div>
                                        <div class="stat-label">Total Users</div>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">👁</div>
                                    <div class="stat-info">
                                        <div class="stat-number" id="totalViews">-</div>
                                        <div class="stat-label">Total Views</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="recent-activities">
                                <h3>Recent Activities</h3>
                                <div id="recentActivities">Loading...</div>
                            </div>
                        </div>
                        
                        <div id="newsTab" class="tab-content">
                            <div class="content-header">
                                <h3>News Management</h3>
                                <button class="btn btn-primary" onclick="adminDashboard.showAddNewsForm()">+ Add News</button>
                            </div>
                            <div class="filters">
                                <select id="newsStatusFilter" onchange="adminDashboard.filterNews()">
                                    <option value="all">All Status</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                                <input type="text" id="newsSearchInput" placeholder="Search news..." onkeyup="adminDashboard.searchNews()">
                            </div>
                            <div id="newsTable">Loading...</div>
                        </div>
                        
                        <div id="contactsTab" class="tab-content">
                            <div class="content-header">
                                <h3>Contact Management</h3>
                                <div class="contact-filters">
                                    <select id="contactStatusFilter" onchange="adminDashboard.filterContacts()">
                                        <option value="all">All Status</option>
                                        <option value="new">New</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="responded">Responded</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    <select id="contactInterestFilter" onchange="adminDashboard.filterContacts()">
                                        <option value="all">All Interests</option>
                                        <option value="investment">Investment</option>
                                        <option value="partnership">Partnership</option>
                                        <option value="office">Office</option>
                                        <option value="technology">Technology</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div id="contactsTable">Loading...</div>
                        </div>
                        
                        <div id="usersTab" class="tab-content">
                            <div class="content-header">
                                <h3>User Management</h3>
                                <button class="btn btn-primary" onclick="adminDashboard.showAddUserForm()">+ Add User</button>
                            </div>
                            <div id="usersTable">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
        this.addDashboardStyles();
    }

    addDashboardStyles() {
        const styles = `
            <style id="dashboardStyles">
                .dashboard-tabs {
                    display: flex;
                    border-bottom: 2px solid var(--light-gray);
                    margin-bottom: 2rem;
                }
                
                .tab-btn {
                    padding: 1rem 2rem;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-weight: 600;
                    color: var(--gray);
                    transition: all 0.3s ease;
                    border-bottom: 3px solid transparent;
                }
                
                .tab-btn.active,
                .tab-btn:hover {
                    color: var(--primary-blue);
                    border-bottom-color: var(--primary-yellow);
                }
                
                .tab-content {
                    display: none;
                }
                
                .tab-content.active {
                    display: block;
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }
                
                .stat-item {
                    background: linear-gradient(135deg, var(--primary-blue), var(--light-blue));
                    color: white;
                    padding: 2rem;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .stat-icon {
                    font-size: 2.5rem;
                }
                
                .stat-number {
                    font-size: 2rem;
                    font-weight: bold;
                    color: var(--primary-yellow);
                }
                
                .stat-label {
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
                
                .content-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                
                .filters,
                .contact-filters {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }
                
                .filters select,
                .filters input,
                .contact-filters select {
                    padding: 0.8rem;
                    border: 2px solid var(--light-gray);
                    border-radius: 8px;
                    font-size: 0.9rem;
                }
                
                .data-table {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                .data-table table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .data-table th,
                .data-table td {
                    padding: 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--light-gray);
                }
                
                .data-table th {
                    background: var(--light-gray);
                    font-weight: 600;
                    color: var(--primary-blue);
                }
                
                .data-table tbody tr:hover {
                    background: var(--light-yellow);
                }
                
                .status-badge {
                    padding: 0.3rem 0.8rem;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .status-published { background: var(--success); color: white; }
                .status-draft { background: var(--warning); color: white; }
                .status-archived { background: var(--gray); color: white; }
                .status-new { background: var(--info); color: white; }
                .status-in_progress { background: var(--warning); color: white; }
                .status-responded { background: var(--success); color: white; }
                .status-closed { background: var(--gray); color: white; }
                
                .action-btn {
                    padding: 0.3rem 0.8rem;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    margin: 0 0.2rem;
                    transition: all 0.3s ease;
                }
                
                .action-btn.edit { background: var(--warning); color: white; }
                .action-btn.delete { background: var(--error); color: white; }
                .action-btn.view { background: var(--info); color: white; }
                
                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                
                .recent-activities {
                    background: white;
                    padding: 2rem;
                    border-radius: 15px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                .activity-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 0;
                    border-bottom: 1px solid var(--light-gray);
                }
                
                .activity-item:last-child {
                    border-bottom: none;
                }
                
                .activity-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    background: var(--light-blue);
                    color: white;
                }
                
                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 2rem;
                }
                
                .pagination button {
                    padding: 0.5rem 1rem;
                    border: 1px solid var(--light-gray);
                    background: white;
                    cursor: pointer;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                }
                
                .pagination button:hover,
                .pagination button.active {
                    background: var(--primary-blue);
                    color: white;
                    border-color: var(--primary-blue);
                }
                
                @media (max-width: 768px) {
                    .content-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: stretch;
                    }
                    
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .filters,
                    .contact-filters {
                        flex-direction: column;
                    }
                    
                    .data-table {
                        overflow-x: auto;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    setupEventListeners() {
        // Add any additional event listeners here
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDashboard();
            }
        });
    }

    async loadDashboardData() {
        if (!api.isAuthenticated() || !api.canManageNews()) {
            Toast.error('Access denied');
            return;
        }

        try {
            // Load overview stats
            await this.loadOverviewStats();
            
            // Load recent activities
            await this.loadRecentActivities();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            Toast.error('Failed to load dashboard data');
        }
    }

    async loadOverviewStats() {
        try {
            const [newsResponse, contactsResponse] = await Promise.all([
                api.getNews({ limit: 1000 }),
                api.getContacts({ limit: 1000 })
            ]);

            if (newsResponse.success) {
                const totalNews = newsResponse.data.pagination.totalItems;
                const totalViews = newsResponse.data.news.reduce((sum, article) => sum + (article.views || 0), 0);
                
                document.getElementById('totalNews').textContent = totalNews;
                document.getElementById('totalViews').textContent = totalViews.toLocaleString();
            }

            if (contactsResponse.success) {
                document.getElementById('totalContacts').textContent = contactsResponse.data.pagination.totalItems;
            }

            // Mock users count (would come from actual API)
            document.getElementById('totalUsers').textContent = '2';
        } catch (error) {
            console.error('Error loading overview stats:', error);
        }
    }

    async loadRecentActivities() {
        try {
            const response = await api.getNews({ limit: 5, sort: '-createdAt' });
            if (response.success) {
                const activitiesHTML = response.data.news.map(article => `
                    <div class="activity-item">
                        <div class="activity-icon">📰</div>
                        <div>
                            <div style="font-weight: 600;">News article "${article.title}" was ${article.status}</div>
                            <div style="font-size: 0.8rem; color: var(--gray);">${new Date(article.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                `).join('');
                
                document.getElementById('recentActivities').innerHTML = activitiesHTML || '<p>No recent activities</p>';
            }
        } catch (error) {
            console.error('Error loading recent activities:', error);
            document.getElementById('recentActivities').innerHTML = '<p>Failed to load activities</p>';
        }
    }

    async loadNewsTable() {
        try {
            const status = document.getElementById('newsStatusFilter')?.value;
            const search = document.getElementById('newsSearchInput')?.value;
            
            const params = {
                page: this.currentPage,
                limit: this.itemsPerPage
            };
            
            if (status && status !== 'all') {
                params.status = status;
            }
            
            if (search) {
                params.search = search;
            }

            const response = await api.getNews(params);
            if (response.success) {
                this.renderNewsTable(response.data);
            }
        } catch (error) {
            console.error('Error loading news table:', error);
            document.getElementById('newsTable').innerHTML = '<p>Failed to load news</p>';
        }
    }

    renderNewsTable(data) {
        const { news, pagination } = data;
        
        const tableHTML = `
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Views</th>
                            <th>Likes</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${news.map(article => `
                            <tr>
                                <td>
                                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                                        <span style="font-size: 1.5rem;">${article.icon}</span>
                                        <div>
                                            <div style="font-weight: 600;">${heartUI.escapeHtml(article.title)}</div>
                                            <div style="font-size: 0.8rem; color: var(--gray);">${heartUI.escapeHtml(article.excerpt.substring(0, 50))}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span class="status-badge status-${article.status}">${article.status}</span></td>
                                <td>${article.views || 0}</td>
                                <td>${article.likes || 0}</td>
                                <td>${new Date(article.publishedAt).toLocaleDateString()}</td>
                                <td>
                                    <button class="action-btn view" onclick="heartUI.showNewsDetail('${article._id}')">View</button>
                                    <button class="action-btn edit" onclick="adminDashboard.editNews('${article._id}')">Edit</button>
                                    <button class="action-btn delete" onclick="adminDashboard.deleteNews('${article._id}')">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${this.renderPagination(pagination)}
        `;
        
        document.getElementById('newsTable').innerHTML = tableHTML;
    }

    async loadContactsTable() {
        try {
            const status = document.getElementById('contactStatusFilter')?.value;
            const interest = document.getElementById('contactInterestFilter')?.value;
            
            const params = {
                page: this.currentPage,
                limit: this.itemsPerPage
            };
            
            if (status && status !== 'all') {
                params.status = status;
            }
            
            if (interest && interest !== 'all') {
                params.interest = interest;
            }

            const response = await api.getContacts(params);
            if (response.success) {
                this.renderContactsTable(response.data);
            }
        } catch (error) {
            console.error('Error loading contacts table:', error);
            document.getElementById('contactsTable').innerHTML = '<p>Failed to load contacts</p>';
        }
    }

    renderContactsTable(data) {
        const { contacts, pagination } = data;
        
        const tableHTML = `
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Interest</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contacts.map(contact => `
                            <tr>
                                <td>
                                    <div>
                                        <div style="font-weight: 600;">${heartUI.escapeHtml(contact.name)}</div>
                                        <div style="font-size: 0.8rem; color: var(--gray);">${contact.priority}</div>
                                    </div>
                                </td>
                                <td>${heartUI.escapeHtml(contact.email)}</td>
                                <td>${heartUI.escapeHtml(contact.company || '-')}</td>
                                <td>${contact.interest}</td>
                                <td><span class="status-badge status-${contact.status}">${contact.status}</span></td>
                                <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button class="action-btn view" onclick="adminDashboard.viewContact('${contact._id}')">View</button>
                                    <button class="action-btn edit" onclick="adminDashboard.updateContactStatus('${contact._id}')">Update</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${this.renderPagination(pagination)}
        `;
        
        document.getElementById('contactsTable').innerHTML = tableHTML;
    }

    renderPagination(pagination) {
        if (pagination.totalPages <= 1) return '';
        
        const pages = [];
        for (let i = 1; i <= pagination.totalPages; i++) {
            pages.push(`
                <button class="${i === pagination.currentPage ? 'active' : ''}" 
                        onclick="adminDashboard.goToPage(${i})">${i}</button>
            `);
        }
        
        return `
            <div class="pagination">
                ${pagination.hasPrev ? `<button onclick="adminDashboard.goToPage(${pagination.currentPage - 1})">&larr; Prev</button>` : ''}
                ${pages.join('')}
                ${pagination.hasNext ? `<button onclick="adminDashboard.goToPage(${pagination.currentPage + 1})">Next &rarr;</button>` : ''}
            </div>
        `;
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(`${tabName}Tab`).classList.add('active');
        event.target.classList.add('active');
        
        // Load data for the selected tab
        this.currentPage = 1;
        if (tabName === 'news') {
            this.loadNewsTable();
        } else if (tabName === 'contacts') {
            this.loadContactsTable();
        } else if (tabName === 'users') {
            this.loadUsersTable();
        }
    }

    filterNews() {
        this.currentPage = 1;
        this.loadNewsTable();
    }

    searchNews() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.currentPage = 1;
            this.loadNewsTable();
        }, 500);
    }

    filterContacts() {
        this.currentPage = 1;
        this.loadContactsTable();
    }

    goToPage(page) {
        this.currentPage = page;
        const activeTab = document.querySelector('.tab-content.active').id;
        
        if (activeTab === 'newsTab') {
            this.loadNewsTable();
        } else if (activeTab === 'contactsTab') {
            this.loadContactsTable();
        } else if (activeTab === 'usersTab') {
            this.loadUsersTable();
        }
    }

    showDashboard() {
        if (!api.isAuthenticated() || !api.canManageNews()) {
            Toast.error('Access denied');
            return;
        }
        
        const dashboard = document.getElementById('adminDashboard');
        if (dashboard) {
            dashboard.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.loadDashboardData();
        }
    }

    closeDashboard() {
        const dashboard = document.getElementById('adminDashboard');
        if (dashboard) {
            dashboard.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Placeholder methods for future implementation
    showAddNewsForm() {
        Toast.info('News creation form will be implemented');
    }

    editNews(id) {
        Toast.info(`Edit news ${id} will be implemented`);
    }

    async deleteNews(id) {
        if (confirm('Are you sure you want to delete this news article?')) {
            try {
                await api.deleteNews(id);
                Toast.success('News article deleted successfully');
                this.loadNewsTable();
            } catch (error) {
                Toast.error('Failed to delete news article');
            }
        }
    }

    viewContact(id) {
        Toast.info(`View contact ${id} will be implemented`);
    }

    updateContactStatus(id) {
        Toast.info(`Update contact status ${id} will be implemented`);
    }

    loadUsersTable() {
        // Mock users table
        document.getElementById('usersTable').innerHTML = `
            <div class="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>admin</td>
                            <td>admin@heart.com</td>
                            <td>Admin</td>
                            <td><span class="status-badge status-published">Active</span></td>
                            <td>${new Date().toLocaleDateString()}</td>
                            <td>
                                <button class="action-btn view">View</button>
                                <button class="action-btn edit">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>editor</td>
                            <td>editor@heart.com</td>
                            <td>Editor</td>
                            <td><span class="status-badge status-published">Active</span></td>
                            <td>${new Date().toLocaleDateString()}</td>
                            <td>
                                <button class="action-btn view">View</button>
                                <button class="action-btn edit">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    showAddUserForm() {
        Toast.info('User creation form will be implemented');
    }
}

// Initialize admin dashboard
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});