// js/modules/components/footer-loader.js - UPDATED VERSION


const FooterLoader = {
    /**
     * Load and render dynamic footer content
     * @returns {Promise<boolean>} Success status
     */
    async load() {
        
        
        try {
            // Verify DataLoader is ready
            if (!window.DataLoader || !window.DataLoader.loadTours) {
                throw new Error('DataLoader not available');
            }
            
            // Load tours and packages
            const [tours, packages] = await Promise.all([
                window.DataLoader.loadTours(5),
                window.DataLoader.loadPackages(3)
            ]);
            
            // Update sections
            this.updatePopularTours(tours);
            this.updatePackages(packages);
            
            
            return true;
            
        } catch (error) {
            console.error('❌ Error loading footer content:', error);
            
            // Show error message instead of hardcoded content
            this.showErrorMessage();
            return false;
        }
    },
    
    /**
     * Update Popular Day Tours section
     * @param {Array} tours - Array of tours
     */
    updatePopularTours(tours) {
        const container = document.getElementById('popular-tours-list');
        if (!container) {
            console.warn('Popular tours container not found');
            return;
        }
        
        if (!tours || tours.length === 0) {
            container.innerHTML = '<li><span class="loading-text">No tours available</span></li>';
            return;
        }
        
        let html = '';
        tours.forEach(tour => {
            const title = window.Formatters ? 
                window.Formatters.formatTitle(tour.title) : 
                tour.title;
            
            const escapedId = window.Formatters ? 
                window.Formatters.escapeHtml(tour.id) : 
                tour.id;
            
            html += `
                <li>
                    <a href="tour-details.html?tour=${escapedId}" class="footer-link">
                        ${title}
                    </a>
                </li>
            `;
        });
        
        container.innerHTML = html;
    },
    
    /**
     * Update Multi-Day Packages section
     * @param {Array} packages - Array of packages
     */
    updatePackages(packages) {
        const container = document.getElementById('packages-list');
        if (!container) {
            console.warn('Packages container not found');
            return;
        }
        
        if (!packages || packages.length === 0) {
            container.innerHTML = '<li><span class="loading-text">No packages available</span></li>';
            return;
        }
        
        let html = '';
        packages.forEach(pkg => {
            const title = window.Formatters ? 
                window.Formatters.formatTitle(pkg.title) : 
                pkg.title;
            
            const escapedId = window.Formatters ? 
                window.Formatters.escapeHtml(pkg.id) : 
                pkg.id;
            
            html += `
                <li>
                    <a href="tour-details.html?tour=${escapedId}" class="footer-link">
                        ${title}
                    </a>
                </li>
            `;
        });
        
        container.innerHTML = html;
    },
    
    /**
     * Show error message (NO HARCODED CONTENT)
     */
    showErrorMessage() {
        const toursContainer = document.getElementById('popular-tours-list');
        const packagesContainer = document.getElementById('packages-list');
        
        // Just show error messages - NO HARCODED CONTENT
        if (toursContainer) {
            toursContainer.innerHTML = `
                <li>
                    <span class="error-text">
                        Unable to load tours
                    </span>
                </li>
            `;
        }
        
        if (packagesContainer) {
            packagesContainer.innerHTML = `
                <li>
                    <span class="error-text">
                        Unable to load packages
                    </span>
                </li>
            `;
        }
    }
};

// Make available globally
window.FooterLoader = FooterLoader;
