

class ImageGallery {
    static keydownHandler = null;
    
    static open(imageHandler, startIndex = 0) {
       
        
        if (imageHandler.totalImages === 0) {
            console.error('❌ No images to show in gallery!');
            alert('No images available to show in gallery');
            return;
        }
        
        imageHandler.currentImageIndex = startIndex;
        
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal) {
            galleryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            
            this.setupGallery(imageHandler);
            this.showCurrent(imageHandler);
            
            
        } else {
            console.error('❌ Gallery modal not found!');
        }
    }

    static setupGallery(imageHandler) {
        
        
        this.setupGalleryButtons(imageHandler);
        this.loadThumbnails(imageHandler);
        
        if (window.ImageKeyboard) {
            window.ImageKeyboard.addListeners(imageHandler);
        }
    }

    static setupGalleryButtons(imageHandler) {
        
        
        const setupButton = (selector, callback, label) => {
            const btn = document.querySelector(selector);
            if (!btn) {
                console.error(`❌ ${label} button not found:`, selector);
                return;
            }
            
            const newBtn = ImageDOM.cloneElement(btn);
            ImageDOM.replaceElement(btn, newBtn);
            
            const freshBtn = document.querySelector(selector);
            freshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                callback.call(imageHandler);
            });
            
            
        };
        
        setupButton('.lightbox-nav.prev', imageHandler.prevImage, 'Prev');
        setupButton('.lightbox-nav.next', imageHandler.nextImage, 'Next');
        setupButton('.close-gallery', imageHandler.closeGallery, 'Close');
        setupButton('.zoom-btn', imageHandler.toggleZoom, 'Zoom');
    }

    static close() {
        
        
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            
        }
        
        if (window.ImageKeyboard) {
            window.ImageKeyboard.removeListeners();
        }
        
        // Reset zoom
        const lightboxImage = document.getElementById('lightbox-image');
        if (lightboxImage) {
            lightboxImage.classList.remove('zoomed');
        }
    }

    static next(imageHandler) {
        
        
        if (imageHandler.totalImages <= 1) return;
        
        imageHandler.currentImageIndex = (imageHandler.currentImageIndex + 1) % imageHandler.totalImages;
        this.showCurrent(imageHandler);
    }

    static prev(imageHandler) {
        
        
        if (imageHandler.totalImages <= 1) return;
        
        imageHandler.currentImageIndex = (imageHandler.currentImageIndex - 1 + imageHandler.totalImages) % imageHandler.totalImages;
        this.showCurrent(imageHandler);
    }

    static showCurrent(imageHandler) {
        
        
        if (imageHandler.currentImageIndex >= 0 && imageHandler.currentImageIndex < imageHandler.totalImages) {
            const imageUrl = imageHandler.images[imageHandler.currentImageIndex];
            
            const lightboxImage = document.getElementById('lightbox-image');
            if (lightboxImage) {
                lightboxImage.src = imageUrl;
            }
            
            this.updateCounters(imageHandler);
            this.updateActiveThumbnail(imageHandler);
        }
    }

    static loadThumbnails(imageHandler) {
        
        const container = document.getElementById('gallery-thumbnails');
        
        if (!container) {
            console.error('❌ Thumbnails container not found');
            return;
        }
        
        container.innerHTML = '';
        
        imageHandler.images.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${index === imageHandler.currentImageIndex ? 'active' : ''}`;
            thumb.style.cursor = 'pointer';
            
            const imgEl = document.createElement('img');
            imgEl.src = img;
            imgEl.alt = `Thumbnail ${index + 1}`;
            
            thumb.appendChild(imgEl);
            container.appendChild(thumb);
            
            thumb.addEventListener('click', () => {
                
                imageHandler.currentImageIndex = index;
                this.showCurrent(imageHandler);
            });
        });
        
        
    }

    static updateCounters(imageHandler) {
        const galleryCounter = document.getElementById('gallery-counter');
        const imageNumber = document.getElementById('image-number');
        
        if (galleryCounter) {
            galleryCounter.textContent = `${imageHandler.currentImageIndex + 1} / ${imageHandler.totalImages}`;
        }
        if (imageNumber) {
            imageNumber.textContent = `${imageHandler.currentImageIndex + 1} / ${imageHandler.totalImages}`;
        }
    }

    static updateActiveThumbnail(imageHandler) {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === imageHandler.currentImageIndex);
        });
    }

    static toggleZoom(imageHandler) {
        
        const lightboxImage = document.getElementById('lightbox-image');
        if (lightboxImage) {
            imageHandler.isZoomed = !imageHandler.isZoomed;
            lightboxImage.classList.toggle('zoomed', imageHandler.isZoomed);
        }
    }
}

// Export globally
window.ImageGallery = ImageGallery;
