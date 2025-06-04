document.addEventListener('DOMContentLoaded', () => {
    // Page load animation
    document.body.classList.add('page-loaded');

    // Navigation link handling
    const mainNavMenu = document.getElementById('main-nav-menu');
    const navLinks = mainNavMenu.querySelectorAll('li a');
    const currentPath = window.location.pathname;
    let currentPageFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    if (currentPageFile === '' || currentPageFile.startsWith('index.html')) {
        currentPageFile = 'index.html';
    }

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        let linkFile = linkHref.substring(linkHref.lastIndexOf('/') + 1);
        if (linkFile === '' && (linkHref.endsWith('/') || linkHref === '.' || linkHref === './')) {
            linkFile = 'index.html';
        } else if (linkFile === '' && !linkHref.includes('/')) {
            linkFile = linkHref;
        }
        
        if (linkFile.startsWith(currentPageFile)) { // Use startsWith for index.html#section cases
            if (!linkHref.includes('#')) { // Only add active to non-hash links initially
                 link.classList.add('active');
            }
        } else {
            link.classList.remove('active');
        }

        if (linkHref.startsWith('#')) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    e.preventDefault();
                    const headerOffset = document.querySelector('header').offsetHeight;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    // Close mobile nav if open
                    if (mainNavMenu.classList.contains('nav-open')) {
                        mainNavMenu.classList.remove('nav-open');
                        navToggle.setAttribute('aria-expanded', 'false');
                        navToggle.textContent = '☰';
                    }
                }
            });
        }
    });

    // Update copyright year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Scroll spy for navigation (adapted for new structure)
    const sections = document.querySelectorAll('main > section[id]');
    if (sections.length > 0) {
        const headerHeight = document.querySelector('header').offsetHeight;
        
        const activateLinkOnScroll = () => {
            let currentSectionId = null;
            let anyLinkActivatedByScroll = false;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 70;
                const sectionBottom = sectionTop + section.offsetHeight;
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(navLink => {
                const navLinkHref = navLink.getAttribute('href');
                if (navLinkHref.includes('#')) { // Only manage scroll-spy for hash links
                    if (navLinkHref === `#${currentSectionId}`) {
                        navLink.classList.add('active');
                        anyLinkActivatedByScroll = true;
                    } else {
                        navLink.classList.remove('active');
                    }
                }
            });
            
            // If no hash link is active due to scrolling, ensure the main page link is active
            if (!anyLinkActivatedByScroll) {
                navLinks.forEach(nLink => {
                    const linkHref = nLink.getAttribute('href');
                    let linkFile = linkHref.substring(linkHref.lastIndexOf('/') + 1);
                     if (linkFile === '' && (linkHref.endsWith('/') || linkHref === '.' || linkHref === './')) {
                        linkFile = 'index.html';
                    } else if (linkFile === '' && !linkHref.includes('/')) {
                        linkFile = linkHref;
                    }

                    if (!linkHref.includes('#') && linkFile.startsWith(currentPageFile)) {
                        nLink.classList.add('active');
                    } else if (linkHref.includes('#')) { // Remove active from other hash links
                        nLink.classList.remove('active');
                    }
                });
            }
        };
        window.addEventListener('scroll', activateLinkOnScroll);
        activateLinkOnScroll(); // Initial call
    }


    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        darkModeToggle.textContent = '☀️'; // Sun icon for light mode
        darkModeToggle.setAttribute('aria-pressed', 'true');
    } else if (currentTheme === 'light') {
        document.body.classList.remove('dark-theme');
        darkModeToggle.textContent = '🌙'; // Moon icon for dark mode
        darkModeToggle.setAttribute('aria-pressed', 'false');
    } else if (prefersDarkScheme.matches) { // If no theme saved, respect OS preference
        document.body.classList.add('dark-theme');
        darkModeToggle.textContent = '☀️';
        darkModeToggle.setAttribute('aria-pressed', 'true');
    }


    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        let theme = 'light';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
            darkModeToggle.textContent = '☀️';
            darkModeToggle.setAttribute('aria-pressed', 'true');
        } else {
            darkModeToggle.textContent = '🌙';
            darkModeToggle.setAttribute('aria-pressed', 'false');
        }
        localStorage.setItem('theme', theme);
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle && mainNavMenu) {
        navToggle.addEventListener('click', () => {
            const isOpened = mainNavMenu.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpened.toString());
            if (isOpened) {
                navToggle.textContent = '×'; // Close icon
            } else {
                navToggle.textContent = '☰'; // Hamburger icon
            }
        });
    }
    
    // Click-to-Copy
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSelector = button.dataset.copyTarget;
            const targetElement = document.querySelector(targetSelector);
            const feedbackElement = button.nextElementSibling; // Assumes feedback span is right after

            if (targetElement && navigator.clipboard) {
                const textToCopy = targetElement.innerText || targetElement.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    if(feedbackElement) feedbackElement.textContent = 'Copied!';
                    button.setAttribute('aria-label', 'Copied ' + (targetSelector.toLowerCase().includes('email') ? 'email' : 'phone'));
                    setTimeout(() => {
                        if(feedbackElement) feedbackElement.textContent = '';
                        button.setAttribute('aria-label', 'Copy ' + (targetSelector.toLowerCase().includes('email') ? 'email address' : 'phone number'));
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    if(feedbackElement) feedbackElement.textContent = 'Failed!';
                     setTimeout(() => {
                        if(feedbackElement) feedbackElement.textContent = '';
                    }, 2000);
                });
            }
        });
    });
});
