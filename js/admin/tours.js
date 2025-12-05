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
        
        try {
            // Prepare tour data for Firebase
            const tourData = {
                title: formData.title,
                category: formData.category,
                duration: formData.duration,
                groupSize: formData.groupSize || '1-12 people',
                description: formData.description,
                images: formData.images,
                included: formData.included,
                excluded: formData.excluded,
                itinerary: formData.itinerary,
                pricing: formData.pricing,
                type: 'tour',
                isActive: true,
                views: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                whatsappMessage: `Hello! I want to book the ${formData.title}`
            };
            
            console.log('Adding tour:', tourData);
            
            // Add to Firebase
            const tourId = await FirebaseAdmin.addTour(tourData);
            
            // Add to local list
            if (Dashboard) {
                Dashboard.tours.unshift({ id: tourId, ...tourData });
                Dashboard.renderTours();
            }
            
            // Clear form
            UI.clearForm();
            
            // Switch to tours tab
            document.querySelector('[data-tab="tours"]').click();
            
            if (Utils) Utils.showMessage('Tour created successfully!', 'success');
            
        } catch (error) {
            console.error('Error adding tour:', error);
            if (Utils) Utils.showMessage('Failed to create tour: ' + error.message, 'error');
        }
    },
    
    async updateTour() {
        const tourId = document.getElementById('editTourId').value;
        if (!tourId) return;
        
        const updatedData = {
            title: document.getElementById('editTitle').value.trim(),
            description: document.getElementById('editDescription').value.trim(),
            duration: document.getElementById('editDuration').value.trim(),
            updatedAt: new Date().toISOString()
        };
        
        // Validate
        if (!Utils.validateRequired({
            'title': updatedData.title,
            'description': updatedData.description,
            'duration': updatedData.duration
        })) {
            return;
        }
        
        try {
            await FirebaseAdmin.updateTour(tourId, updatedData);
            
            // Update local list
            if (Dashboard) {
                Dashboard.updateTourList(tourId, updatedData);
            }
            
            // Close modal
            document.getElementById('editModal').style.display = 'none';
            
            if (Utils) Utils.showMessage('Tour updated successfully!', 'success');
            
        } catch (error) {
            console.error('Error updating tour:', error);
            if (Utils) Utils.showMessage('Failed to update tour: ' + error.message, 'error');
        }
    },
    
    async deleteTour(tourId) {
        if (!tourId) return;
        
        const tour = Dashboard.getTour(tourId);
        const tourName = tour ? tour.title : 'this tour';
        
        if (!confirm(`Are you sure you want to delete "${tourName}"?`)) {
            return;
        }
        
        try {
            await FirebaseAdmin.deleteTour(tourId);
            
            // Remove from local list
            if (Dashboard) {
                Dashboard.removeFromList(tourId);
            }
            
            if (Utils) Utils.showMessage('Tour deleted successfully!', 'success');
            
        } catch (error) {
            console.error('Error deleting tour:', error);
            if (Utils) Utils.showMessage('Failed to delete tour: ' + error.message, 'error');
        }
    }
};

window.Tours = Tours;