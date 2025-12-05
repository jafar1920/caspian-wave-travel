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
    },
    
    async loadTours() {
        try {
            if (!FirebaseAdmin.db) return;
            
            const toursList = document.getElementById('toursList');
            if (toursList) {
                toursList.innerHTML = '<div class="loading">Loading tours...</div>';
            }
            
            this.tours = await FirebaseAdmin.getAllTours();
            this.renderTours();
            
            if (Utils) Utils.showMessage(`Loaded ${this.tours.length} tours`, 'success');
            
        } catch (error) {
            console.error('Error loading tours:', error);
            if (Utils) Utils.showMessage('Failed to load tours', 'error');
        }
    },
    
    renderTours() {
        const toursList = document.getElementById('toursList');
        if (!toursList) return;
        
        if (this.tours.length === 0) {
            toursList.innerHTML = '<div class="loading">No tours found</div>';
            return;
        }
        
        toursList.innerHTML = this.tours.map(tour => `
            <div class="tour-card" data-id="${tour.id}">
                <div class="tour-info">
                    <h3>${tour.title || 'Untitled Tour'}</h3>
                    <div class="tour-meta">
                        <span>${tour.duration || 'N/A'}</span>
                        <span>•</span>
                        <span>${tour.category || 'general'}</span>
                        <span>•</span>
                        <span>${tour.groupSize || 'N/A'}</span>
                    </div>
                    <p class="tour-description">${(tour.description || '').substring(0, 150)}...</p>
                </div>
                <div class="tour-actions">
                    <button class="btn btn-small btn-edit" onclick="UI.editTour('${tour.id}')">Edit</button>
                    <button class="btn btn-small btn-delete" onclick="Tours.deleteTour('${tour.id}')">Delete</button>
                </div>
            </div>
        `).join('');
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