// js/pages/tour-details.js
console.log('=== TOUR DETAILS PAGE ENTRY POINT ===');

// Global gallery functions
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing tour loading...');
    
    if (typeof TourDetailsManager !== 'undefined') {
        const tourManager = new TourDetailsManager();
        tourManager.loadTourDetails();
    } else {
        console.error('TourDetailsManager not loaded!');
        document.getElementById('tour-content').innerHTML = `
            <div style="text-align: center; padding: 50px; color: #ff6b6b;">
                <h2>Error Loading Tour</h2>
                <p>Required JavaScript modules failed to load. Please refresh the page.</p>
                <a href="index.html" style="color: #0095da;">Return to Home</a>
            </div>
        `;
    }
});