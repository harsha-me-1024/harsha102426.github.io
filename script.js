// script.js - Portfolio Interactive System

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Ambient Live Background Canvas
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

    // Scroll Reveal Observer
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

// Live Canvas Ambient Constellation System
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

    const numParticles = Math.min(Math.floor((width * height) / 16000), 65);
    const particles = [];
    
    // Soft, dark ambient theme particle colors
    const particleColors = [
        'rgba(204, 102, 255, ', // Soft Violet
        'rgba(0, 170, 230, ',   // Ambient Cyan
        'rgba(230, 80, 160, ',  // Soft Magenta
        'rgba(140, 100, 240, '  // Deep Indigo
    ];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.8 + 0.8;
            this.alpha = Math.random() * 0.4 + 0.2;
            this.colorIdx = Math.floor(Math.random() * particleColors.length);
        }

        update(mouseX, mouseY) {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Subtle cursor interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const angle = Math.atan2(dy, dx);
                const force = (120 - dist) / 120;
                this.x -= Math.cos(angle) * force * 1.0;
                this.y -= Math.sin(angle) * force * 1.0;
            }
        }

        draw() {
            const colorPrefix = particleColors[this.colorIdx];
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

        for (let i = 0; i < particles.length; i++) {
            particles[i].update(mouseX, mouseY);
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const alpha = (1 - dist / 120) * 0.15;
                    ctx.strokeStyle = particleColors[0] + alpha + ')';
                    ctx.lineWidth = 0.65;
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

