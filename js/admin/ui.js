// User Interface
const UI = {
    init() {
        console.log('UI initialized');
        
        // Setup tabs
        this.setupTabs();
        
        // Setup forms
        this.setupForms();
        
        // Setup modals
        this.setupModals();
        
        // Load tours if on tours tab
        if (Dashboard && Dashboard.tours.length === 0) {
            Dashboard.loadTours();
        }
    },
    
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Update buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update content
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById(tabId + 'Tab').classList.add('active');
            });
        });
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
            addItineraryBtn.addEventListener('click', () => this.addItineraryField());
        }
        
        // Add pricing button
        const addPricingBtn = document.getElementById('addPricingBtn');
        if (addPricingBtn) {
            addPricingBtn.addEventListener('click', () => this.addPricingField());
        }
    },
    
    setupModals() {
        const modal = document.getElementById('editModal');
        const closeBtns = document.querySelectorAll('.close-btn');
        
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Edit form submission
        const editForm = document.getElementById('editTourForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (Tours) Tours.updateTour();
            });
        }
    },
    
    editTour(tourId) {
        const tour = Dashboard.getTour(tourId);
        if (!tour) return;
        
        document.getElementById('editTourId').value = tourId;
        document.getElementById('editTitle').value = tour.title || '';
        document.getElementById('editDescription').value = tour.description || '';
        document.getElementById('editDuration').value = tour.duration || '';
        
        document.getElementById('editModal').style.display = 'flex';
    },
    
    clearForm() {
        const form = document.getElementById('addTourForm');
        if (form) form.reset();
        
        // Clear dynamic fields
        const itineraryFields = document.getElementById('itineraryFields');
        const pricingFields = document.getElementById('pricingFields');
        
        if (itineraryFields) {
            itineraryFields.innerHTML = `
                <div class="itinerary-item">
                    <input type="number" placeholder="Day" class="itinerary-day" min="1">
                    <input type="text" placeholder="Title" class="itinerary-title">
                    <textarea placeholder="Description" class="itinerary-desc" rows="2"></textarea>
                </div>
            `;
        }
        
        if (pricingFields) {
            pricingFields.innerHTML = `
                <div class="pricing-item">
                    <input type="text" placeholder="Description" class="pricing-desc">
                    <input type="text" placeholder="Persons" class="pricing-persons">
                    <input type="text" placeholder="Price" class="pricing-price">
                </div>
            `;
        }
        
        if (Utils) Utils.showMessage('Form cleared', 'info');
    },
    
    addItineraryField() {
        const container = document.getElementById('itineraryFields');
        if (!container) return;
        
        const newField = document.createElement('div');
        newField.className = 'itinerary-item';
        newField.innerHTML = `
            <input type="number" placeholder="Day" class="itinerary-day" min="1">
            <input type="text" placeholder="Title" class="itinerary-title">
            <textarea placeholder="Description" class="itinerary-desc" rows="2"></textarea>
        `;
        container.appendChild(newField);
    },
    
    addPricingField() {
        const container = document.getElementById('pricingFields');
        if (!container) return;
        
        const newField = document.createElement('div');
        newField.className = 'pricing-item';
        newField.innerHTML = `
            <input type="text" placeholder="Description" class="pricing-desc">
            <input type="text" placeholder="Persons" class="pricing-persons">
            <input type="text" placeholder="Price" class="pricing-price">
        `;
        container.appendChild(newField);
    },
    
    getFormData() {
        return {
            title: document.getElementById('tourTitle').value.trim(),
            category: document.getElementById('tourCategory').value.trim() || 'general',
            duration: document.getElementById('tourDuration').value.trim(),
            groupSize: document.getElementById('tourGroupSize').value.trim(),
            description: document.getElementById('tourDescription').value.trim(),
            images: Utils.parseLines(document.getElementById('tourImages').value),
            included: Utils.parseLines(document.getElementById('tourIncluded').value),
            excluded: Utils.parseLines(document.getElementById('tourExcluded').value),
            itinerary: this.getItineraryData(),
            pricing: this.getPricingData()
        };
    },
    
    getItineraryData() {
        const items = [];
        const itineraryItems = document.querySelectorAll('.itinerary-item');
        
        itineraryItems.forEach(item => {
            const day = item.querySelector('.itinerary-day').value;
            const title = item.querySelector('.itinerary-title').value;
            const description = item.querySelector('.itinerary-desc').value;
            
            if (day && title && description) {
                items.push({
                    day: parseInt(day),
                    title: title.trim(),
                    description: description.trim()
                });
            }
        });
        
        return items;
    },
    
    getPricingData() {
        const items = [];
        const pricingItems = document.querySelectorAll('.pricing-item');
        
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

window.UI = UI;