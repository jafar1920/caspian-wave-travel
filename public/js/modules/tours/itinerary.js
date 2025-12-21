// js/tour-details/itinerary-handler.js


class ItineraryHandler {
    constructor() {
       
    }

    renderItinerary(itinerary) {
        // Show all days if 3 or fewer, otherwise show first 2 with show more option
        const showAllInitially = itinerary.length <= 3;
        const initialDaysToShow = 2;
        
        const visibleDays = showAllInitially ? itinerary : itinerary.slice(0, initialDaysToShow);
        const hiddenDays = showAllInitially ? [] : itinerary.slice(initialDaysToShow);
        
        return `
            <div class="itinerary-section">
                <h3><i class="fas fa-route"></i> Tour Itinerary</h3>
                <div class="itinerary-days">
                    ${visibleDays.map(day => this.renderDay(day)).join('')}
                    ${!showAllInitially ? `
                        <div class="hidden-days" style="display: none;">
                            ${hiddenDays.map(day => this.renderDay(day)).join('')}
                        </div>
                    ` : ''}
                </div>
                ${!showAllInitially ? `
                    <button class="show-more-less" data-state="more">
                        <i class="fas fa-chevron-down"></i> show more
                    </button>
                ` : ''}
            </div>
        `;
    }

    renderDay(day) {
        return `
            <div class="itinerary-day">
                <div class="day-header">
                    <div class="day-number">${day.day}</div>
                    <h4 class="day-title">${day.title}</h4>
                </div>
                <div class="day-content">
                    <p>${day.description}</p>
                </div>
            </div>
        `;
    }

    setupItineraryToggle() {
        const showMoreButtons = document.querySelectorAll('.show-more-less');
        
        showMoreButtons.forEach(button => {
            // Make sure button is visible
            button.style.display = 'flex';
            
            button.addEventListener('click', function() {
                const hiddenDays = this.parentElement.querySelector('.hidden-days');
                const isShowingMore = this.getAttribute('data-state') === 'more';
                
                if (isShowingMore) {
                    // Show hidden days
                    hiddenDays.style.display = 'block';
                    this.innerHTML = '<i class="fas fa-chevron-up"></i> show less';
                    this.setAttribute('data-state', 'less');
                } else {
                    // Hide days
                    hiddenDays.style.display = 'none';
                    this.innerHTML = '<i class="fas fa-chevron-down"></i> show more';
                    this.setAttribute('data-state', 'more');
                }
            });
        });
        
        // Hide buttons that shouldn't be visible (for tours with 3 or fewer days)
        const itinerarySections = document.querySelectorAll('.itinerary-section');
        itinerarySections.forEach(section => {
            const days = section.querySelectorAll('.itinerary-day');
            const button = section.querySelector('.show-more-less');
            if (days.length <= 3 && button) {
                button.style.display = 'none';
            }
        });
    }
}

// Make ItineraryHandler globally available
window.ItineraryHandler = ItineraryHandler;