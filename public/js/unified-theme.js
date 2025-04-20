// Código JS para funcionalidades adicionales del tema unificado

// Función para manejar la barra de progreso de scroll
function handleScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) return;

    window.addEventListener('scroll', () => {
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });
}

// Función para manejar el header sticky
function handleStickyHeader() {
    const navegacion = document.querySelector('.navegacion');
    if (!navegacion) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navegacion.classList.add('sticky-header');
        } else {
            navegacion.classList.remove('sticky-header');
        }
    });
}

// Función para añadir efectos smooth scroll a los links de ancla
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Función para inicializar animaciones de entrada en elementos
function initFadeEffects() {
    // Solo aplicar en navegadores modernos que soportan IntersectionObserver
    if ('IntersectionObserver' in window) {
        const fadeElems = document.querySelectorAll('.fade-in:not(.fade-in-active)');
        
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-active');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        fadeElems.forEach(elem => {
            fadeObserver.observe(elem);
        });
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        document.querySelectorAll('.fade-in').forEach(elem => {
            elem.classList.add('fade-in-active');
        });
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    handleScrollProgress();
    handleStickyHeader();
    initSmoothScroll();
    initFadeEffects();
    
    // Inicialización de tooltips de Bootstrap si están disponibles
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
});