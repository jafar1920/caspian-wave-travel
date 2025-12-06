// js/modules/components/footer-loader.js
console.log('=== FOOTER LOADER COMPONENT LOADED ===');

const FooterLoader = {
    /**
     * Load and render dynamic footer content
     * @returns {Promise<boolean>} Success status
     */
    async load() {
        console.log('🎯 Loading dynamic footer content');
        
        try {
            // Load tours and packages for footer sections
            const [tours, packages] = await Promise.all([
                window.DataLoader.loadTours(5),  // First 5 tours
                window.DataLoader.loadPackages(3) // First 3 packages
            ]);
            
            // Update Popular Day Tours section
            this.updatePopularTours(tours);
            
            // Update Multi-Day Packages section
            this.updatePackages(packages);
            
            console.log('✅ Footer content loaded');
            return true;
            
        } catch (error) {
            console.error('❌ Error loading footer content:', error);
            this.showFallbackContent();
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
        
        // Add Hotels link (static, since it's not a package in Firebase)
       
        
        container.innerHTML = html;
    },
    
    /**
     * Show fallback content if loading fails
     */
   showFallbackContent() {
    const packagesContainer = document.getElementById('packages-list');
    if (packagesContainer) {
        packagesContainer.innerHTML = `
            <li>
                <span class="error-text">
                    Unable to load packages. Please check your connection.
                </span>
            </li>
        `;
    }
}
};

// Make available globally
window.FooterLoader = FooterLoader;
console.log('✅ Footer Loader ready');