// js/modules/utils/formatters.js
console.log('=== FORMATTERS UTILITY LOADED ===');

const Formatters = {
    /**
     * Format price from pricing array (gets last price)
     * @param {Object} item - Tour or package object
     * @param {boolean} withFromPrefix - Add "From " prefix for packages
     * @returns {string} Formatted price
     */
    formatPrice: function(item, withFromPrefix = false) {
        if (!item || !item.pricing || !Array.isArray(item.pricing) || item.pricing.length === 0) {
            return 'Price on request';
        }
        
        const lastPrice = item.pricing[item.pricing.length - 1];
        if (!lastPrice || !lastPrice.price) {
            return 'Price on request';
        }
        
        // Extract numeric value from price string
        const match = lastPrice.price.match(/\$?(\d+)/);
        if (!match) {
            return lastPrice.price;
        }
        
        const priceNumber = match[1];
        return withFromPrefix ? `From $${priceNumber}` : `$${priceNumber}`;
    },
    
    /**
     * Get first image URL from images array
     * @param {Object} item - Tour or package object
     * @returns {string} Image URL or empty string
     */
    getFirstImage: function(item) {
        if (!item || !item.images || !Array.isArray(item.images) || item.images.length === 0) {
            return '';
        }
        return item.images[0];
    },
    
    /**
     * Get duration or return default
     * @param {Object} item - Tour or package object
     * @param {string} defaultDuration - Default if no duration
     * @returns {string} Duration text
     */
    getDuration: function(item, defaultDuration = 'Full Day Tour') {
        return item.duration || defaultDuration;
    },
    
    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Safe HTML
     */
    escapeHtml: function(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * Format tour title (could add icons, truncation, etc.)
     * @param {string} title - Tour title
     * @returns {string} Formatted title
     */
    formatTitle: function(title) {
        return title || 'Tour';
    }
};

// Make available globally
window.Formatters = Formatters;
console.log('✅ Formatters utility ready');