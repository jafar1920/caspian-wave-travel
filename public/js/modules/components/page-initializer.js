

class PageInitializer {
    static async initializePage(loader) {
        if (loader.currentPage === 'tour-details') {
            await PageInitializer.initializeTourDetailsPage(loader);
        } else {
            await PageInitializer.initializeMainPage(loader);
        }
        
        loader.hideLoader();
    }

    static async initializeTourDetailsPage(loader) {
       
        await loader.loadComponents(['nav', 'footer']);
        PageInitializer.initializeTourDetails();
    }

    static async initializeMainPage(loader) {
       
        const components = [
            'nav', 'header', 'services', 'packages', 
            'carousel', 'about', 'contact', 'footer'
        ];
        
        await loader.loadComponents(components);
        PageInitializer.onMainPageLoaded();
    }

    static initializeTourDetails() {
        setTimeout(() => {
            if (typeof window.TourDetailsManager !== 'undefined') {
                const tourManager = new window.TourDetailsManager();
                tourManager.loadTourDetails();
            } else {
                console.error('TourDetailsManager not found');
            }
        }, 100);
    }

    static onMainPageLoaded() {
        PageInitializer.initializeCarousel();
        PageInitializer.initializeHeaderLoading();
    }

    static initializeCarousel() {
        setTimeout(() => {
            if (typeof initializeCarousel === 'function') {
                initializeCarousel();
            }
        }, 100);
    }

    static initializeHeaderLoading() {
        if (typeof enhanceHeaderLoading === 'function') {
            enhanceHeaderLoading();
        }
    }
}

// Export globally
window.PageInitializer = PageInitializer;