/* ================================
   Personal Portfolio - JavaScript
   Nguyễn Vũ Quang Huy
================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Preloader.init();
    Particles.init();
    Navigation.init();
    ThemeToggle.init();
    TypingEffect.init();
    ScrollAnimations.init();
    SkillsTabs.init();
    ProjectsFilter.init();
    ExperienceTabs.init();
    TestimonialsSlider.init();
    ContactForm.init();
    BackToTop.init();
    CounterAnimation.init();
});

/* ================================
   Preloader Module
================================ */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, 500);
        });
    }
};

/* ================================
   Particles Background
================================ */
const Particles = {
    init() {
        if (typeof particlesJS === 'undefined') return;
        
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#6366f1'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6366f1',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
};

/* ================================
   Navigation Module
================================ */
const Navigation = {
    init() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (!this.navbar) return;
        
        this.bindEvents();
        this.handleScroll();
    },
    
    bindEvents() {
        // Scroll event for navbar background
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
                this.setActiveLink(link);
            });
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', () => this.updateActiveOnScroll());
    },
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },
    
    toggleMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    },
    
    closeMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    },
    
    setActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    },
    
    updateActiveOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

/* ================================
   Theme Toggle Module
================================ */
const ThemeToggle = {
    init() {
        this.toggle = document.getElementById('theme-toggle');
        if (!this.toggle) return;
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        }
        
        this.toggle.addEventListener('click', () => this.toggleTheme());
    },
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
};

/* ================================
   Typing Effect Module
================================ */
const TypingEffect = {
    init() {
        this.element = document.querySelector('.typing-text');
        if (!this.element) return;
        
        this.texts = [
            'Full-Stack Developer',
            'UI/UX Designer',
            'Problem Solver',
            'Tech Enthusiast',
            'Freelancer'
        ];
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        this.type();
    },
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let timeout = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            timeout = 500;
        }
        
        setTimeout(() => this.type(), timeout);
    }
};

/* ================================
   Scroll Animations Module
================================ */
const ScrollAnimations = {
    init() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }
        
        // Custom scroll animations for skill bars
        this.animateSkillBars();
    },
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute('data-progress');
                    entry.target.style.width = `${progress}%`;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }
};

/* ================================
   Skills Tabs Module
================================ */
const SkillsTabs = {
    init() {
        this.tabs = document.querySelectorAll('.tab-btn');
        this.contents = document.querySelectorAll('.tab-content');
        
        if (this.tabs.length === 0) return;
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    },
    
    switchTab(activeTab) {
        const targetId = activeTab.getAttribute('data-tab');
        
        // Update tab buttons
        this.tabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
        
        // Update content
        this.contents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetId) {
                content.classList.add('active');
                // Re-trigger skill bar animations
                this.reAnimateSkillBars(content);
            }
        });
    },
    
    reAnimateSkillBars(container) {
        const bars = container.querySelectorAll('.skill-progress');
        bars.forEach(bar => {
            bar.style.width = '0';
            setTimeout(() => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = `${progress}%`;
            }, 100);
        });
    }
};

/* ================================
   Projects Filter Module
================================ */
const ProjectsFilter = {
    init() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projects = document.querySelectorAll('.project-card');
        
        if (this.filterBtns.length === 0) return;
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filter(btn));
        });
    },
    
    filter(activeBtn) {
        const filter = activeBtn.getAttribute('data-filter');
        
        // Update buttons
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
        
        // Filter projects
        this.projects.forEach(project => {
            const category = project.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                project.classList.remove('hidden');
                project.style.animation = 'fadeIn 0.5s ease';
            } else {
                project.classList.add('hidden');
            }
        });
    }
};

/* ================================
   Experience Tabs Module
================================ */
const ExperienceTabs = {
    init() {
        this.tabs = document.querySelectorAll('.exp-tab-btn');
        this.contents = document.querySelectorAll('.exp-tab-content');
        
        if (this.tabs.length === 0) return;
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab));
        });
    },
    
    switchTab(activeTab) {
        const targetId = activeTab.getAttribute('data-exp-tab');
        
        // Update tab buttons
        this.tabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
        
        // Update content
        this.contents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetId) {
                content.classList.add('active');
            }
        });
    }
};

