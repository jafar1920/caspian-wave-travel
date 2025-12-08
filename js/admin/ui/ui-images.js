// UI Images - Image upload and preview management
const UIImages = {
    init() {
        console.log('✅ UI Images initialized');
        this.setupImageUpload();
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
        if (UICore) UICore.cleanupObjectURLs();
        
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
    
    updateEditModalImagePreview() {
        // Cleanup old URLs
        if (UICore) UICore.cleanupObjectURLs();
        
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
    }
};

window.UIImages = UIImages;