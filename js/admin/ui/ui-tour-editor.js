// UI Tour Editor - Tour editing functions
const UITourEditor = {
    init() {
        console.log('✅ UI Tour Editor initialized');
    },
    
    editTour(tourId) {
        const tour = Dashboard.getTour(tourId);
        if (!tour) return;
        
        console.log(`✏️ Editing tour: ${tourId}`);
        
        // Store current tour ID globally
        window.currentEditingTourId = tourId;
        
        // Reset temporary data
        window.currentTourImages = [...(tour.images || [])];
        window.pendingImageDeletions = [];
        window.newImagesToUpload = [];
        
        // Set basic fields
        document.getElementById('editTourId').value = tourId;
        document.getElementById('editType').value = tour.type || 'tour';
        document.getElementById('editTitle').value = tour.title || '';
        document.getElementById('editCategory').value = tour.category || 'general';
        document.getElementById('editDuration').value = tour.duration || '';
        document.getElementById('editDescription').value = tour.description || '';
        document.getElementById('editIncluded').value = (tour.included || []).join('\n');
        document.getElementById('editExcluded').value = (tour.excluded || []).join('\n');
        
        // Set package-specific fields
        if (tour.type === 'package') {
            document.getElementById('editAvailability').value = tour.availability || '';
        }
        
        // Toggle package fields
        if (UIForms) {
            UIForms.togglePackageFields('edit', tour.type || 'tour');
        }
        
        // Show current images
        if (UIImages) {
            UIImages.updateEditModalImagePreview();
        }
        
        // Populate itinerary fields
        this.populateEditItinerary(tour.itinerary || []);
        
        // Populate pricing fields
        this.populateEditPricing(tour.pricing || []);
        
        // Setup edit modal buttons
        this.setupEditModalButtons(tourId);
        
        // Show modal
        document.getElementById('editModal').style.display = 'flex';
    },
    
    // Helper function to create edit itinerary items
    createEditItineraryItem(dayNumber, title = '', description = '') {
    const item = document.createElement('div');
    item.className = 'itinerary-item';
    item.innerHTML = `
        <div class="day-number">${dayNumber}</div>
        <div class="itinerary-content">
            <input type="text" placeholder="Title" class="itinerary-title" value="${title}">
            <textarea placeholder="Description" class="itinerary-desc" rows="2">${description}</textarea>
        </div>
        <button type="button" class="remove-itinerary-btn" title="Remove this day">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add remove button event
    const removeBtn = item.querySelector('.remove-itinerary-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.removeEditItineraryItem(item);
        });
    }
    
    return item;
},
    
    populateEditItinerary(itinerary) {
        const container = document.getElementById('editItineraryFields');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (itinerary.length === 0) {
            // Create one empty item
            const emptyItem = this.createEditItineraryItem(1);
            container.appendChild(emptyItem);
        } else {
            // Create items from itinerary data
            itinerary.forEach((item, index) => {
                const dayNumber = index + 1;
                const newItem = this.createEditItineraryItem(
                    dayNumber,
                    item.title || '',
                    item.description || ''
                );
                container.appendChild(newItem);
            });
        }
    },
    
    removeEditItineraryItem(item) {
    const container = document.getElementById('editItineraryFields');
    if (!container) return;
    
    const items = container.querySelectorAll('.itinerary-item');
    
    // Always allow removal if there's more than one item
    if (items.length > 1) {
        item.remove();
        // Re-number all remaining items
        this.updateEditItineraryNumbers();
    } else {
        // If only one item left, just clear its content
        this.clearEditItineraryItem(item);
        if (Utils) Utils.showMessage('Cleared itinerary content. At least one itinerary is required.', 'info');
    }
},

// Helper function to create edit pricing items
createEditPricingItem(description = '', persons = '', price = '') {
    const item = document.createElement('div');
    item.className = 'pricing-item';
    item.innerHTML = `
        <input type="text" placeholder="Description" class="pricing-desc" value="${description}">
        <input type="text" placeholder="Persons" class="pricing-persons" value="${persons}">
        <input type="text" placeholder="Price" class="pricing-price" value="${price}">
        <button type="button" class="remove-pricing-btn" title="Remove price">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add remove button event
    const removeBtn = item.querySelector('.remove-pricing-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.removeEditPricingItem(item);
        });
    }
    
    return item;
},

