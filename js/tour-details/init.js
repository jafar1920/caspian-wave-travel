// js/tour-details/init.js
console.log('=== TOUR DETAILS INIT MODULE LOADED ===');

// Global functions for gallery modal
window.openGallery = function() {
    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal) {
        galleryModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
};

window.closeGallery = function() {
    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal) {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.prevImage = function() {
    const prevBtn = document.querySelector('.gallery-nav.prev');
    if (prevBtn) prevBtn.click();
};

window.nextImage = function() {
    const nextBtn = document.querySelector('.gallery-nav.next');
    if (nextBtn) nextBtn.click();
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing TourDetailsManager...');
    
    // Check if all required modules are loaded
    if (typeof TourDetailsManager !== 'undefined' && typeof window.tourData !== 'undefined') {
        const tourManager = new TourDetailsManager();
        tourManager.loadTourDetails();
    } else {
        console.error('Required modules not loaded!');
        console.log('TourDetailsManager available:', typeof TourDetailsManager !== 'undefined');
        console.log('tourData available:', typeof window.tourData !== 'undefined');
        
        // Fallback error message
        document.getElementById('tour-content').innerHTML = `
            <div style="text-align: center; padding: 50px; color: #ff6b6b;">
                <h2>Error Loading Tour</h2>
                <p>Required JavaScript modules failed to load. Please refresh the page.</p>
                <a href="index.html" style="color: #0095da;">Return to Home</a>
            </div>
        `;
    }
});