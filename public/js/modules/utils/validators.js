// js/modules/utils/validators.js
console.log('=== VALIDATORS UTILITY LOADED ===');

const Validators = {
    /**
     * Validate tour/package data from Firebase
     * @param {Object} item - Data from Firebase
     * @returns {boolean} True if valid
     */
    isValidTour: function(item) {
        if (!item) return false;
        if (!item.id) return false;
        if (!item.title) return false;
        if (!item.isActive) return false;
        return true;
    },
    
    /**
     * Check if item has required fields for display
     * @param {Object} item - Tour or package
     * @returns {boolean} True if can be displayed
     */
    canDisplayItem: function(item) {
        if (!this.isValidTour(item)) return false;
        if (!item.images || !Array.isArray(item.images) || item.images.length === 0) {
            console.warn(`Tour ${item.id} has no images`);
        }
        return true;
    },
    
    /**
     * Validate and sanitize data array
     * @param {Array} data - Array of tours/packages
     * @returns {Array} Filtered and validated array
     */
    validateDataArray: function(data) {
        if (!data || !Array.isArray(data)) {
            console.error('Invalid data array:', data);
            return [];
        }
        
        return data.filter(item => this.canDisplayItem(item));
    }
};

// Make available globally
window.Validators = Validators;
console.log('✅ Validators utility ready');