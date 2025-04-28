document.addEventListener('DOMContentLoaded', () => {
    // Default language
    const defaultLang = 'mk';

    // Get current language from localStorage or default to 'mk'
    let currentLang = localStorage.getItem('language') || defaultLang;

    // Load translations
    fetch('translations.json')
        .then(response => response.json())
        .then(translations => {
            // Function to update navbar active state based on current page
            const updateNavbarActive = () => {
                const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === currentPath || (currentPath.startsWith('product-') && href === 'products.html')) {
                        link.classList.add('active');
                    }
                });
            };

            // Function to get nested translation value from a key (e.g., 'about_us.title')
            const getTranslation = (key, lang) => {
                return key.split('.').reduce((obj, k) => obj && obj[k], translations[lang]) || key;
            };

            // Function to update all elements with data-translate attributes
            const updateTranslatedElements = (lang) => {
                document.querySelectorAll('[data-translate]').forEach(element => {
                    const key = element.getAttribute('data-translate');
                    element.textContent = getTranslation(key, lang);
                });
            };

            // Update page content based on language
            const updateContent = (lang) => {
                // Update navbar text
                const navbar = translations[lang].navbar;
                document.querySelector('.navbar-brand').innerHTML = `<span class="prima">${navbar.brand.split(' ')[0]}</span><span class="concept">${navbar.brand.split(' ')[1]}</span>`;
                document.querySelector('.nav-link[href="index.html"]').textContent = navbar.home;
                document.querySelector('.nav-link[href="products.html"]').textContent = navbar.products;
                document.querySelector('.nav-link[href="gallery.html"]').textContent = navbar.gallery;
                document.querySelector('.nav-link[href="contact.html"]').textContent = navbar.contact;
                document.querySelector('.btn-search').textContent = navbar.request_quote;

                // Update carousel content (index page)
                if (document.querySelector('#homeCarousel')) {
                    const carousel = translations[lang].carousel;
                    document.querySelectorAll('.carousel-item').forEach((item, index) => {
                        const slide = carousel[`slide${index + 1}`];
                        item.querySelector('h1').textContent = slide.title;
                        item.querySelector('p').textContent = slide.subtitle;
                        item.querySelector('.btn-primary').textContent = slide.button;
                    });
                }

                // Update all elements with data-translate attributes
                updateTranslatedElements(lang);

                // Update HTML lang attribute
                document.documentElement.lang = lang;

                // Update navbar active state
                updateNavbarActive();

                // Trigger custom event for dynamic pages (products, product pages)
                document.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang, translations: translations[lang] } }));

                // Make sure content is visible after language is updated
                document.documentElement.style.visibility = 'visible';
            };

            // Initialize content with current language
            updateContent(currentLang);

            // Language switcher event
            document.querySelector('#languageSwitcher').addEventListener('change', (e) => {
                currentLang = e.target.value;
                localStorage.setItem('language', currentLang);
                updateContent(currentLang);
            });

            // Set language switcher to reflect current language
            document.querySelector('#languageSwitcher').value = currentLang;
        })
        .catch(error => {
            console.error('Error loading translations:', error);
            // Make content visible even if there's an error
            document.documentElement.style.visibility = 'visible';
        });
});
