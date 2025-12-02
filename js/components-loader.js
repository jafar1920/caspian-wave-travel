// components-loader.js - Fixed version for page-specific loading
class ComponentLoader {
   constructor() {
    console.log('=== COMPONENTS LOADER STARTED ===');
    console.log('Full URL:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    
    this.components = {};
    this.currentPage = this.getCurrentPage();
    
    // === ADDED: Cache for storing loaded components ===
    this.componentCache = new Map();
    
    console.log('Detected page:', this.currentPage);
    
    // === ADDED: Show loader immediately ===
    this.showLoader();
  }

  // === ADDED: Show loading indicator ===
  showLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.style.display = 'flex';
    }
  }

  // === ADDED: Hide loading indicator ===
  hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
      // Add fade-out class for smooth transition
      loader.classList.add('fade-out');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        loader.style.display = 'none';
        loader.classList.remove('fade-out');
      }, 300);
    }
  }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('tour-details.html')) {
            return 'tour-details';
        }
        return 'index';
    }

    // Load a single component
    async loadComponent(componentName) {
        // === ADDED: Check cache first ===
        if (this.componentCache.has(componentName)) {
            console.log(`Loading ${componentName} from cache`);
            const cachedHtml = this.componentCache.get(componentName);
            this.insertComponent(componentName, cachedHtml);
            return true;
        }
        
        try {
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            
            // === ADDED: Cache the HTML ===
            this.componentCache.set(componentName, html);
            
            this.components[componentName] = html;
            
            // Insert into the page ONLY if container exists
            this.insertComponent(componentName, html);
            
            return true;
        } catch (error) {
            console.error(`Failed to load ${componentName}:`, error);
            return false;
        }
    }

    // === ADDED: Helper method for inserting components ===
    insertComponent(componentName, html) {
        const container = document.getElementById(`${componentName}-container`);
        if (container) {
            container.innerHTML = html;
        }
    }

    // Load components based on current page
    async loadPageComponents() {
        if (this.currentPage === 'tour-details') {
            await this.loadTourDetailsComponents();
        } else {
            await this.loadMainPageComponents();
        }
        
        // === ADDED: Hide loader when all components are loaded ===
        this.hideLoader();
    }

    // Load only essential components for tour details page
    async loadTourDetailsComponents() {
        console.log('Loading tour details page components');
        const essentialComponents = ['nav', 'footer'];
        const loadPromises = essentialComponents.map(component => 
            this.loadComponent(component)
        );
        await Promise.all(loadPromises);
        
        // Initialize tour details after components are loaded
        this.initializeTourDetails();
    }

    // Load all components for main page
    async loadMainPageComponents() {
        console.log('Loading main page components');
        const components = [
            'nav', 'header', 'services', 'packages', 
            'carousel', 'about', 'contact', 'footer'
        ];

        const loadPromises = components.map(component => 
            this.loadComponent(component)
        );
        await Promise.all(loadPromises);
        this.onMainPageLoaded();
    }

    // Initialize tour details functionality
    initializeTourDetails() {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            if (typeof window.TourDetailsManager !== 'undefined') {
                const tourManager = new window.TourDetailsManager();
                tourManager.loadTourDetails();
            } else {
                console.error('TourDetailsManager not found - make sure tour-details.js is loaded');
            }
        }, 100);
    }

    // Called when main page components are loaded
    onMainPageLoaded() {
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
    loader.loadPageComponents();
});