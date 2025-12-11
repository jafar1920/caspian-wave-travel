// Firebase Admin
const FirebaseAdmin = {
    db: null,
    storage: null,
    auth: null,
    
    init() {
        try {
            console.log('🔥 Initializing Firebase...');
            
            // Your Firebase config - FIXED authDomain
            const firebaseConfig = {
                apiKey: "AIzaSyAlB40w4svZViv1vCWQRpstobmtl97urnU",
                authDomain: "caspianwavetravel-b9aa4.firebaseapp.com", // FIXED THIS LINE
                projectId: "caspianwavetravel-b9aa4",
                storageBucket: "caspianwavetravel-b9aa4.firebasestorage.app",
                messagingSenderId: "1088543982224",
                appId: "1:1088543982224:web:c8a825db4a58a58a8c8e15"
            };
            
            console.log('📋 Firebase config loaded');
            
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
                console.log('✅ Firebase App initialized');
            } else {
                console.log('✅ Firebase App already initialized');
            }
            
            // Get Firebase services
            this.db = firebase.firestore();
            this.storage = firebase.storage();
            this.auth = firebase.auth();
            
            console.log('✅ Firebase services ready:', {
                db: !!this.db,
                storage: !!this.storage,
                auth: !!this.auth,
                currentUser: this.auth ? this.auth.currentUser : null
            });
            
            // Setup auth state listener
            this.setupAuthStateListener();
            
            // Check initial auth state
            if (this.auth.currentUser) {
                console.log('👤 Already logged in as:', this.auth.currentUser.email);
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminEmail', this.auth.currentUser.email);
            }
            
        } catch (error) {
            console.error('❌ Firebase initialization error:', error);
            
            // Show error to user
            setTimeout(() => {
                const errorEl = document.getElementById('loginError');
                if (errorEl) {
                    errorEl.textContent = 'Firebase initialization failed. Please refresh.';
                    errorEl.style.color = 'red';
                }
            }, 100);
        }
    },
    
    setupAuthStateListener() {
        if (!this.auth) {
            console.error('❌ Auth service not available');
            return;
        }
        
        console.log('👂 Setting up auth state listener...');
        
        this.auth.onAuthStateChanged((user) => {
            console.log('🔐 Auth state changed. User:', user ? user.email : 'No user');
            
            const loginScreen = document.getElementById('loginScreen');
            const adminPanel = document.getElementById('adminPanel');
            
            if (!loginScreen || !adminPanel) {
                console.error('❌ Could not find login or admin elements');
                return;
            }
            
            if (user) {
                // User is signed in
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminEmail', user.email);
                
                // Hide login, show admin
                loginScreen.style.display = 'none';
                adminPanel.style.display = 'block';
                
                console.log('🏠 Showing admin panel...');
                
                // Initialize other modules
                setTimeout(() => {
                    if (UICore && typeof UICore.init === 'function') UICore.init();
                    if (Dashboard && typeof Dashboard.init === 'function') Dashboard.init();
                    if (ImageUpload && typeof ImageUpload.init === 'function') ImageUpload.init();
                    
                    // Load tours
                    if (Dashboard && typeof Dashboard.loadTours === 'function') {
                        Dashboard.loadTours();
                    }
                    
                    // Show welcome message
                    if (Utils && Utils.showMessage) {
                        Utils.showMessage(`Welcome, ${user.email}!`, 'success');
                    }
                }, 100);
                
            } else {
                // User is signed out
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminEmail');
                
                // Show login, hide admin
                loginScreen.style.display = 'flex';
                adminPanel.style.display = 'none';
                
                console.log('🔒 Showing login screen...');
                
                // Clear login form
                const usernameInput = document.getElementById('username');
                const passwordInput = document.getElementById('password');
                const errorEl = document.getElementById('loginError');
                
                if (usernameInput) usernameInput.value = '';
                if (passwordInput) passwordInput.value = '';
                if (errorEl) errorEl.textContent = '';
            }
        }, (error) => {
            console.error('❌ Auth state listener error:', error);
        });
    },
    
    // Get current user
    getCurrentUser() {
        return this.auth ? this.auth.currentUser : null;
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return this.auth && this.auth.currentUser !== null;
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
            console.error('❌ Error getting tours:', error);
            throw error;
        }
    },
    
    // Add tour
    async addTour(tourData) {
        try {
            const user = this.getCurrentUser();
            const tourDataWithUser = {
                ...tourData,
                createdBy: user ? user.email : 'admin',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const docRef = await this.db.collection('tours').add(tourDataWithUser);
            return docRef.id;
        } catch (error) {
            console.error('❌ Error adding tour:', error);
            throw error;
        }
    },
    
    // Update tour
    async updateTour(tourId, tourData) {
        try {
            const user = this.getCurrentUser();
            const updateData = {
                ...tourData,
                updatedBy: user ? user.email : 'admin',
                updatedAt: new Date().toISOString()
            };
            
            await this.db.collection('tours').doc(tourId).update(updateData);
        } catch (error) {
            console.error('❌ Error updating tour:', error);
            throw error;
        }
    },
    
    // Delete tour
    async deleteTour(tourId) {
        try {
            await this.db.collection('tours').doc(tourId).delete();
        } catch (error) {
            console.error('❌ Error deleting tour:', error);
            throw error;
        }
    }
};

window.FirebaseAdmin = FirebaseAdmin;