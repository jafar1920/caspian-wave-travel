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
                uploadedImageUrls = await UI.uploadSelectedImages('add', tourId);
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
            // Get existing tour to preserve existing images
            const existingTour = Dashboard.getTour(tourId);
            const existingImages = existingTour?.images || [];
            
            // Upload new images if any
            let newImageUrls = [];
            if (window.selectedFiles && window.selectedFiles.edit && window.selectedFiles.edit.length > 0) {
                try {
                    newImageUrls = await UI.uploadSelectedImages('edit', tourId);
                } catch (uploadError) {
                    console.error('Error uploading images:', uploadError);
                    // Continue with existing images even if new upload fails
                }
            }
            
            // Combine existing images with newly uploaded images
            updatedData.images = [...existingImages, ...newImageUrls];
            
            // Update tour in Firebase
            await FirebaseAdmin.updateTour(tourId, updatedData);
            
            // Update local list
            if (Dashboard) {
                Dashboard.updateTourList(tourId, updatedData);
            }
            
            // Clear selected files for edit form
            if (window.selectedFiles && window.selectedFiles.edit) {
                window.selectedFiles.edit = [];
            }
            
            // Close modal
            document.getElementById('editModal').style.display = 'none';
            
            const itemType = updatedData.type === 'tour' ? 'Tour' : 'Package';
            if (Utils) Utils.showMessage(`${itemType} updated successfully!`, 'success');
            
        } catch (error) {
            console.error('Error updating item:', error);
            if (Utils) Utils.showMessage('Failed to update item: ' + error.message, 'error');
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