// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Sticky navigation
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if(window.scrollY > 100) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.padding = '15px 0';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const toggle = navbar.querySelector('.menu-toggle');
    const navList = navbar.querySelector('ul');
    if (!toggle || !navList) return;

    // Mark active page link
    const setActiveLink = () => {
        const raw = window.location.pathname.split('/').pop() || 'index.html';
        const page = raw.split('#')[0].split('?')[0] || 'index.html';
        navbar.querySelectorAll('a[href]').forEach(a => {
            const hrefRaw = a.getAttribute('href') || '';
            const target = hrefRaw.split('#')[0].split('?')[0] || '';
            a.classList.remove('active');
            a.removeAttribute('aria-current');
            // Treat empty href or './' as index.html
            const normalized = (target === '' || target === './') ? 'index.html' : target;
            if (normalized === page) {
                a.classList.add('active');
                a.setAttribute('aria-current', 'page');
            }
        });
    };
    setActiveLink();

    const closeMenu = () => {
        navbar.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    toggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('menu-open', isOpen);
    });

    // Close menu when a link is clicked
    navList.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMenu);
    });

    // Close button inside drawer
    const drawerClose = navbar.querySelector('.menu-close');
    if (drawerClose) drawerClose.addEventListener('click', closeMenu);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Click/ Tap outside (backdrop) to close
    document.addEventListener('pointerdown', (e) => {
        const isOpen = navbar.classList.contains('open');
        if (!isOpen) return;
        const clickedToggle = toggle.contains(e.target);
        const clickedMenu = navList.contains(e.target);
        if (!clickedToggle && !clickedMenu) {
            closeMenu();
        }
    });

    // Ensure state resets when resizing to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navbar.classList.contains('open')) {
            closeMenu();
        }
    });

    // Blog "Read more" toggles
    const blogPosts = document.querySelectorAll('.blog-post');
    blogPosts.forEach(post => {
        const readMore = post.querySelector('.read-more');
        if (!readMore) return;

        // All content paragraphs except the date
        const paragraphs = Array.from(post.querySelectorAll('p')).filter(p => !p.classList.contains('post-date'));

        // If there's only one paragraph, no need for a toggle
        if (paragraphs.length <= 1) {
            readMore.style.display = 'none';
            return;
        }

        // Hide everything after the first paragraph initially
        paragraphs.forEach((p, index) => {
            if (index > 0) p.classList.add('collapsed');
        });

        readMore.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = post.classList.toggle('expanded');

            if (isExpanded) {
                paragraphs.forEach(p => p.classList.remove('collapsed'));
                readMore.textContent = 'Show less';
            } else {
                paragraphs.forEach((p, index) => {
                    if (index > 0) {
                        p.classList.add('collapsed');
                    } else {
                        p.classList.remove('collapsed');
                    }
                });
                readMore.textContent = 'Read more';
            }
        });
    });

    // In case of client-side navigation patterns later, expose re-run
    window.__setNavbarActive = setActiveLink;
});