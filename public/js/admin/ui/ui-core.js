// UI Core - Main initialization
const UICore = {
    init() {
        console.log('✅ UI Core initialized');
        
        // Initialize all UI modules
        this.initModules();
        
        // Initialize Dashboard if needed
        if (Dashboard && typeof Dashboard.init === 'function') {
            Dashboard.init();
        }
        
        // Initialize ImageUpload if available
        if (ImageUpload && typeof ImageUpload.init === 'function') {
            ImageUpload.init();
        }
        
        // Load tours if on tours tab
        if (Dashboard && Dashboard.tours && Dashboard.tours.length === 0) {
            setTimeout(() => {
                if (Dashboard && typeof Dashboard.loadTours === 'function') {
                    Dashboard.loadTours();
                }
            }, 1000);
        }
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanupObjectURLs();
        });
    },
    
    initModules() {
        // Initialize all UI modules
        if (UITabs) UITabs.init();
        if (UIForms) UIForms.init();
        if (UIModals) UIModals.init();
        if (UIImages) UIImages.init();
        if (UITourEditor) UITourEditor.init();
    },
    
    // Cleanup object URLs to prevent memory leaks
    cleanupObjectURLs() {
        if (window.objectURLs && window.objectURLs.length > 0) {
            console.log(`🗑️ Cleaning up ${window.objectURLs.length} object URLs`);
            window.objectURLs.forEach(url => {
                try {
                    URL.revokeObjectURL(url);
                } catch (e) {
                    // Silent fail
                }
            });
            window.objectURLs = [];
        }
    },
    
    // Global edit tour function
    editTour(tourId) {
        if (UITourEditor) {
            UITourEditor.editTour(tourId);
        }
    },
    
    // Global clear form function
    clearForm() {
        if (UIForms) {
            UIForms.clearForm();
        }
    }
};

window.UICore = UICore;