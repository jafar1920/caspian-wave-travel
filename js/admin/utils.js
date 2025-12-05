// Utilities
const Utils = {
    // Show message
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existing = document.querySelector('.message');
        if (existing) existing.remove();
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        
        // Style it
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f56565' : type === 'success' ? '#48bb78' : '#4299e1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageEl);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
        
        // Add animations if not present
        if (!document.querySelector('#message-animations')) {
            const style = document.createElement('style');
            style.id = 'message-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Format date
    formatDate(timestamp) {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString();
    },
    
    // Parse textarea lines into array
    parseLines(text) {
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    },
    
    // Validate required fields
    validateRequired(fields) {
        for (const [name, value] of Object.entries(fields)) {
            if (!value || value.trim() === '') {
                this.showMessage(`Please fill in ${name}`, 'error');
                return false;
            }
        }
        return true;
    }
};

window.Utils = Utils;