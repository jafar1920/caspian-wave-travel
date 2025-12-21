// js/modules/data/data-loader.js
console.log('=== DATA LOADER MODULE LOADED ===');

const DataLoader = {
    /**
     * Load tours from Firebase
     * @param {number} limit - Maximum number of tours to load (0 for all)
     * @param {string} sortBy - Field to sort by
     * @returns {Promise<Array>} Array of tours
     */
    async loadTours(limit = 0, sortBy = 'createdAt') {
        console.log('🔄 Loading tours from Firebase...');
        
        if (!window.DomHelpers || !window.DomHelpers.isFirebaseAvailable('getAllTours')) {
            throw new Error('Firebase service not available');
        }
        
        try {
            const tours = await window.FirebaseTourService.getAllTours();
            
            if (!tours || !Array.isArray(tours)) {
                console.warn('No tours returned from Firebase');
                return [];
            }
            
            // Validate and filter tours
            const validTours = window.Validators ? 
                window.Validators.validateDataArray(tours) : 
                tours.filter(t => t && t.isActive);
            
            // Sort tours (newest first by default)
            const sortedTours = this.sortTours(validTours, sortBy);
            
            // Apply limit if specified
            const finalTours = limit > 0 ? sortedTours.slice(0, limit) : sortedTours;
            
            console.log(`✅ Loaded ${finalTours.length} tours`);
            return finalTours;
            
        } catch (error) {
            console.error('❌ Error loading tours:', error);
            throw error;
        }
    },
    
    /**
     * Load packages from Firebase
     * @param {number} limit - Maximum number of packages to load (0 for all)
     * @param {string} sortBy - Field to sort by
     * @returns {Promise<Array>} Array of packages
     */
    async loadPackages(limit = 0, sortBy = 'createdAt') {
        console.log('🔄 Loading packages from Firebase...');
        
        if (!window.DomHelpers || !window.DomHelpers.isFirebaseAvailable('getAllPackages')) {
            throw new Error('Firebase service not available');
        }
        
        try {
            const packages = await window.FirebaseTourService.getAllPackages();
            
            if (!packages || !Array.isArray(packages)) {
                console.warn('No packages returned from Firebase');
                return [];
            }
            
            // Validate and filter packages
            const validPackages = window.Validators ? 
                window.Validators.validateDataArray(packages) : 
                packages.filter(p => p && p.isActive);
            
            // Sort packages
            const sortedPackages = this.sortTours(validPackages, sortBy);
            
            // Apply limit if specified
            const finalPackages = limit > 0 ? sortedPackages.slice(0, limit) : sortedPackages;
            
            console.log(`✅ Loaded ${finalPackages.length} packages`);
            return finalPackages;
            
        } catch (error) {
            console.error('❌ Error loading packages:', error);
            throw error;
        }
    },
    
    /**
     * Sort tours/packages array
     * @param {Array} items - Array to sort
     * @param {string} sortBy - Field to sort by
     * @returns {Array} Sorted array
     */
    sortTours(items, sortBy = 'createdAt') {
        if (!items || !Array.isArray(items)) return [];
        
        return [...items].sort((a, b) => {
            // Default: newest first (descending)
            if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
                const timeA = new Date(a[sortBy] || 0).getTime();
                const timeB = new Date(b[sortBy] || 0).getTime();
                return timeB - timeA; // Newest first
            }
            
            // Sort by title (alphabetical)
            if (sortBy === 'title') {
                return (a.title || '').localeCompare(b.title || '');
            }
            
            // Sort by price (cheapest first)
            if (sortBy === 'price') {
                const priceA = this.extractPriceValue(a);
                const priceB = this.extractPriceValue(b);
                return priceA - priceB;
            }
            
            return 0;
        });
    },
    
    /**
     * Extract numeric price value from tour/package
     * @param {Object} item - Tour or package
     * @returns {number} Numeric price value
     */
    extractPriceValue(item) {
        if (!item.pricing || item.pricing.length === 0) return Infinity;
        
        const lastPrice = item.pricing[item.pricing.length - 1];
        if (!lastPrice || !lastPrice.price) return Infinity;
        
        const match = lastPrice.price.match(/\$?(\d+)/);
        return match ? parseInt(match[1], 10) : Infinity;
    },
    
    /**
     * Get a single tour by ID
     * @param {string} tourId - Tour ID
     * @returns {Promise<Object|null>} Tour object or null
     */
    async getTourById(tourId) {
        if (!window.DomHelpers || !window.DomHelpers.isFirebaseAvailable('getTour')) {
            throw new Error('Firebase service not available');
        }
        
        try {
            const tour = await window.FirebaseTourService.getTour(tourId);
            return tour || null;
        } catch (error) {
            console.error(`❌ Error loading tour ${tourId}:`, error);
            return null;
        }
    }
};

// Make available globally
window.DataLoader = DataLoader;
console.log('✅ Data Loader ready');