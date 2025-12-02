// components-loader.js - Complete version with scrollable navbar and tour-details navigation fix
class ComponentLoader {
    constructor() {
        console.log('=== COMPONENTS LOADER STARTED ===');
        console.log('Full URL:', window.location.href);
        console.log('Pathname:', window.location.pathname);
        
        this.components = {};
        this.currentPage = this.getCurrentPage();
        
        // Cache for storing loaded components
        this.componentCache = new Map();
        
        console.log('Detected page:', this.currentPage);
        
        // Show loader immediately
        this.showLoader();
    }

    // Show loading indicator
    showLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    }

    // Hide loading indicator
    hideLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            // Add fade-out class for smooth transition
            loader.classList.add('fade-out');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                loader.style.display = 'none';
                loader.classList.remove('fade-out');
            }, 300);
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('tour-details.html')) {
            return 'tour-details';
        }
        return 'index';
    }

    // Load a single component
    async loadComponent(componentName) {
        // Check cache first
        if (this.componentCache.has(componentName)) {
            console.log(`Loading ${componentName} from cache`);
            const cachedHtml = this.componentCache.get(componentName);
            this.insertComponent(componentName, cachedHtml);
            return true;
        }
        
        try {
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            
            // Cache the HTML
            this.componentCache.set(componentName, html);
            
            this.components[componentName] = html;
            
            // Insert into the page ONLY if container exists
            this.insertComponent(componentName, html);
            
            return true;
        } catch (error) {
            console.error(`Failed to load ${componentName}:`, error);
            return false;
        }
    }

    // Helper method for inserting components
    insertComponent(componentName, html) {
        const container = document.getElementById(`${componentName}-container`);
        if (container) {
            container.innerHTML = html;
        }
    }

    // Load components based on current page
    async loadPageComponents() {
        if (this.currentPage === 'tour-details') {
            await this.loadTourDetailsComponents();
        } else {
            await this.loadMainPageComponents();
        }
        
        // Hide loader when all components are loaded
        this.hideLoader();
        
        // Initialize navbar after components are loaded
        this.initializeNavbar();
        
        // Fix navigation for tour-details page
        this.fixTourDetailsNavigation();
    }

    // Load only essential components for tour details page
    async loadTourDetailsComponents() {
        console.log('Loading tour details page components');
        const essentialComponents = ['nav', 'footer'];
        const loadPromises = essentialComponents.map(component => 
            this.loadComponent(component)
        );
        await Promise.all(loadPromises);
        
        // Initialize tour details after components are loaded
        this.initializeTourDetails();
    }

    // Load all components for main page
    async loadMainPageComponents() {
        console.log('Loading main page components');
        const components = [
            'nav', 'header', 'services', 'packages', 
            'carousel', 'about', 'contact', 'footer'
        ];

        const loadPromises = components.map(component => 
            this.loadComponent(component)
        );
        await Promise.all(loadPromises);
        this.onMainPageLoaded();
    }

    // Initialize tour details functionality
    initializeTourDetails() {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            if (typeof window.TourDetailsManager !== 'undefined') {
                const tourManager = new window.TourDetailsManager();
                tourManager.loadTourDetails();
            } else {
                console.error('TourDetailsManager not found - make sure tour-details.js is loaded');
            }
        }, 100);
    }

    // Called when main page components are loaded
    onMainPageLoaded() {
        this.initializeCarousel();
        this.initializeHeaderLoading();
    }

    // Initialize carousel functionality
    initializeCarousel() {
        setTimeout(() => {
            if (typeof initializeCarousel === 'function') {
                initializeCarousel();
            }
        }, 100);
    }

    // Initialize header image loading
    initializeHeaderLoading() {
        if (typeof enhanceHeaderLoading === 'function') {
            enhanceHeaderLoading();
        }
    }

    // ===== FIX NAVIGATION FOR TOUR-DETAILS PAGE =====
    fixTourDetailsNavigation() {
        console.log('Checking navigation fixes...');
        
        // Check if we're on tour-details page
        const isTourDetailsPage = this.currentPage === 'tour-details';
        
        if (isTourDetailsPage) {
            console.log('On tour-details page, fixing navigation links...');
            
            // Try multiple times to ensure DOM is ready
            let attempts = 0;
            const maxAttempts = 5;
            
            const tryFixLinks = () => {
                attempts++;
                
                // Fix links in original navbar
                const originalLinks = document.querySelectorAll('nav .nav-link');
                let fixedCount = 0;
                
                originalLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#') && !href.includes('index.html')) {
                        const newHref = `index.html${href}`;
                        link.setAttribute('href', newHref);
                        fixedCount++;
                        console.log(`Fixed original nav link: ${href} -> ${newHref}`);
                    }
                });
                
                // Fix links in mobile menu (if it exists)
                const mobileMenu = document.querySelector('.mobile-menu-container');
                if (mobileMenu) {
                    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.startsWith('#') && !href.includes('index.html')) {
                            const newHref = `index.html${href}`;
                            link.setAttribute('href', newHref);
                            fixedCount++;
                            console.log(`Fixed mobile nav link: ${href} -> ${newHref}`);
                        }
                    });
                }
                
                if (fixedCount > 0) {
                    console.log(`Fixed ${fixedCount} navigation links for tour-details page`);
                } else if (attempts < maxAttempts) {
                    console.log(`No links found yet (attempt ${attempts}), trying again...`);
                    setTimeout(tryFixLinks, 300);
                }
            };
            
            // Start fixing links
            setTimeout(tryFixLinks, 500);
        }
    }

    // ===== NAVBAR INITIALIZATION WITH SCROLLABLE MENU =====
    initializeNavbar() {
        console.log('Initializing navbar with scrollable menu...');
        
        // Try multiple times with delay since DOM might not be ready yet
        let attempts = 0;
        const maxAttempts = 5;
        
        const tryInitialize = () => {
            attempts++;
            
            const hamburger = document.querySelector('.nav-hamburger');
            const navLinks = document.querySelector('.nav-links');
            const socialIcons = document.querySelector('.social-icons');
            const navContainer = document.querySelector('nav');
            
            if (!hamburger || !navLinks || !socialIcons || !navContainer) {
                console.log(`Navbar elements not found (attempt ${attempts}/${maxAttempts}), trying again...`);
                
                if (attempts < maxAttempts) {
                    setTimeout(tryInitialize, 200);
                } else {
                    console.error('Failed to find navbar elements after', maxAttempts, 'attempts');
                }
                return;
            }
            
            console.log('Navbar elements found! Creating scrollable menu...');
            
            // Create mobile menu container
            let mobileMenuContainer = document.querySelector('.mobile-menu-container');
            if (!mobileMenuContainer) {
                mobileMenuContainer = document.createElement('div');
                mobileMenuContainer.className = 'mobile-menu-container';
                
                // Create scrollable nav links area
                const mobileNavScroll = document.createElement('div');
                mobileNavScroll.className = 'mobile-nav-scroll';
                
                // Create a NEW nav-links div for mobile
                const mobileNavLinks = document.createElement('div');
                mobileNavLinks.className = 'nav-links';
                
                // Copy all the links from original nav
                const originalLinks = navLinks.querySelectorAll('a');
                originalLinks.forEach(link => {
                    const clonedLink = link.cloneNode(true);
                    mobileNavLinks.appendChild(clonedLink);
                });
                
                mobileNavScroll.appendChild(mobileNavLinks);
                
                // Create fixed social icons area
                const mobileSocialFixed = document.createElement('div');
                mobileSocialFixed.className = 'mobile-social-fixed';
                
                // Create a NEW social-icons div for mobile
                const mobileSocialIcons = document.createElement('div');
                mobileSocialIcons.className = 'social-icons';
                
                // Copy all social icons
                const originalSocialIcons = socialIcons.querySelectorAll('a');
                originalSocialIcons.forEach(icon => {
                    const clonedIcon = icon.cloneNode(true);
                    mobileSocialIcons.appendChild(clonedIcon);
                });
                
                mobileSocialFixed.appendChild(mobileSocialIcons);
                
                // Assemble mobile menu
                mobileMenuContainer.appendChild(mobileNavScroll);
                mobileMenuContainer.appendChild(mobileSocialFixed);
                
                // Insert after navbar
                navContainer.parentNode.insertBefore(mobileMenuContainer, navContainer.nextSibling);
                
                console.log('Mobile menu created with:', {
                    links: mobileNavLinks.children.length,
                    icons: mobileSocialIcons.children.length
                });
            }
            
            // Ensure mobile menu is hidden by default
            mobileMenuContainer.style.display = 'none';
            
            // Function to check mobile/desktop and adjust display
            const checkMobile = () => {
                if (window.innerWidth <= 768) {
                    // MOBILE: Show hamburger, hide nav/social by default
                    hamburger.style.display = 'block';
                    hamburger.style.order = '3';
                    
                    // Hide original nav and social on mobile
                    navLinks.style.display = 'none';
                    socialIcons.style.display = 'none';
                } else {
                    // DESKTOP: Show original nav/social, hide hamburger and mobile menu
                    navLinks.style.display = 'flex';
                    socialIcons.style.display = 'flex';
                    hamburger.style.display = 'none';
                    
                    // Hide mobile menu
                    mobileMenuContainer.classList.remove('active');
                    mobileMenuContainer.style.display = 'none';
                    document.body.style.overflow = '';
                }
            };
            
            // Initial check
            checkMobile();
            
            // Check on resize
            window.addEventListener('resize', checkMobile);
            
            // HAMBURGER CLICK HANDLER - Toggle scrollable mobile menu
            hamburger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (mobileMenuContainer.classList.contains('active')) {
                    // CLOSE MENU
                    mobileMenuContainer.classList.remove('active');
                    mobileMenuContainer.style.display = 'none';
                    this.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = '';
                } else {
                    // OPEN MENU
                    mobileMenuContainer.classList.add('active');
                    mobileMenuContainer.style.display = 'flex';
                    this.innerHTML = '<i class="fas fa-times"></i>';
                    document.body.style.overflow = 'hidden';
                    
                    // Scroll to top of menu
                    mobileMenuContainer.querySelector('.mobile-nav-scroll').scrollTop = 0;
                }
            });
            
            // Close menu when clicking links in mobile menu
            mobileMenuContainer.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    if (window.innerWidth <= 768) {
                        // Close mobile menu
                        mobileMenuContainer.classList.remove('active');
                        mobileMenuContainer.style.display = 'none';
                        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                        document.body.style.overflow = '';
                        
                        // Check if we need to handle navigation specially
                        if (href && href.startsWith('#') && window.location.pathname.includes('tour-details.html')) {
                            // On tour-details page, check if link is properly formatted
                            if (!href.includes('index.html')) {
                                e.preventDefault();
                                // Navigate to index.html with the hash
                                window.location.href = `index.html${href}`;
                            }
                            // If it already has index.html, let it navigate normally
                        }
                    }
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (window.innerWidth <= 768 && 
                    mobileMenuContainer.classList.contains('active') && 
                    !mobileMenuContainer.contains(e.target) && 
                    !hamburger.contains(e.target)) {
                    
                    mobileMenuContainer.classList.remove('active');
                    mobileMenuContainer.style.display = 'none';
                    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = '';
                }
            });
            
            // Close on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileMenuContainer.classList.contains('active')) {
                    mobileMenuContainer.classList.remove('active');
                    mobileMenuContainer.style.display = 'none';
                    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = '';
                }
            });
            
            console.log('Scrollable mobile menu initialization complete!');
        };
        
        // Start initialization with a small delay
        setTimeout(tryInitialize, 100);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const loader = new ComponentLoader();
    loader.loadPageComponents();
});