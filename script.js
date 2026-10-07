// script.js - Portfolio Interactive System & Live Themes

const THEME_PALETTES = {
    cosmic: ['rgba(255, 51, 102, ', 'rgba(0, 195, 255, ', 'rgba(224, 102, 255, ', 'rgba(255, 204, 0, '],
    cyberpunk: ['rgba(255, 0, 85, ', 'rgba(0, 240, 255, ', 'rgba(255, 230, 0, ', 'rgba(120, 0, 255, '],
    synthwave: ['rgba(255, 69, 0, ', 'rgba(148, 0, 211, ', 'rgba(255, 140, 0, ', 'rgba(255, 0, 127, '],
    matrix: ['rgba(0, 255, 102, ', 'rgba(0, 136, 255, ', 'rgba(0, 255, 204, ', 'rgba(50, 255, 150, ']
};

let currentTheme = 'cosmic';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme Switcher
    initThemeSelector();

    // 2. Initialize Live Background Canvas
    initLiveCanvas();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Interaction Bubble Glow Effect
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    // Smooth follow using requestAnimationFrame and linear interpolation (Lerp)
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.25; 
        glowY += (mouseY - glowY) * 0.25;
        
        cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
        requestAnimationFrame(animateGlow);
    }
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Only run glow on non-touch devices
    if(window.matchMedia("(pointer: fine)").matches) {
        animateGlow();
    } else {
        cursorGlow.style.display = 'none';
    }

    // Scroll Reveal Observer with Staggering
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach((el) => {
        revealObserver.observe(el);
    });
});

// Live Theme Selector Functionality
function initThemeSelector() {
    const toggleBtn = document.getElementById('themeToggleBtn');
    const dropdown = document.getElementById('themeDropdown');
    const options = document.querySelectorAll('.theme-opt');

    if (!toggleBtn || !dropdown) return;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('portfolio_theme') || 'cosmic';
    setTheme(savedTheme);

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !toggleBtn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    options.forEach(opt => {
        opt.addEventListener('click', () => {
            const theme = opt.getAttribute('data-theme');
            setTheme(theme);
            dropdown.classList.remove('show');
        });
    });

    function setTheme(theme) {
        currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio_theme', theme);

        options.forEach(opt => {
            if (opt.getAttribute('data-theme') === theme) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }
}

// Live Canvas Constellation Particle System
function initLiveCanvas() {
    const canvas = document.getElementById('live-bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const numParticles = Math.min(Math.floor((width * height) / 15000), 75);
    const particles = [];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.3;
            this.colorIdx = Math.floor(Math.random() * 4);
        }

        update(mouseX, mouseY) {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Soft cursor interaction physics
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                const angle = Math.atan2(dy, dx);
                const force = (130 - dist) / 130;
                this.x -= Math.cos(angle) * force * 1.2;
                this.y -= Math.sin(angle) * force * 1.2;
            }
        }

        draw() {
            const colors = THEME_PALETTES[currentTheme] || THEME_PALETTES.cosmic;
            const colorPrefix = colors[this.colorIdx];
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = colorPrefix + this.alpha + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    let mouseX = -1000;
    let mouseY = -1000;
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function loop() {
        ctx.clearRect(0, 0, width, height);

        const colors = THEME_PALETTES[currentTheme] || THEME_PALETTES.cosmic;
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(mouseX, mouseY);
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const alpha = (1 - dist / 130) * 0.22;
                    ctx.strokeStyle = colors[0] + alpha + ')';
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(loop);
    }

    loop();
}

// Modal specific logic
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function closeModal(event, modalId) {
    const modal = document.getElementById(modalId);
    if (event.target === modal || event.target.classList.contains('close-btn')) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 400);
    }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.show').forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 400);
        });
    }
});

// Gallery scrolling logic
function scrollGallery(direction, btnElement) {
    const wrapper = btnElement.closest('.gallery-wrapper');
    const gallery = wrapper.querySelector('.modal-gallery');
    
    const imgWidth = gallery.querySelector('img').clientWidth;
    const gap = 20;
    const scrollAmount = (imgWidth + gap) * direction;
    
    gallery.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

