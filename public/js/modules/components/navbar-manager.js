

class NavbarManager {
    static initialize() {
       
        
        let attempts = 0;
        const maxAttempts = 5;
        
        const tryInitialize = () => {
            attempts++;
            
            const hamburger = document.querySelector('.nav-hamburger');
            const navLinks = document.querySelector('.nav-links');
            const socialIcons = document.querySelector('.social-icons');
            const navContainer = document.querySelector('nav');
            
            if (!hamburger || !navLinks || !socialIcons || !navContainer) {
                if (attempts < maxAttempts) {
                    setTimeout(tryInitialize, 200);
                } else {
                    console.error('Navbar elements not found');
                }
                return;
            }
            
            NavbarManager.createMobileMenu(navContainer, navLinks, socialIcons);
            NavbarManager.setupEventListeners(hamburger, navLinks, socialIcons);
           
        };
        
        setTimeout(tryInitialize, 100);
    }

    static createMobileMenu(navContainer, navLinks, socialIcons) {
        let mobileMenuContainer = document.querySelector('.mobile-menu-container');
        if (!mobileMenuContainer) {
            mobileMenuContainer = document.createElement('div');
            mobileMenuContainer.className = 'mobile-menu-container';
            
            // Scrollable nav links
            const mobileNavScroll = document.createElement('div');
            mobileNavScroll.className = 'mobile-nav-scroll';
            
            const mobileNavLinks = document.createElement('div');
            mobileNavLinks.className = 'nav-links';
            
            navLinks.querySelectorAll('a').forEach(link => {
                mobileNavLinks.appendChild(link.cloneNode(true));
            });
            
            mobileNavScroll.appendChild(mobileNavLinks);
            
            // Fixed social icons
            const mobileSocialFixed = document.createElement('div');
            mobileSocialFixed.className = 'mobile-social-fixed';
            
            const mobileSocialIcons = document.createElement('div');
            mobileSocialIcons.className = 'social-icons';
            
            socialIcons.querySelectorAll('a').forEach(icon => {
                mobileSocialIcons.appendChild(icon.cloneNode(true));
            });
            
            mobileSocialFixed.appendChild(mobileSocialIcons);
            
            mobileMenuContainer.appendChild(mobileNavScroll);
            mobileMenuContainer.appendChild(mobileSocialFixed);
            navContainer.parentNode.insertBefore(mobileMenuContainer, navContainer.nextSibling);
        }
        
        mobileMenuContainer.style.display = 'none';
    }

    static setupEventListeners(hamburger, navLinks, socialIcons) {
        const mobileMenuContainer = document.querySelector('.mobile-menu-container');
        
        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                hamburger.style.display = 'block';
                hamburger.style.order = '3';
                navLinks.style.display = 'none';
                socialIcons.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                socialIcons.style.display = 'flex';
                hamburger.style.display = 'none';
                mobileMenuContainer.classList.remove('active');
                mobileMenuContainer.style.display = 'none';
                document.body.style.overflow = '';
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        // Hamburger click
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (mobileMenuContainer.classList.contains('active')) {
                NavbarManager.closeMobileMenu(hamburger, mobileMenuContainer);
            } else {
                NavbarManager.openMobileMenu(hamburger, mobileMenuContainer);
            }
        });
        
        // Close menu on link click
        mobileMenuContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    NavbarManager.closeMobileMenu(hamburger, mobileMenuContainer);
                }
            });
        });
        
        // Close on click outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                mobileMenuContainer.classList.contains('active') && 
                !mobileMenuContainer.contains(e.target) && 
                !hamburger.contains(e.target)) {
                NavbarManager.closeMobileMenu(hamburger, mobileMenuContainer);
            }
        });
        
        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuContainer.classList.contains('active')) {
                NavbarManager.closeMobileMenu(hamburger, mobileMenuContainer);
            }
        });
    }

    static openMobileMenu(hamburger, mobileMenuContainer) {
        mobileMenuContainer.classList.add('active');
        mobileMenuContainer.style.display = 'flex';
        hamburger.innerHTML = '<i class="fas fa-times"></i>';
        document.body.style.overflow = 'hidden';
        mobileMenuContainer.querySelector('.mobile-nav-scroll').scrollTop = 0;
    }

    static closeMobileMenu(hamburger, mobileMenuContainer) {
        mobileMenuContainer.classList.remove('active');
        mobileMenuContainer.style.display = 'none';
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
    }
}

// Export globally
window.NavbarManager = NavbarManager;