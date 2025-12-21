// Tours CRUD Operations - UPDATED WITH ORGANIZED STORAGE
const Tours = {
    async addTour() {
        const submitBtn = document.querySelector('#addTourForm button[type="submit"]');
        let originalBtnState = null;
        
        try {
            // Store original button state
            if (submitBtn) {
                originalBtnState = {
                    innerHTML: submitBtn.innerHTML,
                    disabled: submitBtn.disabled
                };
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
                submitBtn.disabled = true;
            }
            
            // Use UIHelpers instead of UI
            const formData = UIHelpers.getFormData();
            
            // Validate
            if (!Utils.validateRequired({
                'title': formData.title,
                'duration': formData.duration,
                'description': formData.description
            })) {
                throw new Error('Please fill in all required fields');
            }
            
            // Validate images
            if (!window.selectedFiles || !window.selectedFiles.add || window.selectedFiles.add.length === 0) {
                Utils.showMessage('Please upload at least one image', 'error');
                throw new Error('No images uploaded');
            }
            
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
                // =================== UPDATED: PASS TYPE TO UPLOAD ===================
                uploadedImageUrls = await this.uploadImagesForAddForm(tourId, formData.type);
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
            
            // Clear form
            if (UICore && UICore.clearForm) {
                UICore.clearForm();
            } else if (UIForms && UIForms.clearForm) {
                UIForms.clearForm();
            }
            
            // Clear selected files
            if (window.selectedFiles && window.selectedFiles.add) {
                window.selectedFiles.add = [];
            }
            
            // Switch to tours tab
            const toursTabBtn = document.querySelector('[data-tab="tours"]');
            if (toursTabBtn) {
                toursTabBtn.click();
            }
            
            const itemType = formData.type === 'tour' ? 'Tour' : 'Package';
            if (Utils) Utils.showMessage(`${itemType} created successfully!`, 'success');
            
            // AUTO-REFRESH: Refresh the tours list after 1 second
            setTimeout(() => {
                if (Dashboard && Dashboard.refreshData) {
                    Dashboard.refreshData();
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error adding item:', error);
            if (Utils) Utils.showMessage('Failed to create item: ' + error.message, 'error');
        } finally {
            // Always restore button state
            if (submitBtn && originalBtnState) {
                submitBtn.innerHTML = originalBtnState.innerHTML;
                submitBtn.disabled = originalBtnState.disabled;
            }
        }
    },

    // =================== UPDATED: ADD TYPE PARAMETER ===================
    async uploadImagesForAddForm(tourId, itemType = 'tour') {
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
                
                progressFill.style.width = '0%';
                progressText.textContent = `Uploading 0/${files.length} images...`;
            }
            
            // UPLOAD ALL IMAGES IN PARALLEL (FASTER!)
            // =================== UPDATED: PASS TYPE TO UPLOAD ===================
            const uploadPromises = files.map((file, index) => 
                ImageUpload.uploadImage(file, tourId, { type: itemType }).catch(error => {
                    console.error(`Error uploading image ${file.name}:`, error);
                    Utils.showMessage(`Failed to upload ${file.name}`, 'error');
                    return null; // Return null for failed uploads
                })
            );
            
            // Track progress
            let completed = 0;
            uploadPromises.forEach(promise => {
                promise.then(() => {
                    completed++;
                    if (progressBar) {
                        const progressFill = progressBar.querySelector('.progress-fill');
                        const progressText = progressBar.querySelector('.progress-text');
                        const percent = (completed / files.length) * 100;
                        progressFill.style.width = `${percent}%`;
                        progressText.textContent = `Uploading ${completed}/${files.length} images...`;
                    }
                });
            });
            
            // Wait for all uploads (parallel)
            const results = await Promise.all(uploadPromises);
            
            // Filter out failed uploads (null values)
            const uploadedUrls = results.filter(url => url !== null);
            
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
        const submitBtn = document.querySelector('#editTourForm button[type="submit"]');
        let originalBtnState = null;
        
        try {
            // Store original button state
            if (submitBtn) {
                originalBtnState = {
                    innerHTML: submitBtn.innerHTML,
                    disabled: submitBtn.disabled
                };
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
                submitBtn.disabled = true;
            }
            
            const tourId = document.getElementById('editTourId').value;
            if (!tourId) return;
            
            // Use UIHelpers instead of UI
            const updatedData = UIHelpers.getEditFormData();
            
            // Validate required fields
            if (!Utils.validateRequired({
                'title': updatedData.title,
                'description': updatedData.description,
                'duration': updatedData.duration
            })) {
                throw new Error('Please fill in all required fields');
            }
            
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
            // =================== UPDATED: PASS TYPE TO UPLOAD ===================
            const newImageUrls = await this.uploadNewImages(newImagesToUpload, tourId, existingTour.type);
            
            // Step 3: Build final images array (existing minus deletions plus new)
            const finalImages = existingImages
                .filter((_, index) => !pendingDeletions.includes(index))
                .concat(newImageUrls);
            
            // Update the data with final images
            updatedData.images = finalImages;
            
            // Step 4: Update tour in Firebase
            await FirebaseAdmin.updateTour(tourId, updatedData);
            
            // Step 5: Clear all temporary data
            window.currentEditingTourId = null;
            window.currentTourImages = null;
            window.pendingImageDeletions = [];
            window.newImagesToUpload = [];
            
            // Close modal
            document.getElementById('editModal').style.display = 'none';
            
            const itemType = updatedData.type === 'tour' ? 'Tour' : 'Package';
            if (Utils) Utils.showMessage(`${itemType} updated successfully!`, 'success');
            
            // AUTO-REFRESH: Refresh the tours list after 1 second
            setTimeout(() => {
                if (Dashboard && Dashboard.refreshData) {
                    Dashboard.refreshData();
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error updating item:', error);
            if (Utils) Utils.showMessage('Failed to update item: ' + error.message, 'error');
        } finally {
            // Always restore button state
            if (submitBtn && originalBtnState) {
                submitBtn.innerHTML = originalBtnState.innerHTML;
                submitBtn.disabled = originalBtnState.disabled;
            }
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
    
    // =================== UPDATED: ADD TYPE PARAMETER ===================
    async uploadNewImages(files, tourId, itemType = 'tour') {
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
                    // =================== UPDATED: PASS TYPE TO UPLOAD ===================
                    const url = await ImageUpload.uploadImage(files[i], tourId, { type: itemType });
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
    
    // =================== UPDATED DELETE FUNCTION WITH FOLDER CLEANUP ===================
    async deleteTour(tourId, fromEditModal = false) {
        if (!tourId) return;
        
        const tour = Dashboard.getTour(tourId);
        const tourName = tour ? tour.title : 'this item';
        const itemType = tour?.type === 'package' ? 'Package' : 'Tour';
        
        // Store tourId for use in confirmation
        window.pendingDeleteTourId = tourId;
        window.pendingDeleteFromEditModal = fromEditModal;
        
        // Set confirmation message
        const confirmMessage = document.getElementById('confirmMessage');
        if (confirmMessage) {
            confirmMessage.textContent = 
                `Are you sure you want to delete the ${itemType.toLowerCase()} "${tourName}"? This action cannot be undone.`;
        }
        
        // Show custom confirmation modal
        document.getElementById('confirmModal').style.display = 'flex';
    },
    
    // =================== NEW: EXECUTE DELETE AFTER CONFIRMATION ===================
    async executeDeleteTour() {
        const tourId = window.pendingDeleteTourId;
        const fromEditModal = window.pendingDeleteFromEditModal;
        
        if (!tourId) return;
        
        try {
            // Get tour info before deletion
            const tour = Dashboard.getTour(tourId);
            
            // Delete from Firestore
            await FirebaseAdmin.deleteTour(tourId);
            
            // =================== NEW: DELETE IMAGE FOLDER FROM STORAGE ===================
            if (tour) {
                try {
                    // Delete entire folder for this tour/package
                    await ImageUpload.deleteItemFolder(tourId, tour.type);
                    console.log(`✅ Cleaned up storage folder for ${tour.type} ${tourId}`);
                } catch (storageError) {
                    console.warn('Could not delete storage folder (might not exist):', storageError);
                    // Continue even if storage cleanup fails
                }
            }
            
            // Clear temporary data
            window.pendingDeleteTourId = null;
            window.pendingDeleteFromEditModal = null;
            
            // Close confirmation modal
            document.getElementById('confirmModal').style.display = 'none';
            
            // Close edit modal if deleting from there
            if (fromEditModal) {
                document.getElementById('editModal').style.display = 'none';
            }
            
            // Show success message
            const itemType = tour?.type === 'package' ? 'Package' : 'Tour';
            if (Utils) Utils.showMessage(`${itemType} deleted successfully!`, 'success');
            
            // Refresh the list
            setTimeout(() => {
                if (Dashboard && Dashboard.refreshData) {
                    Dashboard.refreshData();
                }
            }, 500);
            
        } catch (error) {
            console.error('Error deleting tour:', error);
            if (Utils) Utils.showMessage('Failed to delete item: ' + error.message, 'error');
            
            // Clear temporary data even on error
            window.pendingDeleteTourId = null;
            window.pendingDeleteFromEditModal = null;
        }
    }
};

window.Tours = Tours;