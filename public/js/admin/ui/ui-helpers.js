// UI Helpers - Helper functions for UI
const UIHelpers = {
    // Get form data for add form
    getFormData() {
        const type = document.getElementById('tourType').value;
        
        const data = {
            type: type,
            title: document.getElementById('tourTitle').value.trim(),
            category: document.getElementById('tourCategory').value.trim() || 'general',
            duration: document.getElementById('tourDuration').value.trim(),
            description: document.getElementById('tourDescription').value.trim(),
            images: [],
            included: Utils.parseLines(document.getElementById('tourIncluded').value),
            excluded: Utils.parseLines(document.getElementById('tourExcluded').value),
            itinerary: this.getItineraryData(),
            pricing: this.getPricingData(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add package-specific fields
        if (type === 'package') {
            data.availability = document.getElementById('packageAvailability').value.trim() || 'Daily';
        }
        
        return data;
    },
    
    // Get form data for edit form
    getEditFormData() {
        const type = document.getElementById('editType').value;
        
        const data = {
            type: type,
            title: document.getElementById('editTitle').value.trim(),
            category: document.getElementById('editCategory').value.trim() || 'general',
            duration: document.getElementById('editDuration').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            images: [],
            included: Utils.parseLines(document.getElementById('editIncluded').value),
            excluded: Utils.parseLines(document.getElementById('editExcluded').value),
            itinerary: this.getEditItineraryData(),
            pricing: this.getEditPricingData(),
            updatedAt: new Date().toISOString()
        };
        
        // Add package-specific fields
        if (type === 'package') {
            data.availability = document.getElementById('editAvailability').value.trim() || 'Daily';
        }
        
        return data;
    },
    
    // Get itinerary data from add form
    getItineraryData() {
    const items = [];
    const itineraryItems = document.querySelectorAll('#itineraryFields .itinerary-item');
    
    itineraryItems.forEach((item, index) => {
        // Get day number from div.day-number instead of input.itinerary-day
        const dayNumberDiv = item.querySelector('.day-number');
        const title = item.querySelector('.itinerary-title').value;
        const description = item.querySelector('.itinerary-desc').value;
        
        // Get day number from div or use index + 1 as fallback
        const day = dayNumberDiv ? 
            parseInt(dayNumberDiv.textContent) || (index + 1) : 
            (index + 1);
        
        if (title && description) {
            items.push({
                day: day,
                title: title.trim(),
                description: description.trim()
            });
        }
    });
    
    return items;
},
    
    // Get itinerary data from edit form
    getEditItineraryData() {
    const items = [];
    const itineraryItems = document.querySelectorAll('#editItineraryFields .itinerary-item');
    
    itineraryItems.forEach((item, index) => {
        // Get day number from div.day-number instead of input.itinerary-day
        const dayNumberDiv = item.querySelector('.day-number');
        const title = item.querySelector('.itinerary-title').value;
        const description = item.querySelector('.itinerary-desc').value;
        
        // Get day number from div or use index + 1 as fallback
        const day = dayNumberDiv ? 
            parseInt(dayNumberDiv.textContent) || (index + 1) : 
            (index + 1);
        
        if (title && description) {
            items.push({
                day: day,
                title: title.trim(),
                description: description.trim()
            });
        }
    });
    
    return items;
},
    
    // Get pricing data from add form
    getPricingData() {
        const items = [];
        const pricingItems = document.querySelectorAll('#pricingFields .pricing-item');
        
        pricingItems.forEach(item => {
            const description = item.querySelector('.pricing-desc').value;
            const persons = item.querySelector('.pricing-persons').value;
            const price = item.querySelector('.pricing-price').value;
            
            if (description && persons && price) {
                items.push({
                    description: description.trim(),
                    persons: persons.trim(),
                    price: price.trim()
                });
            }
        });
        
        return items;
    },
    
    // Get pricing data from edit form
    getEditPricingData() {
        const items = [];
        const pricingItems = document.querySelectorAll('#editPricingFields .pricing-item');
        
        pricingItems.forEach(item => {
            const description = item.querySelector('.pricing-desc').value;
            const persons = item.querySelector('.pricing-persons').value;
            const price = item.querySelector('.pricing-price').value;
            
            if (description && persons && price) {
                items.push({
                    description: description.trim(),
                    persons: persons.trim(),
                    price: price.trim()
                });
            }
        });
        
        return items;
    }
};

window.UIHelpers = UIHelpers;