/**
 * Al Ogaily - Core JavaScript
 * 
 * This script handles all interactive components including:
 * - Navigation & Scroll effects
 * - Dynamic data rendering (Services, Testimonials)
 * - Booking system logic
 * - Dynamic Business Status (Open/Closed)
 * - Form handling & validation
 */

// --- GLOBAL DATA STORE ---
const SERVICES = [
    {
        id: 'engine-diagnostics',
        title: 'Engine Diagnostics & Repair',
        description: 'Expert engine diagnostics, routine servicing, and premium oil changes to keep your vehicle running at peak performance.',
        icon: 'settings',
        duration: '2-4 Hours',
        image: 'assets/img/Engine%20Diagnostics%20%26%20Repair.png',
        items: ['Engine Diagnostics', 'Engine Repair', 'Oil Change', 'Routine Servicing']
    },
    {
        id: 'brake-suspension',
        title: 'Brake & Suspension Work',
        description: 'Certified brake and suspension services to keep your vehicle safe, smooth, and stable on the road.',
        icon: 'car',
        duration: '2-3 Hours',
        image: 'assets/img/Brake%20%26%20Suspension%20Work.png',
        items: ['Brake Inspection', 'Brake Pad Replacement', 'Suspension Tuning', 'Shock Absorber Service']
    },
    {
        id: 'denting-painting',
        title: 'Denting & Painting',
        description: 'Professional denting, high-quality car painting, and full body repair to restore your vehicle to its original glory.',
        icon: 'paint-bucket',
        duration: '1-3 Days',
        image: 'assets/img/Denting%20%26%20Painting.png',
        items: ['Denting', 'Car Painting', 'Body Repair']
    },
    {
        id: 'electrical-ac',
        title: 'AC & Electrical Repair',
        description: 'Advanced vehicle electrical diagnostics, precision repairs, and expert air-conditioning service for comfort and reliability.',
        icon: 'zap',
        duration: '1-3 Hours',
        image: 'assets/img/AC%20%26%20Electrical%20Repair.png',
        items: ['Electrical Diagnostics', 'Electrical Repairs', 'AC Repair']
    }
];

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Ahmed Al-Mansoori',
        role: 'Verified Customer',
        content: "Al Ogaily provides the most reliable mechanical service in Musaffah. Their engine diagnostics saved me a lot of trouble. Highly recommended!",
        rating: 5,
        photo: 'https://i.pravatar.cc/150?u=ahmed',
        service: 'Mechanical'
    },
    {
        id: 2,
        name: 'Sarah J.',
        role: 'Verified Customer',
        content: "I had my car's body repaired and painted here. The finish is perfect, and the team is very professional. Great value for money.",
        rating: 4,
        photo: 'https://i.pravatar.cc/150?u=sarah',
        service: 'Body & Exterior'
    },
    {
        id: 3,
        name: 'Mohammed K.',
        role: 'Verified Customer',
        content: "Excellent AC repair service. They fixed my car's cooling system in no time. 4.3 stars is well-deserved for their consistency.",
        rating: 5,
        photo: 'https://i.pravatar.cc/150?u=mohammed',
        service: 'Electrical & AC'
    }
];

// --- BUSINESS HOURS CONFIG ---
const BUSINESS_HOURS = {
    1: [{ start: '08:00', end: '13:00' }, { start: '15:00', end: '19:30' }], // Mon
    2: [{ start: '08:00', end: '13:00' }, { start: '15:00', end: '19:30' }], // Tue
    3: [{ start: '08:00', end: '13:00' }, { start: '15:00', end: '19:30' }], // Wed
    4: [{ start: '08:00', end: '13:00' }, { start: '15:00', end: '19:30' }], // Thu
    5: [{ start: '08:00', end: '12:00' }, { start: '15:00', end: '19:30' }], // Fri
    6: [{ start: '08:00', end: '13:00' }, { start: '15:00', end: '19:30' }], // Sat
    0: [] // Sun (Closed)
};

