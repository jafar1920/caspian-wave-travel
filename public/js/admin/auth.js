// Authentication with Firebase
const Auth = {
    init() {
        console.log('🔐 Auth module initialized');
        
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
    
    async login() {
        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('loginError');
        
        // Clear previous errors
        errorEl.textContent = '';
        
        // Basic validation
        if (!email || !password) {
            errorEl.textContent = 'Please enter both email and password';
            return;
        }
        
        // Show loading state
        const loginBtn = document.getElementById('loginBtn');
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        loginBtn.disabled = true;
        
        try {
            console.log('🔐 Attempting login with:', email);
            
            // Direct Firebase auth call - should work since we initialized globally
            await firebase.auth().signInWithEmailAndPassword(email, password);
            
            console.log('✅ Login successful!');
            // Auth state listener will handle the rest
            
        } catch (error) {
            console.error('❌ Login error:', error);
            
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.code) {
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        errorMessage = 'Invalid email or password';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email address format';
                        break;
                    case 'auth/user-disabled':
                        errorMessage = 'This account has been disabled';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many attempts. Try again later';
                        break;
                    default:
                        errorMessage = `Error: ${error.code}`;
                }
            }
            
            errorEl.textContent = errorMessage;
            
            // Restore button
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    },
    
    logout() {
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
    
    async performLogout() {
        try {
            console.log('👋 Logging out...');
            await firebase.auth().signOut();
            console.log('✅ Logout successful');
        } catch (error) {
            console.error('❌ Logout error:', error);
            if (Utils) Utils.showMessage('Logout failed: ' + error.message, 'error');
        }
    }
};

window.Auth = Auth;