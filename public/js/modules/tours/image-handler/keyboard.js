

class ImageKeyboard {
    static keydownHandler = null;

    static addListeners(imageHandler) {
        
        
        this.keydownHandler = (e) => {
            switch(e.key) {
                case 'Escape': 
                    imageHandler.closeGallery(); 
                    break;
                case 'ArrowLeft': 
                    imageHandler.prevImage(); 
                    break;
                case 'ArrowRight': 
                    imageHandler.nextImage(); 
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    imageHandler.toggleZoom();
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keydownHandler);
    }

    static removeListeners() {
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }
    }
}

// Export globally
window.ImageKeyboard = ImageKeyboard;
