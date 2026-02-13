// ========================================
// Navigation
// ========================================

const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// Navbar scroll effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(12px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-12px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// ========================================
// Smooth Scroll
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Intersection Observer for Animations
// ========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
const animatedElements = document.querySelectorAll(
    '.menu-item, .craft-card, .location-card, .story-grid, .section-tag, .section-title'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// ========================================
// Stagger Animation for Menu Items
// ========================================

const menuItems = document.querySelectorAll('.menu-item');
const menuObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            menuObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

menuItems.forEach(item => {
    menuObserver.observe(item);
});

// ========================================
// Stats Counter Animation
// ========================================

function animateCounter(element, target, suffix = '', duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            
            statNumbers.forEach(stat => {
                const text = stat.textContent.trim();
                
                if (text === '3') {
                    animateCounter(stat, 3);
                } else if (text === '100%') {
                    animateCounter(stat, 100, '%');
                } else if (text === 'MOF') {
                    // No animation for MOF, it's text
                    stat.textContent = 'MOF';
                } else if (text === '5.8k') {
                    animateCounter(stat, 5.8, 'k');
                }
            });
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
    statsObserver.observe(statsBar);
}

// ========================================
// Parallax Effect on Hero Decorations
// ========================================

let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const circles = document.querySelectorAll('.deco-circle');
    const lines = document.querySelectorAll('.deco-line');
    
    if (scrolled < window.innerHeight) {
        circles.forEach((circle, index) => {
            const speed = (index + 1) * 0.1;
            circle.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
        });
        
        lines.forEach((line, index) => {
            const speed = (index + 1) * 0.15;
            line.style.transform = `translateY(${scrolled * speed}px) rotate(-30deg)`;
        });
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ========================================
// Card Hover Effects with 3D Tilt
// ========================================

const cards = document.querySelectorAll('.menu-item, .craft-card, .location-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        this.style.transition = 'transform 0.5s ease';
    });
});

// ========================================
// Loading Animation
// ========================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// Active Section Detection
// ========================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

function setActiveLink() {
    const scrollPosition = window.pageYOffset + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ========================================
// Baguette Progress Bar (Easter Egg)
// ========================================

function createBaguetteProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'baguette-progress';
    progressBar.innerHTML = '<div class="baguette-fill">🥖</div>';
    
    const style = document.createElement('style');
    style.textContent = `
        .baguette-progress {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: rgba(139, 30, 63, 0.1);
            z-index: 9998;
            overflow: hidden;
        }
        .baguette-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
            transition: width 0.1s ease;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 5px;
            font-size: 20px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        const fill = progressBar.querySelector('.baguette-fill');
        fill.style.width = scrolled + '%';
    });
}

createBaguetteProgress();

// ========================================
// Menu Item Special Effects
// ========================================

const featuredItem = document.querySelector('.menu-item.featured');
if (featuredItem) {
    setInterval(() => {
        featuredItem.style.boxShadow = '0 8px 48px rgba(139, 30, 63, 0.3)';
        setTimeout(() => {
            featuredItem.style.boxShadow = '0 8px 48px rgba(139, 30, 63, 0.16)';
        }, 1000);
    }, 3000);
}

// ========================================
// Random Floating Crumbs Animation
// ========================================

function createCrumb() {
    const crumb = document.createElement('div');
    crumb.className = 'crumb';
    crumb.textContent = ['🥖', '🧈', '🥓', '🧀'][Math.floor(Math.random() * 4)];
    crumb.style.cssText = `
        position: fixed;
        font-size: ${Math.random() * 20 + 15}px;
        opacity: 0.4;
        pointer-events: none;
        z-index: 9997;
        left: ${Math.random() * 100}vw;
        top: -50px;
        animation: fall ${Math.random() * 3 + 4}s linear;
    `;
    
    document.body.appendChild(crumb);
    
    setTimeout(() => {
        crumb.remove();
    }, 7000);
}

const crumbStyle = document.createElement('style');
crumbStyle.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(${Math.random() * 720}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(crumbStyle);

// Create crumbs periodically when scrolling through menu section
let crumbInterval;
const menuSection = document.querySelector('.menu-section');

const menuSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            crumbInterval = setInterval(() => {
                if (Math.random() > 0.7) {
                    createCrumb();
                }
            }, 2000);
        } else {
            clearInterval(crumbInterval);
        }
    });
}, { threshold: 0.3 });

if (menuSection) {
    menuSectionObserver.observe(menuSection);
}

// ========================================
// Scroll Reveal for Images
// ========================================

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.clipPath = 'inset(0 0 0 0)';
            entry.target.style.transform = 'scale(1)';
            imageObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

const images = document.querySelectorAll('.image-frame, .image-placeholder');
images.forEach(img => {
    img.style.clipPath = 'inset(10% 10% 10% 10%)';
    img.style.transform = 'scale(0.9)';
    img.style.transition = 'clip-path 1s ease, transform 1s ease';
    imageObserver.observe(img);
});

// ========================================
// Accessibility: Keyboard Navigation
// ========================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ========================================
// Console Easter Egg
// ========================================

console.log(
    '%c🥖 BBT Paris - Le Bon, Le Beurre & Le Truand 🥖',
    'font-size: 24px; color: #8B1E3F; font-weight: bold; font-family: Playfair Display, serif;'
);
console.log(
    '%cL\'authentique jambon-beurre parisien 🇫🇷',
    'font-size: 16px; color: #D4AF37; font-weight: bold;'
);
console.log(
    '%cSuivez-nous sur Instagram: @bbtparis',
    'font-size: 14px; color: #6B5B4F;'
);
console.log(
    '%cBaguette MOF • Jambon Prince de Paris • Fait Minute',
    'font-size: 12px; color: #3A2618; font-style: italic;'
);
console.log(
    '%c💡 Astuce dev: Regardez la barre de progression en bas (c\'est une baguette qui se remplit!) 🥖',
    'font-size: 10px; color: #C17C58;'
);

// ========================================
// Performance: Debounce Scroll Events
// ========================================

function debounce(func, wait = 10) {
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

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(setActiveLink, 50));

// ========================================
// Initialize
// ========================================

console.log('✅ BBT Paris site initialized successfully');
console.log('📍 3 boutiques à Paris');
console.log('🥖 100% fait minute');
console.log('👨‍🍳 Baguette MOF Olivier Magne');
