// js/tour-details/image-handler.js - ULTIMATE FIXED VERSION
console.log('=== IMAGE HANDLER MODULE LOADED ===');

// Check if already loaded
if (window._imageHandlerLoaded) {
    console.log('⚠️ ImageHandler already loaded, skipping');
    throw new Error('ImageHandler already loaded - check script loading');
}
window._imageHandlerLoaded = true;

class ImageHandler {
    constructor() {
        console.log('✅ ImageHandler constructor called');
        
        // Store single instance
        if (window._imageHandlerInstance) {
            console.log('⚠️ Returning existing instance');
            return window._imageHandlerInstance;
        }
        
        this.currentImageIndex = 0;
        this.totalImages = 0;
        this.images = [];
        this.isZoomed = false;
        this.keydownHandler = null;
        
        // Mark as main instance
        window._imageHandlerInstance = this;
        window.imageHandler = this;
        
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
            this.setupAllEventListeners();
        } else {
            console.error('❌ No images found in tour data');
        }
    }

    renderGallery(images) {
        console.log('🎨 renderGallery called with', images.length, 'images');
        
        this.images = images;
        this.totalImages = images.length;
        
        // Set main image
        const mainImage = document.getElementById('main-image');
        if (mainImage && images[0]) {
            mainImage.src = images[0];
            console.log('✅ Set main image');
        }
        
        // Set side images
        const sideImage1 = document.getElementById('side-image-1');
        const sideImage2 = document.getElementById('side-image-2');
        
        if (sideImage1 && images[1]) {
            sideImage1.src = images[1];
            console.log('✅ Set side image 1');
        }
        if (sideImage2 && images[2]) {
            sideImage2.src = images[2];
            console.log('✅ Set side image 2');
        }
        
        // Update image count
        const imageCountElement = document.getElementById('image-count');
        if (imageCountElement) {
            imageCountElement.textContent = images.length > 3 ? 
                `+${images.length - 3} more` : 'View All';
        }
    }

    setupAllEventListeners() {
        console.log('🔧 Setting up ALL event listeners...');
        
        // Setup side images
        this.setupSideImageListeners();
        
        // Setup View All button
        this.setupViewAllButton();
        
        console.log('✅ All event listeners setup complete');
    }

    setupSideImageListeners() {
        console.log('🔧 Setting up side image listeners...');
        
        // Use event delegation for reliability
        document.addEventListener('click', (e) => {
            // Check if clicked on side image or its children
            const sideImage = e.target.closest('.side-image');
            if (!sideImage) return;
            
            // Find which side image was clicked
            const sideImages = document.querySelectorAll('.side-image');
            const index = Array.from(sideImages).indexOf(sideImage) + 1;
            
            console.log('🖱️ Side image clicked:', index);
            this.switchMainImage(index);
        });
    }

    setupViewAllButton() {
        console.log('🔧 Setting up View All button...');
        
        const viewAllIcon = document.querySelector('.image-icon');
        if (!viewAllIcon) {
            console.error('❌ View All icon not found');
            return;
        }
        
        // Remove ALL existing event listeners by replacing the element
        const newIcon = viewAllIcon.cloneNode(true);
        viewAllIcon.parentNode.replaceChild(newIcon, viewAllIcon);
        
        // Get fresh reference
        const freshIcon = document.querySelector('.image-icon');
        
        // Add SUPER SIMPLE click handler
        freshIcon.addEventListener('click', (e) => {
            console.log('🎯 View All button CLICKED - DIRECT HANDLER');
            e.preventDefault();
            e.stopPropagation();
            
            // Check if we have images
            console.log('   Total images:', this.totalImages);
            console.log('   Images array:', this.images);
            
            if (this.totalImages > 0) {
                console.log('   Opening gallery...');
                this.openGallery(0);
            } else {
                console.error('❌ No images to show!');
                alert('No images available');
            }
        });
        
        console.log('✅ View All button setup complete');
    }

    switchMainImage(index) {
        console.log('🔄 Switching main image with index:', index);
        
        const mainImage = document.getElementById('main-image');
        const sideImage1 = document.getElementById('side-image-1');
        const sideImage2 = document.getElementById('side-image-2');
        
        if (index === 1 && mainImage && sideImage1 && sideImage1.src) {
            // Swap images
            const temp = mainImage.src;
            mainImage.src = sideImage1.src;
            sideImage1.src = temp;
            console.log('✅ Switched with side image 1');
        } else if (index === 2 && mainImage && sideImage2 && sideImage2.src) {
            const temp = mainImage.src;
            mainImage.src = sideImage2.src;
            sideImage2.src = temp;
            console.log('✅ Switched with side image 2');
        } else {
            console.error('❌ Cannot switch images - elements or src missing');
        }
    }

    // ===== GALLERY FUNCTIONS =====
    openGallery(startIndex = 0) {
        console.log('🚪 OPENING GALLERY...');
        console.log('   Start index:', startIndex);
        console.log('   Total images:', this.totalImages);
        
        if (this.totalImages === 0) {
            console.error('❌ No images to show in gallery!');
            return;
        }
        
        this.currentImageIndex = startIndex;
        
        // Show modal
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal) {
            galleryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            console.log('✅ Gallery modal displayed');
        } else {
            console.error('❌ Gallery modal not found!');
            return;
        }
        
        // Setup gallery
        this.setupGallery();
        this.showCurrentImage();
        
        console.log('✅ Gallery opened successfully');
    }

    setupGallery() {
        console.log('🔧 Setting up gallery...');
        
        // Setup gallery buttons
        this.setupGalleryButtons();
        
        // Load thumbnails
        this.loadThumbnails();
        
        // Add keyboard listeners
        this.addKeyboardListeners();
    }

    setupGalleryButtons() {
        console.log('🔧 Setting up gallery buttons...');
        
        // Helper function to setup button
        const setupButton = (selector, callback, label) => {
            const btn = document.querySelector(selector);
            if (!btn) {
                console.error(`❌ ${label} button not found:`, selector);
                return;
            }
            
            // Clone to remove old listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // Add fresh listener
            document.querySelector(selector).addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🖱️ ${label} button clicked`);
                callback.call(this);
            });
            
            console.log(`✅ ${label} button setup`);
        };
        
        // Setup all gallery buttons
        setupButton('.lightbox-nav.prev', this.prevImage, 'Prev');
        setupButton('.lightbox-nav.next', this.nextImage, 'Next');
        setupButton('.close-gallery', this.closeGallery, 'Close');
        setupButton('.zoom-btn', this.toggleZoom, 'Zoom');
    }

    closeGallery() {
        console.log('🚪 CLOSING GALLERY...');
        
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            console.log('✅ Gallery closed');
        }
        
        this.removeKeyboardListeners();
        
        // Reset zoom
        this.isZoomed = false;
        const lightboxImage = document.getElementById('lightbox-image');
        if (lightboxImage) {
            lightboxImage.classList.remove('zoomed');
        }
    }

    nextImage() {
        console.log('⏭️ NEXT IMAGE called');
        
        if (this.totalImages <= 1) return;
        
        this.currentImageIndex = (this.currentImageIndex + 1) % this.totalImages;
        this.showCurrentImage();
    }

    prevImage() {
        console.log('⏮️ PREV IMAGE called');
        
        if (this.totalImages <= 1) return;
        
        this.currentImageIndex = (this.currentImageIndex - 1 + this.totalImages) % this.totalImages;
        this.showCurrentImage();
    }

    showCurrentImage() {
        console.log('🖼️ SHOWING CURRENT IMAGE', this.currentImageIndex);
        
        if (this.currentImageIndex >= 0 && this.currentImageIndex < this.totalImages) {
            const imageUrl = this.images[this.currentImageIndex];
            
            // Update lightbox image
            const lightboxImage = document.getElementById('lightbox-image');
            if (lightboxImage) {
                lightboxImage.classList.add('image-changing');
                lightboxImage.src = imageUrl;
                
                setTimeout(() => {
                    lightboxImage.classList.remove('image-changing');
                }, 300);
            }
            
            this.updateCounters();
            this.updateActiveThumbnail();
        }
    }

    loadThumbnails() {
        console.log('🖼️ LOADING THUMBNAILS...');
        const container = document.getElementById('gallery-thumbnails');
        
        if (!container) {
            console.error('❌ Thumbnails container not found');
            return;
        }
        
        // Clear and create thumbnails
        container.innerHTML = '';
        
        this.images.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = `thumbnail ${index === this.currentImageIndex ? 'active' : ''}`;
            
            const imgEl = document.createElement('img');
            imgEl.src = img;
            imgEl.alt = `Thumbnail ${index + 1}`;
            
            thumb.appendChild(imgEl);
            container.appendChild(thumb);
            
            // Add click listener
            thumb.addEventListener('click', () => {
                console.log('🖼️ Thumbnail clicked:', index);
                this.currentImageIndex = index;
                this.showCurrentImage();
            });
        });
        
        console.log(`✅ Created ${this.images.length} thumbnails`);
    }

    updateCounters() {
        const galleryCounter = document.getElementById('gallery-counter');
        const imageNumber = document.getElementById('image-number');
        
        if (galleryCounter) {
            galleryCounter.textContent = `${this.currentImageIndex + 1} / ${this.totalImages}`;
        }
        if (imageNumber) {
            imageNumber.textContent = `${this.currentImageIndex + 1} / ${this.totalImages}`;
        }
    }

    updateActiveThumbnail() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentImageIndex);
        });
    }

    toggleZoom() {
        console.log('🔍 TOGGLE ZOOM');
        const lightboxImage = document.getElementById('lightbox-image');
        if (lightboxImage) {
            this.isZoomed = !this.isZoomed;
            lightboxImage.classList.toggle('zoomed', this.isZoomed);
        }
    }

    addKeyboardListeners() {
        console.log('⌨️ Adding keyboard listeners');
        
        this.keydownHandler = (e) => {
            switch(e.key) {
                case 'Escape': this.closeGallery(); break;
                case 'ArrowLeft': this.prevImage(); break;
                case 'ArrowRight': this.nextImage(); break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.toggleZoom();
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keydownHandler);
    }

    removeKeyboardListeners() {
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }
    }
}

// ===== CREATE AND EXPORT INSTANCE =====
try {
    const imageHandler = new ImageHandler();
    console.log('🎯 ImageHandler instance ready');
    
    // Make globally available
    window.imageHandler = imageHandler;
    window._imageHandlerInstance = imageHandler;
    
    // Global functions for backward compatibility
    window.openGallery = (index = 0) => {
        console.log('🔗 Global openGallery called');
        if (imageHandler && typeof imageHandler.openGallery === 'function') {
            return imageHandler.openGallery(index);
        }
    };
    
} catch (error) {
    console.error('❌ Error creating ImageHandler:', error);
}

console.log('✅ ImageHandler module loaded successfully');

