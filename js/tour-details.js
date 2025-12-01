// js/tour-details.js - MAIN ENTRY POINT
console.log('=== TOUR DETAILS MAIN ENTRY POINT ===');

// Load all modules in correct dependency order
try {
    // 1. First load the data (no dependencies)
    if (typeof tourData === 'undefined') {
        // If not loaded via HTML, load it dynamically
        console.log('Loading tour data module...');
        // In production, you would use module imports or ensure HTML loads this first
    }
    
    // Note: All other modules should be loaded via HTML script tags in this order:
    // 1. tour-data.js
    // 2. image-handler.js
    // 3. itinerary-handler.js
    // 4. tour-renderer.js
    // 5. tour-manager.js
    // 6. init.js
    
    console.log('All tour details modules loaded successfully');
    
} catch (error) {
    console.error('Error loading tour details modules:', error);
}