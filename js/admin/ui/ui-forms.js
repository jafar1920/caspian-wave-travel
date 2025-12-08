// UI Forms - Form handling
const UIForms = {
    init() {
        console.log('✅ UI Forms initialized');
        this.setupForms();
        this.setupTypeChangeHandlers();
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
    
    addItineraryField() {
        const container = document.getElementById('itineraryFields');
        if (!container) return;
        
        const visibleItems = container.querySelectorAll('.itinerary-item');
        const count = visibleItems.length + 1;
        
        const newField = document.createElement('div');
        newField.className = 'itinerary-item';
        newField.innerHTML = `
            <input type="number" placeholder="Order" class="itinerary-day" min="1" value="${count}">
            <input type="text" placeholder="Title" class="itinerary-title">
            <textarea placeholder="Description" class="itinerary-desc" rows="2"></textarea>
        `;
        container.appendChild(newField);
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
    
    clearForm() {
        // Cleanup object URLs
        if (UICore) UICore.cleanupObjectURLs();
        
        const form = document.getElementById('addTourForm');
        if (form) form.reset();
        
        // Reset type to default
        document.getElementById('tourType').value = 'tour';
        this.togglePackageFields('add', 'tour');
        
        // Clear dynamic fields
        const itineraryFields = document.getElementById('itineraryFields');
        const pricingFields = document.getElementById('pricingFields');
        
        if (itineraryFields) {
            itineraryFields.innerHTML = '';
            const initialField = document.createElement('div');
            initialField.className = 'itinerary-item';
            initialField.innerHTML = `
                <input type="number" placeholder="Order" class="itinerary-day" min="1" value="1">
                <input type="text" placeholder="Title" class="itinerary-title">
                <textarea placeholder="Description" class="itinerary-desc" rows="2"></textarea>
            `;
            itineraryFields.appendChild(initialField);
        }
        
        if (pricingFields) {
            pricingFields.innerHTML = '';
            const initialField = document.createElement('div');
            initialField.className = 'pricing-item';
            initialField.innerHTML = `
                <input type="text" placeholder="Description" class="pricing-desc">
                <input type="text" placeholder="Persons" class="pricing-persons">
                <input type="text" placeholder="Price" class="pricing-price">
            `;
            pricingFields.appendChild(initialField);
        }
        
        // Clear selected files and preview
        if (window.selectedFiles && window.selectedFiles.add) {
            window.selectedFiles.add = [];
        }
        
        const previewContainer = document.getElementById('addImagesPreview');
        if (previewContainer) {
            previewContainer.innerHTML = '<div class="no-images-message">No images selected yet. Upload images to see preview.</div>';
        }
        
        if (Utils) Utils.showMessage('Form cleared', 'info');
    }
};

window.UIForms = UIForms;