/* ================================
   Testimonials Slider Module
================================ */
const TestimonialsSlider = {
    init() {
        this.track = document.querySelector('.testimonial-track');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.prevBtn = document.querySelector('.testimonial-prev');
        this.nextBtn = document.querySelector('.testimonial-next');
        this.dotsContainer = document.querySelector('.testimonial-dots');
        
        if (!this.track || this.cards.length === 0) return;
        
        this.currentIndex = 0;
        this.totalSlides = this.cards.length;
        
        this.createDots();
        this.bindEvents();
        this.autoPlay();
    },
    
    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
        this.dots = this.dotsContainer.querySelectorAll('.dot');
    },
    
    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Touch events for mobile
        let startX = 0;
        let endX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) this.next();
            if (endX - startX > 50) this.prev();
        });
    },
    
    updateSlider() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    },
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlider();
    },
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    },
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    },
    
    autoPlay() {
        setInterval(() => this.next(), 5000);
    }
};

/* ================================
   Contact Form Module
================================ */
const ContactForm = {
    init() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;
        
        this.submitBtn = this.form.querySelector('.btn-submit');
        this.statusDiv = this.form.querySelector('.form-status');
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    },
    
    validateField(field) {
        const parent = field.closest('.form-group');
        const error = parent.querySelector('.form-error');
        
        if (!field.value.trim()) {
            parent.classList.add('error');
            error.textContent = 'Vui lòng điền thông tin này';
            return false;
        }
        
        if (field.type === 'email' && !this.isValidEmail(field.value)) {
            parent.classList.add('error');
            error.textContent = 'Email không hợp lệ';
            return false;
        }
        
        parent.classList.remove('error');
        return true;
    },
    
    clearError(field) {
        const parent = field.closest('.form-group');
        if (field.value.trim()) {
            parent.classList.remove('error');
        }
    },
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all required fields
        const requiredFields = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        // Show loading state
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        try {
            await this.simulateSubmit();
            this.showStatus('success', 'Cảm ơn bạn! Tin nhắn đã được gửi thành công.');
            this.form.reset();
        } catch (error) {
            this.showStatus('error', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    },
    
    simulateSubmit() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    },
    
    showStatus(type, message) {
        this.statusDiv.className = `form-status ${type}`;
        this.statusDiv.textContent = message;
        
        setTimeout(() => {
            this.statusDiv.className = 'form-status';
            this.statusDiv.textContent = '';
        }, 5000);
    }
};

/* ================================
   Back to Top Module
================================ */
const BackToTop = {
    init() {
        this.button = document.getElementById('back-to-top');
        if (!this.button) return;
        
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
    },
    
    toggleVisibility() {
        if (window.scrollY > 500) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    },
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

/* ================================
   Counter Animation Module
================================ */
const CounterAnimation = {
    init() {
        this.counters = document.querySelectorAll('.stat-number');
        if (this.counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        this.counters.forEach(counter => observer.observe(counter));
    },
    
    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    }
};

/* ================================
   Smooth Scroll for Anchor Links
================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

/* ================================
   Keyboard Navigation
================================ */
document.addEventListener('keydown', (e) => {
    // Press 'T' to toggle theme
    if (e.key === 't' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            ThemeToggle.toggleTheme();
        }
    }
    
    // Press 'Escape' to close mobile menu
    if (e.key === 'Escape') {
        Navigation.closeMenu();
    }
});

/* ================================
   Parallax Effect for Hero
================================ */
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && scrolled < hero.offsetHeight) {
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    }
});

/* ================================
   Image Lazy Loading
================================ */
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support native lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

/* ================================
   Console Easter Egg
================================ */
console.log('%c👋 Xin chào!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cCảm ơn bạn đã ghé thăm portfolio của tôi!', 'font-size: 14px; color: #64748b;');
console.log('%c🚀 Nếu bạn quan tâm đến việc hợp tác, hãy liên hệ với tôi nhé!', 'font-size: 14px; color: #10b981;');
