// Dashboard
const Dashboard = {
    tours: [],
    
    init() {
        console.log('✅ Dashboard initialized');
        
        // Setup event delegation for tour cards
        this.setupEventDelegation();
        
        // Setup refresh button
        this.setupRefreshButton();
        
        // Setup logout button
        this.setupLogoutButton();
        
        // Load tours on init
        this.loadTours();
    },
    
    setupEventDelegation() {
        // Listen for clicks on the tours list container
        const toursList = document.getElementById('toursList');
        if (toursList) {
            toursList.addEventListener('click', (e) => {
                // Handle edit button clicks
                if (e.target.closest('.btn-edit') || e.target.classList.contains('btn-edit')) {
                    this.handleEditClick(e);
                }
                
                // Handle delete button clicks
                if (e.target.closest('.btn-delete') || e.target.classList.contains('btn-delete')) {
                    this.handleDeleteClick(e);
                }
            });
        }
    },
    
    handleEditClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const editButton = e.target.closest('.btn-edit');
        if (!editButton) return;
        
        const tourCard = editButton.closest('.tour-card');
        if (!tourCard) return;
        
        const tourId = tourCard.getAttribute('data-id');
        if (!tourId) return;
        
        console.log(`✏️ Edit clicked for tour: ${tourId}`);
        
        // Use UICore.editTour if available
        if (typeof UICore !== 'undefined' && UICore.editTour) {
            UICore.editTour(tourId);
        } else {
            console.error('UICore.editTour not available');
            Utils.showMessage('Edit function not available. Please refresh the page.', 'error');
        }
    },
    
    handleDeleteClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const deleteButton = e.target.closest('.btn-delete');
        if (!deleteButton) return;
        
        const tourCard = deleteButton.closest('.tour-card');
        if (!tourCard) return;
        
        const tourId = tourCard.getAttribute('data-id');
        if (!tourId) return;
        
        console.log(`🗑️ Delete clicked for tour: ${tourId}`);
        
        // Use Tours.deleteTour if available
        if (typeof Tours !== 'undefined' && Tours.deleteTour) {
            Tours.deleteTour(tourId, false);
        } else {
            console.error('Tours.deleteTour not available');
            Utils.showMessage('Delete function not available. Please refresh the page.', 'error');
        }
    },
    
    setupRefreshButton() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleRefreshClick();
            });
        } else {
            console.warn('⚠️ Refresh button not found');
        }
    },
    
    handleRefreshClick() {
        console.log('🔄 Refresh button clicked');
        
        const refreshBtn = document.getElementById('refreshBtn');
        if (!refreshBtn) return;
        
        // Show loading state
        const originalHTML = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        // Store original state for restoration
        window.refreshButtonState = {
            element: refreshBtn,
            originalHTML: originalHTML
        };
        
        // Load tours with force refresh
        this.loadTours(true).finally(() => {
            // Always restore button when loading is done (success or error)
            this.restoreRefreshButton();
        });
    },
    
    restoreRefreshButton() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (!refreshBtn) return;
        
        // Restore original state
        if (window.refreshButtonState && window.refreshButtonState.originalHTML) {
            refreshBtn.innerHTML = window.refreshButtonState.originalHTML;
        } else {
            // Fallback
            refreshBtn.innerHTML = '<i class="fas fa-sync"></i> Refresh';
        }
        
        refreshBtn.disabled = false;
        
        // Clear stored state
        delete window.refreshButtonState;
    },
    
    setupLogoutButton() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (Auth && Auth.logout) {
                    Auth.logout();
                }
            });
        }
    },
    
    async loadTours(forceRefresh = false) {
        try {
            console.log('📥 Loading tours...', forceRefresh ? '(forced)' : '');
            
            // Show loading state
            const toursList = document.getElementById('toursList');
            if (toursList) {
                toursList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
            }
            
            if (!FirebaseAdmin || !FirebaseAdmin.db) {
                console.warn('Firebase not initialized, waiting...');
                setTimeout(() => this.loadTours(forceRefresh), 1000);
                return;
            }
            
            // Get tours from Firebase
            this.tours = await FirebaseAdmin.getAllTours();
            this.renderTours();
            
            console.log(`✅ Loaded ${this.tours.length} items`);
            
            // Show success message only on manual refresh
            if (forceRefresh && Utils) {
                Utils.showMessage(`Refreshed ${this.tours.length} items`, 'success');
            }
            
        } catch (error) {
            console.error('❌ Error loading items:', error);
            
            // Show error in tours list
            const toursList = document.getElementById('toursList');
            if (toursList) {
                toursList.innerHTML = `
                    <div class="loading error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load items</p>
                        <small>${error.message}</small>
                        <button class="btn btn-small retry-btn" style="margin-top: 10px;">
                            <i class="fas fa-redo"></i> Retry
                        </button>
                    </div>
                `;
                
                // Add event listener to retry button
                const retryBtn = toursList.querySelector('.retry-btn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', () => this.loadTours(true));
                }
            }
            
            if (Utils) Utils.showMessage('Failed to load items: ' + error.message, 'error');
        } finally {
            // ALWAYS restore refresh button in finally block
            this.restoreRefreshButton();
        }
    },
    
    renderTours() {
        const toursList = document.getElementById('toursList');
        if (!toursList) return;
        
        if (this.tours.length === 0) {
            toursList.innerHTML = '<div class="loading">No items found. Add your first tour or package!</div>';
            return;
        }
        
        // Sort items by creation date (newest first)
        const sortedTours = [...this.tours].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });
        
        toursList.innerHTML = sortedTours.map(tour => {
            const isPackage = tour.type === 'package';
            const badgeClass = isPackage ? 'tour-badge package' : 'tour-badge';
            const badgeText = isPackage ? 'Package' : 'Tour';
            const availability = isPackage && tour.availability ? ` • ${tour.availability}` : '';
            
            // REMOVED inline onclick handlers - using event delegation instead
            return `
                <div class="tour-card" data-id="${tour.id}">
                    <div class="tour-info">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <h3>${tour.title || 'Untitled'}</h3>
                            <span class="${badgeClass}">${badgeText}</span>
                        </div>
                        <div class="tour-meta">
                            <span><i class="far fa-clock"></i> ${tour.duration || 'N/A'}</span>
                            <span>•</span>
                            <span><i class="fas fa-tag"></i> ${tour.category || 'general'}</span>
                            <span>•</span>
                            <span><i class="far fa-calendar"></i> ${Utils.formatDate(tour.createdAt)}</span>
                            ${availability ? '<span>•</span><span><i class="fas fa-calendar-check"></i> ' + tour.availability + '</span>' : ''}
                        </div>
                        <p class="tour-description">${(tour.description || '').substring(0, 150)}...</p>
                        <div class="tour-stats">
                            <span class="stat"><i class="fas fa-image"></i> ${tour.images ? tour.images.length : 0} images</span>
                            <span class="stat"><i class="fas fa-list-ol"></i> ${tour.itinerary ? tour.itinerary.length : 0} days</span>
                            <span class="stat"><i class="fas fa-eye"></i> ${tour.views || 0} views</span>
                            ${tour.isActive === false ? '<span class="stat inactive"><i class="fas fa-ban"></i> Inactive</span>' : ''}
                        </div>
                    </div>
                    <div class="tour-actions">
                        <button class="btn btn-small btn-edit" data-id="${tour.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-small btn-delete" data-id="${tour.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    getTour(id) {
        return this.tours.find(tour => tour.id === id);
    },
    
    updateTourList(tourId, updatedData) {
        const index = this.tours.findIndex(tour => tour.id === tourId);
        if (index !== -1) {
            this.tours[index] = { ...this.tours[index], ...updatedData };
            this.renderTours();
        }
    },
    
    removeFromList(tourId) {
        this.tours = this.tours.filter(tour => tour.id !== tourId);
        this.renderTours();
    },
    
    // Global refresh function - can be called from anywhere
    refreshData() {
        console.log('🔄 Refreshing data...');
        
        const refreshBtn = document.getElementById('refreshBtn');
        if (!refreshBtn) {
            // If no button, just load tours
            this.loadTours(true);
            return;
        }
        
        // Show loading on button
        const originalHTML = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        // Store original state
        window.refreshButtonState = {
            element: refreshBtn,
            originalHTML: originalHTML
        };
        
        // Load tours
        this.loadTours(true);
    }
};

window.Dashboard = Dashboard;