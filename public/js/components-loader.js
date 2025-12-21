console.log('=== COMPONENTS LOADER MAIN ENTRY ===');

// Import all modules (they're loaded via script tags in HTML)
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('Initializing component loader...');
        
        // Create main loader instance
        const loader = new ComponentLoader();
        
        // Initialize page
        await PageInitializer.initializePage(loader);
        
        // Initialize navbar
        NavbarManager.initialize();
        
        // Fix tour-details navigation
        NavigationFixer.fixTourDetailsNavigation();
        
        console.log('✅ All components initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing components:', error);
        
        // Hide loader on error
        const loaderElement = document.getElementById('page-loader');
        if (loaderElement) {
            loaderElement.style.display = 'none';
        }
    }
});