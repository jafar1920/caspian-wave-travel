// components-loader.js - Updated version for tour details page
class ComponentLoader {
    constructor() {
        this.components = {};
        this.isTourDetailsPage = window.location.pathname.includes('tour-details.html');
    }

    // Load a single component
    async loadComponent(componentName) {
        try {
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            this.components[componentName] = html;
            
            // Insert into the page
            const container = document.getElementById(`${componentName}-container`);
            if (container) {
                container.innerHTML = html;
            }
            
            return true;
        } catch (error) {
            console.error(`Failed to load ${componentName}:`, error);
            return false;
        }
    }

    // Load only essential components for tour details page
    async loadTourDetailsComponents() {
        const essentialComponents = ['nav', 'footer'];
        const loadPromises = essentialComponents.map(component => 
            this.loadComponent(component)
        );
        await Promise.all(loadPromises);
    }

    // Load all components for main page
    async loadMainPageComponents() {
        const components = [
            'nav', 'header', 'services', 'packages', 
            'carousel', 'about', 'contact', 'footer'
        ];

        const loadPromises = components.map(component => 
            this.loadComponent(component)
        );
        await Promise.all(loadPromises);
        this.onAllComponentsLoaded();
    }

    // Decide which components to load based on page
    async loadPageSpecificComponents() {
        if (this.isTourDetailsPage) {
            console.log('Loading tour details page components');
            await this.loadTourDetailsComponents();
            // Initialize tour details functionality
            this.initializeTourDetails();
        } else {
            console.log('Loading main page components');
            await this.loadMainPageComponents();
        }
    }

    // Initialize tour details page
    initializeTourDetails() {
        // Load tour details functionality
        if (typeof window.TourDetailsManager !== 'undefined') {
            const tourManager = new window.TourDetailsManager();
            tourManager.loadTourDetails();
        } else {
            console.log('TourDetailsManager not found');
        }
    }

    // Called when all main page components are loaded
    onAllComponentsLoaded() {
        this.initializeCarousel();
        this.initializeHeaderLoading();
    }

    // Initialize carousel functionality
    initializeCarousel() {
        setTimeout(() => {
            if (typeof initializeCarousel === 'function') {
                initializeCarousel();
            }
        }, 100);
    }

    // Initialize header image loading
    initializeHeaderLoading() {
        if (typeof enhanceHeaderLoading === 'function') {
            enhanceHeaderLoading();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const loader = new ComponentLoader();
    loader.loadPageSpecificComponents();
});