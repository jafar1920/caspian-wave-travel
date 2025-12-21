// js/modules/components/tours-loader.js


const ToursLoader = {
    /**
     * Load and render tours in a container
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
            window.DomHelpers.showLoading(container, 'Loading tours...');
        } else {
            container.innerHTML = '<div style="text-align:center;padding:40px;">Loading tours...</div>';
        }
        
        try {
            // Load tours using DataLoader
            const tours = await window.DataLoader.loadTours(options.limit || 0);
            
            if (!tours || tours.length === 0) {
                this.showEmptyState(container);
                return true;
            }
            
            // Render tours
            this.renderTours(container, tours);
           
            return true;
            
        } catch (error) {
            console.error(`❌ Error loading tours:`, error);
            this.showErrorState(container, 'Failed to load tours');
            return false;
        }
    },
    
    /**
     * Render tours in container
     * @param {HTMLElement} container - Container element
     * @param {Array} tours - Array of tours
     */
    renderTours(container, tours) {
        let html = '';
        
        tours.forEach(tour => {
            // Use Formatters if available
            const imageUrl = window.Formatters ? 
                window.Formatters.getFirstImage(tour) : 
                (tour.images && tour.images.length > 0 ? tour.images[0] : '');
            
            const displayPrice = window.Formatters ? 
                window.Formatters.formatPrice(tour, false) : 
                'Price on request';
            
            const duration = window.Formatters ? 
                window.Formatters.getDuration(tour, 'Full Day Tour') : 
                (tour.duration || 'Full Day Tour');
            
            const title = window.Formatters ? 
                window.Formatters.formatTitle(tour.title) : 
                (tour.title || 'Tour');
            
            const escapedId = window.Formatters ? 
                window.Formatters.escapeHtml(tour.id) : 
                tour.id;
            
            // Build card HTML
            html += `
                <a href="tour-details.html?tour=${escapedId}" class="card-link">
                    <div class="card" style="background-image: url('${imageUrl}');">
                        <div class="card-overlay">
                            <h3>${title}</h3>
                            <div class="price">${displayPrice}</div>
                            <div class="duration">${duration}</div>
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
            window.DomHelpers.showEmpty(container, 'No tours available at the moment');
        } else {
            container.innerHTML = '<p style="text-align:center;padding:40px;color:#666;">No tours available</p>';
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
window.ToursLoader = ToursLoader;
