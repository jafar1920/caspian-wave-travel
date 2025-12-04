// js/modules/tours/renderer.js
console.log('=== TOUR RENDERER MODULE LOADED ===');

class TourRenderer {
    constructor() {
        console.log('TourRenderer initialized');
    }

    renderTourContent(tour) {
        const tourContent = document.getElementById('tour-content');
        if (!tourContent) {
            console.error('tour-content element not found!');
            return '';
        }
        
        const includedList = tour.included.map(item => 
            `<li><i class="fas fa-check"></i> ${item}</li>`
        ).join('');

        const excludedList = tour.excluded.map(item => 
            `<li><i class="fas fa-times"></i> ${item}</li>`
        ).join('');

        const pricingOptions = tour.pricing.map(option => `
            <div class="price-option">
                <h4>${option.persons}</h4>
                <div class="price-amount">${option.price}</div>
                <p>${option.description}</p>
            </div>
        `).join('');

        // Itinerary will be added separately by the main manager
        return `
            <div class="tour-content">
                <div class="tour-info">
                    <h1>${tour.title}</h1>
                    <p class="tour-description">${tour.description}</p>
                    
                    <!-- Itinerary will be inserted here -->
                    <div id="itinerary-container"></div>
                    
                    <div class="details-grid">
                        <div class="included-section">
                            <h3><i class="fas fa-check-circle"></i> What's Included</h3>
                            <ul>${includedList}</ul>
                        </div>
                        <div class="excluded-section">
                            <h3><i class="fas fa-times-circle"></i> Not Included</h3>
                            <ul>${excludedList}</ul>
                        </div>
                    </div>
                </div>
                <div class="pricing-card">
                    <h3>Book This ${tour.title.includes('Package') ? 'Package' : 'Tour'}</h3>
                    ${pricingOptions}
                    <button class="book-now-btn" onclick="window.location.href='https://wa.me/994775700711?text=${encodeURIComponent(tour.whatsappMessage)}'">
                        <i class="fab fa-whatsapp"></i> Book on WhatsApp
                    </button>
                    <div style="text-align: center; margin-top: 15px; color: #666; font-size: 0.9rem;">
                        <p><i class="fas fa-clock"></i> Duration: ${tour.duration}</p>
                        <p><i class="fas fa-users"></i> Group Size: ${tour.groupSize}</p>
                        <p><i class="fas fa-calendar"></i> Available: ${tour.availability}</p>
                    </div>
                </div>
            </div>
        `;
    }

    updateTourTitle(tour) {
        document.title = `${tour.title} - CaspianWaveTravel`;
    }
}

// Make TourRenderer globally available
window.TourRenderer = TourRenderer;