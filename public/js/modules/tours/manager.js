// js/modules/tours/manager.js


class TourDetailsManager {
    constructor() {
        
        
        // Create instances
        this.imageHandler = window.ImageHandler ? new window.ImageHandler() : null;
        this.itineraryHandler = window.ItineraryHandler ? new window.ItineraryHandler() : null;
        this.tourRenderer = window.TourRenderer ? new window.TourRenderer() : null;
        
       
    }

    getTourIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const tourId = urlParams.get('tour');
        
        return tourId;
    }

    loadTourDetails() {
        
        const tourId = this.getTourIdFromURL();
        
        if (!tourId) {
            this.showTourNotFound(tourId);
            return;
        }

        // Try Firebase first
        if (window.FirebaseTourService) {
           
            window.FirebaseTourService.getTour(tourId)
                .then(tour => {
                    if (tour) {
                        
                        this.renderTourDetails(tour);
                    } else {
                        
                        this.loadFromStaticData(tourId);
                    }
                })
                .catch(error => {
                    console.error('Firebase error:', error);
                    this.loadFromStaticData(tourId);
                });
        } else {
            
            this.loadFromStaticData(tourId);
        }
    }

    loadFromStaticData(tourId) {
        
        
        if (!window.tourData || !window.tourData[tourId]) {
            console.error('Tour not found in static data:', tourId);
            this.showTourNotFound(tourId);
            return;
        }
        
        const tour = window.tourData[tourId];
        
        this.renderTourDetails(tour);
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
       
        
        // Update page title
        if (this.tourRenderer) {
            this.tourRenderer.updateTourTitle(tour);
        }
        
        // Render images
        if (this.imageHandler) {
            this.imageHandler.renderGallery(tour.images);
        }
        
        // Render main content
        this.renderTourContent(tour);
    }

    renderTourContent(tour) {
        const tourContent = document.getElementById('tour-content');
        if (!tourContent) {
            console.error('tour-content element not found!');
            return;
        }
        
        // Use tourRenderer if available
        if (this.tourRenderer) {
            tourContent.innerHTML = this.tourRenderer.renderTourContent(tour);
        } else {
            // Fallback simple render
            tourContent.innerHTML = `
                <div class="tour-content">
                    <h1>${tour.title}</h1>
                    <p>${tour.description}</p>
                    <button onclick="window.location.href='https://wa.me/994775700711?text=${encodeURIComponent(tour.whatsappMessage)}'">
                        Book on WhatsApp
                    </button>
                </div>
            `;
        }
        
        // Add itinerary if it exists
        if (tour.itinerary && tour.itinerary.length > 0 && this.itineraryHandler) {
            const itineraryContainer = document.getElementById('itinerary-container');
            if (itineraryContainer) {
                itineraryContainer.innerHTML = this.itineraryHandler.renderItinerary(tour.itinerary);
                // Setup itinerary toggle functionality
                this.itineraryHandler.setupItineraryToggle();
            }
        }
        
        
    }
}

// Make TourDetailsManager globally available
window.TourDetailsManager = TourDetailsManager;