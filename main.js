// DOM Elements
const sidebar = document.getElementById('sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const pageContents = document.querySelectorAll('.page-content');
const contactForm = document.getElementById('contactForm');

// Initialize the application
function handleResponsiveAvatars() {
    const pageAvatars = document.querySelectorAll('.responsive-page-avatars .page-avatar');
    pageAvatars.forEach(avatar => {
        avatar.addEventListener('click', function () {
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
            pageAvatars.forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function handleFooterNavigation() {
    const footerLinks = document.querySelectorAll('footer a[data-page]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');

            navLinks.forEach(nav => nav.classList.remove('active'));
            const correspondingSidebarLink = document.querySelector(`.nav-link[data-page="${targetPage}"]`);
            if (correspondingSidebarLink) {
                correspondingSidebarLink.classList.add('active');
            }

            const pageAvatars = document.querySelectorAll('.responsive-page-avatars .page-avatar');
            pageAvatars.forEach(avatar => avatar.classList.remove('active'));
            const correspondingAvatar = document.querySelector(`.page-avatar[data-page="${targetPage}"]`);
            if (correspondingAvatar) {
                correspondingAvatar.classList.add('active');
            }

            showPage(targetPage);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    addScrollEffects();
    handleResponsiveAvatars();
    handleFooterNavigation();

    // Newsletter Form AJAX
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = new FormData(newsletterForm);
            const messageArea = document.createElement('div');

            try {
                const response = await fetch(newsletterForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { Accept: 'application/json' }
                });

                messageArea.className = 'newsletter-message alert mt-2';
                if (response.ok) {
                    messageArea.classList.add('alert-success');
                    messageArea.innerHTML = `<i class="fas fa-check-circle me-2"></i>Subscribed successfully!`;
                    newsletterForm.reset();
                } else {
                    messageArea.classList.add('alert-danger');
                    messageArea.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i>Subscription failed. Try again.`;
                }
            } catch (err) {
                messageArea.classList.add('alert-danger');
                messageArea.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i>Something went wrong.`;
            }

            newsletterForm.appendChild(messageArea);
            setTimeout(() => messageArea.remove(), 5000);
        });
    }
});

// Navigation
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            pageContents.forEach(page => page.classList.remove('active'));
            const targetPageElement = document.getElementById(targetPage);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
                targetPageElement.style.opacity = '0';
                targetPageElement.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    targetPageElement.style.opacity = '1';
                    targetPageElement.style.transform = 'translateY(0)';
                }, 50);
            }
            if (window.innerWidth < 992) {
                sidebar.classList.remove('show');
            }
        });
    });
}

// Toast Container for success/error messages
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');

    toast.className = `alert alert-${type} fade show`;
    toast.style.minWidth = '250px';
    toast.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()" style="border: none; background: transparent;"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Initialize form validation and submission
if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        if (!validateForm(data)) return;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                showToast('Message sent successfully!', 'success');
                resetForm();
            } else {
                showToast('Failed to send message. Please try again.', 'danger');
            }
        } catch (err) {
            showToast('Something went wrong. Please try later.', 'danger');
        }
    });

    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
            if (input.value.trim()) {
                input.classList.add('is-valid');
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    switch (field.id) {
        case 'fullname':
            isValid = value.length >= 3;
            break;
        case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            break;
        case 'contact':
            isValid = /^[0-9]{10}$/.test(value.replace(/\D/g, ''));
            break;
        case 'gender':
        case 'service':
            isValid = value !== '';
            break;
        case 'city':
        case 'state':
            isValid = value.length >= 2;
            break;
        case 'pincode':
            isValid = /^[0-9]{6}$/.test(value);
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

function validateForm(data) {
    const fields = contactForm.querySelectorAll('input, select, textarea');
    let isFormValid = true;

    fields.forEach(field => {
        const valid = validateField(field);
        if (!valid) isFormValid = false;
    });

    if (!isFormValid) {
        showToast("Please fix validation errors.", "danger");
    }

    return isFormValid;
}

function resetForm() {
    contactForm.reset();
    const inputs = contactForm.querySelectorAll('.form-control, .form-select');
    inputs.forEach(el => el.classList.remove('is-valid', 'is-invalid'));
}

// Toast container setup (ensure this div exists in HTML)
document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("toastContainer")) {
        const container = document.createElement("div");
        container.id = "toastContainer";
        container.style.position = "fixed";
        container.style.bottom = "20px";
        container.style.right = "20px";
        container.style.zIndex = "1055";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "10px";
        document.body.appendChild(container);
    }
});

// Show Error Messages
function showErrorMessages(errors) {
    removeExistingMessages();
    const errorContainer = document.createElement('div');
    errorContainer.className = 'alert alert-danger';
    errorContainer.innerHTML = `
        <strong>Please fix the following errors:</strong>
        <ul class="mb-0 mt-2">${errors.map(err => `<li>${err}</li>`).join('')}</ul>
    `;
    contactForm.insertBefore(errorContainer, contactForm.firstChild);
    errorContainer.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => errorContainer.remove(), 5000);
}

// Show Success Message
function showSuccessMessage() {
    removeExistingMessages();
    const successContainer = document.createElement('div');
    successContainer.className = 'alert alert-success';
    successContainer.innerHTML = `<i class="fas fa-check-circle me-2"></i>Message sent successfully! We'll get back to you soon.`;
    contactForm.insertBefore(successContainer, contactForm.firstChild);
    successContainer.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => successContainer.remove(), 5000);
}

// Remove Existing Messages
function removeExistingMessages() {
    const existing = contactForm.querySelectorAll('.alert');
    existing.forEach(msg => msg.remove());
}

// Reset Form
function resetForm() {
    contactForm.reset();
    const inputs = contactForm.querySelectorAll('.form-control, .form-select');
    inputs.forEach(el => el.classList.remove('is-valid', 'is-invalid'));
}

// Scroll Effects
function addScrollEffects() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll(
        '.feature-card, .benefit-card, .team-card, .solution-card, .contact-form, .contact-info, .about-stats'
    );

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Show Page
function showPage(pageId) {
    const page = document.getElementById(pageId);
    if (page) {
        pageContents.forEach(p => {
            p.classList.remove('active');
            p.style.opacity = '0';
        });
        setTimeout(() => {
            page.classList.add('active');
            page.style.opacity = '1';
        }, 150);
    }
}

// Button hover effect
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => button.style.transform = 'translateY(-2px)');
        button.addEventListener('mouseleave', () => button.style.transform = 'translateY(0)');
    });
});

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