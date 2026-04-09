// script.js
document.addEventListener('DOMContentLoaded', () => {
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
        // Increased from 0.12 to 0.25 for a more responsive and fluid catch-up to the cursor
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
                // Add class actively
                entry.target.classList.add('active');
            } else {
                // Optional: remove class when scrolling up to allow re-animation, keeping it fluid
                entry.target.classList.remove('active');
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach((el) => {
        revealObserver.observe(el);
    });
});

// Modal specific logic
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = 'flex';
        // Small delay to trigger animation
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function closeModal(event, modalId) {
    const modal = document.getElementById(modalId);
    // Only close if clicking the overlay or close button, not the content
    if (event.target === modal || event.target.classList.contains('close-btn')) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 400); // Wait for transition
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
    // Find the adjacent gallery container relative to the clicked button
    const wrapper = btnElement.closest('.gallery-wrapper');
    const gallery = wrapper.querySelector('.modal-gallery');
    
    // Calculate distance to scroll based on the first image's width + gap
    const imgWidth = gallery.querySelector('img').clientWidth;
    const gap = 20; // 20px gap defined in CSS
    const scrollAmount = (imgWidth + gap) * direction;
    
    gallery.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}
