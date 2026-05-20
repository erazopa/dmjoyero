document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const header = document.querySelector('.header');
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
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (mainNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Dynamic Testimonials Logic
    async function cargarTestimonios() {
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQplJLgwiCyvjSLgmlSmoLWQZU3CGpUu7NhBQDVeBE25dZgVZCboh-xck1n1stdrz26vXmddxOBXXzB/pub?gid=2141995915&single=true&output=csv';
        const grid = document.getElementById('testimonials-grid');
        
        if (!grid) return;

        try {
            const response = await fetch(csvUrl);
            const data = await response.text();
            const rows = parseCSV(data);
            
            // Remove header row
            const testimonials = rows.slice(1).filter(row => row.length >= 3);
            
            grid.innerHTML = ''; // Clear previous content

            testimonials.forEach(row => {
                const [id, nombre, comentario, foto, joya, fecha] = row;
                
                const card = document.createElement('div');
                card.className = 'testimonial-card';
                
                // AppSheet Image logic
                const imageUrl = `https://www.appsheet.com/template/gettablefileurl?appName=Hojadecálculosintítulo-534273002&tableName=testimonios&fileName=${encodeURIComponent(foto)}`;
                
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${nombre}" class="testimonial-avatar" onerror="this.src='images/logodm.png'">
                    <h4 class="testimonial-name">${nombre}</h4>
                    <p class="testimonial-joya">${joya || 'Joyas Exclusivas'}</p>
                    <p class="testimonial-text">${comentario}</p>
                `;
                
                grid.appendChild(card);
            });
        } catch (error) {
            console.error('Error cargando testimonios:', error);
            grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Error al cargar los testimonios. Por favor, intenta de nuevo más tarde.</p>';
        }
    }

    // Helper function to parse CSV correctly (handling quotes and commas)
    function parseCSV(text) {
        const result = [];
        let row = [];
        let col = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"' && inQuotes && nextChar === '"') {
                col += '"';
                i++;
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(col.trim());
                col = '';
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
                if (col !== '' || row.length > 0) {
                    row.push(col.trim());
                    result.push(row);
                    col = '';
                    row = [];
                }
                if (char === '\r' && nextChar === '\n') i++;
            } else {
                col += char;
            }
        }
        if (col !== '' || row.length > 0) {
            row.push(col.trim());
            result.push(row);
        }
        return result;
    }

    cargarTestimonios();

    // Initial animations for Hero elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBtn = document.querySelector('.hero .btn');

    if (heroTitle) {
        setTimeout(() => {
            if (heroTitle) heroTitle.classList.add('fade-in-up');
            if (heroSubtitle) heroSubtitle.classList.add('fade-in-up');
            if (heroBtn) heroBtn.classList.add('fade-in-up');
        }, 100);
    }

    // Intersection Observer for scroll animations (fade in effect)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Observers only once
            }
        });
    }, observerOptions);

    // Apply observer to service cards and section headers
    const animateElements = document.querySelectorAll('.service-card, .section-header, .authority-content, .video-container');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Page Transition Logic
    const transitionLinks = document.querySelectorAll('.transition-link');
    const transitionOverlay = document.querySelector('.page-transition');

    // Make sure overlay is hidden on load (fade in from previous page)
    if (transitionOverlay) {
        // A short timeout creates the "entering" effect if we navigated from another page
        transitionOverlay.classList.add('active');
        setTimeout(() => {
            transitionOverlay.classList.remove('active');
        }, 50);
    }

    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            if (link.getAttribute('target') === '_blank') return;

            // Handle internal anchors differently
            if (targetUrl.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetUrl);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // Close mobile menu if open
                    mainNav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
                return;
            }

            e.preventDefault();

            if (transitionOverlay) {
                transitionOverlay.classList.add('active');

                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500); 
            } else {
                window.location.href = targetUrl;
            }
        });
    });

    // Simple video interaction
    const video = document.querySelector('.design-video');
    const videoOverlay = document.querySelector('.video-overlay-play');

    if (video && videoOverlay) {
        video.addEventListener('play', () => {
            videoOverlay.style.opacity = '0';
        });
        video.addEventListener('pause', () => {
            videoOverlay.style.opacity = '1';
        });
    }

});
