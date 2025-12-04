// js/tour-details/firebase-service.js
console.log('=== FIREBASE SERVICE MODULE LOADED ===');

const FirebaseTourService = {
    // Configuration
    config: {
        apiKey: "AIzaSyAlB40w4svZViv1vCWQRpstobmtl97urnU",
        authDomain: "caspianwavetravel-b9aa4.firebaseapp.com",
        projectId: "caspianwavetravel-b9aa4",
        storageBucket: "caspianwavetravel-b9aa4.firebasestorage.app",
        messagingSenderId: "1088543982224",
        appId: "1:1088543982224:web:c8a825db4a58a58a8c8e15"
    },
    
    // State
    initialized: false,
    db: null,
    cache: {},
    
    // Initialize Firebase
    async initialize() {
        if (this.initialized) return true;
        
        try {
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(this.config);
            }
            
            this.db = firebase.firestore();
            this.initialized = true;
            
            console.log('✅ Firebase service initialized');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize Firebase:', error);
            return false;
        }
    },
    
    // Get a single tour
    async getTour(tourId) {
        // Try cache first
        if (this.cache[tourId]) {
            console.log(`📦 Using cache: ${tourId}`);
            return this.cache[tourId];
        }
        
        // Initialize if needed
        if (!this.initialized) {
            const initialized = await this.initialize();
            if (!initialized) {
                return this.fallbackToStatic(tourId);
            }
        }
        
        try {
            // Get from Firebase
            console.log(`🌐 Fetching from Firebase: ${tourId}`);
            const doc = await this.db.collection('tours').doc(tourId).get();
            
            if (doc.exists) {
                const tourData = doc.data();
                
                // Cache it
                this.cache[tourId] = tourData;
                
                console.log(`✅ Loaded from Firebase: ${tourId}`);
                return tourData;
            } else {
                console.warn(`⚠️ Tour not found in Firebase: ${tourId}`);
                return this.fallbackToStatic(tourId);
            }
            
        } catch (error) {
            console.error(`❌ Error fetching ${tourId}:`, error);
            return this.fallbackToStatic(tourId);
        }
    },
    
    // Get all tours
    async getAllTours() {
        // Initialize if needed
        if (!this.initialized) {
            const initialized = await this.initialize();
            if (!initialized) {
                return window.tourData || {};
            }
        }
        
        try {
            console.log('🌐 Fetching all tours from Firebase...');
            const snapshot = await this.db.collection('tours').get();
            const tours = {};
            
            snapshot.forEach(doc => {
                tours[doc.id] = doc.data();
                this.cache[doc.id] = doc.data();
            });
            
            console.log(`✅ Loaded ${snapshot.size} tours from Firebase`);
            return tours;
            
        } catch (error) {
            console.error('❌ Error fetching all tours:', error);
            return window.tourData || {};
        }
    },
    
    // Fallback to static data
    fallbackToStatic(tourId) {
        console.log(`🔄 Falling back to static data: ${tourId}`);
        
        if (window.tourData && window.tourData[tourId]) {
            return window.tourData[tourId];
        }
        
        console.error(`💥 Tour not found anywhere: ${tourId}`);
        return null;
    },
    
    // Clear cache
    clearCache() {
        this.cache = {};
        console.log('🧹 Cache cleared');
    }
};

// Initialize immediately
FirebaseTourService.initialize();

// Make globally available
window.FirebaseTourService = FirebaseTourService;

console.log('Firebase service ready. Use: FirebaseTourService.getTour("baku-city")');