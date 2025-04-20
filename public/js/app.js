// app.js - Script principal para la agencia de viajes

document.addEventListener('DOMContentLoaded', function() {
    // ===== Menú Sticky =====
    const header = document.querySelector('header');
    const navigation = document.querySelector('.navegacion');
    let headerHeight = header ? header.offsetHeight : 0;
    
    function handleScroll() {
        if (window.scrollY > headerHeight) {
            navigation.classList.add('sticky-header');
            if (header) {
                document.body.style.paddingTop = navigation.offsetHeight + 'px';
            }
        } else {
            navigation.classList.remove('sticky-header');
            document.body.style.paddingTop = '0';
        }
        
        // Actualizar la barra de progreso de scroll
        updateScrollProgress();
    }
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', function() {
        headerHeight = header ? header.offsetHeight : 0;
        handleScroll();
    });
    
    // ===== Indicador de Scroll =====
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-progress';
    document.body.appendChild(scrollIndicator);
    
    function updateScrollProgress() {
        const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / height) * 100;
        
        scrollIndicator.style.width = scrolled + '%';
    }
    
    // ===== Animación para los elementos con la clase .fade-in =====
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, fadeOptions);
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // ===== Inicializar Breadcrumbs =====
    const breadcrumbsContainer = document.querySelector('.breadcrumbs');
    if (breadcrumbsContainer) {
        updateBreadcrumbs();
    }
    
    function updateBreadcrumbs() {
        const currentPath = window.location.pathname;
        let segments = currentPath.split('/').filter(segment => segment !== '');
        
        // Si no hay segmentos, estamos en la página de inicio
        if (segments.length === 0) {
            breadcrumbsContainer.innerHTML = '<span class="current">Inicio</span>';
            return;
        }
        
        let breadcrumbsHTML = '<a href="/">Inicio</a> <i class="fas fa-angle-right"></i> ';
        let currentPath = '';
        
        segments.forEach((segment, index) => {
            currentPath += '/' + segment;
            let segmentName = formatSegmentName(segment);
            
            if (index === segments.length - 1) {
                breadcrumbsHTML += `<span class="current">${segmentName}</span>`;
            } else {
                breadcrumbsHTML += `<a href="${currentPath}">${segmentName}</a> <i class="fas fa-angle-right"></i> `;
            }
        });
        
        breadcrumbsContainer.innerHTML = breadcrumbsHTML;
    }
    
    function formatSegmentName(segment) {
        // Formatear los nombres de los segmentos de la URL
        switch(segment) {
            case 'viajes':
                return 'Viajes';
            case 'nosotros':
                return 'Nosotros';
            case 'testimoniales':
                return 'Testimonios';
            case 'reservar':
                return 'Reservar';
            case 'admin':
                return 'Administración';
            default:
                // Para los slugs de viajes, podríamos buscar el título real, 
                // pero por ahora solo formatemos el texto 
                return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
        }
    }
});
