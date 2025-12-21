// UI Forms - Form handling
const UIForms = {
    init() {
    console.log('✅ UI Forms initialized');
    this.setupForms();
    this.setupTypeChangeHandlers();
    this.initializeItineraryFields();
    this.initializePricingFields(); // Add this line
},
    
    setupForms() {
        const addForm = document.getElementById('addTourForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (Tours) Tours.addTour();
            });
        }
        
        // Clear form button
        const clearBtn = document.getElementById('clearFormBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearForm());
        }
        
        // Add itinerary button
        const addItineraryBtn = document.getElementById('addItineraryBtn');
        if (addItineraryBtn) {
            addItineraryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addItineraryField();
            });
        }
        
        // Add pricing button
        const addPricingBtn = document.getElementById('addPricingBtn');
        if (addPricingBtn) {
            addPricingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addPricingField();
            });
        }
    },
    
    setupTypeChangeHandlers() {
        // Add form type change
        const tourTypeSelect = document.getElementById('tourType');
        if (tourTypeSelect) {
            tourTypeSelect.addEventListener('change', (e) => {
                this.togglePackageFields('add', e.target.value);
            });
        }
        
        // Edit form type change
        const editTypeSelect = document.getElementById('editType');
        if (editTypeSelect) {
            editTypeSelect.addEventListener('change', (e) => {
                this.togglePackageFields('edit', e.target.value);
            });
        }
    },
    
    togglePackageFields(formType, selectedType) {
        const packageFields = formType === 'add' 
            ? document.getElementById('packageFields')
            : document.getElementById('editPackageFields');
            
        if (packageFields) {
            packageFields.style.display = selectedType === 'package' ? 'block' : 'none';
        }
    },
    
    // Helper function to create itinerary items
    createItineraryItem(dayNumber, title = '', description = '') {
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
                this.removeItineraryItem(item);
            });
        }
        
        return item;
    },
    
    addItineraryField() {
        const container = document.getElementById('itineraryFields');
        if (!container) return;
        
        const count = container.querySelectorAll('.itinerary-item').length + 1;
        const newItem = this.createItineraryItem(count);
        container.appendChild(newItem);
        
        // Update all numbers
        this.updateItineraryNumbers();
    },
    
    removeItineraryItem(item) {
        const container = document.getElementById('itineraryFields');
        if (!container) return;
        
        const items = container.querySelectorAll('.itinerary-item');
        
        // Always allow removal if there's more than one item
        if (items.length > 1) {
            item.remove();
            // Re-number all remaining items
            this.updateItineraryNumbers();
        } else {
            // If only one item left, just clear its content instead of removing
            this.clearItineraryItem(item);
            if (Utils) Utils.showMessage('Cleared itinerary content. At least one itinerary is required.', 'info');
        }
    },
    
    clearItineraryItem(item) {
        const titleInput = item.querySelector('.itinerary-title');
        const descTextarea = item.querySelector('.itinerary-desc');
        
        if (titleInput) titleInput.value = '';
        if (descTextarea) descTextarea.value = '';
    },
    
    updateItineraryNumbers() {
        const container = document.getElementById('itineraryFields');
        if (!container) return;
        
        const items = container.querySelectorAll('.itinerary-item');
        
        items.forEach((item, index) => {
            const dayNumber = index + 1;
            const dayNumberDiv = item.querySelector('.day-number');
            if (dayNumberDiv) {
                dayNumberDiv.textContent = dayNumber;
            }
        });
    },
    
    addPricingField() {
        const container = document.getElementById('pricingFields');
        if (!container) return;
        
        const visibleItems = container.querySelectorAll('.pricing-item');
        const count = visibleItems.length + 1;
        
        const newField = document.createElement('div');
        newField.className = 'pricing-item';
        newField.innerHTML = `
            <input type="text" placeholder="Description" class="pricing-desc">
            <input type="text" placeholder="Persons" class="pricing-persons">
            <input type="text" placeholder="Price" class="pricing-price">
        `;
        container.appendChild(newField);
    },
    
    initializeItineraryFields() {
        const container = document.getElementById('itineraryFields');
        if (!container) return;
        
        // If container is empty or has old structure, recreate it
        if (container.children.length === 0) {
            const initialItem = this.createItineraryItem(1);
            container.appendChild(initialItem);
        } else {
            // Check if we have the old structure
            const firstItem = container.querySelector('.itinerary-item');
            if (firstItem && firstItem.querySelector('input[type="number"]')) {
                // Old structure detected - recreate everything
                this.recreateItineraryFields();
            } else {
                // New structure - just ensure remove buttons are attached
                this.attachRemoveButtons();
            }
        }
    },
    
    recreateItineraryFields() {
        const container = document.getElementById('itineraryFields');
        if (!container) return;
        
        const items = container.querySelectorAll('.itinerary-item');
        const itineraryData = [];
        
        // Extract data from old structure
        items.forEach(item => {
            const dayInput = item.querySelector('input[type="number"]');
            const titleInput = item.querySelector('.itinerary-title');
            const descTextarea = item.querySelector('.itinerary-desc');
            
            itineraryData.push({
                title: titleInput ? titleInput.value : '',
                description: descTextarea ? descTextarea.value : ''
            });
        });
        
        // Clear and recreate with new structure
        container.innerHTML = '';
        
        itineraryData.forEach((data, index) => {
            const dayNumber = index + 1;
            const newItem = this.createItineraryItem(dayNumber, data.title, data.description);
            container.appendChild(newItem);
        });
        
        // If no items were created, add one default
        if (container.children.length === 0) {
            const initialItem = this.createItineraryItem(1);
            container.appendChild(initialItem);
        }
    },
    
    attachRemoveButtons() {
        const container = document.getElementById('itineraryFields');
        if (!container) return;
        
        const items = container.querySelectorAll('.itinerary-item');
        items.forEach((item, index) => {
            const removeBtn = item.querySelector('.remove-itinerary-btn');
            if (removeBtn) {
                // Remove any existing event listeners
                const newRemoveBtn = removeBtn.cloneNode(true);
                removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
                
                // Add new event listener
                newRemoveBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.removeItineraryItem(item);
                });
            }
        });
        
        // Update numbers
        this.updateItineraryNumbers();
    },

    // Helper function to create pricing items