addEditPricingField() {
    const container = document.getElementById('editPricingFields');
    if (!container) return;
    
    const newItem = this.createEditPricingItem();
    container.appendChild(newItem);
},

removeEditPricingItem(item) {
    const container = document.getElementById('editPricingFields');
    if (!container) return;
    
    const items = container.querySelectorAll('.pricing-item');
    
    // Always allow removal if there's more than one item
    if (items.length > 1) {
        item.remove();
    } else {
        // If only one item left, just clear its content
        this.clearEditPricingItem(item);
        if (Utils) Utils.showMessage('Cleared price fields. At least one price option is required.', 'info');
    }
},

clearEditPricingItem(item) {
    const descInput = item.querySelector('.pricing-desc');
    const personsInput = item.querySelector('.pricing-persons');
    const priceInput = item.querySelector('.pricing-price');
    
    if (descInput) descInput.value = '';
    if (personsInput) personsInput.value = '';
    if (priceInput) priceInput.value = '';
},

// Add this helper function
    clearEditItineraryItem(item) {
    const titleInput = item.querySelector('.itinerary-title');
    const descTextarea = item.querySelector('.itinerary-desc');
    
    if (titleInput) titleInput.value = '';
    if (descTextarea) descTextarea.value = '';
    },
    
    populateEditPricing(pricing) {
    const container = document.getElementById('editPricingFields');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (pricing.length === 0) {
        // Create one empty item
        const emptyItem = this.createEditPricingItem();
        container.appendChild(emptyItem);
    } else {
        // Create items from pricing data
        pricing.forEach(item => {
            const newItem = this.createEditPricingItem(
                item.description || '',
                item.persons || '',
                item.price || ''
            );
            container.appendChild(newItem);
        });
    }
},
    
  setupEditModalButtons(tourId) {
    // Add itinerary button in edit modal
    const editAddItineraryBtn = document.getElementById('editAddItineraryBtn');
    if (editAddItineraryBtn) {
        editAddItineraryBtn.onclick = () => this.addEditItineraryField();
    }
    
    // Add pricing button in edit modal - update to use new function
    const editAddPricingBtn = document.getElementById('editAddPricingBtn');
    if (editAddPricingBtn) {
        editAddPricingBtn.onclick = () => this.addEditPricingField(); // Use new function
    }
    
    // Delete button
    const editDeleteBtn = document.getElementById('editDeleteBtn');
    if (editDeleteBtn) {
        editDeleteBtn.onclick = () => {
            if (Tours) Tours.deleteTour(tourId, true);
        };
    }
},
    
    addEditItineraryField() {
        const container = document.getElementById('editItineraryFields');
        if (!container) return;
        
        const count = container.querySelectorAll('.itinerary-item').length + 1;
        const newItem = this.createEditItineraryItem(count);
        container.appendChild(newItem);
        
        // Update all numbers
        this.updateEditItineraryNumbers();
    },
    
    addEditPricingField() {
        const container = document.getElementById('editPricingFields');
        if (!container) return;
        
        const count = container.querySelectorAll('.pricing-item').length + 1;
        
        const newField = document.createElement('div');
        newField.className = 'pricing-item';
        newField.innerHTML = `
            <div class="field-header">
                <span>Price Option ${count}</span>
                <button type="button" class="btn-remove-pricing" title="Remove price">&times;</button>
            </div>
            <input type="text" placeholder="Description" class="pricing-desc">
            <input type="text" placeholder="Persons" class="pricing-persons">
            <input type="text" placeholder="Price" class="pricing-price">
        `;
        container.appendChild(newField);
    },
    
    updateEditItineraryNumbers() {
        const container = document.getElementById('editItineraryFields');
        if (!container) return;
        
        const items = container.querySelectorAll('.itinerary-item');
        
        items.forEach((item, index) => {
            const dayNumber = index + 1;
            const dayNumberDiv = item.querySelector('.day-number');
            if (dayNumberDiv) {
                dayNumberDiv.textContent = dayNumber;
            }
        });
    }
};

window.UITourEditor = UITourEditor;