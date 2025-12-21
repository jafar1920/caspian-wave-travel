// carousel.js - Fixed auto-play issue
let carouselInterval;

function initializeCarousel() {
    
    
    const track = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!track || slides.length === 0) {
       
        return;
    }
    
    let currentSlide = 0;

    // Function to show slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Next slide function
    function nextSlide() {
        let nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Previous slide function
    function prevSlide() {
        let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    // Auto-play function
    function startAutoPlay() {
        // Clear any existing interval first
        stopAutoPlay();
        // Start new interval
        carouselInterval = setInterval(nextSlide, 3000); // Change every 3 seconds
    }
    
    // Stop auto-play on user interaction
    function stopAutoPlay() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
            carouselInterval = null;
        }
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });
    }
    
    // Dot click events
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                stopAutoPlay();
                showSlide(index);
                startAutoPlay();
            });
        });
    }
    
    // Pause auto-play when hovering over carousel
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Start auto-play
    startAutoPlay();
    
   
}

// Header loading function
function enhanceHeaderLoading() {
    const header = document.querySelector('header');
    const headerImageUrl = 'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/center.jpg?alt=media&token=a7e54401-d351-4b6c-8178-02cf88ecc34e';
    
    if (!header) {
       
        return;
    }
    
    const img = new Image();
    
    img.onload = function() {
        setTimeout(() => {
            header.classList.add('image-loaded');
        }, 300);
    };
    
    img.onerror = function() {
        
    };
    
    img.src = headerImageUrl;
}

// Clean up interval when page is hidden (optional performance improvement)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (carouselInterval) {
            clearInterval(carouselInterval);
            carouselInterval = null;
        }
    } else {
        // Restart carousel when page becomes visible again
        const carousel = document.querySelector('.carousel');
        if (carousel && !carouselInterval) {
            initializeCarousel();
        }
    }
});

// Export functions for global access
window.initializeCarousel = initializeCarousel;
window.enhanceHeaderLoading = enhanceHeaderLoading;