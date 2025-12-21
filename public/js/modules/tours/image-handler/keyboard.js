console.log('=== IMAGE KEYBOARD MANAGER LOADED ===');

class ImageKeyboard {
    static keydownHandler = null;

    static addListeners(imageHandler) {
        console.log('⌨️ Adding keyboard listeners');
        
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
console.log('✅ ImageKeyboard manager loaded');