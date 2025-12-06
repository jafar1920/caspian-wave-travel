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
        
        // Setup confirmation modal
        this.setupConfirmationModal();
        
        // Setup image upload
        this.setupImageUpload();
        
        // Setup type change handlers
        this.setupTypeChangeHandlers();
        
        // Initialize ImageUpload if available
        if (ImageUpload) {
            ImageUpload.init();
        }
        
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
            if (selectedType === 'package') {
                packageFields.style.display = 'block';
            } else {
                packageFields.style.display = 'none';
            }
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
    
    setupConfirmationModal() {
        const confirmModal = document.getElementById('confirmModal');
        const confirmCancel = document.getElementById('confirmCancel');
        const confirmDelete = document.getElementById('confirmDelete');
        const confirmCloseBtns = document.querySelectorAll('.confirm-close');
        
        // Close modal buttons
        confirmCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                confirmModal.style.display = 'none';
                window.pendingDeleteTourId = null;
                window.pendingDeleteFromEditModal = false;
            });
        });
        
        // Cancel button
        confirmCancel.addEventListener('click', () => {
            confirmModal.style.display = 'none';
            window.pendingDeleteTourId = null;
            window.pendingDeleteFromEditModal = false;
        });
        
        // Delete button
        confirmDelete.addEventListener('click', async () => {
            const tourId = window.pendingDeleteTourId;
            const fromEditModal = window.pendingDeleteFromEditModal;
            
            if (!tourId) {
                confirmModal.style.display = 'none';
                return;
            }
            
            try {
                await FirebaseAdmin.deleteTour(tourId);
                
                // Remove from local list
                if (Dashboard) {
                    Dashboard.removeFromList(tourId);
                }
                
                // Close modals
                confirmModal.style.display = 'none';
                if (fromEditModal) {
                    document.getElementById('editModal').style.display = 'none';
                }
                
                // Clear pending delete
                window.pendingDeleteTourId = null;
                window.pendingDeleteFromEditModal = false;
                
                if (Utils) Utils.showMessage('Item deleted successfully!', 'success');
                
            } catch (error) {
                console.error('Error deleting item:', error);
                confirmModal.style.display = 'none';
                if (Utils) Utils.showMessage('Failed to delete item: ' + error.message, 'error');
            }
        });
        
        // Close on outside click
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                confirmModal.style.display = 'none';
                window.pendingDeleteTourId = null;
                window.pendingDeleteFromEditModal = false;
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && confirmModal.style.display === 'flex') {
                confirmModal.style.display = 'none';
                window.pendingDeleteTourId = null;
                window.pendingDeleteFromEditModal = false;
            }
        });
    },
    
    setupImageUpload() {
        this.setupAddFormImageUpload();
        this.setupEditFormImageUpload();
    },
    
    setupAddFormImageUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const browseBtn = document.getElementById('browseBtn');
        const fileInput = document.getElementById('imageUpload');
        const selectedFilesDiv = document.getElementById('selectedFiles');
        
        if (!uploadArea || !browseBtn || !fileInput) return;
        
        // Browse button click
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFilesSelected(e.target.files, selectedFilesDiv, 'add');
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFilesSelected(e.dataTransfer.files, selectedFilesDiv, 'add');
        });
    },
    
    setupEditFormImageUpload() {
        const uploadArea = document.getElementById('editUploadArea');
        const browseBtn = document.getElementById('editBrowseBtn');
        const fileInput = document.getElementById('editImageUpload');
        const selectedFilesDiv = document.getElementById('editSelectedFiles');
        
        if (!uploadArea || !browseBtn || !fileInput) return;
        
        // Browse button click
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFilesSelected(e.target.files, selectedFilesDiv, 'edit');
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFilesSelected(e.dataTransfer.files, selectedFilesDiv, 'edit');
        });
    },
    
    handleFilesSelected(files, container, formType) {
        if (!files || files.length === 0) return;
        
        container.innerHTML = '';
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validate file type
            if (!file.type.match('image.*')) {
                Utils.showMessage(`File ${file.name} is not an image`, 'error');
                continue;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Utils.showMessage(`File ${file.name} is too large (max 5MB)`, 'error');
                continue;
            }
            
            // Create file preview
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-image"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">(${(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button type="button" class="btn-remove-file" data-index="${i}">&times;</button>
            `;
            
            container.appendChild(fileItem);
            
            // Store file reference
            if (!window.selectedFiles) window.selectedFiles = {};
            if (!window.selectedFiles[formType]) window.selectedFiles[formType] = [];
            window.selectedFiles[formType].push(file);
        }
        
        // Setup remove buttons
        container.querySelectorAll('.btn-remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                window.selectedFiles[formType].splice(index, 1);
                this.updateFileList(formType);
            });
        });
    },
    
    updateFileList(formType) {
        const container = formType === 'add' 
            ? document.getElementById('selectedFiles')
            : document.getElementById('editSelectedFiles');
        
        if (!container || !window.selectedFiles || !window.selectedFiles[formType]) return;
        
        const files = window.selectedFiles[formType];
        container.innerHTML = '';
        
        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-image"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">(${(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <button type="button" class="btn-remove-file" data-index="${index}">&times;</button>
            `;
            container.appendChild(fileItem);
        });
        
        // Re-setup remove buttons
        container.querySelectorAll('.btn-remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                window.selectedFiles[formType].splice(index, 1);
                this.updateFileList(formType);
            });
        });
    },
    
    async uploadSelectedImages(formType, tourId) {
        if (!window.selectedFiles || !window.selectedFiles[formType] || 
            window.selectedFiles[formType].length === 0) {
            return [];
        }
        
        const files = window.selectedFiles[formType];
        const progressBar = formType === 'add' 
            ? document.getElementById('uploadProgress')
            : document.getElementById('editUploadProgress');
        
        try {
            // Show progress
            if (progressBar) {
                progressBar.style.display = 'block';
                const progressFill = progressBar.querySelector('.progress-fill');
                const progressText = progressBar.querySelector('.progress-text');
                
                // Update progress
                progressFill.style.width = '0%';
                progressText.textContent = `Uploading 0/${files.length} images...`;
            }
            
            // Upload images
            const uploadedUrls = [];
            
            for (let i = 0; i < files.length; i++) {
                try {
                    const url = await ImageUpload.uploadImage(files[i], tourId);
                    uploadedUrls.push(url);
                    
                    // Update progress
                    if (progressBar) {
                        const progressFill = progressBar.querySelector('.progress-fill');
                        const progressText = progressBar.querySelector('.progress-text');
                        const percent = ((i + 1) / files.length) * 100;
                        progressFill.style.width = `${percent}%`;
                        progressText.textContent = `Uploading ${i + 1}/${files.length} images...`;
                    }
                } catch (error) {
                    console.error(`Error uploading image ${files[i].name}:`, error);
                    Utils.showMessage(`Failed to upload ${files[i].name}`, 'error');
                }
            }
            
            // Clear selected files
            window.selectedFiles[formType] = [];
            this.updateFileList(formType);
            
            // Hide progress
            if (progressBar) {
                setTimeout(() => {
                    progressBar.style.display = 'none';
                }, 1000);
            }
            
            return uploadedUrls;
            
        } catch (error) {
            console.error('Error uploading images:', error);
            if (progressBar) {
                progressBar.style.display = 'none';
            }
            throw error;
        }
    },
    
    editTour(tourId) {
        const tour = Dashboard.getTour(tourId);
        if (!tour) return;
        
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
        this.togglePackageFields('edit', tour.type || 'tour');
        
        // Show current images
        this.showCurrentImages(tour.images || []);
        
        // Populate itinerary fields
        this.populateEditItinerary(tour.itinerary || []);
        
        // Populate pricing fields
        this.populateEditPricing(tour.pricing || []);
        
        // Setup edit modal buttons
        this.setupEditModalButtons(tourId);
        
        // Show modal
        document.getElementById('editModal').style.display = 'flex';
    },
    
    showCurrentImages(images) {
        const container = document.getElementById('currentImages');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!images || images.length === 0) {
            container.innerHTML = '<p class="form-note">No images uploaded yet.</p>';
            return;
        }
        
        images.forEach((imageUrl, index) => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'current-image';
            imageDiv.innerHTML = `
                <img src="${imageUrl}" alt="Tour image ${index + 1}" onerror="this.src='https://via.placeholder.com/80?text=Image+Error'">
                <button type="button" class="btn-remove-image" data-index="${index}" title="Remove image">&times;</button>
            `;
            container.appendChild(imageDiv);
        });
        
        // Setup remove image buttons
        container.querySelectorAll('.btn-remove-image').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.removeImageFromList(index);
            });
        });
    },
    
    removeImageFromList(index) {
        // This would require updating the tour data, but for simplicity,
        // we'll just show a message for now
        Utils.showMessage('Image removal requires saving changes. Please save after removing images.', 'info');
    },
    
    populateEditItinerary(itinerary) {
        const container = document.getElementById('editItineraryFields');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (itinerary.length === 0) {
            const emptyField = document.createElement('div');
            emptyField.className = 'itinerary-item';
            emptyField.innerHTML = `
                <input type="number" placeholder="Day" class="itinerary-day" min="1">
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
                        <span>Day ${index + 1}</span>
                        <button type="button" class="btn-remove-itinerary" title="Remove day">&times;</button>
                    </div>
                    <input type="number" placeholder="Day" class="itinerary-day" min="1" value="${item.day || index + 1}">
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
                <span>Day ${count}</span>
                <button type="button" class="btn-remove-itinerary" title="Remove day">&times;</button>
            </div>
            <input type="number" placeholder="Day" class="itinerary-day" min="1" value="${count}">
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
                    // Update day numbers
                    const container = document.getElementById('editItineraryFields');
                    if (container) {
                        container.querySelectorAll('.itinerary-item').forEach((item, index) => {
                            const header = item.querySelector('.field-header span');
                            if (header) header.textContent = `Day ${index + 1}`;
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
    },
    
    clearForm() {
        const form = document.getElementById('addTourForm');
        if (form) form.reset();
        
        // Reset type to default
        document.getElementById('tourType').value = 'tour';
        this.togglePackageFields('add', 'tour');
        
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
        
        // Clear selected files
        if (window.selectedFiles && window.selectedFiles.add) {
            window.selectedFiles.add = [];
            document.getElementById('selectedFiles').innerHTML = '';
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
        const type = document.getElementById('tourType').value;
        
        const data = {
            type: type,
            title: document.getElementById('tourTitle').value.trim(),
            category: document.getElementById('tourCategory').value.trim() || 'general',
            duration: document.getElementById('tourDuration').value.trim(),
            description: document.getElementById('tourDescription').value.trim(),
            images: [], // Will be populated with uploaded images
            included: Utils.parseLines(document.getElementById('tourIncluded').value),
            excluded: Utils.parseLines(document.getElementById('tourExcluded').value),
            itinerary: this.getItineraryData(),
            pricing: this.getPricingData()
        };
        
        // Add package-specific fields
        if (type === 'package') {
            data.availability = document.getElementById('packageAvailability').value.trim() || 'Daily';
        }
        
        return data;
    },
    
    getEditFormData() {
        const type = document.getElementById('editType').value;
        
        const data = {
            type: type,
            title: document.getElementById('editTitle').value.trim(),
            category: document.getElementById('editCategory').value.trim() || 'general',
            duration: document.getElementById('editDuration').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            images: [], // Will be combined with existing and new images
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
    
    getEditItineraryData() {
        const items = [];
        const itineraryItems = document.querySelectorAll('#editItineraryFields .itinerary-item');
        
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
    },
    
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

window.UI = UI;