// User Interface
const UI = {
    init() {
        console.log('✅ UI initialized');
        
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
        
        // Initialize Dashboard if needed
        if (Dashboard && typeof Dashboard.init === 'function') {
            Dashboard.init();
        }
        
        // Initialize ImageUpload if available
        if (ImageUpload && typeof ImageUpload.init === 'function') {
            ImageUpload.init();
        }
        
        // Load tours if on tours tab
        if (Dashboard && Dashboard.tours && Dashboard.tours.length === 0) {
            setTimeout(() => {
                if (Dashboard && typeof Dashboard.loadTours === 'function') {
                    Dashboard.loadTours();
                }
            }, 1000);
        }
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanupObjectURLs();
        });
    },
    
    // Cleanup object URLs to prevent memory leaks
    cleanupObjectURLs() {
        if (window.objectURLs && window.objectURLs.length > 0) {
            console.log(`🗑️ Cleaning up ${window.objectURLs.length} object URLs`);
            window.objectURLs.forEach(url => {
                try {
                    URL.revokeObjectURL(url);
                } catch (e) {
                    // Silent fail
                }
            });
            window.objectURLs = [];
        }
    },
    
    // Setup refresh button - ADD THIS METHOD
    setupRefreshButton() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            console.log('🔄 Setting up refresh button');
            
            // Remove existing event listeners
            const newBtn = refreshBtn.cloneNode(true);
            refreshBtn.parentNode.replaceChild(newBtn, refreshBtn);
            
            // Add click event
            document.getElementById('refreshBtn').addEventListener('click', async (e) => {
                e.preventDefault();
                console.log('🔄 Refresh button clicked');
                
                // Disable button and show loading
                const btn = e.target;
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
                btn.disabled = true;
                
                try {
                    if (Dashboard && typeof Dashboard.loadTours === 'function') {
                        await Dashboard.loadTours();
                        Utils.showMessage('Data refreshed successfully!', 'success');
                    } else {
                        throw new Error('Dashboard not available');
                    }
                } catch (error) {
                    console.error('❌ Refresh error:', error);
                    Utils.showMessage('Failed to refresh: ' + error.message, 'error');
                } finally {
                    // Restore button
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }
            });
        } else {
            console.warn('⚠️ Refresh button not found in DOM');
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
                const tabContent = document.getElementById(tabId + 'Tab');
                if (tabContent) {
                    tabContent.classList.add('active');
                }
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
        
        // Setup refresh button - ADD THIS CALL
        this.setupRefreshButton();
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
    
    setupModals() {
        const modal = document.getElementById('editModal');
        const closeBtns = document.querySelectorAll('.close-btn');
        
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = 'none';
                this.clearEditModalTempData();
            });
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                this.clearEditModalTempData();
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
    
    clearEditModalTempData() {
        // Cleanup object URLs
        this.cleanupObjectURLs();
        
        // Clear all temporary data
        window.currentEditingTourId = null;
        window.currentTourImages = null;
        window.pendingImageDeletions = [];
        window.newImagesToUpload = [];
        
        // Clear selected files
        if (window.selectedFiles && window.selectedFiles.edit) {
            window.selectedFiles.edit = [];
            document.getElementById('editSelectedFiles').innerHTML = '';
        }
        
        // Clear the current images container
        const currentImagesContainer = document.getElementById('currentImages');
        if (currentImagesContainer) {
            currentImagesContainer.innerHTML = '';
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
                    this.clearEditModalTempData();
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
        
        if (!uploadArea || !browseBtn || !fileInput) return;
        
        // Browse button click
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleAddFormFilesSelected(e.target.files);
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
            this.handleAddFormFilesSelected(e.dataTransfer.files);
        });
    },
    
    setupEditFormImageUpload() {
        const uploadArea = document.getElementById('editUploadArea');
        const browseBtn = document.getElementById('editBrowseBtn');
        const fileInput = document.getElementById('editImageUpload');
        
        if (!uploadArea || !browseBtn || !fileInput) return;
        
        // Browse button click
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleEditFormFilesSelected(e.target.files);
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
            this.handleEditFormFilesSelected(e.dataTransfer.files);
        });
    },
    
    handleAddFormFilesSelected(files) {
        if (!files || files.length === 0) return;
        
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const errors = [];
        const validFiles = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Check file type
            if (!validImageTypes.includes(file.type.toLowerCase())) {
                errors.push(`${file.name}: Invalid file type. Use JPEG, PNG, GIF, or WebP.`);
                continue;
            }
            
            // Check file size
            if (file.size > maxSize) {
                errors.push(`${file.name}: File too large (max 5MB). Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                continue;
            }
            
            validFiles.push(file);
        }
        
        // Show errors
        if (errors.length > 0) {
            Utils.showMessage(errors.join('<br>'), 'error');
        }
        
        // Store valid files
        if (validFiles.length > 0) {
            if (!window.selectedFiles) window.selectedFiles = {};
            if (!window.selectedFiles.add) window.selectedFiles.add = [];
            
            // Add only new files (avoid duplicates)
            validFiles.forEach(file => {
                const isDuplicate = window.selectedFiles.add.some(existing => 
                    existing.name === file.name && existing.size === file.size
                );
                if (!isDuplicate) {
                    window.selectedFiles.add.push(file);
                }
            });
            
            // Update preview
            this.updateAddFormImagePreview();
        }
    },
    
    handleEditFormFilesSelected(files) {
        if (!files || files.length === 0) return;
        
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const errors = [];
        const validFiles = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Check file type
            if (!validImageTypes.includes(file.type.toLowerCase())) {
                errors.push(`${file.name}: Invalid file type`);
                continue;
            }
            
            // Check file size
            if (file.size > maxSize) {
                errors.push(`${file.name}: File too large (max 5MB)`);
                continue;
            }
            
            validFiles.push(file);
        }
        
        // Show errors
        if (errors.length > 0) {
            Utils.showMessage(errors.join('<br>'), 'error');
        }
        
        // Store file references for later upload
        if (validFiles.length > 0) {
            if (!window.newImagesToUpload) window.newImagesToUpload = [];
            
            // Add only new files
            validFiles.forEach(file => {
                const isDuplicate = window.newImagesToUpload.some(existing => 
                    existing.name === file.name && existing.size === file.size
                );
                if (!isDuplicate) {
                    window.newImagesToUpload.push(file);
                }
            });
            
            // Update preview
            this.updateEditModalImagePreview();
        }
    },
    
    updateAddFormImagePreview() {
        // Cleanup old URLs
        this.cleanupObjectURLs();
        
        const container = document.getElementById('addImagesPreview');
        if (!container || !window.selectedFiles || !window.selectedFiles.add) return;
        
        const files = window.selectedFiles.add;
        
        if (files.length === 0) {
            container.innerHTML = '<div class="no-images-message">No images selected yet.</div>';
            return;
        }
        
        container.innerHTML = '';
        
        // Initialize object URLs array if needed
        if (!window.objectURLs) window.objectURLs = [];
        
        files.forEach((file, index) => {
            // Create object URL for preview
            const objectUrl = URL.createObjectURL(file);
            window.objectURLs.push(objectUrl);
            
            const imageDiv = document.createElement('div');
            imageDiv.className = 'add-image-preview';
            imageDiv.innerHTML = `
                <img src="${objectUrl}" alt="Image ${index + 1}" 
                     onerror="this.style.display='none'; this.parentElement.innerHTML+='<div style=\"position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#718096;font-size:12px;\">Image preview failed</div>'" 
                     loading="lazy">
                <span class="image-counter">${index + 1}</span>
                <button type="button" class="btn-remove-new-image" data-index="${index}" title="Remove image">
                    &times;
                </button>
            `;
            container.appendChild(imageDiv);
            
            // Setup remove button
            const removeBtn = imageDiv.querySelector('.btn-remove-new-image');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const indexToRemove = parseInt(e.target.getAttribute('data-index'));
                this.removeAddFormImage(indexToRemove);
            });
        });
    },
    
    removeAddFormImage(index) {
        if (window.selectedFiles && window.selectedFiles.add && window.selectedFiles.add[index]) {
            // Remove from array
            window.selectedFiles.add.splice(index, 1);
            // Update preview
            this.updateAddFormImagePreview();
        }
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
        this.togglePackageFields('edit', tour.type || 'tour');
        
        // Show current images
        this.updateEditModalImagePreview();
        
        // Populate itinerary fields
        this.populateEditItinerary(tour.itinerary || []);
        
        // Populate pricing fields
        this.populateEditPricing(tour.pricing || []);
        
        // Setup edit modal buttons
        this.setupEditModalButtons(tourId);
        
        // Show modal
        document.getElementById('editModal').style.display = 'flex';
    },
    
    updateEditModalImagePreview() {
        // Cleanup old URLs
        this.cleanupObjectURLs();
        
        // Combine existing images (minus deletions) with previews for new images
        const existingImages = window.currentTourImages || [];
        const pendingDeletions = window.pendingImageDeletions || [];
        const newImages = window.newImagesToUpload || [];
        
        // Filter out deleted images
        const currentImages = existingImages.filter((_, index) => !pendingDeletions.includes(index));
        
        // Create object URLs for new images for preview
        const newImagePreviews = newImages.map(file => URL.createObjectURL(file));
        if (!window.objectURLs) window.objectURLs = [];
        newImagePreviews.forEach(url => window.objectURLs.push(url));
        
        // Create combined array for display
        const displayItems = [];
        
        // Add existing images
        currentImages.forEach((imageUrl, index) => {
            displayItems.push({
                url: imageUrl,
                type: 'existing',
                index: index
            });
        });
        
        // Add new image previews
        newImagePreviews.forEach((previewUrl, index) => {
            displayItems.push({
                url: previewUrl,
                type: 'new',
                index: index,
                file: newImages[index]
            });
        });
        
        // Show the combined preview
        this.showCurrentImages(displayItems);
    },
    
    showCurrentImages(displayItems) {
        const container = document.getElementById('currentImages');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!displayItems || displayItems.length === 0) {
            container.innerHTML = '<p class="form-note" style="text-align: center; padding: 2rem;">No images uploaded yet.</p>';
            return;
        }
        
        displayItems.forEach((item, index) => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'current-image';
            
            const img = document.createElement('img');
            img.alt = `Image ${index + 1}`;
            img.loading = 'lazy';
            img.style.objectFit = 'cover';
            img.style.width = '100%';
            img.style.height = '100%';
            
            // Handle loading errors
            img.onerror = () => {
                console.warn(`Failed to load image: ${item.url}`);
                img.style.display = 'none';
                
                const errorMsg = document.createElement('div');
                errorMsg.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #718096;
                    font-size: 12px;
                    text-align: center;
                    padding: 10px;
                `;
                errorMsg.textContent = 'Image failed to load';
                imageDiv.appendChild(errorMsg);
            };
            
            img.src = item.url;
            
            if (item.type === 'new') {
                imageDiv.innerHTML = '';
                imageDiv.appendChild(img);
                imageDiv.innerHTML += `
                    <span class="image-counter">New</span>
                    <button type="button" class="btn-remove-image" data-index="${index}" 
                            data-type="new" data-new-index="${item.index}" title="Remove image">
                        &times;
                    </button>
                `;
            } else {
                const isMarkedForDeletion = window.pendingImageDeletions && 
                    window.pendingImageDeletions.includes(item.index);
                
                if (isMarkedForDeletion) {
                    imageDiv.style.opacity = '0.5';
                    imageDiv.style.filter = 'grayscale(100%)';
                }
                
                imageDiv.innerHTML = '';
                imageDiv.appendChild(img);
                imageDiv.innerHTML += `
                    <span class="image-counter">${index + 1}</span>
                    <button type="button" class="btn-remove-image" data-index="${index}" 
                            data-type="existing" data-original-index="${item.index}" 
                            title="${isMarkedForDeletion ? 'Restore image' : 'Delete image'}">
                        ${isMarkedForDeletion ? '↶' : '×'}
                    </button>
                `;
            }
            
            container.appendChild(imageDiv);
        });
        
        this.setupImageDeletionButtons();
    },
    
    setupImageDeletionButtons() {
        const container = document.getElementById('currentImages');
        if (!container) return;
        
        container.querySelectorAll('.btn-remove-image').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.target.getAttribute('data-index'));
                const type = e.target.getAttribute('data-type');
                
                if (type === 'new') {
                    const newIndex = parseInt(e.target.getAttribute('data-new-index'));
                    this.removeNewImage(newIndex);
                } else {
                    const originalIndex = parseInt(e.target.getAttribute('data-original-index'));
                    this.toggleImageDeletion(originalIndex);
                }
            });
        });
    },
    
    removeNewImage(newIndex) {
        if (window.newImagesToUpload && window.newImagesToUpload[newIndex]) {
            window.newImagesToUpload.splice(newIndex, 1);
            this.updateEditModalImagePreview();
        }
    },
    
    toggleImageDeletion(originalIndex) {
        if (!window.pendingImageDeletions) window.pendingImageDeletions = [];
        
        const isCurrentlyMarked = window.pendingImageDeletions.includes(originalIndex);
        
        if (isCurrentlyMarked) {
            // Restore image
            window.pendingImageDeletions = window.pendingImageDeletions.filter(i => i !== originalIndex);
        } else {
            // Mark for deletion
            window.pendingImageDeletions.push(originalIndex);
        }
        
        this.updateEditModalImagePreview();
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
    },
    
    clearForm() {
        // Cleanup object URLs
        this.cleanupObjectURLs();
        
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
    
    getItineraryData() {
        const items = [];
        const itineraryItems = document.querySelectorAll('#itineraryFields .itinerary-item');
        
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