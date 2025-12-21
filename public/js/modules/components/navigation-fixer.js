console.log('=== NAVIGATION FIXER LOADED ===');

class NavigationFixer {
    static fixTourDetailsNavigation() {
        console.log('Checking navigation fixes...');
        
        if (!window.location.pathname.includes('tour-details.html')) {
            return;
        }
        
        console.log('On tour-details page, fixing navigation links...');
        
        let attempts = 0;
        const maxAttempts = 5;
        
        const tryFixLinks = () => {
            attempts++;
            let fixedCount = 0;
            
            // Fix original navbar links
            const originalLinks = document.querySelectorAll('nav .nav-link');
            originalLinks.forEach(link => {
                fixedCount += NavigationFixer.fixSingleLink(link);
            });
            
            // Fix mobile menu links
            const mobileMenu = document.querySelector('.mobile-menu-container');
            if (mobileMenu) {
                mobileMenu.querySelectorAll('.nav-link').forEach(link => {
                    fixedCount += NavigationFixer.fixSingleLink(link);
                });
            }
            
            if (fixedCount > 0) {
                console.log(`Fixed ${fixedCount} navigation links`);
            } else if (attempts < maxAttempts) {
                setTimeout(tryFixLinks, 300);
            }
        };
        
        setTimeout(tryFixLinks, 500);
    }

    static fixSingleLink(link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && !href.includes('index.html')) {
            const newHref = `index.html${href}`;
            link.setAttribute('href', newHref);
            
            // Add click handler as backup
            link.addEventListener('click', function(e) {
                if (window.location.pathname.includes('tour-details.html') && !href.includes('index.html')) {
                    e.preventDefault();
                    window.location.href = newHref;
                }
            });
            
            return 1;
        }
        return 0;
    }
}

// Export globally
window.NavigationFixer = NavigationFixer;