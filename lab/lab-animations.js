/* 
   Mandalla Lab Animation Engine
   Intersection Observer and Entrance Controller
*/

document.addEventListener('DOMContentLoaded', () => {
    // Add "loaded" class to body for initial entrance
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 150);

    // Auto-set active class in sidebar
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'lab.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentFile) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Initial check for Intersection Observer availability
    if ('IntersectionObserver' in window) {

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing if we only want animations once
                    // observer.unobserve(entry.target);
                    // But maybe we want them to re-animate when scrolling back? Let's leave for now.
                }
            });
        }, observerOptions);

        // Find all elements prepared for animation
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

        revealElements.forEach(el => {
            observer.observe(el);
        });

    } else {
        // Fallback for browsers without Intersection Observer
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
            el.classList.add('active');
        });
    }

    // Dynamic Hover Logic for Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.3) rotate(15deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        link.addEventListener('mouseleave', function () {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
});
