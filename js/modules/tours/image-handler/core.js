console.log('=== IMAGE HANDLER CORE LOADED ===');

// Check if already loaded
if (window._imageHandlerLoaded) {
    console.log('⚠️ ImageHandler already loaded, skipping');
    throw new Error('ImageHandler already loaded - check script loading');
}
window._imageHandlerLoaded = true;

class ImageHandler {
    constructor() {
        console.log('✅ ImageHandler constructor called');
        
        this.currentImageIndex = 0;
        this.totalImages = 0;
        this.images = [];
        this.isZoomed = false;
        
        console.log('✅ ImageHandler instance created');
    }

    // Initialize with tour data
    init(tour) {
        console.log('🔄 ImageHandler init with tour:', tour?.title);
        
        if (tour && tour.images) {
            this.images = tour.images;
            this.totalImages = tour.images.length;
            console.log(`📸 Loaded ${this.totalImages} images`);
            
            this.renderGallery(tour.images);
        } else {
            console.error('❌ No images found in tour data');
        }
    }

    renderGallery(images) {
        console.log('🎨 renderGallery called with', images.length, 'images');
        
        this.images = images;
        this.totalImages = images.length;
        
        // Delegate to DOM Manager
        if (window.ImageDOM) {
            window.ImageDOM.setMainImage(images[0]);
            window.ImageDOM.setSideImages(images);
            window.ImageDOM.updateImageCount(images.length);
        }
        
        // Delegate to Event Manager
        setTimeout(() => {
            if (window.ImageEvents) {
                window.ImageEvents.setupAllClickHandlers(this);
            }
        }, 100);
    }

    // Switch images between main and side
    switchMainImage(index) {
        console.log('🔄 Switching main image with index:', index);
        
        if (window.ImageDOM) {
            window.ImageDOM.switchImages(index);
        }
    }

    // Gallery methods will be handled by GalleryManager
    openGallery(startIndex = 0) {
        if (window.ImageGallery) {
            window.ImageGallery.open(this, startIndex);
        }
    }

    closeGallery() {
        if (window.ImageGallery) {
            window.ImageGallery.close();
        }
    }

    nextImage() {
        if (window.ImageGallery) {
            window.ImageGallery.next(this);
        }
    }

    prevImage() {
        if (window.ImageGallery) {
            window.ImageGallery.prev(this);
        }
    }

    showCurrentImage() {
        if (window.ImageGallery) {
            window.ImageGallery.showCurrent(this);
        }
    }

    toggleZoom() {
        if (window.ImageGallery) {
            window.ImageGallery.toggleZoom(this);
        }
    }
}

// Export globally
window.ImageHandler = ImageHandler;
console.log('✅ ImageHandler core class loaded');