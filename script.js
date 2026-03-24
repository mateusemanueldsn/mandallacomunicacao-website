// Header Scroll Effect
const header = document.querySelector('.header');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile Menu Toggle
if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) icon.classList.replace('ph-x', 'ph-list');
        });
    });
}

// Scroll Animations using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once animated
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
    observer.observe(el);
});
// Carousel Logic
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.nav-arrow.prev');
const nextBtn = document.querySelector('.nav-arrow.next');
let currentSlide = 0;
let slideInterval;
const INTERVAL_TIME = 8000; // 8 segundos para leitura tranquila

// Drag variables
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;

function showSlide(index) {
    dots.forEach(dot => dot.classList.remove('active'));
    slides.forEach(slide => slide.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;

    // Slide horizontal movement
    prevTranslate = -currentSlide * 100;
    track.style.transform = `translateX(${prevTranslate}%)`;

    void dots[currentSlide].offsetWidth;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Auto play
function startSlideInterval() {
    stopSlideInterval();
    slideInterval = setInterval(nextSlide, INTERVAL_TIME);
}

function stopSlideInterval() {
    clearInterval(slideInterval);
}

// Drag Events
if (track) {
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('mouseleave', dragEnd);
    track.addEventListener('mousemove', dragMove);
    track.addEventListener('touchmove', dragMove);
}

function dragStart(e) {
    isDragging = true;
    startPos = getPositionX(e);
    track.classList.add('grabbing');
    stopSlideInterval();
    animationID = requestAnimationFrame(animation);
}

function dragMove(e) {
    if (!isDragging) return;
    const currentPosition = getPositionX(e);
    const diff = currentPosition - startPos;
    // Calculate new translate in %
    const movePercent = (diff / window.innerWidth) * 100;
    currentTranslate = prevTranslate + movePercent;
}

function dragEnd() {
    isDragging = false;
    track.classList.remove('grabbing');
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -15) nextSlide();
    else if (movedBy > 15) prevSlide();
    else showSlide(currentSlide);

    startSlideInterval();
}

function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function animation() {
    if (isDragging) {
        track.style.transform = `translateX(${currentTranslate}%)`;
        requestAnimationFrame(animation);
    }
}

if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        startSlideInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startSlideInterval();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startSlideInterval();
        });
    });

    const carouselSection = document.querySelector('.hero-carousel');
    if (carouselSection) {
        carouselSection.addEventListener('mouseenter', stopSlideInterval);
        carouselSection.addEventListener('mouseleave', startSlideInterval);
    }

    startSlideInterval();
}

// Headline Text Animation: Wrap words in spans
document.querySelectorAll('.slide-headline').forEach(headline => {
    const text = headline.textContent;
    const words = text.split(' ');
    headline.innerHTML = '';

    words.forEach((word, i) => {
        const span = document.createElement('span');
        span.textContent = word + (i === words.length - 1 ? '' : ' ');
        span.style.transitionDelay = `${i * 0.05}s`;
        headline.appendChild(span);
    });
});


// Counter Animation for Stats
const animateCounters = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            card.classList.add('animate-stats');

            const span = card.querySelector('.stat-circle span');
            if (span && !card.dataset.animated) {
                card.dataset.animated = "true";
                const target = parseInt(card.style.getPropertyValue('--percent'));
                let current = 0;
                const duration = 2000; // 2 segundos, igual ao CSS
                const startTime = performance.now();

                const updateCounter = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing cubic-bezier(0.2, 0.6, 0.2, 1) approximate
                    const easeProgress = 1 - Math.pow(1 - progress, 3);

                    current = Math.floor(easeProgress * target);
                    span.innerHTML = `${current}<small>%</small>`;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        span.innerHTML = `${target}<small>%</small>`;
                    }
                };

                requestAnimationFrame(updateCounter);
            }
        }
    });
};

const counterObserver = new IntersectionObserver(animateCounters, {
    threshold: 0.5
});

document.querySelectorAll('.data-card').forEach(card => {
    counterObserver.observe(card);
});

// Generic Counter Animation for .stat-number
const animateGenericCounter = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            if (el.dataset.animated) return;
            el.dataset.animated = "true";

            const target = parseInt(el.dataset.target);
            const suffix = el.dataset.suffix || "";
            const duration = 2500; // 2.5 seconds
            const startTime = performance.now();

            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 4); // Quart easing

                const current = Math.floor(easeProgress * target);
                el.innerText = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.innerText = target + suffix;
                }
            };
            requestAnimationFrame(update);
        }
    });
};

const genericCounterObserver = new IntersectionObserver(animateGenericCounter, {
    threshold: 0.2
});

document.querySelectorAll('.stat-number').forEach(el => {
    genericCounterObserver.observe(el);
});

