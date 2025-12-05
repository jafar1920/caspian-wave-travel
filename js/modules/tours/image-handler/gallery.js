console.log('=== IMAGE GALLERY MANAGER LOADED ===');

class ImageGallery {
    static keydownHandler = null;
    
    static open(imageHandler, startIndex = 0) {
        console.log('🚪 OPENING GALLERY...');
        console.log('   Start index:', startIndex);
        console.log('   Total images:', imageHandler.totalImages);
        
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
            console.log('✅ Gallery modal displayed');
            
            this.setupGallery(imageHandler);
            this.showCurrent(imageHandler);
            
            console.log('✅ Gallery opened successfully');
        } else {
            console.error('❌ Gallery modal not found!');
        }
    }

    static setupGallery(imageHandler) {
        console.log('🔧 Setting up gallery...');
        
        this.setupGalleryButtons(imageHandler);
        this.loadThumbnails(imageHandler);
        
        if (window.ImageKeyboard) {
            window.ImageKeyboard.addListeners(imageHandler);
        }
    }

    static setupGalleryButtons(imageHandler) {
        console.log('🔧 Setting up gallery buttons...');
        
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
                console.log(`🖱️ ${label} button clicked`);
                callback.call(imageHandler);
            });
            
            console.log(`✅ ${label} button setup`);
        };
        
        setupButton('.lightbox-nav.prev', imageHandler.prevImage, 'Prev');
        setupButton('.lightbox-nav.next', imageHandler.nextImage, 'Next');
        setupButton('.close-gallery', imageHandler.closeGallery, 'Close');
        setupButton('.zoom-btn', imageHandler.toggleZoom, 'Zoom');
    }

    static close() {
        console.log('🚪 CLOSING GALLERY...');
        
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('✅ Gallery closed');
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
        console.log('⏭️ NEXT IMAGE called');
        
        if (imageHandler.totalImages <= 1) return;
        
        imageHandler.currentImageIndex = (imageHandler.currentImageIndex + 1) % imageHandler.totalImages;
        this.showCurrent(imageHandler);
    }

    static prev(imageHandler) {
        console.log('⏮️ PREV IMAGE called');
        
        if (imageHandler.totalImages <= 1) return;
        
        imageHandler.currentImageIndex = (imageHandler.currentImageIndex - 1 + imageHandler.totalImages) % imageHandler.totalImages;
        this.showCurrent(imageHandler);
    }

    static showCurrent(imageHandler) {
        console.log('🖼️ SHOWING CURRENT IMAGE', imageHandler.currentImageIndex);
        
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
        console.log('🖼️ LOADING THUMBNAILS...');
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
                console.log('🖼️ Thumbnail clicked:', index);
                imageHandler.currentImageIndex = index;
                this.showCurrent(imageHandler);
            });
        });
        
        console.log(`✅ Created ${imageHandler.images.length} thumbnails`);
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
        console.log('🔍 TOGGLE ZOOM');
        const lightboxImage = document.getElementById('lightbox-image');
        if (lightboxImage) {
            imageHandler.isZoomed = !imageHandler.isZoomed;
            lightboxImage.classList.toggle('zoomed', imageHandler.isZoomed);
        }
    }
}

// Export globally
window.ImageGallery = ImageGallery;
console.log('✅ ImageGallery manager loaded');