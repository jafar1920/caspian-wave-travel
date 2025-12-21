

class ImageEvents {
    static setupAllClickHandlers(imageHandler) {
      
        
        this.setupMainImageClick(imageHandler);
        this.setupSideImageClicks(imageHandler);
        this.setupViewAllButton(imageHandler);
        
        
    }

    static setupMainImageClick(imageHandler) {
        const mainImage = document.getElementById('main-image');
        if (mainImage) {
            const newMainImg = ImageDOM.cloneElement(mainImage);
            ImageDOM.replaceElement(mainImage, newMainImg);
            
            const freshMainImg = document.getElementById('main-image');
            freshMainImg.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
               
                imageHandler.openGallery(0);
            });
            
        }
    }

    static setupSideImageClicks(imageHandler) {
        // Side image 1
        const sideImage1Container = document.querySelector('.side-images .side-image:nth-child(1)');
        if (sideImage1Container) {
            this.setupContainerClick(sideImage1Container, imageHandler, 1);
        }
        
        // Side image 2
        const sideImage2Container = document.querySelector('.side-images .side-image:nth-child(2)');
        if (sideImage2Container) {
            this.setupContainerClick(sideImage2Container, imageHandler, 2);
        }
    }

    static setupContainerClick(container, imageHandler, index) {
        const newContainer = ImageDOM.cloneElement(container);
        ImageDOM.replaceElement(container, newContainer);
        
        const freshContainer = document.querySelector(`.side-images .side-image:nth-child(${index})`);
        freshContainer.style.cursor = 'pointer';
        
        // Add click to entire container
        freshContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            imageHandler.switchMainImage(index);
        });
        
        // Also add to image and overlay inside
        const img = freshContainer.querySelector('img');
        const overlay = freshContainer.querySelector('.image-overlay');
        
        if (img) {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                imageHandler.switchMainImage(index);
            });
        }
        
        if (overlay) {
            overlay.style.cursor = 'pointer';
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                imageHandler.switchMainImage(index);
            });
        }
        
       
    }

    static setupViewAllButton(imageHandler) {
        
        
        const viewAllButton = document.getElementById('view-all-button');
        if (viewAllButton) {
            const newButton = ImageDOM.cloneElement(viewAllButton);
            ImageDOM.replaceElement(viewAllButton, newButton);
            
            const freshButton = document.getElementById('view-all-button');
            freshButton.style.cursor = 'pointer';
            
            freshButton.addEventListener('click', (e) => {
               
                e.preventDefault();
                e.stopPropagation();
                
                if (imageHandler.totalImages > 0) {
                    
                    imageHandler.openGallery(0);
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
               
                imageHandler.openGallery(0);
            });
        }
        
       
    }
}

// Export globally
window.ImageEvents = ImageEvents;