// --- CORE FUNCTIONALITY ---

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Initial Render
    renderServices();
    renderTestimonials();
    updateBusinessStatus();
    setupMobileMenu();
    setupNavbarScroll();
    setupBookingSystem();
    setupContactForm();

    // Update status every minute
    setInterval(updateBusinessStatus, 60000);
});

// 1. Business Status Logic
function updateBusinessStatus() {
    const statusContainer = document.getElementById('business-status');
    if (!statusContainer) return;

    const now = new Date();
    const day = now.getDay();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const todayHours = BUSINESS_HOURS[day];
    let isOpen = false;
    let nextPeriod = null;

    if (todayHours.length > 0) {
        for (const period of todayHours) {
            const start = parseInt(period.start.replace(':', ''));
            const end = parseInt(period.end.replace(':', ''));
            
            if (currentTime >= start && currentTime <= end) {
                isOpen = true;
                break;
            }
            
            if (currentTime < start && !nextPeriod) {
                nextPeriod = period.start;
            }
        }
    }

    if (isOpen) {
        statusContainer.innerHTML = `
            <span class="flex items-center gap-2 text-green-600 font-bold">
                <span class="relative flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Open Now
            </span>
        `;
    } else {
        let statusText = 'Closed';
        if (nextPeriod) {
            statusText += ` • Opens at ${nextPeriod}`;
        } else {
            // Find next opening day
            let nextDay = (day + 1) % 7;
            while (BUSINESS_HOURS[nextDay].length === 0) {
                nextDay = (nextDay + 1) % 7;
            }
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            statusText += ` • Opens ${dayNames[nextDay]} at ${BUSINESS_HOURS[nextDay][0].start}`;
        }
        
        statusContainer.innerHTML = `
            <span class="flex items-center gap-2 text-red-600 font-bold">
                <i data-lucide="clock" class="w-4 h-4"></i>
                ${statusText}
            </span>
        `;
        lucide.createIcons();
    }
}

// 2. Navigation Logic
function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    let isOpen = false;

    mobileMenuButton.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.offsetHeight;
            mobileMenu.style.maxHeight = '500px';
            mobileMenuButton.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
        } else {
            mobileMenu.style.maxHeight = '0';
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
            mobileMenuButton.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        }
        lucide.createIcons();
    });

    mobileMenu.querySelectorAll('a, button').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.style.maxHeight = '0';
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
            mobileMenuButton.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
            isOpen = false;
            lucide.createIcons();
        });
    });
}

function setupNavbarScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('py-2', 'shadow-lg');
            header.classList.remove('py-4');
        } else {
            header.classList.remove('py-2', 'shadow-lg');
            header.classList.add('py-4');
        }
    });
}

