// Admin Initialization
const AdminInit = {
    init() {
        console.log('🚀 Admin panel initializing...');
        
        // Initialize FirebaseAdmin FIRST (this sets up the auth listener)
        if (typeof FirebaseAdmin !== 'undefined' && FirebaseAdmin.init) {
            console.log('🔥 Initializing FirebaseAdmin...');
            FirebaseAdmin.init();
        } else {
            console.error('❌ FirebaseAdmin not found or missing init()');
        }
        
        // Then initialize Auth (for login button handlers)
        if (typeof Auth !== 'undefined' && Auth.init) {
            console.log('🔐 Initializing Auth...');
            Auth.init();
        }
        
        // Log all loaded modules for debugging
        this.logModules();
    },
    
    logModules() {
        setTimeout(() => {
            console.log('📦 Loaded modules:', {
                FirebaseAdmin: typeof FirebaseAdmin !== 'undefined',
                Auth: typeof Auth !== 'undefined',
                Dashboard: typeof Dashboard !== 'undefined',
                Tours: typeof Tours !== 'undefined',
                UICore: typeof UICore !== 'undefined',
                Utils: typeof Utils !== 'undefined',
                ImageUpload: typeof ImageUpload !== 'undefined'
            });
        }, 500);
    }
};

window.AdminInit = AdminInit;