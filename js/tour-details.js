// tour-details.js - FIXED VERSION (no circular dependency)
console.log('=== TOUR-DETAILS.JS LOADED ===');

class TourDetailsManager {
    constructor() {
        console.log('TourDetailsManager initialized');
        this.tourData = {
            'baku-city': {
                title: 'Baku City Tour',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/baku.jpg?alt=media&token=96ab7d71-d712-43fa-a8ab-52313c39caee',
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/Carousel-1.jpeg?alt=media&token=3b2ed8c8-a533-46da-bced-22431b5b63d0'
                ],
                description: 'Discover the perfect blend of ancient history and modern architecture in Azerbaijan\'s vibrant capital. This full-day tour takes you through Baku\'s most iconic landmarks, from the medieval Old City to the futuristic Flame Towers.',
                included: [
                    'Professional English-speaking guide',
                    'Comfortable air-conditioned vehicle',
                    'Hotel pickup and drop-off',
                    'Entrance fees to all attractions',
                    'Traditional Azerbaijani lunch',
                    'Bottled water'
                ],
                excluded: [
                    'Personal expenses',
                    'Gratuities (optional)',
                    'Travel insurance',
                    'Additional meals and drinks'
                ],
                pricing: [
                    { persons: '1 Person', price: '$50', description: 'Private tour for one person' },
                    { persons: '2-3 People', price: '$45 per person', description: 'Small group discount' },
                    { persons: '4+ People', price: '$40 per person', description: 'Group discount rate' }
                ],
                duration: 'Full Day (8 hours)',
                groupSize: '1-15 people',
                availability: 'Daily',
                whatsappMessage: 'Hello! I want to book the Baku City Tour'
            },
            'gobustan': {
                title: 'Gobustan & Mud Volcano Tour',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/gobustan-mud-volcano.jpg?alt=media&token=3012552c-c376-4635-9950-3af1e88aab95'
                ],
                description: 'Journey back in time to explore ancient rock carvings and experience the unique natural phenomenon of mud volcanoes in the Gobustan National Park.',
                included: [
                    'Professional guide',
                    'Transportation',
                    'Entrance fees',
                    'Bottled water'
                ],
                excluded: [
                    'Meals',
                    'Personal expenses',
                    'Travel insurance'
                ],
                pricing: [
                    { persons: '1 Person', price: '$80', description: 'Private tour' },
                    { persons: '2-3 People', price: '$70 per person', description: 'Small group' },
                    { persons: '4+ People', price: '$60 per person', description: 'Group rate' }
                ],
                duration: '6-8 Hours',
                groupSize: '1-12 people',
                availability: 'Daily',
                whatsappMessage: 'Hello! I want to book the Gobustan & Mud Volcano Tour'
            },
            'complete-azerbaijan': {
                title: 'Complete Azerbaijan Package',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/package-2.jpg?alt=media&token=c7e54418-2fe4-49a0-b501-91cf8c525f69'
                ],
                description: 'The ultimate 7-day journey through Azerbaijan. Explore Baku, Gobustan, Gabala, and Sheki in one comprehensive package.',
                included: [
                    '6 nights hotel accommodation',
                    'All meals included',
                    'All tours and transfers',
                    'Professional guides',
                    'All entrance fees',
                    '24/7 support'
                ],
                excluded: [
                    'International flights',
                    'Personal expenses',
                    'Travel insurance'
                ],
                pricing: [
                    { persons: '1 Person', price: '$599', description: 'Single occupancy' },
                    { persons: '2 People', price: '$499 per person', description: 'Double occupancy' },
                    { persons: '3+ People', price: '$449 per person', description: 'Group rate' }
                ],
                duration: '6 Nights / 7 Days',
                groupSize: '1-8 people',
                availability: 'Year-round',
                whatsappMessage: 'Hello! I want to book the Complete Azerbaijan Package'
            }
            // Add more tours here as needed
        };
    }

    getTourIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('tour');
    }

    loadTourDetails() {
        const tourId = this.getTourIdFromURL();
        console.log('Loading tour details for:', tourId);
        
        if (!tourId || !this.tourData[tourId]) {
            document.getElementById('tour-content').innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h2>Tour Not Found</h2>
                    <p>Sorry, the tour you're looking for doesn't exist.</p>
                    <a href="index.html" style="color: #0095da;">Return to Home</a>
                </div>
            `;
            return;
        }

        this.renderTourDetails(this.tourData[tourId]);
    }

    renderTourDetails(tour) {
        console.log('Rendering tour:', tour.title);
        document.title = `${tour.title} - CaspianWaveTravel`;
        this.renderGallery(tour.images);
        this.renderTourContent(tour);
    }

    renderGallery(images) {
        const galleryContainer = document.querySelector('.tour-gallery');
        if (!galleryContainer) return;

        let galleryHTML = '';
        let dotsHTML = '';

        images.forEach((image, index) => {
            galleryHTML += `
                <div class="gallery-slide ${index === 0 ? 'active' : ''}">
                    <img src="${image}" alt="Tour Image ${index + 1}">
                </div>
            `;
            dotsHTML += `<span class="gallery-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>`;
        });

        galleryContainer.innerHTML = `
            ${galleryHTML}
            <div class="gallery-controls">
                ${dotsHTML}
            </div>
        `;

        this.initializeGallery();
    }

    renderTourContent(tour) {
        const tourContent = document.getElementById('tour-content');
        if (!tourContent) {
            console.error('tour-content element not found!');
            return;
        }
        
        const includedList = tour.included.map(item => 
            `<li><i class="fas fa-check"></i> ${item}</li>`
        ).join('');

        const excludedList = tour.excluded.map(item => 
            `<li><i class="fas fa-times"></i> ${item}</li>`
        ).join('');

        const pricingOptions = tour.pricing.map(option => `
            <div class="price-option">
                <h4>${option.persons}</h4>
                <div class="price-amount">${option.price}</div>
                <p>${option.description}</p>
            </div>
        `).join('');

        tourContent.innerHTML = `
            <div class="tour-content">
                <div class="tour-info">
                    <h1>${tour.title}</h1>
                    <p class="tour-description">${tour.description}</p>
                    <div class="details-grid">
                        <div class="included-section">
                            <h3><i class="fas fa-check-circle"></i> What's Included</h3>
                            <ul>${includedList}</ul>
                        </div>
                        <div class="excluded-section">
                            <h3><i class="fas fa-times-circle"></i> Not Included</h3>
                            <ul>${excludedList}</ul>
                        </div>
                    </div>
                </div>
                <div class="pricing-card">
                    <h3>Book This ${tour.title.includes('Package') ? 'Package' : 'Tour'}</h3>
                    ${pricingOptions}
                    <button class="book-now-btn" onclick="window.location.href='https://wa.me/994775700711?text=${encodeURIComponent(tour.whatsappMessage)}'">
                        <i class="fab fa-whatsapp"></i> Book on WhatsApp
                    </button>
                    <div style="text-align: center; margin-top: 15px; color: #666; font-size: 0.9rem;">
                        <p><i class="fas fa-clock"></i> Duration: ${tour.duration}</p>
                        <p><i class="fas fa-users"></i> Group Size: ${tour.groupSize}</p>
                        <p><i class="fas fa-calendar"></i> Available: ${tour.availability}</p>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Tour content rendered successfully');
    }

    initializeGallery() {
        const slides = document.querySelectorAll('.gallery-slide');
        const dots = document.querySelectorAll('.gallery-dot');
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });
        
        setInterval(() => {
            const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
            const nextIndex = (currentIndex + 1) % slides.length;
            showSlide(nextIndex);
        }, 5000);
    }
}

// Make it available globally
window.TourDetailsManager = TourDetailsManager;
console.log('TourDetailsManager registered globally');