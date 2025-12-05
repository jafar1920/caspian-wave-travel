console.log('=== COMPONENT LOADER CORE LOADED ===');

class ComponentLoader {
    constructor() {
        console.log('ComponentLoader initialized');
        this.components = {};
        this.currentPage = this.getCurrentPage();
        this.componentCache = new Map();
        console.log('Detected page:', this.currentPage);
        this.showLoader();
    }

    showLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) loader.style.display = 'flex';
    }

    hideLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
                loader.classList.remove('fade-out');
            }, 300);
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        return path.includes('tour-details.html') ? 'tour-details' : 'index';
    }

    async loadComponent(componentName) {
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
            this.componentCache.set(componentName, html);
            this.components[componentName] = html;
            this.insertComponent(componentName, html);
            return true;
        } catch (error) {
            console.error(`Failed to load ${componentName}:`, error);
            return false;
        }
    }

    insertComponent(componentName, html) {
        const container = document.getElementById(`${componentName}-container`);
        if (container) container.innerHTML = html;
    }

    async loadComponents(componentList) {
        const loadPromises = componentList.map(component => 
            this.loadComponent(component)
        );
        await Promise.all(loadPromises);
    }
}

// Export globally
window.ComponentLoader = ComponentLoader;