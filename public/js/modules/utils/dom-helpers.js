// js/modules/utils/dom-helpers.js


const DomHelpers = {
    /**
     * Show loading state in a container
     * @param {HTMLElement} container - DOM element to show loading in
     * @param {string} message - Loading message
     */
    showLoading: function(container, message = 'Loading...') {
        if (!container) return;
        container.innerHTML = `
            <div style="
                text-align: center; 
                padding: 40px; 
                grid-column: 1 / -1;
                color: #666;
                font-style: italic;
            ">
                ${message}
            </div>
        `;
    },
    
    /**
     * Show error state in a container
     * @param {HTMLElement} container - DOM element to show error in
     * @param {string} message - Error message
     * @param {boolean} showRetry - Show retry button
     */
    showError: function(container, message = 'Error loading content', showRetry = true) {
        if (!container) return;
        
        const retryButton = showRetry ? 
            `<button onclick="location.reload()" style="
                background: #0095da;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
                font-size: 14px;
            ">
                Retry
            </button>` : '';
        
        container.innerHTML = `
            <div style="
                text-align: center; 
                padding: 40px; 
                grid-column: 1 / -1;
                color: #ff4444;
            ">
                <p>${message}</p>
                ${retryButton}
            </div>
        `;
    },
    
    /**
     * Show empty state in a container
     * @param {HTMLElement} container - DOM element to show empty state in
     * @param {string} message - Empty state message
     */
    showEmpty: function(container, message = 'No content available') {
        if (!container) return;
        container.innerHTML = `
            <div style="
                text-align: center; 
                padding: 40px; 
                grid-column: 1 / -1;
                color: #666;
            ">
                <p>${message}</p>
            </div>
        `;
    },
    
    /**
     * Check if Firebase service is available
     * @param {string} methodName - Specific method to check (optional)
     * @returns {boolean} True if service is available
     */
    isFirebaseAvailable: function(methodName = null) {
        if (!window.FirebaseTourService) {
            console.error('FirebaseTourService not found');
            return false;
        }
        
        if (methodName && typeof window.FirebaseTourService[methodName] !== 'function') {
            console.error(`FirebaseTourService.${methodName} not found`);
            return false;
        }
        
        return true;
    },
    
    /**
     * Wait for an element to exist in DOM
     * @param {string} selector - CSS selector
     * @param {number} timeout - Max time to wait in ms
     * @returns {Promise<HTMLElement>} Element when found
     */
    waitForElement: function(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }
                
                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found after ${timeout}ms`));
                    return;
                }
                
                setTimeout(check, 100);
            };
            
            check();
        });
    }
};

// Make available globally
window.DomHelpers = DomHelpers;
