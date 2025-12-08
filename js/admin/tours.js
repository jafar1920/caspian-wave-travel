// Tours CRUD Operations
const Tours = {
    async addTour() {
        const formData = UI.getFormData();
        
        // Validate
        if (!Utils.validateRequired({
            'title': formData.title,
            'duration': formData.duration,
            'description': formData.description
        })) {
            return;
        }
        
        // Validate images
        if (!window.selectedFiles || !window.selectedFiles.add || window.selectedFiles.add.length === 0) {
            Utils.showMessage('Please upload at least one image', 'error');
            return;
        }
        
        try {
            // First add the tour to get an ID
            const initialTourData = {
                type: formData.type,
                title: formData.title,
                category: formData.category,
                duration: formData.duration,
                description: formData.description,
                images: [], // Start empty, will be filled after upload
                included: formData.included,
                excluded: formData.excluded,
                itinerary: formData.itinerary,
                pricing: formData.pricing,
                isActive: true,
                views: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                whatsappMessage: `Hello! I want to book the ${formData.title}`
            };
            
            // Add package-specific fields
            if (formData.type === 'package') {
                initialTourData.availability = formData.availability || 'Daily';
            }
            
            console.log('Adding item:', initialTourData);
            
            // Add to Firebase to get ID
            const tourId = await FirebaseAdmin.addTour(initialTourData);
            
            // Upload images
            let uploadedImageUrls = [];
            try {
                uploadedImageUrls = await this.uploadImagesForAddForm(tourId);
                if (uploadedImageUrls.length === 0) {
                    throw new Error('No images were uploaded successfully');
                }
            } catch (uploadError) {
                console.error('Error uploading images:', uploadError);
                // Delete the tour if image upload fails
                await FirebaseAdmin.deleteTour(tourId);
                Utils.showMessage('Failed to upload images. Please try again.', 'error');
                return;
            }
            
            // Update the tour with uploaded images
            initialTourData.images = uploadedImageUrls;
            await FirebaseAdmin.updateTour(tourId, {
                images: uploadedImageUrls,
                updatedAt: new Date().toISOString()
            });
            
            // Add to local list
            if (Dashboard) {
                Dashboard.tours.unshift({ 
                    id: tourId, 
                    ...initialTourData
                });
                Dashboard.renderTours();
            }
            
            // Clear form
            UI.clearForm();
            
            // Clear selected files
            if (window.selectedFiles && window.selectedFiles.add) {
                window.selectedFiles.add = [];
            }
            
            // Switch to tours tab
            document.querySelector('[data-tab="tours"]').click();
            
            const itemType = formData.type === 'tour' ? 'Tour' : 'Package';
            if (Utils) Utils.showMessage(`${itemType} created successfully!`, 'success');
            
        } catch (error) {
            console.error('Error adding item:', error);
            if (Utils) Utils.showMessage('Failed to create item: ' + error.message, 'error');
        }
    },
    
    async uploadImagesForAddForm(tourId) {
        if (!window.selectedFiles || !window.selectedFiles.add || window.selectedFiles.add.length === 0) {
            return [];
        }
        
        const files = window.selectedFiles.add;
        const progressBar = document.getElementById('uploadProgress');
        
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
    
    async updateTour() {
        const tourId = document.getElementById('editTourId').value;
        if (!tourId) return;
        
        const updatedData = UI.getEditFormData();
        
        // Validate required fields
        if (!Utils.validateRequired({
            'title': updatedData.title,
            'description': updatedData.description,
            'duration': updatedData.duration
        })) {
            return;
        }
        
        try {
            // Get existing tour data
            const existingTour = Dashboard.getTour(tourId);
            if (!existingTour) {
                throw new Error('Tour not found');
            }
            
            const existingImages = existingTour.images || [];
            const pendingDeletions = window.pendingImageDeletions || [];
            const newImagesToUpload = window.newImagesToUpload || [];
            
            // Step 1: Delete images marked for deletion from storage
            const imagesToDelete = pendingDeletions.map(index => existingImages[index]).filter(url => url);
            await this.deleteImagesFromStorage(imagesToDelete);
            
            // Step 2: Upload new images
            const newImageUrls = await this.uploadNewImages(newImagesToUpload, tourId);
            
            // Step 3: Build final images array (existing minus deletions plus new)
            const finalImages = existingImages
                .filter((_, index) => !pendingDeletions.includes(index))
                .concat(newImageUrls);
            
            // Update the data with final images
            updatedData.images = finalImages;
            
            // Step 4: Update tour in Firebase
            await FirebaseAdmin.updateTour(tourId, updatedData);
            
            // Step 5: Update local list
            if (Dashboard) {
                Dashboard.updateTourList(tourId, updatedData);
            }
            
            // Step 6: Clear all temporary data
            window.currentEditingTourId = null;
            window.currentTourImages = null;
            window.pendingImageDeletions = [];
            window.newImagesToUpload = [];
            
            // Close modal
            document.getElementById('editModal').style.display = 'none';
            
            const itemType = updatedData.type === 'tour' ? 'Tour' : 'Package';
            if (Utils) Utils.showMessage(`${itemType} updated successfully!`, 'success');
            
        } catch (error) {
            console.error('Error updating item:', error);
            if (Utils) Utils.showMessage('Failed to update item: ' + error.message, 'error');
        }
    },
    
    async deleteImagesFromStorage(imageUrls) {
        if (!imageUrls || imageUrls.length === 0) return;
        
        const deletePromises = imageUrls.map(url => ImageUpload.deleteImage(url).catch(err => {
            console.warn('Failed to delete image from storage:', url, err);
            return false;
        }));
        
        await Promise.all(deletePromises);
    },
    
    async uploadNewImages(files, tourId) {
        if (!files || files.length === 0) return [];
        
        const progressBar = document.getElementById('editUploadProgress');
        const uploadedUrls = [];
        
        try {
            // Show progress
            if (progressBar) {
                progressBar.style.display = 'block';
                const progressFill = progressBar.querySelector('.progress-fill');
                const progressText = progressBar.querySelector('.progress-text');
                
                progressFill.style.width = '0%';
                progressText.textContent = `Uploading 0/${files.length} images...`;
            }
            
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
                    console.error(`Error uploading new image ${files[i].name}:`, error);
                    Utils.showMessage(`Failed to upload ${files[i].name}`, 'error');
                }
            }
            
            // Hide progress
            if (progressBar) {
                setTimeout(() => {
                    progressBar.style.display = 'none';
                }, 1000);
            }
            
            return uploadedUrls;
            
        } catch (error) {
            console.error('Error uploading new images:', error);
            if (progressBar) {
                progressBar.style.display = 'none';
            }
            throw error;
        }
    },
    
    async deleteTour(tourId, fromEditModal = false) {
        if (!tourId) return;
        
        const tour = Dashboard.getTour(tourId);
        const tourName = tour ? tour.title : 'this item';
        const itemType = tour?.type === 'package' ? 'Package' : 'Tour';
        
        // Store tourId for use in confirmation
        window.pendingDeleteTourId = tourId;
        window.pendingDeleteFromEditModal = fromEditModal;
        
        // Set confirmation message
        document.getElementById('confirmMessage').textContent = 
            `Are you sure you want to delete the ${itemType.toLowerCase()} "${tourName}"? This action cannot be undone.`;
        
        // Show custom confirmation modal
        document.getElementById('confirmModal').style.display = 'flex';
    }
};

window.Tours = Tours;