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
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('adminLoggedIn');
            location.reload();
        }
    },
    
    showAdminPanel() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        
        // Initialize other modules
        if (FirebaseAdmin) FirebaseAdmin.init();
        if (UI) UI.init();
    }
};

window.Auth = Auth;