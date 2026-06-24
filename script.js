// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }));
}

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
            
            // Tandai bahwa user sudah melewati layar welcome
            sessionStorage.setItem('welcomed', 'true');
            
            setTimeout(() => {
                introScreen.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = 'index.html?welcomed=true';
                }, 500); // Wait for fade out
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

// Typewriter Effect Logic
const heroTitle = document.getElementById('hero-title');
const heroDesc = document.getElementById('hero-desc');
const heroHeart = document.getElementById('hero-heart');
const heroBtn = document.getElementById('hero-btn');

if (heroTitle && heroDesc) {
    const wrapChars = (el) => {
        const childNodes = Array.from(el.childNodes);
        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < text.length; i++) {
                    const span = document.createElement('span');
                    span.textContent = text[i];
                    span.style.display = 'none';
                    fragment.appendChild(span);
                }
                el.replaceChild(fragment, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                wrapChars(node);
            }
        });
    };

    wrapChars(heroTitle);
    wrapChars(heroDesc);

    const titleChars = Array.from(heroTitle.querySelectorAll('span[style*="display: none"]'));
    const descChars = Array.from(heroDesc.querySelectorAll('span[style*="display: none"]'));

    let typeSpeed = 60;
    let eraseSpeed = 35;

    const typeArray = (chars, callback) => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < chars.length) {
                chars[i].style.display = 'inline';
                i++;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, typeSpeed);
    };

    const eraseArray = (chars, stopIndex, callback) => {
        let i = chars.length - 1;
        const interval = setInterval(() => {
            if (i >= stopIndex) {
                chars[i].style.display = 'none';
                i--;
            } else {
                clearInterval(interval);
                if (callback) callback();
            }
        }, eraseSpeed);
    };

    // Animation Sequence
    setTimeout(() => {
        typeArray(titleChars, () => {
            typeArray(descChars, () => {
                // Show heart and button
                if(heroHeart) heroHeart.style.opacity = '1';
                if(heroBtn) {
                    heroBtn.style.opacity = '1';
                    heroBtn.style.transform = 'translateY(0)';
                    heroBtn.style.pointerEvents = 'auto';
                }

                // Wait before erasing
                setTimeout(() => {
                    if(heroHeart) heroHeart.style.opacity = '0';
                    if(heroBtn) {
                        heroBtn.style.opacity = '0';
                        heroBtn.style.pointerEvents = 'none';
                    }
                    
                    setTimeout(() => {
                        eraseArray(descChars, 0, () => {
                            // "Selamat" is 7 chars. Stop at index 7 to keep indices 0-6 visible.
                            eraseArray(titleChars, 7, () => {
                                // Done! Only "Selamat" remains
                            });
                        });
                    }, 500); // Wait for fade out
                }, 5000); // 5 seconds of reading time
            });
        });
    }, 800); // Initial delay before typing starts
}