// 3. Services Rendering
function renderServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = SERVICES.map(service => `
        <div class="service-card group bg-white rounded-3xl p-8 border border-secondary-100 hover:border-primary-200 shadow-sm">
            <div class="relative mb-8 rounded-2xl overflow-hidden h-48 bg-secondary-100">
                <img src="${service.image}" alt="${service.title}" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 opacity-0" loading="lazy" onload="this.classList.remove('opacity-0')" onerror="this.onerror=null;this.src='assets/img/al%20ogaily%20front%20image.jpg';this.classList.remove('opacity-0')">
                <div class="absolute inset-0 bg-gradient-to-t from-secondary-900/60 to-transparent"></div>
                <div class="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center">
                    <i data-lucide="${service.icon}" class="w-6 h-6 text-primary-600"></i>
                </div>
            </div>
            <div class="space-y-4">
                <div class="flex justify-between items-start">
                    <h3 class="text-2xl font-heading font-bold text-secondary-900">${service.title}</h3>
                    <span class="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-wider">${service.duration}</span>
                </div>
                <p class="text-secondary-600 leading-relaxed">${service.description}</p>
                <ul class="space-y-2 pb-4">
                    ${service.items.map(item => `
                        <li class="flex items-center gap-2 text-sm text-secondary-500">
                            <i data-lucide="check" class="w-4 h-4 text-primary-500"></i>
                            ${item}
                        </li>
                    `).join('')}
                </ul>
                <div class="pt-4 flex items-center justify-between border-t border-secondary-50">
                    <button onclick="openBookingModal('${service.id}')" class="flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all group/btn">
                        Book Now <i data-lucide="chevron-right" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// 4. Testimonials Rendering
function renderTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    container.innerHTML = TESTIMONIALS.map(t => `
        <div class="bg-secondary-50 p-8 rounded-3xl space-y-6 relative border border-secondary-100">
            <div class="flex gap-1 text-yellow-400">
                ${Array(Math.floor(t.rating)).fill('<i data-lucide="star" class="w-4 h-4 fill-current"></i>').join('')}
                ${t.rating % 1 !== 0 ? '<i data-lucide="star-half" class="w-4 h-4 fill-current"></i>' : ''}
            </div>
            <p class="text-secondary-700 italic leading-relaxed text-lg">"${t.content}"</p>
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden bg-secondary-100">
                    <img src="${t.photo}" alt="${t.name}" class="w-full h-full object-cover opacity-0 transition-opacity duration-500" loading="lazy" onload="this.classList.remove('opacity-0')">
                </div>
                <div>
                    <h5 class="font-bold text-secondary-900 leading-none">${t.name}</h5>
                    <p class="text-sm text-secondary-500 mt-1">${t.role} • ${t.service}</p>
                </div>
                <div class="ml-auto">
                    <i data-lucide="quote" class="w-10 h-10 text-primary-100"></i>
                </div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

// 5. Booking System Logic
const bookingModal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('booking-form');

function openBookingModal(serviceId = '') {
    bookingModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    const servicesList = document.getElementById('booking-services-list');
    servicesList.innerHTML = SERVICES.map(s => `
        <label class="relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all ${serviceId === s.id ? 'border-primary-600 bg-primary-50/50' : 'border-secondary-100 hover:border-secondary-200 bg-white'}">
            <input type="radio" name="booking-service" value="${s.id}" class="sr-only" ${serviceId === s.id ? 'checked' : ''}>
            <span class="font-bold text-secondary-900">${s.title}</span>
            <span class="text-xs text-secondary-500 mt-1">${s.duration}</span>
            <div class="absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${serviceId === s.id ? 'border-primary-600 bg-primary-600' : 'border-secondary-200'}">
                ${serviceId === s.id ? '<i data-lucide="check" class="w-3 h-3 text-white"></i>' : ''}
            </div>
        </label>
    `).join('');

    servicesList.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', (e) => {
            openBookingModal(e.target.value);
        });
    });

    lucide.createIcons();
}

function closeBookingModal() {
    bookingModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

document.getElementById('booking-overlay').addEventListener('click', closeBookingModal);

function setupBookingSystem() {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            service: bookingForm.querySelector('input[name="booking-service"]:checked')?.value,
            date: document.getElementById('booking-date').value,
            time: document.getElementById('booking-time').value,
            name: document.getElementById('booking-name').value,
            phone: document.getElementById('booking-phone').value,
            email: document.getElementById('booking-email').value,
            timestamp: new Date().toISOString()
        };

        if (!formData.service) {
            alert('Please select a service');
            return;
        }

        const bookings = JSON.parse(localStorage.getItem('ogaily_bookings') || '[]');
        bookings.push(formData);
        localStorage.setItem('ogaily_bookings', JSON.stringify(bookings));

        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="check-circle" class="w-6 h-6 animate-fade-in"></i> Booking Confirmed!';
        submitBtn.classList.replace('bg-primary-600', 'bg-green-600');
        lucide.createIcons();

        setTimeout(() => {
            closeBookingModal();
            bookingForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            submitBtn.classList.replace('bg-green-600', 'bg-primary-600');
            lucide.createIcons();
            
            alert(`Thank you ${formData.name}! Your appointment at Al Ogaily for ${formData.service} is confirmed for ${formData.date} at ${formData.time}.`);
        }, 1500);
    });
}

// 6. Contact Form Handling
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending Message...';
        
        setTimeout(() => {
            alert('Your message has been sent successfully to Al Ogaily! We will get back to you within 24 hours.');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }, 1500);
    });
}

// Global exposure for modal
window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
