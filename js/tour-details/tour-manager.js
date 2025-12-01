// js/tour-details/tour-manager.js
console.log('=== TOUR MANAGER MODULE LOADED ===');

class TourDetailsManager {
    constructor() {
        console.log('TourDetailsManager initialized');
        this.imageHandler = new ImageHandler();
        this.itineraryHandler = new ItineraryHandler();
        this.tourRenderer = new TourRenderer();
    }

    getTourIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const tourId = urlParams.get('tour');
        console.log('URL Tour ID:', tourId);
        console.log('Available tours:', Object.keys(window.tourData || {}));
        return tourId;
    }

    loadTourDetails() {
        const tourId = this.getTourIdFromURL();
        console.log('Loading tour details for:', tourId);
        
        if (!tourId || !window.tourData || !window.tourData[tourId]) {
            this.showTourNotFound(tourId);
            return;
        }

        this.renderTourDetails(window.tourData[tourId]);
    }

    showTourNotFound(tourId) {
        const availableTours = window.tourData ? Object.keys(window.tourData).join(', ') : 'none';
        document.getElementById('tour-content').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Tour Not Found</h2>
                <p>Sorry, the tour "${tourId}" doesn't exist.</p>
                <p>Available tours: ${availableTours}</p>
                <a href="index.html" style="color: #0095da;">Return to Home</a>
            </div>
        `;
    }

    renderTourDetails(tour) {
        console.log('Rendering tour:', tour.title);
        
        // Update page title
        this.tourRenderer.updateTourTitle(tour);
        
        // Render images
        this.imageHandler.renderGallery(tour.images);
        
        // Render main content
        this.renderTourContent(tour);
    }

    renderTourContent(tour) {
        const tourContent = document.getElementById('tour-content');
        if (!tourContent) {
            console.error('tour-content element not found!');
            return;
        }
        
        // Render the main tour content
        tourContent.innerHTML = this.tourRenderer.renderTourContent(tour);
        
        // Add itinerary if it exists
        if (tour.itinerary && tour.itinerary.length > 0) {
            const itineraryContainer = document.getElementById('itinerary-container');
            if (itineraryContainer) {
                itineraryContainer.innerHTML = this.itineraryHandler.renderItinerary(tour.itinerary);
                // Setup itinerary toggle functionality
                this.itineraryHandler.setupItineraryToggle();
            }
        }
        
        console.log('Tour content rendered successfully');
    }
}

// Make TourDetailsManager globally available
window.TourDetailsManager = TourDetailsManager;