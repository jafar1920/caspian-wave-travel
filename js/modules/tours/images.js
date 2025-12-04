// js/modules/tours/images.js
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
        
        this.currentImageIndex = 0;
        this.totalImages = 0;
        this.images = [];
        this.isZoomed = false;
        this.keydownHandler = null;
        
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
        
        // ===== SET MAIN IMAGE WITH CLICK LISTENER =====
        const mainImage = document.getElementById('main-image');
        if (mainImage && images[0]) {
            mainImage.src = images[0];
            mainImage.style.cursor = 'pointer';
            console.log('✅ Main image source set');
        }
        
        // ===== SET SIDE IMAGES =====
        this.setupSideImages(images);
        
        // ===== SETUP VIEW ALL BUTTON =====
        this.setupViewAllButton();
        
        // Update image count
        const imageCountElement = document.getElementById('image-count');
        if (imageCountElement) {
            imageCountElement.textContent = images.length > 3 ? 
                `+${images.length - 3} more` : 'View All';
        }
        
        // Setup all click handlers - Wait a bit for DOM to be ready
        setTimeout(() => {
            this.setupClickHandlers();
        }, 100);
    }

    setupSideImages(images) {
        console.log('🔧 Setting up side images...');
        
        // Side Image 1
        const sideImage1 = document.getElementById('side-image-1');
        if (sideImage1 && images[1]) {
            sideImage1.src = images[1];
            sideImage1.style.cursor = 'pointer';
            console.log('✅ Side image 1 source set');
        }
        
        // Side Image 2
        const sideImage2 = document.getElementById('side-image-2');
        if (sideImage2 && images[2]) {
            sideImage2.src = images[2];
            sideImage2.style.cursor = 'pointer';
            console.log('✅ Side image 2 source set');
        }
    }

    setupClickHandlers() {
        console.log('🔗 Setting up all click handlers...');
        
        // ===== MAIN IMAGE CLICK =====
        const mainImage = document.getElementById('main-image');
        if (mainImage) {
            // Remove any existing listeners first
            const newMainImg = mainImage.cloneNode(true);
            mainImage.parentNode.replaceChild(newMainImg, mainImage);
            
            // Get fresh reference
            const freshMainImg = document.getElementById('main-image');
            freshMainImg.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Main image clicked');
                this.openGallery(0);
            });
            console.log('✅ Main image click handler added');
        }
        
        // ===== SIDE IMAGE 1 AND ITS OVERLAY =====
        const sideImage1Container = document.querySelector('.side-images .side-image:nth-child(1)');
        const sideImage1 = document.getElementById('side-image-1');
        
        if (sideImage1Container && sideImage1) {
            // Clone to remove old listeners
            const newContainer1 = sideImage1Container.cloneNode(true);
            sideImage1Container.parentNode.replaceChild(newContainer1, sideImage1Container);
            
            // Get fresh references
            const freshContainer1 = document.querySelector('.side-images .side-image:nth-child(1)');
            const freshSideImage1 = freshContainer1.querySelector('img');
            const freshOverlay1 = freshContainer1.querySelector('.image-overlay');
            
            // Add click handler to the ENTIRE container
            freshContainer1.style.cursor = 'pointer';
            freshContainer1.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Side image 1 container clicked');
                this.switchMainImage(1);
            });
            
            // Also add to the image itself
            if (freshSideImage1) {
                freshSideImage1.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Side image 1 clicked');
                    this.switchMainImage(1);
                });
            }
            
            // And to the overlay
            if (freshOverlay1) {
                freshOverlay1.style.cursor = 'pointer';
                freshOverlay1.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Side image 1 OVERLAY clicked');
                    this.switchMainImage(1);
                });
            }
            
            console.log('✅ Side image 1, container and overlay handlers added');
        }
        
        // ===== SIDE IMAGE 2 AND ITS OVERLAY =====
        const sideImage2Container = document.querySelector('.side-images .side-image:nth-child(2)');
        const sideImage2 = document.getElementById('side-image-2');
        
        if (sideImage2Container && sideImage2) {
            // Clone to remove old listeners
            const newContainer2 = sideImage2Container.cloneNode(true);
            sideImage2Container.parentNode.replaceChild(newContainer2, sideImage2Container);
            
            // Get fresh references
            const freshContainer2 = document.querySelector('.side-images .side-image:nth-child(2)');
            const freshSideImage2 = freshContainer2.querySelector('img');
            const freshOverlay2 = freshContainer2.querySelector('.image-overlay');
            
            // Add click handler to the ENTIRE container
            freshContainer2.style.cursor = 'pointer';
            freshContainer2.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Side image 2 container clicked');
                this.switchMainImage(2);
            });
            
            // Also add to the image itself
            if (freshSideImage2) {
                freshSideImage2.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Side image 2 clicked');
                    this.switchMainImage(2);
                });
            }
            
            // And to the overlay
            if (freshOverlay2) {
                freshOverlay2.style.cursor = 'pointer';
                freshOverlay2.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Side image 2 OVERLAY clicked');
                    this.switchMainImage(2);
                });
            }
            
            console.log('✅ Side image 2, container and overlay handlers added');
        }
        
        console.log('✅ All click handlers setup complete');
    }

    setupAllEventListeners() {
        console.log('🔧 Setting up ALL event listeners...');
        this.setupViewAllButton();
    }

    setupViewAllButton() {
        console.log('🔧 Setting up View All button...');
        
        const viewAllButton = document.getElementById('view-all-button');
        if (viewAllButton) {
            // Clone to remove old listeners
            const newButton = viewAllButton.cloneNode(true);
            viewAllButton.parentNode.replaceChild(newButton, viewAllButton);
            
            // Get fresh reference
            const freshButton = document.getElementById('view-all-button');
            freshButton.style.cursor = 'pointer';
            
            freshButton.addEventListener('click', (e) => {
                console.log('🎯 View All clicked');
                e.preventDefault();
                e.stopPropagation();
                
                if (this.totalImages > 0) {
                    console.log('   Opening gallery...');
                    this.openGallery(0);
                } else {
                    console.error('❌ No images to show!');
                    alert('No images available');
                }
            });
        }
        
        // Also make image count text clickable
        const imageCountElement = document.getElementById('image-count');
        if (imageCountElement) {
            imageCountElement.style.cursor = 'pointer';
            imageCountElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('📝 Image count text clicked');
                this.openGallery(0);
            });
        }
        
        console.log('✅ View All button setup complete');
    }

    switchMainImage(index) {
        console.log('🔄 Switching main image with index:', index);
        
        const mainImage = document.getElementById('main-image');
        const sideImage1 = document.getElementById('side-image-1');
        const sideImage2 = document.getElementById('side-image-2');
        
        if (!mainImage || !sideImage1 || !sideImage2) {
            console.error('❌ Image elements not found');
            return;
        }
        
        let tempSrc;
        
        if (index === 1 && sideImage1.src) {
            // Swap main image with side image 1
            tempSrc = mainImage.src;
            mainImage.src = sideImage1.src;
            sideImage1.src = tempSrc;
            console.log('✅ Switched with side image 1');
        } else if (index === 2 && sideImage2.src) {
            // Swap main image with side image 2
            tempSrc = mainImage.src;
            mainImage.src = sideImage2.src;
            sideImage2.src = tempSrc;
            console.log('✅ Switched with side image 2');
        } else {
            console.error('❌ Cannot switch images');
        }
    }

    // ===== GALLERY FUNCTIONS =====
    openGallery(startIndex = 0) {
        console.log('🚪 OPENING GALLERY...');
        console.log('   Start index:', startIndex);
        console.log('   Total images:', this.totalImages);
        
        if (this.totalImages === 0) {
            console.error('❌ No images to show in gallery!');
            alert('No images available to show in gallery');
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
            
            // Remove existing listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // Add fresh listener
            const freshBtn = document.querySelector(selector);
            freshBtn.addEventListener('click', (e) => {
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
                lightboxImage.src = imageUrl;
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
            thumb.style.cursor = 'pointer';
            
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

// MAKE THE CLASS AVAILABLE GLOBALLY
window.ImageHandler = ImageHandler;

console.log('✅ ImageHandler class loaded');