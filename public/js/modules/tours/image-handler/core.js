

// Check if already loaded
if (window._imageHandlerLoaded) {
   
    throw new Error('ImageHandler already loaded - check script loading');
}
window._imageHandlerLoaded = true;

class ImageHandler {
    constructor() {
        
        
        this.currentImageIndex = 0;
        this.totalImages = 0;
        this.images = [];
        this.isZoomed = false;
        
       
    }

    // Initialize with tour data
    init(tour) {
        
        
        if (tour && tour.images) {
            this.images = tour.images;
            this.totalImages = tour.images.length;
           
            
            this.renderGallery(tour.images);
        } else {
            console.error('❌ No images found in tour data');
        }
    }

    renderGallery(images) {
       
        
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
