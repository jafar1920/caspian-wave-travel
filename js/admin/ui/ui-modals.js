// UI Modals - Modal windows management
const UIModals = {
    init() {
        console.log('✅ UI Modals initialized');
        this.setupModals();
        this.setupConfirmationModal();
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
        if (UICore) UICore.cleanupObjectURLs();
        
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
    }
};

window.UIModals = UIModals;