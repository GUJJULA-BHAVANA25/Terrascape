// Main page functionality
const API_BASE_URL = 'http://localhost:3000/api';

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && user) {
        const signinLink = document.getElementById('signin-link');
        if (signinLink) {
            signinLink.textContent = user.firstName || 'Profile';
            signinLink.href = '#';
        }
    }
}

// Load packages
async function loadPackages() {
    try {
        const response = await fetch(`${API_BASE_URL}/packages`);
        const data = await response.json();
        
        const packagesGrid = document.getElementById('packages-grid');
        if (!packagesGrid) return;
        
        if (data.packages && data.packages.length > 0) {
            packagesGrid.innerHTML = data.packages.map(pkg => `
                <div class="package-card" data-type="${pkg.type}">
                    <div class="package-image">
                        ${pkg.images && pkg.images.length > 0 
                            ? `<img src="${pkg.images[0]}" alt="${pkg.name}">` 
                            : '<div class="package-placeholder">🌱</div>'}
                    </div>
                    <div class="package-content">
                        <h3>${pkg.name}</h3>
                        <p class="package-category">${pkg.category}</p>
                        <p class="package-description">${pkg.description}</p>
                        <div class="package-features">
                            ${pkg.features ? pkg.features.slice(0, 3).map(f => `<span class="feature-tag">${f}</span>`).join('') : ''}
                        </div>
                        <div class="package-footer">
                            <span class="package-price">₹${pkg.price}</span>
                            <button class="btn btn-primary btn-small" onclick="bookPackage('${pkg._id}')">Book Now</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            packagesGrid.innerHTML = '<p>No packages available at the moment.</p>';
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        document.getElementById('packages-grid').innerHTML = '<p>Error loading packages. Please try again later.</p>';
    }
}

// Load testimonials
async function loadTestimonials() {
    try {
        const response = await fetch(`${API_BASE_URL}/testimonials?isFeatured=true`);
        const data = await response.json();
        
        const testimonialsSlider = document.getElementById('testimonials-slider');
        const galleryGrid = document.getElementById('gallery-grid');
        
        if (data.testimonials && data.testimonials.length > 0) {
            // Testimonials slider
            if (testimonialsSlider) {
                testimonialsSlider.innerHTML = data.testimonials.slice(0, 3).map(testimonial => `
                    <div class="testimonial-card">
                        <div class="testimonial-content">
                            <p>"${testimonial.content}"</p>
                            <div class="testimonial-author">
                                <strong>${testimonial.name}</strong>
                                ${testimonial.role ? `<span>${testimonial.role}</span>` : ''}
                            </div>
                            ${testimonial.metrics ? `
                                <div class="testimonial-metrics">
                                    ${testimonial.metrics.vegetablesPerMonth ? `<span>${testimonial.metrics.vegetablesPerMonth} kg/month</span>` : ''}
                                    ${testimonial.metrics.temperatureReduction ? `<span>${testimonial.metrics.temperatureReduction}°C reduction</span>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('');
            }
            
            // Gallery grid
            if (galleryGrid) {
                const testimonialsWithImages = data.testimonials.filter(t => t.images && t.images.length > 0);
                if (testimonialsWithImages.length > 0) {
                    galleryGrid.innerHTML = testimonialsWithImages.slice(0, 6).map(testimonial => `
                        <div class="gallery-item">
                            ${testimonial.images[0] ? `<img src="${testimonial.images[0]}" alt="Terrace Garden">` : ''}
                            <div class="gallery-overlay">
                                <p>${testimonial.name}</p>
                            </div>
                        </div>
                    `).join('');
                } else {
                    galleryGrid.innerHTML = '<p>Gallery images coming soon!</p>';
                }
            }
        } else {
            if (testimonialsSlider) {
                testimonialsSlider.innerHTML = '<p>No testimonials available yet.</p>';
            }
            if (galleryGrid) {
                galleryGrid.innerHTML = '<p>Gallery coming soon!</p>';
            }
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

// Book package function
function bookPackage(packageId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please sign in to book a package');
        window.location.href = 'User-Signin/User-Signin.html';
        return;
    }
    
    // Redirect to booking page or open booking modal
    window.location.href = `booking.html?packageId=${packageId}`;
}

// Package filter functionality
function setupPackageFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const packageCards = document.querySelectorAll('.package-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            packageCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-type') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Contact form handler
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadPackages();
    loadTestimonials();
    setupPackageFilters();
    setupContactForm();
});

