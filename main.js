// DOM Elements
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const pageContents = document.querySelectorAll('.page-content');
const contactForm = document.getElementById('contactForm');

// Initialize the application
function handleResponsiveAvatars() {
    const pageAvatars = document.querySelectorAll('.responsive-page-avatars .page-avatar');
    pageAvatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
            // Deactivate all avatars
            pageAvatars.forEach(a => a.classList.remove('active'));
            // Activate clicked avatar
            this.classList.add('active');
        });
    });
}

// Handle footer navigation links
function handleFooterNavigation() {
    const footerLinks = document.querySelectorAll('footer a[data-page]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Update sidebar navigation
            navLinks.forEach(nav => nav.classList.remove('active'));
            const correspondingSidebarLink = document.querySelector(`.nav-link[data-page="${targetPage}"]`);
            if (correspondingSidebarLink) {
                correspondingSidebarLink.classList.add('active');
            }
            
            // Update page avatars
            const pageAvatars = document.querySelectorAll('.responsive-page-avatars .page-avatar');
            pageAvatars.forEach(avatar => avatar.classList.remove('active'));
            const correspondingAvatar = document.querySelector(`.page-avatar[data-page="${targetPage}"]`);
            if (correspondingAvatar) {
                correspondingAvatar.classList.add('active');
            }
            
            // Show the page
            showPage(targetPage);
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    // initializeContactForm();
    addScrollEffects();
    handleResponsiveAvatars();
    handleFooterNavigation();
});

// Navigation System
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            
            // Remove active class from all nav links
            navLinks.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked nav link
            this.classList.add('active');
            
            // Hide all page contents
            pageContents.forEach(page => page.classList.remove('active'));
            
            // Show target page
            const targetPageElement = document.getElementById(targetPage);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
                
                // Add page transition effect
                targetPageElement.style.opacity = '0';
                targetPageElement.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    targetPageElement.style.opacity = '1';
                    targetPageElement.style.transform = 'translateY(0)';
                }, 50);
            }
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth < 992) {
                sidebar.classList.remove('show');
            }
        });
    });
}


// Form Validation
function validateForm(data) {
    const errors = [];
    
    // Fullname validation
    if (!data.fullname || !data.fullname.trim()) {
        errors.push('Full name is required');
    } else if (data.fullname.length < 3) {
        errors.push('Full name must be at least 3 characters');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
        errors.push('Email is required');
    } else if (!emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Contact validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!data.contact.trim()) {
        errors.push('Contact number is required');
    } else if (!phoneRegex.test(data.contact.replace(/\D/g, ''))) {
        errors.push('Please enter a valid 10-digit contact number');
    }
    
    // Gender validation
    if (!data.gender) {
        errors.push('Please select a gender');
    }
    
    // City validation
    if (!data.city.trim()) {
        errors.push('City is required');
    }
    
    // State validation
    if (!data.state.trim()) {
        errors.push('State is required');
    }
    
    // Pincode validation
    const pincodeRegex = /^[0-9]{6}$/;
    if (!data.pincode.trim()) {
        errors.push('Pincode is required');
    } else if (!pincodeRegex.test(data.pincode)) {
        errors.push('Please enter a valid 6-digit pincode');
    }
    
    // Message validation
    if (!data.message.trim()) {
        errors.push('Message is required');
    } else if (data.message.length < 10) {
        errors.push('Message must be at least 10 characters');
    }
    
    if (errors.length > 0) {
        showErrorMessages(errors);
        return false;
    }
    
    return true;
}

// Show Error Messages
function showErrorMessages(errors) {
    // Remove existing error messages
    removeExistingMessages();
    
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-danger';
    errorContainer.innerHTML = `
        <strong>Please fix the following errors:</strong>
        <ul class="mb-0 mt-2">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    contactForm.insertBefore(errorContainer, contactForm.firstChild);
    
    // Scroll to error messages
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

// Show Success Message
function showSuccessMessage() {
    // Remove existing messages
    removeExistingMessages();
    
    const successContainer = document.createElement('div');
    successContainer.className = 'alert alert-success';
    successContainer.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>Success!</strong> Your message has been sent successfully. We'll get back to you soon.
    `;
    
    contactForm.insertBefore(successContainer, contactForm.firstChild);
    
    // Scroll to success message
    successContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successContainer.remove();
    }, 5000);
}

// Remove Existing Messages
function removeExistingMessages() {
    const existingMessages = contactForm.querySelectorAll('.alert');
    existingMessages.forEach(message => message.remove());
}

// Reset Form
function resetForm() {
    contactForm.reset();
    
    // Remove any validation classes
    const formControls = contactForm.querySelectorAll('.form-control, .form-select');
    formControls.forEach(control => {
        control.classList.remove('is-valid', 'is-invalid');
    });
}

// Add Scroll Effects
function addScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const animatedElements = document.querySelectorAll(
        '.feature-card, .benefit-card, .team-card, .solution-card, .contact-form, .contact-info, .about-stats'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth hover effects to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add loading states to navigation
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Add loading effect
        const icon = this.querySelector('i');
        const originalIcon = icon.className;
        
        icon.className = 'fas fa-spinner fa-spin';
        
        setTimeout(() => {
            icon.className = originalIcon;
        }, 500);
    });
});

// Add dynamic content loading effect
function showPage(pageId) {
    const page = document.getElementById(pageId);
    if (page) {
        // Hide all pages first
        pageContents.forEach(p => {
            p.classList.remove('active');
            p.style.opacity = '0';
        });
        
        // Show target page with animation
        setTimeout(() => {
            page.classList.add('active');
            page.style.opacity = '1';
        }, 150);
    }
}

