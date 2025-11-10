// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    API_URL: 'http://localhost:5000/api',
    ML_API_URL: 'http://localhost:5001',
    TOKEN_KEY: 'smartcontent_token',
    USER_KEY: 'smartcontent_user'
};

const getToken = () => localStorage.getItem(CONFIG.TOKEN_KEY);
const getUser = () => {
    const user = localStorage.getItem(CONFIG.USER_KEY);
    return user ? JSON.parse(user) : null;
};
const setAuth = (token, user) => {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
};
const clearAuth = () => {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
};

// ============================================
// PAGE ROUTING
// ============================================
let currentPage = 'home';

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show selected page
    const page = document.getElementById(`page-${pageName}`);
    if (page) {
        page.style.display = 'block';
        currentPage = pageName;
        
        // Initialize page content
        initializePage(pageName);
    }
}

function initializePage(pageName) {
    switch(pageName) {
        case 'home':
            initHomePage();
            break;
        case 'login':
            initLoginPage();
            break;
        case 'explore':
            initExplorePage();
            break;
        case 'profile':
            initProfilePage();
            break;
        case 'admin':
            initAdminPage();
            break;
        case 'analytics':
            initAnalyticsPage();
            break;
    }
}

// ============================================
// AUTHENTICATION
// ============================================
function isAuthenticated() {
    return getToken() !== null;
}

function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}

function updateNavigation() {
    const navLogin = document.getElementById('nav-login');
    const navLogout = document.getElementById('nav-logout');
    const navProfile = document.getElementById('nav-profile');
    const navAdmin = document.getElementById('nav-admin');
    const navAnalytics = document.getElementById('nav-analytics');

    if (isAuthenticated()) {
        if (navLogin) navLogin.style.display = 'none';
        if (navLogout) navLogout.style.display = 'block';
        if (navProfile) navProfile.style.display = 'block';
        
        if (isAdmin()) {
            if (navAdmin) navAdmin.style.display = 'block';
            if (navAnalytics) navAnalytics.style.display = 'block';
        }
    } else {
        if (navLogin) navLogin.style.display = 'block';
        if (navLogout) navLogout.style.display = 'none';
        if (navProfile) navProfile.style.display = 'none';
        if (navAdmin) navAdmin.style.display = 'none';
        if (navAnalytics) navAnalytics.style.display = 'none';
    }
}

function logout() {
    clearAuth();
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        showPage('home');
        updateNavigation();
    }, 1000);
}

function requireAuth() {
    if (!isAuthenticated()) {
        showToast('Please login to access this page', 'warning');
        setTimeout(() => {
            showPage('login');
        }, 1500);
        return false;
    }
    return true;
}

function requireAdmin() {
    if (!requireAuth()) return false;
    
    if (!isAdmin()) {
        showToast('Access denied. Admin only.', 'danger');
        setTimeout(() => {
            showPage('home');
        }, 1500);
        return false;
    }
    return true;
}

