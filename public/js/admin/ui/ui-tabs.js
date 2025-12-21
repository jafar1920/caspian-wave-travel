// UI Tabs - Tab management
const UITabs = {
    init() {
        console.log('✅ UI Tabs initialized');
        this.setupTabs();
    },
    
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Update buttons
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update content
                tabContents.forEach(content => content.classList.remove('active'));
                const tabContent = document.getElementById(tabId + 'Tab');
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }
};

window.UITabs = UITabs;