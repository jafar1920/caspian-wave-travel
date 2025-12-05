// Simple authentication (temporary)
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'admin' && password === '1234') {
        localStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadTours();
    } else {
        document.getElementById('loginError').textContent = 'Invalid credentials!';
    }
}

function logout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

// Check if already logged in
window.onload = function() {
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadTours();
    }
};

let currentTours = [];
let db; // Firebase Firestore instance

// Initialize Firebase
async function initializeFirebase() {
    try {
        // Check if Firebase is already initialized
        if (!firebase.apps.length) {
            // Load Firebase config from your existing config
            const firebaseConfigResponse = await fetch('../js/core/firebase/config.js');
            const configText = await firebaseConfigResponse.text();
            
            // Extract config from the module (simple approach)
            // Or just hardcode it here temporarily for debugging
            const firebaseConfig = {
                apiKey: "AIzaSyAlB40w4svZViv1vCWQRpstobmtl97urnU",
                authDomain: "caspianwavetravel-b9aa4.firebaseapp.com",
                projectId: "caspianwavetravel-b9aa4",
                storageBucket: "caspianwavetravel-b9aa4.firebasestorage.app",
                messagingSenderId: "1088543982224",
                appId: "1:1088543982224:web:c8a825db4a58a58a8c8e15"
            };
            
            firebase.initializeApp(firebaseConfig);
        }
        
        db = firebase.firestore();
        console.log('✅ Firebase initialized for admin');
        return true;
    } catch (error) {
        console.error('❌ Firebase init error:', error);
        return false;
    }
}

// Load all tours
async function loadTours() {
    try {
        console.log('Loading tours...');
        
        // Initialize Firebase if needed
        if (!db) {
            const initialized = await initializeFirebase();
            if (!initialized) {
                throw new Error('Failed to initialize Firebase');
            }
        }
        
        // Get all tours from Firestore
        const querySnapshot = await db.collection('tours').get();
        
        currentTours = [];
        querySnapshot.forEach((doc) => {
            currentTours.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('Loaded tours:', currentTours);
        renderTours(currentTours);
        
    } catch (error) {
        console.error('Error loading tours:', error);
        document.getElementById('toursContainer').innerHTML = 
            `<div class="error">
                <p>Error loading tours: ${error.message}</p>
                <p>Check console for details</p>
            </div>`;
    }
}

// Render tours to the page
function renderTours(tours) {
    const container = document.getElementById('toursContainer');
    
    if (!tours || tours.length === 0) {
        container.innerHTML = '<p class="no-tours">No tours found. Add your first tour!</p>';
        return;
    }
    
    container.innerHTML = tours.map(tour => `
        <div class="tour-card" data-id="${tour.id}">
            <div class="tour-info">
                <h3>${tour.name || tour.title || 'Unnamed Tour'}</h3>
                <div class="tour-meta">
                    <span class="price">${tour.price || tour.cost || 'N/A'}</span>
                    <span class="duration">${tour.duration || tour.days || 'N/A'}</span>
                </div>
                <p class="description">${(tour.description || tour.desc || 'No description').substring(0, 100)}...</p>
                ${tour.image ? `<img src="${tour.image}" alt="${tour.name}" class="tour-thumb">` : ''}
            </div>
            <div class="tour-actions">
                <button class="edit-btn" onclick="openEditModal('${tour.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteTour('${tour.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Add new tour
async function addTour() {
    const name = document.getElementById('tourName').value.trim();
    const price = document.getElementById('tourPrice').value.trim();
    const duration = document.getElementById('tourDuration').value.trim();
    const description = document.getElementById('tourDescription').value.trim();
    const image = document.getElementById('tourImage').value.trim();
    
    if (!name) {
        alert('Please enter a tour name');
        return;
    }
    
    const tourData = {
        name: name,
        price: price,
        duration: duration,
        description: description,
        image: image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    try {
        // Initialize Firebase if needed
        if (!db) {
            await initializeFirebase();
        }
        
        // Add to Firebase
        const docRef = await db.collection('tours').add(tourData);
        
        console.log('Tour added with ID:', docRef.id);
        
        // Clear form
        document.getElementById('tourName').value = '';
        document.getElementById('tourPrice').value = '';
        document.getElementById('tourDuration').value = '';
        document.getElementById('tourDescription').value = '';
        document.getElementById('tourImage').value = '';
        
        // Reload tours
        loadTours();
        alert('Tour added successfully!');
        
    } catch (error) {
        console.error('Error adding tour:', error);
        alert('Failed to add tour: ' + error.message);
    }
}

// Open edit modal
function openEditModal(tourId) {
    const tour = currentTours.find(t => t.id === tourId);
    if (!tour) return;
    
    document.getElementById('editId').value = tourId;
    document.getElementById('editName').value = tour.name || tour.title || '';
    document.getElementById('editPrice').value = tour.price || tour.cost || '';
    document.getElementById('editDuration').value = tour.duration || tour.days || '';
    document.getElementById('editDescription').value = tour.description || tour.desc || '';
    document.getElementById('editImage').value = tour.image || tour.imageUrl || '';
    
    document.getElementById('editModal').style.display = 'flex';
}

// Close modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Update tour
async function updateTour() {
    const tourId = document.getElementById('editId').value;
    const name = document.getElementById('editName').value.trim();
    const price = document.getElementById('editPrice').value.trim();
    const duration = document.getElementById('editDuration').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const image = document.getElementById('editImage').value.trim();
    
    if (!name) {
        alert('Please enter a tour name');
        return;
    }
    
    const updatedData = {
        name: name,
        price: price,
        duration: duration,
        description: description,
        image: image,
        updatedAt: new Date().toISOString()
    };
    
    try {
        if (!db) {
            await initializeFirebase();
        }
        
        await db.collection('tours').doc(tourId).update(updatedData);
        
        closeModal();
        loadTours();
        alert('Tour updated successfully!');
        
    } catch (error) {
        console.error('Error updating tour:', error);
        alert('Failed to update tour: ' + error.message);
    }
}

// Delete tour
async function deleteTour(tourId) {
    if (!confirm('Are you sure you want to delete this tour?')) {
        return;
    }
    
    try {
        if (!db) {
            await initializeFirebase();
        }
        
        await db.collection('tours').doc(tourId).delete();
        
        loadTours();
        alert('Tour deleted successfully!');
        
    } catch (error) {
        console.error('Error deleting tour:', error);
        alert('Failed to delete tour: ' + error.message);
    }
}

// Make functions globally available
window.login = login;
window.logout = logout;
window.addTour = addTour;
window.openEditModal = openEditModal;
window.closeModal = closeModal;
window.updateTour = updateTour;
window.deleteTour = deleteTour;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel loaded');
    
    // Add event listener for Enter key in login
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') login();
        });
    }
    
    // Add event listener for Enter key in add form
    const tourNameInput = document.getElementById('tourName');
    if (tourNameInput) {
        tourNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) addTour();
        });
    }
});