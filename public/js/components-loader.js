

// Import all modules (they're loaded via script tags in HTML)
document.addEventListener('DOMContentLoaded', async function() {
    try {
       
        
        // Create main loader instance
        const loader = new ComponentLoader();
        
        // Initialize page
        await PageInitializer.initializePage(loader);
        
        // Initialize navbar
        NavbarManager.initialize();
        
        // Fix tour-details navigation
        NavigationFixer.fixTourDetailsNavigation();
        
        
        
    } catch (error) {
        console.error('❌ Error initializing components:', error);
        
        // Hide loader on error
        const loaderElement = document.getElementById('page-loader');
        if (loaderElement) {
            loaderElement.style.display = 'none';
        }
    }
});