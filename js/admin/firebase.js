// Firebase Admin
const FirebaseAdmin = {
    db: null,
    storage: null,
    
    init() {
        try {
            // Your Firebase config
            const firebaseConfig = {
                apiKey: "AIzaSyAlB40w4svZViv1vCWQRpstobmtl97urnU",
                authDomain: "caspianwavetravel-b9aa4.firebaseapp.com",
                projectId: "caspianwavetravel-b9aa4",
                storageBucket: "caspianwavetravel-b9aa4.firebasestorage.app",
                messagingSenderId: "1088543982224",
                appId: "1:1088543982224:web:c8a825db4a58a58a8c8e15"
            };
            
            // Initialize if not already
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.db = firebase.firestore();
            this.storage = firebase.storage();
            console.log('Firebase connected with storage');
            
            // Load tours
            if (Dashboard) Dashboard.loadTours();
            
        } catch (error) {
            console.error('Firebase error:', error);
            if (Utils) Utils.showMessage('Database connection failed', 'error');
        }
    },
    
    // Get all tours
    async getAllTours() {
        try {
            const snapshot = await this.db.collection('tours').get();
            const tours = [];
            snapshot.forEach(doc => {
                tours.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return tours;
        } catch (error) {
            console.error('Error getting tours:', error);
            throw error;
        }
    },
    
    // Add tour
    async addTour(tourData) {
        try {
            const docRef = await this.db.collection('tours').add(tourData);
            return docRef.id;
        } catch (error) {
            console.error('Error adding tour:', error);
            throw error;
        }
    },
    
    // Update tour
    async updateTour(tourId, tourData) {
        try {
            await this.db.collection('tours').doc(tourId).update(tourData);
        } catch (error) {
            console.error('Error updating tour:', error);
            throw error;
        }
    },
    
    // Delete tour
    async deleteTour(tourId) {
        try {
            await this.db.collection('tours').doc(tourId).delete();
        } catch (error) {
            console.error('Error deleting tour:', error);
            throw error;
        }
    }
};

window.FirebaseAdmin = FirebaseAdmin;