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
    
    populateEditItinerary(itinerary) {
        const container = document.getElementById('editItineraryFields');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (itinerary.length === 0) {
            const emptyField = document.createElement('div');
            emptyField.className = 'itinerary-item';
            emptyField.innerHTML = `
                <div class="field-header">
                    <span>Itinerary 1</span>
                    <button type="button" class="btn-remove-itinerary" title="Remove itinerary">&times;</button>
                </div>
                <input type="number" placeholder="Order" class="itinerary-day" min="1" value="1">
                <input type="text" placeholder="Title" class="itinerary-title">
                <textarea placeholder="Description" class="itinerary-desc" rows="2"></textarea>
            `;
            container.appendChild(emptyField);
        } else {
            itinerary.forEach((item, index) => {
                const newField = document.createElement('div');
                newField.className = 'itinerary-item';
                newField.innerHTML = `
                    <div class="field-header">
                        <span>Itinerary ${index + 1}</span>
                        <button type="button" class="btn-remove-itinerary" title="Remove itinerary">&times;</button>
                    </div>
                    <input type="number" placeholder="Order" class="itinerary-day" min="1" value="${item.day || index + 1}">
                    <input type="text" placeholder="Title" class="itinerary-title" value="${item.title || ''}">
                    <textarea placeholder="Description" class="itinerary-desc" rows="2">${item.description || ''}</textarea>
                `;
                container.appendChild(newField);
            });
        }
    },
    
    populateEditPricing(pricing) {
        const container = document.getElementById('editPricingFields');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (pricing.length === 0) {
            const emptyField = document.createElement('div');
            emptyField.className = 'pricing-item';
            emptyField.innerHTML = `
                <div class="field-header">
                    <span>Price Option 1</span>
                    <button type="button" class="btn-remove-pricing" title="Remove price">&times;</button>
                </div>
                <input type="text" placeholder="Description" class="pricing-desc">
                <input type="text" placeholder="Persons" class="pricing-persons">
                <input type="text" placeholder="Price" class="pricing-price">
            `;
            container.appendChild(emptyField);
        } else {
            pricing.forEach((item, index) => {
                const newField = document.createElement('div');
                newField.className = 'pricing-item';
                newField.innerHTML = `
                    <div class="field-header">
                        <span>Price Option ${index + 1}</span>
                        <button type="button" class="btn-remove-pricing" title="Remove price">&times;</button>
                    </div>
                    <input type="text" placeholder="Description" class="pricing-desc" value="${item.description || ''}">
                    <input type="text" placeholder="Persons" class="pricing-persons" value="${item.persons || ''}">
                    <input type="text" placeholder="Price" class="pricing-price" value="${item.price || ''}">
                `;
                container.appendChild(newField);
            });
        }
    },
    
    setupEditModalButtons(tourId) {
        // Add itinerary button in edit modal
        const editAddItineraryBtn = document.getElementById('editAddItineraryBtn');
        if (editAddItineraryBtn) {
            editAddItineraryBtn.onclick = () => this.addEditItineraryField();
        }
        
        // Add pricing button in edit modal
        const editAddPricingBtn = document.getElementById('editAddPricingBtn');
        if (editAddPricingBtn) {
            editAddPricingBtn.onclick = () => this.addEditPricingField();
        }
        
        // Delete button
        const editDeleteBtn = document.getElementById('editDeleteBtn');
        if (editDeleteBtn) {
            editDeleteBtn.onclick = () => {
                if (Tours) Tours.deleteTour(tourId, true);
            };
        }
        
        // Setup remove buttons
        this.setupRemoveButtons();
    },
    
    addEditItineraryField() {
        const container = document.getElementById('editItineraryFields');
        if (!container) return;
        
        const count = container.querySelectorAll('.itinerary-item').length + 1;
        
        const newField = document.createElement('div');
        newField.className = 'itinerary-item';
        newField.innerHTML = `
            <div class="field-header">
                <span>Itinerary ${count}</span>
                <button type="button" class="btn-remove-itinerary" title="Remove itinerary">&times;</button>
            </div>
            <input type="number" placeholder="Order" class="itinerary-day" min="1" value="${count}">
            <input type="text" placeholder="Title" class="itinerary-title">
            <textarea placeholder="Description" class="itinerary-desc" rows="2"></textarea>
        `;
        container.appendChild(newField);
        this.setupRemoveButtons();
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
        this.setupRemoveButtons();
    },
    
    setupRemoveButtons() {
        // Remove itinerary buttons
        document.querySelectorAll('.btn-remove-itinerary').forEach(btn => {
            btn.onclick = function() {
                const parent = this.closest('.itinerary-item').parentElement;
                if (parent.querySelectorAll('.itinerary-item').length > 1) {
                    this.closest('.itinerary-item').remove();
                    const container = document.getElementById('editItineraryFields');
                    if (container) {
                        container.querySelectorAll('.itinerary-item').forEach((item, index) => {
                            const header = item.querySelector('.field-header span');
                            if (header) header.textContent = `Itinerary ${index + 1}`;
                        });
                    }
                }
            };
        });
        
        // Remove pricing buttons
        document.querySelectorAll('.btn-remove-pricing').forEach(btn => {
            btn.onclick = function() {
                const parent = this.closest('.pricing-item').parentElement;
                if (parent.querySelectorAll('.pricing-item').length > 1) {
                    this.closest('.pricing-item').remove();
                }
            };
        });
    }
};

window.UITourEditor = UITourEditor;