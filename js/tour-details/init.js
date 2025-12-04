// js/tour-details/init.js - UPDATED VERSION
console.log('=== TOUR DETAILS INIT MODULE LOADED ===');

// Global functions for gallery modal (unchanged)
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

// NEW: Async tour loading
async function loadTourAsync() {
    console.log('Loading tour with Firebase...');
    
    // Check if required modules are loaded
    if (typeof TourDetailsManager === 'undefined') {
        console.error('TourDetailsManager not loaded!');
        return;
    }
    
    const tourManager = new TourDetailsManager();
    const tourId = tourManager.getTourIdFromURL();
    
    if (!tourId) {
        tourManager.showTourNotFound(tourId);
        return;
    }
    
    // Try Firebase first
    if (window.FirebaseTourService && window.FirebaseTourService.initialized) {
        console.log('Using Firebase service...');
        const tour = await window.FirebaseTourService.getTour(tourId);
        
        if (tour) {
            tourManager.renderTourDetails(tour);
            return;
        }
    }
    
    // Fallback to static data
    console.log('Falling back to static data...');
    if (window.tourData && window.tourData[tourId]) {
        tourManager.renderTourDetails(window.tourData[tourId]);
    } else {
        tourManager.showTourNotFound(tourId);
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing tour loading...');
    loadTourAsync();
});