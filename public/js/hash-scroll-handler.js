// js/hash-scroll-handler.js


function handleHashNavigation() {
   
    
    // Check if URL has a hash (#something)
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
      
        
        // Function to scroll to element
        function scrollToElement() {
            const targetElement = document.getElementById(hash);
            
            if (targetElement) {
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            } else if (hash === 'home') {
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Element #${hash} not found`);
            }
        }
        
        // Wait a bit for page to load completely
        setTimeout(scrollToElement, 500);
        
        // Also try scrolling again after a longer delay (in case components load late)
        setTimeout(scrollToElement, 1000);
    }
}

// Handle hash when DOM is ready
document.addEventListener('DOMContentLoaded', handleHashNavigation);

// Also handle hash when page fully loads
window.addEventListener('load', function() {
    // Only run if we haven't already handled it from DOMContentLoaded
    if (window.location.hash && !window._hashHandled) {
        setTimeout(handleHashNavigation, 300);
    }
});

// Make function available globally
window.handleHashNavigation = handleHashNavigation;
window.scrollToHash = handleHashNavigation;