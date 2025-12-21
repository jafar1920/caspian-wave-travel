// js/modules/components/favicon-manager.js
class FaviconManager {
    constructor() {
        this.faviconUrl = "https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/fav-icon.png?alt=media&token=08c9ab2a-3d3a-49e0-886f-2ce225e5d97e";
        this.initialized = false;
    }
    
    // Initialize the favicon (call this once)
    initialize() {
        if (this.initialized) {
            console.warn('⚠️ FaviconManager already initialized');
            return;
        }
        
        this.removeExistingFavicons();
        this.createFaviconLinks();
        this.initialized = true;
        
        console.log('✅ FaviconManager: Created 4 favicon links');
        console.log('🔗 URL:', this.faviconUrl);
    }
    
    // Remove any existing favicon links
    removeExistingFavicons() {
        const existingLinks = document.querySelectorAll(`
            link[rel="icon"],
            link[rel="shortcut icon"],
            link[rel="apple-touch-icon"]
        `);
        
        if (existingLinks.length > 0) {
            console.log(`🗑️ Removing ${existingLinks.length} existing favicon link(s)`);
            existingLinks.forEach(link => link.remove());
        }
    }
    
    // Create the 4 specific favicon links you requested
    createFaviconLinks() {
        const links = [
            // Line 1: image/x-icon
            this.createLinkElement({
                rel: 'icon',
                href: this.faviconUrl,
                type: 'image/x-icon'
            }),
            
            // Line 2: 32x32 PNG
            this.createLinkElement({
                rel: 'icon',
                href: this.faviconUrl,
                type: 'image/png',
                sizes: '32x32'
            }),
            
            // Line 3: 16x16 PNG
            this.createLinkElement({
                rel: 'icon',
                href: this.faviconUrl,
                type: 'image/png',
                sizes: '16x16'
            }),
            
            // Line 4: Apple touch icon
            this.createLinkElement({
                rel: 'apple-touch-icon',
                href: this.faviconUrl,
                sizes: '180x180'
            })
        ];
        
        // Append all links to head
        links.forEach(link => {
            if (link) document.head.appendChild(link);
        });
    }
    
    // Helper to create a link element
    createLinkElement(attributes) {
        try {
            const link = document.createElement('link');
            
            // Set all attributes
            for (const [key, value] of Object.entries(attributes)) {
                link.setAttribute(key, value);
            }
            
            return link;
        } catch (error) {
            console.error('❌ Error creating favicon link:', error);
            return null;
        }
    }
    
    // Update favicon URL dynamically
    updateFavicon(newUrl) {
        this.faviconUrl = newUrl;
        this.initialized = false; // Allow re-initialization
        this.initialize();
    }
}

// Create global instance for easy access
window.FaviconManager = new FaviconManager();

// Auto-initialize if script is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.FaviconManager.initialize();
});

// Also try to initialize immediately (for faster loading)
if (document.readyState === 'loading') {
    window.FaviconManager.initialize();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        window.FaviconManager.initialize();
    });
}