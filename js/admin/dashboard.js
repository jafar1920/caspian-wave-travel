// Dashboard
const Dashboard = {
    tours: [],
    
    init() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadTours());
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => Auth.logout());
        }
        
        // Load tours on init
        this.loadTours();
    },
    
    async loadTours() {
        try {
            if (!FirebaseAdmin.db) return;
            
            const toursList = document.getElementById('toursList');
            if (toursList) {
                toursList.innerHTML = '<div class="loading">Loading...</div>';
            }
            
            this.tours = await FirebaseAdmin.getAllTours();
            this.renderTours();
            
            if (Utils) Utils.showMessage(`Loaded ${this.tours.length} items`, 'success');
            
        } catch (error) {
            console.error('Error loading items:', error);
            if (Utils) Utils.showMessage('Failed to load items', 'error');
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
                        <button class="btn btn-small btn-edit" onclick="UI.editTour('${tour.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-small btn-delete" onclick="Tours.deleteTour('${tour.id}', false)">
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
    }
};

window.Dashboard = Dashboard;