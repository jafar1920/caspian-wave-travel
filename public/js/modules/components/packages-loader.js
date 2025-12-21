// js/modules/components/packages-loader.js


const PackagesLoader = {
    /**
     * Load and render packages in a container
     * @param {string} containerId - ID of the container element
     * @param {Object} options - Loading options
     * @returns {Promise<boolean>} Success status
     */
    async load(containerId, options = {}) {
       
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container #${containerId} not found`);
            return false;
        }
        
        // Show loading state
        if (window.DomHelpers) {
            window.DomHelpers.showLoading(container, 'Loading packages...');
        } else {
            container.innerHTML = '<div style="text-align:center;padding:40px;">Loading packages...</div>';
        }
        
        try {
            // Load packages using DataLoader
            const packages = await window.DataLoader.loadPackages(options.limit || 0);
            
            if (!packages || packages.length === 0) {
                this.showEmptyState(container);
                return true;
            }
            
            // Render packages
            this.renderPackages(container, packages);
           
            return true;
            
        } catch (error) {
            console.error(`❌ Error loading packages:`, error);
            this.showErrorState(container, 'Failed to load packages');
            return false;
        }
    },
    
    /**
     * Render packages in container
     * @param {HTMLElement} container - Container element
     * @param {Array} packages - Array of packages
     */
    renderPackages(container, packages) {
        let html = '';
        
        packages.forEach(pkg => {
            // Use Formatters if available
            const imageUrl = window.Formatters ? 
                window.Formatters.getFirstImage(pkg) : 
                (pkg.images && pkg.images.length > 0 ? pkg.images[0] : '');
            
            const displayPrice = window.Formatters ? 
                window.Formatters.formatPrice(pkg, true) : // true = add "From " prefix
                'Price on request';
            
            const duration = window.Formatters ? 
                window.Formatters.getDuration(pkg, 'Package') : 
                (pkg.duration || 'Package');
            
            const title = window.Formatters ? 
                window.Formatters.formatTitle(pkg.title) : 
                (pkg.title || 'Package');
            
            const escapedId = window.Formatters ? 
                window.Formatters.escapeHtml(pkg.id) : 
                pkg.id;
            
            // Build card HTML (with hotel-options for packages)
            html += `
                <a href="tour-details.html?tour=${escapedId}" class="card-link">
                    <div class="card" style="background-image: url('${imageUrl}');">
                        <div class="card-overlay">
                            <h3>${title}</h3>
                            <div class="price">${displayPrice}</div>
                            <div class="duration">${duration}</div>
                            <div class="hotel-options">All-Inclusive Package</div>
                        </div>
                    </div>
                </a>
            `;
        });
        
        container.innerHTML = html;
    },
    
    /**
     * Show empty state
     * @param {HTMLElement} container - Container element
     */
    showEmptyState(container) {
        if (window.DomHelpers) {
            window.DomHelpers.showEmpty(container, 'No packages available at the moment');
        } else {
            container.innerHTML = '<p style="text-align:center;padding:40px;color:#666;">No packages available</p>';
        }
    },
    
    /**
     * Show error state
     * @param {HTMLElement} container - Container element
     * @param {string} message - Error message
     */
    showErrorState(container, message) {
        if (window.DomHelpers) {
            window.DomHelpers.showError(container, message);
        } else {
            container.innerHTML = `<p style="text-align:center;padding:40px;color:#ff4444;">${message}</p>`;
        }
    }
};

// Make available globally
window.PackagesLoader = PackagesLoader;
