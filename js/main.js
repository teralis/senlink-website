// Senlink Website JavaScript
// Navigation and interactive functionality

class SenlinkWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupContactForm();
        this.setupAnimations();
        this.setupProductCards();
    }

    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const navbar = document.getElementById('navbar');

        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Smooth scrolling for navigation links (only for anchor links)
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Only prevent default and smooth scroll for anchor links (starting with #)
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
                // Let external links (like safetyculture.html) work normally
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    setupScrollEffects() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.product-card, .solution-card, .feature-item, .stat');
        animateElements.forEach(el => observer.observe(el));

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroVisual = document.querySelector('.hero-visual');
            
            if (heroVisual && scrolled < window.innerHeight) {
                heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                // Show loading state
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Simulate form submission (replace with actual endpoint)
                try {
                    await this.simulateFormSubmission(new FormData(form));
                    
                    // Show success message
                    this.showFormMessage('Thank you! We\'ll be in touch soon.', 'success');
                    form.reset();
                    
                } catch (error) {
                    // Show error message
                    this.showFormMessage('Sorry, there was an error. Please try again.', 'error');
                } finally {
                    // Reset button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }
            });
        }
    }

    async simulateFormSubmission(formData) {
        // Simulate API call delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure (90% success rate)
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 2000);
        });
    }

    showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        
        // Insert message
        const form = document.getElementById('contact-form');
        form.parentNode.insertBefore(messageDiv, form.nextSibling);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    setupAnimations() {
        // Animate connection nodes in hero section
        const nodes = document.querySelectorAll('.node');
        nodes.forEach((node, index) => {
            node.style.animationDelay = `${index * 0.5}s`;
        });

        // Animate chart bars in features section
        const chartBars = document.querySelectorAll('.bar');
        
        const animateCharts = () => {
            chartBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.transform = 'scaleY(1)';
                }, index * 100);
            });
        };

        // Trigger chart animation when features section comes into view
        const featuresSection = document.querySelector('.features');
        if (featuresSection) {
            const featuresObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCharts();
                        featuresObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            featuresObserver.observe(featuresSection);
        }

        // Counter animation for stats
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element, target, duration = 2000) => {
            const isPercentage = target.includes('%');
            const isPlus = target.includes('+');
            const numericTarget = parseFloat(target.replace(/[^\d.]/g, ''));
            
            let start = 0;
            const increment = numericTarget / (duration / 16);
            
            const timer = setInterval(() => {
                start += increment;
                
                if (start >= numericTarget) {
                    start = numericTarget;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(start);
                if (isPercentage) displayValue += '%';
                if (isPlus) displayValue += '+';
                if (target.includes('/')) displayValue += '/7';
                
                element.textContent = displayValue;
            }, 16);
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target.textContent;
                    animateCounter(entry.target, target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => statsObserver.observe(counter));
    }

    setupProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(27, 154, 170, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            });
        });
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SenlinkWebsite();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reset mobile menu on desktop
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});