// Real-time form validation
if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove invalid state on input
            this.classList.remove('is-invalid');
            
            // Add valid state for non-empty fields
            if (this.value.trim()) {
                this.classList.add('is-valid');
            }
        });
    });
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    switch (field.id) {
        case 'username':
            isValid = value.length >= 3;
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
        case 'contact':
            isValid = /^[0-9]{10}$/.test(value.replace(/\D/g, ''));
            break;
        case 'pincode':
            isValid = /^[0-9]{6}$/.test(value);
            break;
        case 'city':
        case 'state':
            isValid = value.length >= 2;
            break;
        case 'gender':
            isValid = value !== '';
            break;
        case 'message':
            isValid = value.length >= 10;
            break;
    }
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
    
    return isValid;
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + number keys for navigation
    if (e.altKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('[data-page="home"]').click();
                break;
            case '2':
                e.preventDefault();
                document.querySelector('[data-page="about"]').click();
                break;
            case '3':
                e.preventDefault();
                document.querySelector('[data-page="team"]').click();
                break;
            case '4':
                e.preventDefault();
                document.querySelector('[data-page="services"]').click();
                break;
            case '5':
                e.preventDefault();
                document.querySelector('[data-page="contact"]').click();
                break;
        }
    }
});

// Newsletter Subscription Function
function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNewsletterMessage('Please enter your email address.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNewsletterMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate newsletter subscription
    showNewsletterMessage('Thank you for subscribing to our newsletter!', 'success');
    emailInput.value = '';
}

// Show Newsletter Message
function showNewsletterMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.newsletter-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `newsletter-message alert alert-${type === 'success' ? 'success' : 'danger'} mt-2`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
        ${message}
    `;
    
    const newsletterSection = document.querySelector('.newsletter-subscription');
    if (newsletterSection) {
        newsletterSection.appendChild(messageDiv);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}
// Add logo click handler
const logo = document.getElementById('logo');
if (logo) {
    logo.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update navigation
        navLinks.forEach(nav => nav.classList.remove('active'));
        document.querySelector('.nav-link[data-page="home"]').classList.add('active');
        
        // Update page avatars
        const pageAvatars = document.querySelectorAll('.responsive-page-avatars .page-avatar');
        pageAvatars.forEach(avatar => avatar.classList.remove('active'));
        document.querySelector('.page-avatar[data-page="home"]').classList.add('active');
        
        // Show home page
        showPage('home');
    });
}

// If you also want the second logo to work the same way
const secondLogo = document.querySelector('.second-logo');
if (secondLogo) {
    secondLogo.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update navigation
        navLinks.forEach(nav => nav.classList.remove('active'));
        document.querySelector('.nav-link[data-page="home"]').classList.add('active');
        
        // Update page avatars
        const pageAvatars = document.querySelectorAll('.responsive-page-avatars .page-avatar');
        pageAvatars.forEach(avatar => avatar.classList.remove('active'));
        document.querySelector('.page-avatar[data-page="home"]').classList.add('active');
        
        // Show home page
        showPage('home');
    });
}

// Project Data
const projects = [
  {
    id: 1,
    name: "AI GPS Attendance Monitoring System",
    description: "Revolutionary attendance system combining AI face recognition with GPS location verification to ensure accurate attendance tracking for educational institutions and businesses.",
    image: "/logo.png",
    tech: ["AI", "GPS", "Cloud", "Facial Recognition", "Geofencing", "Analytics"],
    date: "Launching January 2026",
    team: "6 Team Members",
    features: [
      "Real-time face recognition with 99.9% accuracy",
      "GPS location verification with geofencing",
      "Multi-platform support (Web, iOS, Android)",
      "Advanced reporting dashboard for administrators",
      "Customizable geofencing for different locations",
      "Secure cloud storage with end-to-end encryption",
      "Offline mode for areas with poor connectivity",
      "Real-time notifications for attendance anomalies"
    ]
  }
  // Add more projects as needed
];

// DOM Elements
const projectPopup = document.getElementById('projectPopup');
const closeBtn = document.querySelector('.close-btn');
const closePopupBtn = document.querySelector('.close-popup');
const contactBtn = document.querySelector('.contact-btn');

// Show Project Popup
function showProjectPopup(projectId) {
  const project = projects.find(p => p.id === projectId);

  // Populate features
  const featuresContainer = document.getElementById('popupProjectFeatures');
  featuresContainer.innerHTML = '';
  project.features.forEach(feature => {
    const li = document.createElement('li');
    li.textContent = feature;
    featuresContainer.appendChild(li);
  });

  // Show popup
  projectPopup.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Close Popup
function closeProjectPopup() {
  projectPopup.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Event Listeners
document.querySelectorAll('.project-overlay .btn').forEach(button => {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    const projectCard = this.closest('.project-card');
    const projectId = projectCard.dataset.projectId ? parseInt(projectCard.dataset.projectId) : 1;
    showProjectPopup(projectId);
  });
});

closeBtn.addEventListener('click', closeProjectPopup);
closePopupBtn.addEventListener('click', closeProjectPopup);

contactBtn.addEventListener('click', function() {
  closeProjectPopup();
  showPage('contact');
  document.querySelector('.nav-link[data-page="contact"]').click();
});

// Close popup when clicking outside content
projectPopup.addEventListener('click', function(e) {
  if (e.target === projectPopup) {
    closeProjectPopup();
  }
});

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && projectPopup.style.display === 'block') {
    closeProjectPopup();
  }
});


console.log(`
🤖 AI Attendance System Website
=================================
Welcome to the console! 
Keyboard shortcuts:
- Alt + 1: Home
- Alt + 2: About  
- Alt + 3: Team
- Alt + 4: Services
- Alt + 5: Products
- Alt + 6: Contact
=================================
`);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    });
}