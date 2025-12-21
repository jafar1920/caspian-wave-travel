// js/core/firebase/service.js


import { firebaseConfig, COLLECTIONS } from './config.js';

class FirebaseTourService {
    constructor() {
        this.initialized = false;
        this.cache = {};
        this.isOnline = navigator.onLine;
        
        // Listen to online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('Online - using Firebase');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('Offline - using cached data');
        });
    }

    async initialize() {
        if (this.initialized) return true;
        
        try {
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.db = firebase.firestore();
            this.initialized = true;
            
            
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize Firebase:', error);
            return false;
        }
    }

    async getTour(tourId) {
        // Try cache first
        if (this.cache[tourId]) {
            
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
            
            const doc = await this.db.collection(COLLECTIONS.TOURS).doc(tourId).get();
            
            if (doc.exists) {
                const tourData = doc.data();
                
                // Cache it
                this.cache[tourId] = tourData;
                
                
                return tourData;
            } else {
                console.warn(`⚠️ Tour not found in Firebase: ${tourId}`);
                return this.fallbackToStatic(tourId);
            }
            
        } catch (error) {
            console.error(`❌ Error fetching ${tourId}:`, error);
            return this.fallbackToStatic(tourId);
        }
    }
    
    
// In firebase-service.js, update the fallback method:
fallbackToStatic(tourId) {
    
    
    // First check if we have a local reference
    if (typeof tourData !== 'undefined' && tourData[tourId]) {
        return tourData[tourId];
    }
    
    // Then check window.tourData (backward compatibility)
    if (window.tourData && window.tourData[tourId]) {
        return window.tourData[tourId];
    }
    
    console.error(`💥 Tour not found anywhere: ${tourId}`);
    return null;
}

// Add to your existing FirebaseTourService class

async getAllTours() {
    try {
        if (!this.initialized) await this.initialize();
        
        const query = await this.db.collection('tours')
            .where('type', '==', 'tour')
            .where('isActive', '==', true)
            .get();
        
        const tours = [];
        query.forEach(doc => {
            tours.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return tours;
    } catch (error) {
        console.error('Error fetching tours:', error);
        return null;
    }
}

async getAllPackages() {
    try {
        if (!this.initialized) await this.initialize();
        
        const query = await this.db.collection('tours')
            .where('type', '==', 'package')
            .where('isActive', '==', true)
            .get();
        
        const packages = [];
        query.forEach(doc => {
            packages.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return packages;
    } catch (error) {
        console.error('Error fetching packages:', error);
        return null;
    }
}
}

// Create and initialize service
const firebaseService = new FirebaseTourService();
firebaseService.initialize();

// Make globally available
window.FirebaseTourService = firebaseService;