// ============================================
// API FUNCTIONS
// ============================================
async function apiRequest(endpoint, options = {}) {
    const url = `${CONFIG.API_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

const AuthAPI = {
    signup: (userData) => apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    login: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })
};

const UserAPI = {
    getProfile: () => apiRequest('/users/profile'),
    updateProfile: (profileData) => apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
    }),
    updatePreferences: (preferences) => apiRequest('/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences)
    })
};

const ContentAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/content?${queryString}`);
    },
    getById: (id) => apiRequest(`/content/${id}`),
    create: (contentData) => apiRequest('/content', {
        method: 'POST',
        body: JSON.stringify(contentData)
    }),
    update: (id, contentData) => apiRequest(`/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(contentData)
    }),
    delete: (id) => apiRequest(`/content/${id}`, {
        method: 'DELETE'
    })
};

const InteractionAPI = {
    trackView: (contentId) => apiRequest('/interactions/view', {
        method: 'POST',
        body: JSON.stringify({ contentId })
    }),
    toggleLike: (contentId) => apiRequest('/interactions/like', {
        method: 'POST',
        body: JSON.stringify({ contentId })
    }),
    rateContent: (contentId, rating) => apiRequest('/interactions/rating', {
        method: 'POST',
        body: JSON.stringify({ contentId, rating })
    }),
    getUserInteractions: (userId) => apiRequest(`/interactions/user/${userId}`)
};

const RecommendationAPI = {
    getPersonalized: () => apiRequest('/recommendations/personalized'),
    getSimilar: (contentId) => apiRequest(`/recommendations/similar/${contentId}`),
    getTrending: (limit = 10) => apiRequest(`/recommendations/trending?limit=${limit}`)
};

const AnalyticsAPI = {
    getOverview: () => apiRequest('/analytics/overview'),
    getMostViewed: (limit = 10) => apiRequest(`/analytics/most-viewed?limit=${limit}`),
    getMostLiked: (limit = 10) => apiRequest(`/analytics/most-liked?limit=${limit}`),
    getTopRated: (limit = 10) => apiRequest(`/analytics/top-rated?limit=${limit}`),
    getCategoryStats: () => apiRequest('/analytics/category-stats')
};

// ============================================
// UI UTILITIES
// ============================================
function showToast(message, type = 'info') {
    const toastEl = document.getElementById('notification-toast');
    const toastBody = toastEl.querySelector('.toast-body');
    
    toastBody.textContent = message;
    
    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
    if (type === 'success') toastEl.classList.add('bg-success', 'text-white');
    else if (type === 'danger') toastEl.classList.add('bg-danger', 'text-white');
    else if (type === 'warning') toastEl.classList.add('bg-warning');
    else toastEl.classList.add('bg-info', 'text-white');
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

function toggleLoading(show = true, spinnerId = 'loading-spinner') {
    const spinner = document.getElementById(spinnerId);
    if (spinner) {
        spinner.style.display = show ? 'block' : 'none';
    }
}

function createContentCard(content) {
    const typeIcons = {
        article: 'fa-file-alt',
        video: 'fa-video',
        product: 'fa-box'
    };

    const icon = typeIcons[content.type] || 'fa-file';

    return `
        <div class="col-md-4 col-lg-3">
            <div class="card content-card h-100 shadow-sm">
                <img src="${content.imageUrl || 'https://via.placeholder.com/400x300'}" 
                     class="card-img-top" 
                     alt="${content.title}"
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-primary">
                            <i class="fas ${icon}"></i> ${content.type}
                        </span>
                        <span class="badge bg-secondary">${content.category}</span>
                    </div>
                    <h5 class="card-title">${content.title}</h5>
                    <p class="card-text text-muted small">${content.description.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <small class="text-muted">
                            <i class="fas fa-eye"></i> ${content.stats.views}
                            <i class="fas fa-heart ms-2"></i> ${content.stats.likes}
                        </small>
                        ${content.stats.averageRating > 0 ? 
                            `<small class="text-warning">
                                <i class="fas fa-star"></i> ${content.stats.averageRating.toFixed(1)}
                            </small>` : ''}
                    </div>
                    ${content.price > 0 ? 
                        `<div class="mb-2"><strong>$${content.price.toFixed(2)}</strong></div>` : ''}
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-sm" onclick="viewContent('${content._id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${isAuthenticated() ? 
                            `<button class="btn btn-outline-danger btn-sm" onclick="likeContent('${content._id}')">
                                <i class="fas fa-heart"></i> Like
                            </button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderContentGrid(contentArray, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) return;

    if (contentArray.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No content found</p></div>';
        return;
    }

    container.innerHTML = contentArray.map(createContentCard).join('');
}

async function viewContent(contentId) {
    try {
        // Track view if authenticated
        if (isAuthenticated()) {
            await InteractionAPI.trackView(contentId);
        }

        // Fetch content details
        const content = await ContentAPI.getById(contentId);
        
        if (!content) {
            showToast('Content not found', 'danger');
            return;
        }

        // Populate modal with content details
        document.getElementById('contentDetailTitle').textContent = content.title;
        document.getElementById('contentDetailImage').src = content.imageUrl || 'https://via.placeholder.com/400x300';
        document.getElementById('contentDetailImage').alt = content.title;
        document.getElementById('contentDetailType').innerHTML = `<i class="fas ${getTypeIcon(content.type)}"></i> ${content.type}`;
        document.getElementById('contentDetailCategory').textContent = content.category;
        document.getElementById('contentDetailAuthor').textContent = content.author;
        document.getElementById('contentDetailDescription').textContent = content.description;
        
        // Tags
        const tagsHtml = content.tags.map(tag => `<span class="badge bg-info me-1">${tag}</span>`).join('');
        document.getElementById('contentDetailTags').innerHTML = tagsHtml;
        
        // Stats
        document.getElementById('contentDetailViews').textContent = content.stats.views.toLocaleString();
        document.getElementById('contentDetailLikes').textContent = content.stats.likes.toLocaleString();
        
        // Rating
        const ratingHtml = content.stats.averageRating > 0 
            ? `<span class="text-warning">${'★'.repeat(Math.round(content.stats.averageRating))}${'☆'.repeat(5 - Math.round(content.stats.averageRating))}</span> ${content.stats.averageRating.toFixed(1)} (${content.stats.ratingCount} ratings)`
            : 'No ratings yet';
        document.getElementById('contentDetailRating').innerHTML = ratingHtml;
        
        // Price (only for products)
        if (content.price && content.price > 0) {
            document.getElementById('contentDetailPrice').style.display = 'block';
            document.getElementById('contentDetailPriceValue').textContent = `$${content.price.toFixed(2)}`;
        } else {
            document.getElementById('contentDetailPrice').style.display = 'none';
        }
        
        // Show/hide like button based on authentication
        const likeBtn = document.getElementById('contentDetailLikeBtn');
        if (isAuthenticated()) {
            likeBtn.style.display = 'inline-block';
            likeBtn.setAttribute('data-content-id', content._id);
        } else {
            likeBtn.style.display = 'none';
        }
        
        // Open content button
        const openBtn = document.getElementById('contentDetailOpenBtn');
        if (content.url) {
            openBtn.style.display = 'inline-block';
            openBtn.onclick = () => window.open(content.url, '_blank');
        } else {
            openBtn.style.display = 'none';
        }
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('contentDetailModal'));
        modal.show();
        
    } catch (error) {
        console.error('Error viewing content:', error);
        showToast('Error loading content details', 'danger');
    }
}

function getTypeIcon(type) {
    const icons = {
        article: 'fa-file-alt',
        video: 'fa-video',
        product: 'fa-box'
    };
    return icons[type] || 'fa-file';
}

async function likeContentFromModal() {
    const contentId = document.getElementById('contentDetailLikeBtn').getAttribute('data-content-id');
    if (contentId) {
        await likeContent(contentId);
        // Refresh the modal content
        viewContent(contentId);
    }
}

async function likeContent(contentId) {
    if (!isAuthenticated()) {
        showToast('Please login to like content', 'warning');
        return;
    }

    try {
        const result = await InteractionAPI.toggleLike(contentId);
        showToast(result.message, 'success');
        
        // Reload current page
        initializePage(currentPage);
    } catch (error) {
        console.error('Error liking content:', error);
        showToast('Error liking content', 'danger');
    }
}

function createPagination(currentPageNum, totalPages, onPageChange) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    let html = '';

    html += `
        <li class="page-item ${currentPageNum <= 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="${onPageChange}(${currentPageNum - 1}); return false;">Previous</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPageNum - 2 && i <= currentPageNum + 2)) {
            html += `
                <li class="page-item ${i === currentPageNum ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="${onPageChange}(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === currentPageNum - 3 || i === currentPageNum + 3) {
            html += '<li class="page-item disabled"><a class="page-link">...</a></li>';
        }
    }

    html += `
        <li class="page-item ${currentPageNum >= totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="${onPageChange}(${currentPageNum + 1}); return false;">Next</a>
        </li>
    `;

    pagination.innerHTML = html;
}

// ============================================
// HOME PAGE
// ============================================
function initHomePage() {
    updateNavigation();
    
    if (isAuthenticated()) {
        document.getElementById('recommendations-section').style.display = 'block';
        document.getElementById('hero-auth').style.display = 'none';
        loadPersonalizedRecommendations();
    } else {
        document.getElementById('recommendations-section').style.display = 'none';
        document.getElementById('hero-auth').style.display = 'block';
    }

    loadTrendingContent();
    loadPopularContent();
}

async function loadPersonalizedRecommendations() {
    try {
        toggleLoading(true);
        const recommendations = await RecommendationAPI.getPersonalized();
        toggleLoading(false);
        renderContentGrid(recommendations, 'recommendations-grid');
    } catch (error) {
        console.error('Error loading recommendations:', error);
        toggleLoading(false);
        const popular = await AnalyticsAPI.getMostViewed(12);
        renderContentGrid(popular, 'recommendations-grid');
    }
}

async function loadTrendingContent() {
    try {
        const trending = await RecommendationAPI.getTrending(8);
        renderContentGrid(trending, 'trending-grid');
    } catch (error) {
        console.error('Error loading trending:', error);
        showToast('Error loading trending content', 'danger');
    }
}

async function loadPopularContent() {
    try {
        const popular = await AnalyticsAPI.getMostViewed(8);
        renderContentGrid(popular, 'popular-grid');
    } catch (error) {
        console.error('Error loading popular:', error);
        showToast('Error loading popular content', 'danger');
    }
}

// ============================================
// LOGIN PAGE
// ============================================
function initLoginPage() {
    if (isAuthenticated()) {
        showPage('home');
        return;
    }

    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Remove existing listeners
    const newLoginForm = loginForm.cloneNode(true);
    const newSignupForm = signupForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newLoginForm, loginForm);
    signupForm.parentNode.replaceChild(newSignupForm, signupForm);

    // Login form handler
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await AuthAPI.login(credentials);
            setAuth(response.token, response.user);
            showToast('Login successful!', 'success');
            
            setTimeout(() => {
                showPage('home');
            }, 1000);
        } catch (error) {
            showToast(error.message || 'Login failed', 'danger');
        }
    });

    // Signup form handler
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await AuthAPI.signup(userData);
            setAuth(response.token, response.user);
            showToast('Account created successfully!', 'success');
            
            setTimeout(() => {
                showPage('profile');
            }, 1000);
        } catch (error) {
            showToast(error.message || 'Signup failed', 'danger');
        }
    });
}

// ============================================
// EXPLORE PAGE
// ============================================
let explorePage = 1;
let exploreFilters = {
    type: '',
    category: '',
    search: ''
};

function initExplorePage() {
    loadContent(1);
    
    // Add enter key support for search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                searchContent();
            }
        };
    }
}

async function loadContent(page = 1) {
    try {
        toggleLoading(true, 'explore-loading-spinner');
        explorePage = page;

        const params = {
            page: explorePage,
            limit: 12,
            ...exploreFilters
        };

        Object.keys(params).forEach(key => {
            if (!params[key]) delete params[key];
        });

        const response = await ContentAPI.getAll(params);
        
        toggleLoading(false, 'explore-loading-spinner');
        renderContentGrid(response.content, 'content-grid');
        createPagination(response.currentPage, response.totalPages, 'loadContent');
    } catch (error) {
        console.error('Error loading content:', error);
        toggleLoading(false, 'explore-loading-spinner');
        showToast('Error loading content', 'danger');
    }
}

function filterContent() {
    exploreFilters.type = document.getElementById('type-filter').value;
    exploreFilters.category = document.getElementById('category-filter').value;
    loadContent(1);
}

function searchContent() {
    exploreFilters.search = document.getElementById('search-input').value;
    loadContent(1);
}

// ============================================
// PROFILE PAGE
// ============================================
function initProfilePage() {
    if (!requireAuth()) return;
    loadUserProfile();
}

async function loadUserProfile() {
    try {
        const user = await UserAPI.getProfile();
        
        document.getElementById('user-username').textContent = user.username;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-role').textContent = user.role.toUpperCase();
        
        if (user.profile.avatar) {
            document.getElementById('user-avatar').src = user.profile.avatar;
        }

        document.getElementById('profile-name').value = user.profile.name || '';
        document.getElementById('profile-bio').value = user.profile.bio || '';
        document.getElementById('profile-avatar').value = user.profile.avatar || '';

        if (user.preferences.categories && user.preferences.categories.length > 0) {
            const categorySelect = document.getElementById('pref-categories');
            Array.from(categorySelect.options).forEach(option => {
                option.selected = user.preferences.categories.includes(option.value);
            });
        }

        if (user.preferences.tags && user.preferences.tags.length > 0) {
            document.getElementById('pref-tags').value = user.preferences.tags.join(', ');
        }

        if (user.role === 'admin') {
            const adminNav = document.getElementById('nav-admin');
            const analyticsNav = document.getElementById('nav-analytics');
            if (adminNav) adminNav.style.display = 'block';
            if (analyticsNav) analyticsNav.style.display = 'block';
        }

        setupProfileForms();
    } catch (error) {
        console.error('Error loading profile:', error);
        showToast('Error loading profile', 'danger');
    }
}

function setupProfileForms() {
    const profileForm = document.getElementById('profile-form');
    const preferencesForm = document.getElementById('preferences-form');

    // Clone to remove old listeners
    const newProfileForm = profileForm.cloneNode(true);
    const newPreferencesForm = preferencesForm.cloneNode(true);
    profileForm.parentNode.replaceChild(newProfileForm, profileForm);
    preferencesForm.parentNode.replaceChild(newPreferencesForm, preferencesForm);

    document.getElementById('profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const profileData = {
            name: formData.get('name'),
            bio: formData.get('bio'),
            avatar: formData.get('avatar')
        };

        try {
            await UserAPI.updateProfile(profileData);
            showToast('Profile updated successfully!', 'success');
            await loadUserProfile();
        } catch (error) {
            showToast(error.message || 'Failed to update profile', 'danger');
        }
    });

    document.getElementById('preferences-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const categorySelect = document.getElementById('pref-categories');
        const selectedCategories = Array.from(categorySelect.selectedOptions).map(opt => opt.value);

        const tagsInput = document.getElementById('pref-tags').value;
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

        const preferences = {
            categories: selectedCategories,
            tags: tags
        };

        try {
            await UserAPI.updatePreferences(preferences);
            showToast('Preferences updated successfully!', 'success');
            localStorage.setItem('user_preferences', JSON.stringify(preferences));
        } catch (error) {
            showToast(error.message || 'Failed to update preferences', 'danger');
        }
    });
}

// ============================================
// ADMIN PAGE
// ============================================
function initAdminPage() {
    if (!requireAdmin()) return;
    loadContentTable();
}

async function loadContentTable() {
    try {
        const response = await ContentAPI.getAll({ limit: 100 });
        const tbody = document.getElementById('content-table-body');
        
        if (response.content.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No content found</td></tr>';
            return;
        }

        tbody.innerHTML = response.content.map(content => `
            <tr>
                <td>${content.title}</td>
                <td><span class="badge bg-primary">${content.type}</span></td>
                <td>${content.category}</td>
                <td>${content.stats.views}</td>
                <td>${content.stats.likes}</td>
                <td>${content.stats.averageRating.toFixed(1)}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editContent('${content._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteContent('${content._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading content:', error);
        showToast('Error loading content', 'danger');
    }
}

function resetContentForm() {
    document.getElementById('modalTitle').textContent = 'Add Content';
    document.getElementById('content-form').reset();
    document.getElementById('content-id').value = '';
}

async function editContent(contentId) {
    try {
        const content = await ContentAPI.getById(contentId);
        
        document.getElementById('modalTitle').textContent = 'Edit Content';
        document.getElementById('content-id').value = content._id;
        document.getElementById('content-title').value = content.title;
        document.getElementById('content-type').value = content.type;
        document.getElementById('content-description').value = content.description;
        document.getElementById('content-category').value = content.category;
        document.getElementById('content-author').value = content.author || '';
        document.getElementById('content-tags').value = content.tags.join(', ');
        document.getElementById('content-image').value = content.imageUrl || '';
        document.getElementById('content-url').value = content.url || '';
        document.getElementById('content-price').value = content.price || 0;
        document.getElementById('content-duration').value = content.metadata?.duration || '';

        const modal = new bootstrap.Modal(document.getElementById('contentModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading content:', error);
        showToast('Error loading content', 'danger');
    }
}

async function saveContent() {
    const contentId = document.getElementById('content-id').value;
    
    const tags = document.getElementById('content-tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

    const contentData = {
        title: document.getElementById('content-title').value,
        type: document.getElementById('content-type').value,
        description: document.getElementById('content-description').value,
        category: document.getElementById('content-category').value,
        author: document.getElementById('content-author').value,
        tags: tags,
        imageUrl: document.getElementById('content-image').value,
        url: document.getElementById('content-url').value,
        price: parseFloat(document.getElementById('content-price').value) || 0,
        metadata: {
            duration: document.getElementById('content-duration').value
        }
    };

    try {
        if (contentId) {
            await ContentAPI.update(contentId, contentData);
            showToast('Content updated successfully!', 'success');
        } else {
            await ContentAPI.create(contentData);
            showToast('Content created successfully!', 'success');
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('contentModal'));
        modal.hide();
        
        await loadContentTable();
    } catch (error) {
        console.error('Error saving content:', error);
        showToast(error.message || 'Error saving content', 'danger');
    }
}

async function deleteContent(contentId) {
    if (!confirm('Are you sure you want to delete this content?')) {
        return;
    }

    try {
        await ContentAPI.delete(contentId);
        showToast('Content deleted successfully!', 'success');
        await loadContentTable();
    } catch (error) {
        console.error('Error deleting content:', error);
        showToast('Error deleting content', 'danger');
    }
}

// ============================================
// ANALYTICS PAGE
// ============================================
function initAnalyticsPage() {
    if (!requireAdmin()) return;
    loadAnalytics();
}

async function loadAnalytics() {
    try {
        const overview = await AnalyticsAPI.getOverview();
        document.getElementById('stat-content').textContent = overview.totalContent;
        document.getElementById('stat-users').textContent = overview.totalUsers;
        document.getElementById('stat-views').textContent = overview.totalViews.toLocaleString();
        document.getElementById('stat-likes').textContent = overview.totalLikes.toLocaleString();

        const mostViewed = await AnalyticsAPI.getMostViewed(10);
        renderAnalyticsList(mostViewed, 'most-viewed-list', 'views');

        const mostLiked = await AnalyticsAPI.getMostLiked(10);
        renderAnalyticsList(mostLiked, 'most-liked-list', 'likes');

        const topRated = await AnalyticsAPI.getTopRated(10);
        renderAnalyticsList(topRated, 'top-rated-list', 'rating');
    } catch (error) {
        console.error('Error loading analytics:', error);
        showToast('Error loading analytics', 'danger');
    }
}

function renderAnalyticsList(items, containerId, metricType) {
    const container = document.getElementById(containerId);
    
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = '<p class="text-muted">No data available</p>';
        return;
    }

    const html = items.map((item, index) => {
        let metricValue;
        let metricIcon;

        if (metricType === 'views') {
            metricValue = item.stats.views.toLocaleString();
            metricIcon = 'fa-eye';
        } else if (metricType === 'likes') {
            metricValue = item.stats.likes.toLocaleString();
            metricIcon = 'fa-heart';
        } else if (metricType === 'rating') {
            metricValue = item.stats.averageRating.toFixed(1);
            metricIcon = 'fa-star';
        }

        return `
            <div class="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                <div class="d-flex align-items-center">
                    <span class="badge bg-primary me-3">${index + 1}</span>
                    <div>
                        <h6 class="mb-0">${item.title}</h6>
                        <small class="text-muted">${item.category} • ${item.type}</small>
                    </div>
                </div>
                <div class="text-end">
                    <h5 class="mb-0">
                        <i class="fas ${metricIcon} text-primary"></i> ${metricValue}
                    </h5>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    showPage('home');
});
