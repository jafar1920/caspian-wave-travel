// js/tour-details/image-handler.js
console.log('=== IMAGE HANDLER MODULE LOADED ===');

class ImageHandler {
    constructor() {
        console.log('ImageHandler initialized');
    }

    renderGallery(images) {
        const mainImage = document.getElementById('main-image');
        const sideImage1 = document.getElementById('side-image-1');
        const sideImage2 = document.getElementById('side-image-2');
        const imageCountElement = document.querySelector('.image-count');
        
        console.log('Loading images:', images);

        // Set main image
        if (images.length > 0 && mainImage) {
            mainImage.src = images[0];
        }

        // Set side images
        if (images.length > 1 && sideImage1) {
            sideImage1.src = images[1];
            sideImage1.parentElement.style.display = 'block';
        } else if (sideImage1) {
            sideImage1.parentElement.style.display = 'none';
        }

        if (images.length > 2 && sideImage2) {
            sideImage2.src = images[2];
            sideImage2.parentElement.style.display = 'block';
        } else if (sideImage2) {
            sideImage2.parentElement.style.display = 'none';
        }

        // Update image count in the icon
        if (imageCountElement && images.length > 3) {
            imageCountElement.textContent = `+${images.length - 3} more`;
        } else if (imageCountElement && images.length <= 3) {
            imageCountElement.textContent = 'View All';
        }

        // Hide side images container if only one image
        const sideImagesContainer = document.querySelector('.side-images');
        if (images.length <= 1 && sideImagesContainer) {
            sideImagesContainer.style.display = 'none';
            document.querySelector('.main-image').style.flex = '1';
        } else if (sideImagesContainer) {
            sideImagesContainer.style.display = 'flex';
            document.querySelector('.main-image').style.flex = '3';
        }

        // Setup click events
        this.setupImageGrid();
    }

    setupImageGrid() {
        const mainImage = document.getElementById('main-image');
        const sideImage1 = document.getElementById('side-image-1');
        const sideImage2 = document.getElementById('side-image-2');
        
        // Simple click handlers for side images
        if (sideImage1 && sideImage1.src) {
            sideImage1.parentElement.onclick = () => {
                if (mainImage.src && sideImage1.src) {
                    const temp = mainImage.src;
                    mainImage.src = sideImage1.src;
                    sideImage1.src = temp;
                }
            };
        }
        
        if (sideImage2 && sideImage2.src) {
            sideImage2.parentElement.onclick = () => {
                if (mainImage.src && sideImage2.src) {
                    const temp = mainImage.src;
                    mainImage.src = sideImage2.src;
                    sideImage2.src = temp;
                }
            };
        }
        
        // Setup gallery modal functionality if gallery exists
        this.setupGalleryModal();
    }

    setupGalleryModal() {
        const galleryModal = document.getElementById('gallery-modal');
        const closeGalleryBtn = document.querySelector('.close-gallery');
        const galleryImagesContainer = document.getElementById('gallery-images');
        const galleryCounter = document.getElementById('gallery-counter');
        
        if (!galleryModal || !galleryImagesContainer) return;
        
        // Store current tour images for gallery
        const tourId = this.getTourIdFromURL();
        const tour = window.tourData[tourId];
        
        if (!tour || !tour.images) return;
        
        // Load gallery images
        galleryImagesContainer.innerHTML = tour.images.map((img, index) => `
            <div class="gallery-img" onclick="openFullImage(${index})">
                <img src="${img}" alt="Gallery image ${index + 1}">
            </div>
        `).join('');
        
        // Update gallery counter
        if (galleryCounter) {
            galleryCounter.textContent = `1 / ${tour.images.length}`;
        }
        
        // Setup close button
        if (closeGalleryBtn) {
            closeGalleryBtn.onclick = () => {
                galleryModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            };
        }
        
        // Close modal when clicking outside
        galleryModal.onclick = (e) => {
            if (e.target === galleryModal) {
                galleryModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };
        
        // Setup gallery navigation
        this.setupGalleryNavigation(tour.images);
    }

    setupGalleryNavigation(images) {
        let currentGalleryIndex = 0;
        const galleryCounter = document.getElementById('gallery-counter');
        const prevBtn = document.querySelector('.gallery-nav.prev');
        const nextBtn = document.querySelector('.gallery-nav.next');
        
        const updateGalleryCounter = () => {
            if (galleryCounter) {
                galleryCounter.textContent = `${currentGalleryIndex + 1} / ${images.length}`;
            }
        };
        
        if (prevBtn) {
            prevBtn.onclick = () => {
                if (currentGalleryIndex > 0) {
                    currentGalleryIndex--;
                    updateGalleryCounter();
                }
            };
        }
        
        if (nextBtn) {
            nextBtn.onclick = () => {
                if (currentGalleryIndex < images.length - 1) {
                    currentGalleryIndex++;
                    updateGalleryCounter();
                }
            };
        }
        
        // Global function for gallery image click
        window.openFullImage = (index) => {
            currentGalleryIndex = index;
            updateGalleryCounter();
            // You could implement a lightbox here if needed
            console.log('Opening full image at index:', index);
        };
    }

    // Helper method to get tour ID from URL
    getTourIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('tour');
    }
}

// Make ImageHandler globally available
window.ImageHandler = ImageHandler;