createPricingItem(description = '', persons = '', price = '') {
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
            this.removePricingItem(item);
        });
    }
    
    return item;
},

addPricingField() {
    const container = document.getElementById('pricingFields');
    if (!container) return;
    
    const newItem = this.createPricingItem();
    container.appendChild(newItem);
},

removePricingItem(item) {
    const container = document.getElementById('pricingFields');
    if (!container) return;
    
    const items = container.querySelectorAll('.pricing-item');
    
    // Always allow removal if there's more than one item
    if (items.length > 1) {
        item.remove();
    } else {
        // If only one item left, just clear its content
        this.clearPricingItem(item);
        if (Utils) Utils.showMessage('Cleared price fields. At least one price option is required.', 'info');
    }
},

clearPricingItem(item) {
    const descInput = item.querySelector('.pricing-desc');
    const personsInput = item.querySelector('.pricing-persons');
    const priceInput = item.querySelector('.pricing-price');
    
    if (descInput) descInput.value = '';
    if (personsInput) personsInput.value = '';
    if (priceInput) priceInput.value = '';
},

initializePricingFields() {
    const container = document.getElementById('pricingFields');
    if (!container) return;
    
    // If container is empty, add first item
    if (container.children.length === 0) {
        const initialItem = this.createPricingItem();
        container.appendChild(initialItem);
    } else {
        // Ensure existing items have remove buttons
        const items = container.querySelectorAll('.pricing-item');
        items.forEach(item => {
            // Check if remove button already exists
            if (!item.querySelector('.remove-pricing-btn')) {
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'remove-pricing-btn';
                removeBtn.title = 'Remove price';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.removePricingItem(item);
                });
                
                item.appendChild(removeBtn);
            } else {
                // If remove button exists, ensure it has the correct event listener
                const removeBtn = item.querySelector('.remove-pricing-btn');
                // Remove any existing event listeners by cloning
                const newRemoveBtn = removeBtn.cloneNode(true);
                removeBtn.parentNode.replaceChild(newRemoveBtn, removeBtn);
                
                // Add new event listener
                newRemoveBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.removePricingItem(item);
                });
            }
        });
    }
},
    
    clearForm() {
        console.log('Clearing form...');
        
        // 1. Cleanup object URLs if they exist
        if (UICore && UICore.cleanupObjectURLs) {
            UICore.cleanupObjectURLs();
        }
        
        // 2. Reset the form
        const form = document.getElementById('addTourForm');
        if (form) {
            form.reset();
        }
        
        // 3. Reset type to default and hide package fields
        const tourTypeSelect = document.getElementById('tourType');
        if (tourTypeSelect) {
            tourTypeSelect.value = 'tour';
            this.togglePackageFields('add', 'tour');
        }
        
        // 4. Clear itinerary fields and add one default item
        const itineraryFields = document.getElementById('itineraryFields');
        if (itineraryFields) {
            itineraryFields.innerHTML = '';
            const initialItem = this.createItineraryItem(1);
            itineraryFields.appendChild(initialItem);
        }
        
        // 5. Clear pricing fields and add one default item
         const pricingFields = document.getElementById('pricingFields');
    if (pricingFields) {
        pricingFields.innerHTML = '';
        const initialItem = this.createPricingItem(); // Use the new helper function
        pricingFields.appendChild(initialItem);
    }
        
        // 6. Clear selected files for add form
        if (window.selectedFiles) {
            window.selectedFiles = window.selectedFiles || {};
            window.selectedFiles.add = [];
        }
        
        // 7. Clear image preview
        const previewContainer = document.getElementById('addImagesPreview');
        if (previewContainer) {
            previewContainer.innerHTML = `
                <div class="no-images-message">
                    <i class="fas fa-image"></i>
                    <p>No images selected yet.</p>
                    <p class="upload-note">Upload images to see preview.</p>
                </div>
            `;
        }
        
        // 8. Hide upload progress if visible
        const uploadProgress = document.getElementById('uploadProgress');
        if (uploadProgress) {
            uploadProgress.style.display = 'none';
        }
        
        // 9. Reset file input
        const fileInput = document.getElementById('imageUpload');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // 10. Clear selected files list
        const selectedFilesDiv = document.getElementById('selectedFiles');
        if (selectedFilesDiv) {
            selectedFilesDiv.innerHTML = '';
            selectedFilesDiv.style.display = 'none';
        }
        
        // 11. Show success message
        if (Utils && Utils.showMessage) {
            Utils.showMessage('Form cleared successfully', 'success');
        }
        
        console.log('Form cleared successfully');
    }
};

window.UIForms = UIForms;