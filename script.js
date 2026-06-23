// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
}));

// Smooth reveal elements on scroll
const revealElements = document.querySelectorAll('.section');

const revealOnScroll = () => {
    for (let i = 0; i < revealElements.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = revealElements[i].getBoundingClientRect().top;
        let elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            revealElements[i].style.opacity = '1';
            revealElements[i].style.transform = 'translateY(0)';
        }
    }
};

// Initial state for reveal elements
revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.8s ease-out';
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // trigger once on load

// Intro Toggle Logic
const introScreen = document.getElementById('intro-screen');
const track = document.getElementById('intro-toggle-track');
const thumb = document.getElementById('intro-toggle-thumb');
const trackText = document.querySelector('.track-text');

if (introScreen && track && thumb) {
    document.body.style.overflow = 'hidden';

    let isDragging = false;
    let startX;
    let maxDrag = track.offsetWidth - thumb.offsetWidth - 6;

    const startDrag = (e) => {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        track.style.cursor = 'grabbing';
    };

    const doDrag = (e) => {
        if (!isDragging) return;
        let currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        let moveX = currentX - startX;

        if (moveX < 0) moveX = 0;
        if (moveX > maxDrag) moveX = maxDrag;

        thumb.style.transform = `translateX(${moveX}px)`;
        trackText.style.opacity = 1 - (moveX / maxDrag);
    };

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';

        let currentTransform = thumb.style.transform;
        let moveX = parseInt(currentTransform.replace('translateX(', '').replace('px)', '')) || 0;

        if (moveX >= maxDrag * 0.8) {
            thumb.style.transform = `translateX(${maxDrag}px)`;
            track.classList.add('success');
            setTimeout(() => {
                introScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 400);
        } else {
            thumb.style.transition = 'transform 0.3s ease';
            thumb.style.transform = `translateX(0px)`;
            trackText.style.opacity = 1;
            setTimeout(() => {
                thumb.style.transition = 'transform 0.1s';
            }, 300);
        }
    };

    thumb.addEventListener('mousedown', startDrag);
    thumb.addEventListener('touchstart', startDrag, {passive: true});

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('touchmove', doDrag, {passive: true});

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
}
