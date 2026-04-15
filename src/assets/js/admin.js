/**
 * Al Ogaily - Admin CMS Logic
 * 
 * Handles:
 * - Authentication (Simple password check)
 * - CRUD operations for Services & Testimonials
 * - Booking management
 * - Persistence via LocalStorage
 */

const ADMIN_PASSWORD = 'admin'; // For demo purposes
let isAuthenticated = false;

// Initialize Admin
document.addEventListener('DOMContentLoaded', () => {
    setupAdminAuth();
    loadAdminData();
});

function loadAdminData() {
    console.log('Al Ogaily Admin data initialized');
}

// 1. Authentication
function setupAdminAuth() {
    const loginForm = document.getElementById('admin-login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pwd = document.getElementById('admin-password').value;
        if (pwd === ADMIN_PASSWORD) {
            isAuthenticated = true;
            document.getElementById('admin-login-view').classList.add('hidden');
            document.getElementById('admin-dashboard-view').classList.remove('hidden');
            renderAdminServices();
        } else {
            alert('Invalid Password');
        }
    });
}

function openAdminModal() {
    document.getElementById('admin-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 2. Tab Navigation
function switchAdminTab(tab) {
    const panels = ['services', 'testimonials', 'bookings'];
    panels.forEach(p => {
        const panel = document.getElementById(`admin-${p}-panel`);
        const tabBtn = document.getElementById(`tab-${p}`);
        if (panel) panel.classList.add('hidden');
        if (tabBtn) {
            tabBtn.classList.remove('text-primary-600', 'border-b-2', 'border-primary-600');
            tabBtn.classList.add('text-secondary-400');
        }
    });

    const activePanel = document.getElementById(`admin-${tab}-panel`);
    const activeTab = document.getElementById(`tab-${tab}`);
    if (activePanel) activePanel.classList.remove('hidden');
    if (activeTab) {
        activeTab.classList.add('text-primary-600', 'border-b-2', 'border-primary-600');
        activeTab.classList.remove('text-secondary-400');
    }

    if (tab === 'services') renderAdminServices();
    if (tab === 'testimonials') renderAdminTestimonials();
    if (tab === 'bookings') renderAdminBookings();
    
    lucide.createIcons();
}

// 3. Data Rendering
function renderAdminServices() {
    const list = document.getElementById('admin-services-list');
    if (!list) return;

    list.innerHTML = SERVICES.map(s => `
        <div class="flex items-center justify-between p-4 bg-secondary-50 rounded-xl border border-secondary-100">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                    <i data-lucide="${s.icon}" class="w-6 h-6 text-primary-600"></i>
                </div>
                <div>
                    <h5 class="font-bold text-secondary-900">${s.title}</h5>
                    <p class="text-sm text-secondary-500">${s.duration}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="editService('${s.id}')" class="p-2 text-secondary-600 hover:text-primary-600 transition-colors"><i data-lucide="edit-3" class="w-5 h-5"></i></button>
                <button onclick="deleteService('${s.id}')" class="p-2 text-secondary-600 hover:text-red-600 transition-colors"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderAdminTestimonials() {
    const list = document.getElementById('admin-testimonials-list');
    if (!list) return;

    list.innerHTML = TESTIMONIALS.map(t => `
        <div class="flex items-center justify-between p-4 bg-secondary-50 rounded-xl border border-secondary-100">
            <div class="flex items-center gap-4">
                <img src="${t.photo}" class="w-12 h-12 rounded-full object-cover">
                <div>
                    <h5 class="font-bold text-secondary-900">${t.name}</h5>
                    <p class="text-sm text-secondary-500 line-clamp-1 max-w-md">${t.content}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="deleteTestimonial(${t.id})" class="p-2 text-secondary-600 hover:text-red-600 transition-colors"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderAdminBookings() {
    const list = document.getElementById('admin-bookings-list');
    if (!list) return;

    const bookings = JSON.parse(localStorage.getItem('ogaily_bookings') || '[]');
    
    list.innerHTML = bookings.reverse().map(b => `
        <tr class="border-b border-secondary-50 hover:bg-secondary-50/50 transition-colors">
            <td class="px-6 py-4">
                <div class="font-bold text-secondary-900">${b.name}</div>
                <div class="text-xs text-secondary-500">${b.email}</div>
            </td>
            <td class="px-6 py-4 text-sm font-medium text-secondary-700 uppercase">${b.service}</td>
            <td class="px-6 py-4 text-sm text-secondary-600">${b.date} at ${b.time}</td>
            <td class="px-6 py-4">
                <button class="text-primary-600 font-bold text-sm hover:underline">Complete</button>
            </td>
        </tr>
    `).join('');
}

// 4. CRUD Operations
function deleteService(id) {
    if (confirm('Are you sure you want to delete this service from Al Ogaily?')) {
        const index = SERVICES.findIndex(s => s.id === id);
        if (index > -1) {
            SERVICES.splice(index, 1);
            renderAdminServices();
            if (window.renderServices) window.renderServices();
        }
    }
}

function deleteTestimonial(id) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        const index = TESTIMONIALS.findIndex(t => t.id === id);
        if (index > -1) {
            TESTIMONIALS.splice(index, 1);
            renderAdminTestimonials();
            if (window.renderTestimonials) window.renderTestimonials();
        }
    }
}

function openServiceEditor() {
    const title = prompt('Enter Service Title:');
    if (!title) return;
    const duration = prompt('Enter Duration (e.g. 1 Hour):');
    
    const newService = {
        id: title.toLowerCase().replace(/\s+/g, '-'),
        title,
        description: 'New service description added via Al Ogaily admin panel.',
        icon: 'tool',
        duration: duration || '1 Hour',
        image: 'assets/img/al%20ogaily%20front%20image.jpg',
        items: ['General Maintenance']
    };
    
    SERVICES.push(newService);
    renderAdminServices();
    if (window.renderServices) window.renderServices();
}

// Global exposure
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;
window.switchAdminTab = switchAdminTab;
window.deleteService = deleteService;
window.deleteTestimonial = deleteTestimonial;
window.openServiceEditor = openServiceEditor;
