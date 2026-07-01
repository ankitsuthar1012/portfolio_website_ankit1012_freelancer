document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTiltEffect();
    initParallaxScroll();
    initMagneticButtons();
    initTextReveal();
    initScrollProgress();
});

/* =============================================
   FLOATING PARTICLES (Hero Section)
   ============================================= */
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.5 + 0.1;

        // Randomize color between accent shades
        const colors = [
            'rgba(99, 102, 241, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(168, 85, 247, 0.5)',
            'rgba(99, 102, 241, 0.4)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);
    }
}

/* =============================================
   3D TILT EFFECT (Project Cards)
   ============================================= */
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    // Only on desktop
    if (window.innerWidth < 768) return;

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            el.style.transition = 'transform 0.5s ease';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'none';
        });
    });
}

/* =============================================
   PARALLAX SCROLL EFFECT
   ============================================= */
function initParallaxScroll() {
    const heroContent = document.querySelector('.hero-content');
    const heroBgGrid = document.querySelector('.hero-bg-grid');

    if (!heroContent || window.innerWidth < 768) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                const heroHeight = document.querySelector('.hero').offsetHeight;

                if (scrolled < heroHeight) {
                    const parallaxFactor = scrolled * 0.3;
                    const opacityFactor = 1 - (scrolled / heroHeight);

                    heroContent.style.transform = `translateY(${parallaxFactor}px)`;
                    heroContent.style.opacity = Math.max(opacityFactor, 0);

                    if (heroBgGrid) {
                        heroBgGrid.style.transform = `translateY(${scrolled * 0.1}px)`;
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

/* =============================================
   MAGNETIC BUTTON EFFECT
   ============================================= */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .nav-cta');

    if (window.innerWidth < 768) return;

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.3s ease';
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });
}

/* =============================================
   TEXT REVEAL ANIMATION (Split text)
   ============================================= */
function initTextReveal() {
    const revealElements = document.querySelectorAll('.section-title');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('text-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    revealElements.forEach(el => observer.observe(el));
}

/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7);
        z-index: 10001;
        transition: width 0.1s ease-out;
        border-radius: 0 2px 2px 0;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    });
}

/* =============================================
   INTERSECTION OBSERVER - STAGGER CHILDREN
   ============================================= */
function initStaggeredReveal() {
    const grids = document.querySelectorAll('.skills-grid, .services-grid, .projects-grid');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 150);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    grids.forEach(grid => observer.observe(grid));
}

// Initialize staggered reveal
document.addEventListener('DOMContentLoaded', initStaggeredReveal);

/* =============================================
   SMOOTH NUMBER COUNTER WITH EASING
   ============================================= */
function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* =============================================
   NAVBAR HIDE ON SCROLL DOWN, SHOW ON SCROLL UP
   ============================================= */
(function() {
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
})();


