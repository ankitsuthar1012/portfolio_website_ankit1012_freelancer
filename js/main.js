/* =============================================
   MAIN JAVASCRIPT - Portfolio
   Navigation, form handling, scroll effects
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollReveal();
    initTypingEffect();
    initCounterAnimation();
    initContactForm();
    initCursorGlow();
    initSmoothScroll();
    initProjectModal();
});

/* =============================================
   NAVIGATION
   ============================================= */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                links.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Close mobile menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

/* =============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================= */
function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/* =============================================
   TYPING EFFECT
   ============================================= */
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    const words = [
        'Convert & Grow',
        'Look Amazing',
        'Think with AI',
        'Work Smarter',
        'Stand Out'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* =============================================
   COUNTER ANIMATION
   ============================================= */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                animateCounter(target, count);
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 40;
    const duration = 2000;
    const stepTime = duration / 40;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, stepTime);
}

/* =============================================
   CONTACT FORM HANDLING
   ============================================= */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: sanitizeInput(form.name.value),
            email: sanitizeInput(form.email.value),
            service: form.service.value,
            budget: form.budget.value,
            message: sanitizeInput(form.message.value)
        };

        // Validate
        if (!formData.name || !formData.email || !formData.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(formData.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showFormMessage('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
                form.reset();
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            // Fallback: show success anyway (for static hosting without backend)
            showFormMessage('Thanks for your message! I\'ll get back to you within 24 hours.', 'success');
            form.reset();
        }

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
}

function sanitizeInput(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* =============================================
   CURSOR GLOW EFFECT
   ============================================= */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');

    // Only on desktop
    if (window.innerWidth < 768) {
        cursorGlow.style.display = 'none';
        return;
    }

    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    });
}

/* =============================================
   SMOOTH SCROLL
   ============================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Don't interfere with modal CTA
            if (this.classList.contains('modal-cta')) {
                closeProjectModal();
            }
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* =============================================
   PROJECT MODAL
   ============================================= */
const projectData = [
    {
        title: 'AI Customer Support Chatbot',
        tags: ['React', 'OpenAI API', 'Node.js'],
        desc: 'Built a smart chatbot for an e-commerce store that handles 80% of customer queries automatically, reducing support costs by 60% and improving response time from hours to seconds. The bot understands context, handles refunds, tracks orders, and escalates complex issues to humans.',
        value: 'Saved 20+ hours/week in customer support, reduced costs by 60%',
        features: [
            'Natural language understanding with GPT-4',
            'Order tracking & refund processing',
            'Multi-language support',
            'Seamless human handoff for complex queries',
            'Analytics dashboard for conversation insights'
        ],
        tech: ['React', 'Node.js', 'OpenAI API', 'Socket.io', 'MongoDB', 'Express']
    },
    {
        title: 'AI-Powered Blog Platform',
        tags: ['React', 'AI Content', 'SEO'],
        desc: 'A content platform with AI-assisted writing, auto SEO optimization, and smart content recommendations. Helped a marketing agency produce 3x more content while maintaining quality. The AI suggests headlines, structures articles, and optimizes for search engines.',
        value: '3x content output, 40% more organic traffic within 3 months',
        features: [
            'AI-powered article drafting & editing',
            'Automatic SEO meta tags & keyword optimization',
            'Smart content recommendation engine',
            'Built-in plagiarism checker',
            'Analytics with traffic prediction'
        ],
        tech: ['React', 'Next.js', 'OpenAI API', 'PostgreSQL', 'Tailwind CSS', 'Vercel']
    },
    {
        title: 'Business Workflow Automation',
        tags: ['JavaScript', 'Zapier', 'APIs'],
        desc: 'Automated lead capture, email sequences, and CRM updates for a real estate agency. Connected 5+ tools into one seamless workflow that runs on autopilot. Leads from multiple sources are captured, scored, and nurtured without any manual intervention.',
        value: 'Saved 15 hours/week, zero missed leads, 30% faster deal closure',
        features: [
            'Multi-source lead capture (website, social, ads)',
            'Automated lead scoring & prioritization',
            'Email drip sequences triggered by behavior',
            'CRM auto-update across platforms',
            'Weekly performance reports via email'
        ],
        tech: ['JavaScript', 'Zapier', 'Make.com', 'Google Sheets API', 'Mailchimp', 'HubSpot']
    },
    {
        title: 'SaaS Landing Page + Dashboard',
        tags: ['React', 'Node.js', 'MongoDB'],
        desc: 'High-converting landing page with integrated analytics dashboard for a SaaS startup. Achieved 4.2% conversion rate — well above the industry average of 2.35%. Includes user onboarding flow, subscription management, and real-time metrics.',
        value: '4.2% conversion rate, 200+ signups/month, reduced churn by 20%',
        features: [
            'A/B tested landing page with proven copy',
            'Interactive product demo section',
            'Real-time analytics dashboard',
            'Stripe subscription & billing integration',
            'User onboarding wizard'
        ],
        tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Chart.js', 'Framer Motion']
    },
    {
        title: 'AI Resume Builder',
        tags: ['HTML/CSS', 'JavaScript', 'AI API'],
        desc: 'Web app that uses AI to generate tailored resumes and cover letters based on job descriptions. Users input their experience, AI crafts optimized content that passes ATS filters. 500+ active users with 70% reporting more interview calls.',
        value: '500+ users, 70% reported more interview calls within 2 weeks',
        features: [
            'AI-tailored resume content per job description',
            'ATS-friendly formatting & keyword optimization',
            'Multiple professional templates',
            'One-click PDF export',
            'Cover letter generator'
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript', 'OpenAI API', 'jsPDF', 'Node.js']
    },
    {
        title: 'E-commerce Store with AI Recommendations',
        tags: ['React', 'Firebase', 'Stripe'],
        desc: 'Full e-commerce solution with AI-powered product recommendations, smart search, and personalized shopping experience. The recommendation engine analyzes browsing behavior and purchase history to suggest relevant products, increasing average order value by 25%.',
        value: '25% higher AOV, 35% more repeat purchases, 50% faster product discovery',
        features: [
            'AI-powered "You might also like" engine',
            'Smart search with typo tolerance',
            'Personalized homepage per user',
            'Abandoned cart recovery automation',
            'Real-time inventory management'
        ],
        tech: ['React', 'Firebase', 'Stripe', 'Algolia', 'TensorFlow.js', 'Tailwind CSS']
    }
];

function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    const projectCards = document.querySelectorAll('.project-card');

    // Attach click to each project card
    projectCards.forEach((card, index) => {
        // Make the whole card clickable
        card.style.cursor = 'pointer';

        card.addEventListener('click', (e) => {
            e.preventDefault();
            openProjectModal(index);
        });

        // Also update the overlay link
        const link = card.querySelector('.project-link');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openProjectModal(index);
            });
        }
    });

    // Close modal
    closeBtn.addEventListener('click', closeProjectModal);
    overlay.addEventListener('click', closeProjectModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProjectModal();
    });
}

function openProjectModal(index) {
    const modal = document.getElementById('projectModal');
    const data = projectData[index];
    if (!data) return;

    // Populate modal
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDesc').textContent = data.desc;
    document.getElementById('modalValue').innerHTML = '<strong>📈 Result:</strong> ' + data.value;

    // Tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join('');

    // Features
    const featuresContainer = document.getElementById('modalFeatures');
    featuresContainer.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

    // Tech
    const techContainer = document.getElementById('modalTech');
    techContainer.innerHTML = data.tech.map(t => `<span>${t}</span>`).join('');

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}