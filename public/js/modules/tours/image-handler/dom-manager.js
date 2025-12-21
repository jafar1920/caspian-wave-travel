

class ImageDOM {
    static setMainImage(imageUrl) {
        const mainImage = document.getElementById('main-image');
        if (mainImage && imageUrl) {
            mainImage.src = imageUrl;
            mainImage.style.cursor = 'pointer';
            
        }
    }

    static setSideImages(images) {
        
        
        // Side Image 1
        const sideImage1 = document.getElementById('side-image-1');
        if (sideImage1 && images[1]) {
            sideImage1.src = images[1];
            sideImage1.style.cursor = 'pointer';
            
        }
        
        // Side Image 2
        const sideImage2 = document.getElementById('side-image-2');
        if (sideImage2 && images[2]) {
            sideImage2.src = images[2];
            sideImage2.style.cursor = 'pointer';
            
        }
    }

    static updateImageCount(totalImages) {
        const imageCountElement = document.getElementById('image-count');
        if (imageCountElement) {
            imageCountElement.textContent = totalImages > 3 ? 
                `+${totalImages - 3} more` : 'View All';
        }
    }

    static switchImages(index) {
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
            
        } else if (index === 2 && sideImage2.src) {
            // Swap main image with side image 2
            tempSrc = mainImage.src;
            mainImage.src = sideImage2.src;
            sideImage2.src = tempSrc;
            
        } else {
            console.error('❌ Cannot switch images');
        }
    }

    static getElement(selector) {
        return document.querySelector(selector);
    }

    static cloneElement(element) {
        return element.cloneNode(true);
    }

    static replaceElement(oldElement, newElement) {
        if (oldElement && oldElement.parentNode) {
            oldElement.parentNode.replaceChild(newElement, oldElement);
        }
    }
}

// Export globally
window.ImageDOM = ImageDOM;
