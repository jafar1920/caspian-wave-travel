// Authentication
const Auth = {
    init() {
        console.log('Auth initialized');
        
        // Check if already logged in
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            this.showAdminPanel();
            return;
        }
        
        // Setup login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.login());
        }
        
        // Enter key support
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.login();
            });
        }
    },
    
    login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('loginError');
        
        // Simple hardcoded login
        if (username === 'admin' && password === '1234') {
            localStorage.setItem('adminLoggedIn', 'true');
            this.showAdminPanel();
            
            if (Utils) Utils.showMessage('Login successful', 'success');
        } else {
            errorEl.textContent = 'Invalid credentials. Use: admin / 1234';
        }
    },
    
    logout() {
        // Use the existing confirmation modal
        this.showLogoutConfirmation();
    },
    
    showLogoutConfirmation() {
        // Set confirmation message
        document.getElementById('confirmMessage').textContent = 
            'Are you sure you want to logout? You will need to login again to access the admin panel.';
        
        // Change the confirm button text
        const confirmDeleteBtn = document.getElementById('confirmDelete');
        const originalText = confirmDeleteBtn.innerHTML;
        confirmDeleteBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        
        // Store callback for when confirmed
        window.confirmLogoutCallback = () => {
            this.performLogout();
            // Restore original button text
            confirmDeleteBtn.innerHTML = originalText;
            delete window.confirmLogoutCallback;
        };
        
        // Show confirmation modal
        document.getElementById('confirmModal').style.display = 'flex';
    },
    
    performLogout() {
        localStorage.removeItem('adminLoggedIn');
        
        // Hide admin panel
        document.getElementById('adminPanel').style.display = 'none';
        
        // Show login screen
        const loginScreen = document.getElementById('loginScreen');
        if (loginScreen) {
            loginScreen.style.display = 'flex';
            
            // Clear login form
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('loginError').textContent = '';
        }
        
        // Clear any pending data
        if (window.currentEditingTourId) {
            window.currentEditingTourId = null;
            window.currentTourImages = null;
            window.pendingImageDeletions = [];
            window.newImagesToUpload = [];
        }
        
        // Clear selected files
        if (window.selectedFiles) {
            window.selectedFiles.add = [];
            window.selectedFiles.edit = [];
        }
        
        // Cleanup object URLs
        if (UICore && UICore.cleanupObjectURLs) {
            UICore.cleanupObjectURLs();
        }
        
        // Show logout message
        if (Utils) Utils.showMessage('Logged out successfully', 'info');
        
        console.log('✅ User logged out');
    },
    
    showAdminPanel() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        
        // Initialize other modules
        if (FirebaseAdmin) FirebaseAdmin.init();
        if (UICore) UICore.init();
        if (Dashboard) Dashboard.init();
    }
};

window.Auth = Auth;