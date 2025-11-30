// tour-details.js - UPDATED WITH SHOW MORE/LESS ITINERARY
console.log('=== TOUR-DETAILS.JS LOADED ===');

class TourDetailsManager {
    constructor() {
        console.log('TourDetailsManager initialized');
        this.tourData = {
            // SINGLE TOURS
            'baku-city': {
                title: 'Baku City Tour',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/baku.jpg?alt=media&token=96ab7d71-d712-43fa-a8ab-52313c39caee',
                    'https://images.unsplash.com/photo-1596484552994-4f70a5a5f801?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1596484552834-4f70a5a5f801?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
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
                whatsappMessage: 'Hello! I want to book the Baku City Tour',
                itinerary: [
                    {
                        day: 1,
                        title: "Old City Exploration",
                        description: "Explore the UNESCO World Heritage Old City (Icherisheher), visit the Palace of Shirvanshahs, Maiden Tower, and ancient caravanserais."
                    },
                    {
                        day: 2,
                        title: "Modern Architecture & Culture",
                        description: "Visit the Heydar Aliyev Center, Flame Towers, and Baku Boulevard. Experience local cuisine at traditional restaurants."
                    }
                ]
            },
            'gobustan': {
                title: 'Gobustan & Mud Volcano Tour',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/gobustan-mud-volcano.jpg?alt=media&token=3012552c-c376-4635-9950-3af1e88aab95',
                    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1559827260-dc66d52bef18?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
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
                whatsappMessage: 'Hello! I want to book the Gobustan & Mud Volcano Tour',
                itinerary: [
                    {
                        day: 1,
                        title: "Gobustan Rock Art",
                        description: "Explore the ancient rock carvings at Gobustan National Park, dating back 40,000 years. Visit the museum to learn about prehistoric life."
                    },
                    {
                        day: 2,
                        title: "Mud Volcano Adventure",
                        description: "Experience the unique mud volcanoes and natural phenomena. See the bubbling mud pools and learn about this geological wonder."
                    }
                ]
            },
            'shahdag': {
                title: 'Shahdag Tour',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/shahdagg.jpg?alt=media&token=1a89deb1-2a1e-4344-956b-5b9041ae12c9',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1464822759844-d62ed8fbf54f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                ],
                description: 'Experience the breathtaking beauty of Shahdag Mountain Resort. Enjoy stunning mountain views, fresh air, and various outdoor activities.',
                included: [
                    'Professional guide',
                    'Transportation',
                    'Entrance fees',
                    'Lunch',
                    'Bottled water'
                ],
                excluded: [
                    'Ski equipment rental',
                    'Personal expenses',
                    'Travel insurance'
                ],
                pricing: [
                    { persons: '1 Person', price: '$70', description: 'Private tour' },
                    { persons: '2-3 People', price: '$60 per person', description: 'Small group' },
                    { persons: '4+ People', price: '$50 per person', description: 'Group rate' }
                ],
                duration: 'Full Day Tour',
                groupSize: '1-8 people',
                availability: 'Daily',
                whatsappMessage: 'Hello! I want to book the Shahdag Tour',
                itinerary: [
                    {
                        day: 1,
                        title: "Mountain Resort Exploration",
                        description: "Arrive at Shahdag Mountain Resort. Explore the facilities and enjoy the stunning mountain scenery. Optional cable car ride."
                    },
                    {
                        day: 2,
                        title: "Outdoor Activities",
                        description: "Enjoy various outdoor activities including hiking, zip-lining, or seasonal sports. Experience the fresh mountain air."
                    }
                ]
            },
            'gabala': {
                title: 'Gabala Tour',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/gbl.jpg?alt=media&token=739490fe-e3c1-43f9-ba0a-f8a900b99350',
                    'https://images.unsplash.com/photo-1570654621852-a4d4b3c29d45?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1570654621852-a4d4b3c29d46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                ],
                description: 'Explore the beautiful city of Gabala, known for its stunning mountains, cable car rides, and beautiful Nohur Lake.',
                included: [
                    'Professional guide',
                    'Transportation',
                    'Entrance fees',
                    'Lunch',
                    'Bottled water'
                ],
                excluded: [
                    'Cable car tickets',
                    'Personal expenses',
                    'Travel insurance'
                ],
                pricing: [
                    { persons: '1 Person', price: '$70', description: 'Private tour' },
                    { persons: '2-3 People', price: '$60 per person', description: 'Small group' },
                    { persons: '4+ People', price: '$50 per person', description: 'Group rate' }
                ],
                duration: 'Full Day Tour',
                groupSize: '1-10 people',
                availability: 'Daily',
                whatsappMessage: 'Hello! I want to book the Gabala Tour',
                itinerary: [
                    {
                        day: 1,
                        title: "Nohur Lake & Cable Car",
                        description: "Visit the beautiful Nohur Lake and enjoy a cable car ride with panoramic mountain views. Explore the surrounding nature."
                    },
                    {
                        day: 2,
                        title: "Gabala City Tour",
                        description: "Explore Gabala city center, visit local markets, and experience the cultural heritage of this mountain region."
                    }
                ]
            },
            'absheron': {
                title: 'Absheron Tour',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/absheron.jpg?alt=media&token=bb727f41-e24a-47ce-b0bc-962ebb9fd160',
                    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1544551763-46a013bb70d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                ],
                description: 'Discover the Absheron Peninsula with its ancient temples, burning mountain, and fascinating historical sites.',
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
                    { persons: '1 Person', price: '$70', description: 'Private tour' },
                    { persons: '2-3 People', price: '$60 per person', description: 'Small group' },
                    { persons: '4+ People', price: '$50 per person', description: 'Group rate' }
                ],
                duration: '4-5 Hours',
                groupSize: '1-12 people',
                availability: 'Daily',
                whatsappMessage: 'Hello! I want to book the Absheron Tour',
                itinerary: [
                    {
                        day: 1,
                        title: "Ateshgah Fire Temple",
                        description: "Visit the ancient Zoroastrian fire temple of Ateshgah, learn about its history and significance in fire worship."
                    },
                    {
                        day: 2,
                        title: "Yanar Dag & Historical Sites",
                        description: "See the burning mountain of Yanar Dag and explore other historical sites on the Absheron Peninsula."
                    }
                ]
            },
            'shamaki': {
                title: 'Shamakhi Tour',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/shamaki.jpg?alt=media&token=810d0a4c-00bc-4bc4-a245-7974395a3ad6',
                    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1501785888041-af3ef285b471?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                ],
                description: 'Visit the historic city of Shamakhi, famous for its ancient Juma Mosque, beautiful landscapes, and rich cultural heritage.',
                included: [
                    'Professional guide',
                    'Transportation',
                    'Entrance fees',
                    'Lunch',
                    'Bottled water'
                ],
                excluded: [
                    'Personal expenses',
                    'Gratuities',
                    'Travel insurance'
                ],
                pricing: [
                    { persons: '1 Person', price: '$70', description: 'Private tour' },
                    { persons: '2-3 People', price: '$60 per person', description: 'Small group' },
                    { persons: '4+ People', price: '$50 per person', description: 'Group rate' }
                ],
                duration: 'Full Day Tour',
                groupSize: '1-10 people',
                availability: 'Daily',
                whatsappMessage: 'Hello! I want to book the Shamakhi Tour',
                itinerary: [
                    {
                        day: 1,
                        title: "Juma Mosque & Old City",
                        description: "Visit the historic Juma Mosque, one of the oldest mosques in the Caucasus. Explore the old city and its architecture."
                    },
                    {
                        day: 2,
                        title: "Cultural Heritage Sites",
                        description: "Explore Shamakhi's rich cultural heritage, including mausoleums, historical monuments, and traditional crafts."
                    },
                    {
                        day: 3,
                        title: "Cultural Heritage Sites",
                        description: "Explore Shamakhi's rich cultural heritage, including mausoleums, historical monuments, and traditional crafts."
                    },
                    {
                        day: 4,
                        title: "Cultural Heritage Sites",
                        description: "Explore Shamakhi's rich cultural heritage, including mausoleums, historical monuments, and traditional crafts."
                    }
                ]
            },
            'sheki': {
                title: 'Sheki Tour',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/shaki.jpg?alt=media&token=5612b775-7d53-4869-8f83-912606f91b09',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                ],
                description: 'Discover the ancient city of Sheki, famous for its stunning architecture, Palace of Sheki Khans, and rich cultural heritage.',
                included: [
                    'Professional guide',
                    'Transportation',
                    'Entrance fees',
                    'Lunch',
                    'Bottled water'
                ],
                excluded: [
                    'Personal expenses',
                    'Gratuities',
                    'Travel insurance'
                ],
                pricing: [
                    { persons: '1 Person', price: '$70', description: 'Private tour' },
                    { persons: '2-3 People', price: '$60 per person', description: 'Small group' },
                    { persons: '4+ People', price: '$50 per person', description: 'Group rate' }
                ],
                duration: 'Full Day Tour',
                groupSize: '1-10 people',
                availability: 'Daily',
                whatsappMessage: 'Hello! I want to book the Sheki Tour',
                itinerary: [
                    {
                        day: 1,
                        title: "Sheki Khan's Palace",
                        description: "Visit the magnificent Palace of Sheki Khans with its stunning stained glass and intricate architecture."
                    },
                    {
                        day: 2,
                        title: "Caravanserai & Local Crafts",
                        description: "Explore the ancient caravanserai, learn about traditional Sheki silk production, and visit local craft workshops."
                    }
                ]
            },
            'hotels': {
                title: 'Hotel Accommodation',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/hotel.jpg?alt=media&token=58a628f7-a4f5-4c2e-9374-0cf615217a5c',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                ],
                description: 'We offer a wide range of hotel accommodations throughout Azerbaijan. From luxury 5-star hotels to comfortable budget options, we have the perfect place for your stay.',
                included: [
                    'Hotel accommodation',
                    'Daily breakfast',
                    'Free WiFi',
                    '24/7 customer support',
                    'Flexible cancellation policy'
                ],
                excluded: [
                    'Airport transfers',
                    'Meals (except breakfast)',
                    'Room service charges',
                    'Mini-bar expenses'
                ],
                pricing: [
                    { persons: 'Budget Hotels', price: 'From $70/night', description: 'Comfortable 3-star accommodation' },
                    { persons: 'Mid-Range Hotels', price: 'From $120/night', description: 'Quality 4-star hotels' },
                    { persons: 'Luxury Hotels', price: 'From $200/night', description: 'Premium 5-star experience' }
                ],
                duration: 'Flexible Stay',
                groupSize: '1+ people',
                availability: 'Year-round',
                whatsappMessage: 'Hello! I want to book hotel accommodation',
                itinerary: [
                    {
                        day: 1,
                        title: "Hotel Selection & Booking",
                        description: "Choose from our curated selection of hotels based on your preferences and budget requirements."
                    },
                    {
                        day: 2,
                        title: "Accommodation Arrangements",
                        description: "We handle all booking arrangements and provide 24/7 support during your stay."
                    }
                ]
            },

            // PACKAGES
            'baku-city-escape': {
                title: 'Baku City Escape Package',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/package-1.jpg?alt=media&token=40a6477f-8fbf-4192-850a-7241717dec50',
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                ],
                description: 'A perfect 4-day getaway exploring the best of Baku. Includes hotel accommodation, city tours, and authentic dining experiences.',
                included: [
                    '3 nights hotel accommodation',
                    'Daily breakfast',
                    'Baku City Tour',
                    'Old City walking tour',
                    'Traditional dinner experience',
                    'Airport transfers',
                    '24/7 support'
                ],
                excluded: [
                    'International flights',
                    'Personal expenses',
                    'Travel insurance',
                    'Additional meals'
                ],
                pricing: [
                    { persons: '1 Person', price: '$299', description: 'Single occupancy' },
                    { persons: '2 People', price: '$249 per person', description: 'Double occupancy' },
                    { persons: '3+ People', price: '$219 per person', description: 'Group rate' }
                ],
                duration: '3 Nights / 4 Days',
                groupSize: '1-6 people',
                availability: 'Year-round',
                whatsappMessage: 'Hello! I want to book the Baku City Escape Package',
                itinerary: [
                    {
                        day: 1,
                        title: "Arrival & Old City",
                        description: "Airport pickup, hotel check-in. Evening walking tour of the Old City and welcome dinner."
                    },
                    {
                        day: 2,
                        title: "Modern Baku Exploration",
                        description: "Full-day city tour including Heydar Aliyev Center, Flame Towers, and Baku Boulevard."
                    },
                    {
                        day: 3,
                        title: "Cultural Immersion",
                        description: "Visit to museums, traditional markets, and authentic Azerbaijani cuisine experience."
                    },
                    {
                        day: 4,
                        title: "Departure",
                        description: "Last-minute shopping, hotel check-out, and airport transfer."
                    }
                ]
            },
            'complete-azerbaijan': {
                title: 'Complete Azerbaijan Package',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/package-2.jpg?alt=media&token=c7e54418-2fe4-49a0-b501-91cf8c525f69',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
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
                whatsappMessage: 'Hello! I want to book the Complete Azerbaijan Package',
                itinerary: [
                    {
                        day: 1,
                        title: "Baku Arrival",
                        description: "Airport pickup, hotel check-in. Evening at leisure to explore the city."
                    },
                    {
                        day: 2,
                        title: "Baku City Tour",
                        description: "Full-day exploration of Old City, modern architecture, and cultural sites."
                    },
                    {
                        day: 3,
                        title: "Gobustan & Mud Volcanoes",
                        description: "Day trip to Gobustan National Park and mud volcanoes. Return to Baku."
                    },
                    {
                        day: 4,
                        title: "Travel to Gabala",
                        description: "Scenic drive to Gabala. Visit Nohur Lake and enjoy cable car rides."
                    },
                    {
                        day: 5,
                        title: "Gabala to Sheki",
                        description: "Travel to Sheki. Visit Khan's Palace and ancient caravanserai."
                    },
                    {
                        day: 6,
                        title: "Sheki Exploration",
                        description: "Full day exploring Sheki's cultural heritage and traditional crafts."
                    },
                    {
                        day: 7,
                        title: "Return to Baku & Departure",
                        description: "Return to Baku, last-minute shopping, and airport transfer."
                    }
                ]
            },
            'mountain-adventure': {
                title: 'Mountain Adventure Package',
                images: [
                    'https://firebasestorage.googleapis.com/v0/b/caspianwavetravel-b9aa4.firebasestorage.app/o/package-3.jpg?alt=media&token=fb936535-ef75-4a56-b977-77bcb8e01997',
                    'https://images.unsplash.com/photo-1464822759844-d62ed8fbf54f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
                ],
                description: 'An exciting 5-day adventure exploring the beautiful mountain regions of Azerbaijan including Gabala and Shahdag.',
                included: [
                    '4 nights hotel accommodation',
                    'All meals included',
                    'Mountain tours and activities',
                    'Professional adventure guides',
                    'All equipment rental',
                    'Transportation between locations',
                    '24/7 support'
                ],
                excluded: [
                    'International flights',
                    'Personal expenses',
                    'Travel insurance'
                ],
                pricing: [
                    { persons: '1 Person', price: '$449', description: 'Single occupancy' },
                    { persons: '2 People', price: '$399 per person', description: 'Double occupancy' },
                    { persons: '3+ People', price: '$349 per person', description: 'Group rate' }
                ],
                duration: '4 Nights / 5 Days',
                groupSize: '1-6 people',
                availability: 'Year-round',
                whatsappMessage: 'Hello! I want to book the Mountain Adventure Package',
                itinerary: [
                    {
                        day: 1,
                        title: "Arrival in Gabala",
                        description: "Arrive in Gabala, hotel check-in. Orientation and equipment fitting for adventure activities."
                    },
                    {
                        day: 2,
                        title: "Mountain Hiking",
                        description: "Full-day hiking in the Caucasus Mountains with professional guides. Picnic lunch with mountain views."
                    },
                    {
                        day: 3,
                        title: "Adventure Activities",
                        description: "Zip-lining, rope courses, and other adventure activities at the mountain resort."
                    },
                    {
                        day: 4,
                        title: "Shahdag Exploration",
                        description: "Travel to Shahdag Mountain Resort. Enjoy cable car rides and mountain scenery."
                    },
                    {
                        day: 5,
                        title: "Departure",
                        description: "Morning at leisure, hotel check-out, and transfer to airport."
                    }
                ]
            }
        };
    }

    getTourIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const tourId = urlParams.get('tour');
        console.log('URL Tour ID:', tourId);
        console.log('Available tours:', Object.keys(this.tourData));
        return tourId;
    }

    loadTourDetails() {
        const tourId = this.getTourIdFromURL();
        console.log('Loading tour details for:', tourId);
        
        if (!tourId || !this.tourData[tourId]) {
            document.getElementById('tour-content').innerHTML = `
                <div style="text-align: center; padding: 50px;">
                    <h2>Tour Not Found</h2>
                    <p>Sorry, the tour "${tourId}" doesn't exist.</p>
                    <p>Available tours: ${Object.keys(this.tourData).join(', ')}</p>
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
        const mainImage = document.getElementById('main-image');
        const sideImage1 = document.getElementById('side-image-1');
        const sideImage2 = document.getElementById('side-image-2');
        
        console.log('Loading images:', images);

        // Set main image
        if (images.length > 0 && mainImage) {
            mainImage.src = images[0];
        }

        // Set side images
        if (images.length > 1 && sideImage1) {
            sideImage1.src = images[1];
            sideImage1.parentElement.style.display = 'block';
        } else if (sideImage1) {
            sideImage1.parentElement.style.display = 'none';
        }

        if (images.length > 2 && sideImage2) {
            sideImage2.src = images[2];
            sideImage2.parentElement.style.display = 'block';
        } else if (sideImage2) {
            sideImage2.parentElement.style.display = 'none';
        }

        // Hide side images container if only one image
        const sideImagesContainer = document.querySelector('.side-images');
        if (images.length <= 1 && sideImagesContainer) {
            sideImagesContainer.style.display = 'none';
            document.querySelector('.main-image').style.flex = '1';
        } else if (sideImagesContainer) {
            sideImagesContainer.style.display = 'flex';
            document.querySelector('.main-image').style.flex = '2';
        }

        // Setup click events
        this.setupImageGrid();
    }

    setupImageGrid() {
        const mainImage = document.getElementById('main-image');
        const sideImage1 = document.getElementById('side-image-1');
        const sideImage2 = document.getElementById('side-image-2');
        
        // Simple click handlers
        if (sideImage1 && sideImage1.src) {
            sideImage1.parentElement.onclick = () => {
                if (mainImage.src && sideImage1.src) {
                    const temp = mainImage.src;
                    mainImage.src = sideImage1.src;
                    sideImage1.src = temp;
                }
            };
        }
        
        if (sideImage2 && sideImage2.src) {
            sideImage2.parentElement.onclick = () => {
                if (mainImage.src && sideImage2.src) {
                    const temp = mainImage.src;
                    mainImage.src = sideImage2.src;
                    sideImage2.src = temp;
                }
            };
        }
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

        // Itinerary HTML with Show More/Less functionality
        const itineraryHTML = tour.itinerary ? this.renderItinerary(tour.itinerary) : '';

        tourContent.innerHTML = `
            <div class="tour-content">
                <div class="tour-info">
                    <h1>${tour.title}</h1>
                    <p class="tour-description">${tour.description}</p>
                    
                    ${itineraryHTML}
                    
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
        
        // Add event listeners for show more/less functionality
        this.setupItineraryToggle();
    }

renderItinerary(itinerary) {
    // Show all days if 3 or fewer, otherwise show first 2 with show more option
    const showAllInitially = itinerary.length <= 3;
    const initialDaysToShow = 2;
    
    const visibleDays = showAllInitially ? itinerary : itinerary.slice(0, initialDaysToShow);
    const hiddenDays = showAllInitially ? [] : itinerary.slice(initialDaysToShow);
    
    return `
        <div class="itinerary-section">
            <h3><i class="fas fa-route"></i> Tour Itinerary</h3>
            <div class="itinerary-days">
                ${visibleDays.map(day => this.renderDay(day)).join('')}
                ${!showAllInitially ? `
                    <div class="hidden-days" style="display: none;">
                        ${hiddenDays.map(day => this.renderDay(day)).join('')}
                    </div>
                ` : ''}
            </div>
            ${!showAllInitially ? `
                <button class="show-more-less" data-state="more">
                    <i class="fas fa-chevron-down"></i> Show More Days (${hiddenDays.length} more)
                </button>
            ` : ''}
        </div>
    `;
}

    renderDay(day) {
        return `
            <div class="itinerary-day">
                <div class="day-header">
                    <div class="day-number">${day.day}</div>
                    <h4 class="day-title">${day.title}</h4>
                </div>
                <div class="day-content">
                    <p>${day.description}</p>
                </div>
            </div>
        `;
    }

setupItineraryToggle() {
    const showMoreButtons = document.querySelectorAll('.show-more-less');
    
    showMoreButtons.forEach(button => {
        // Make sure button is visible
        button.style.display = 'flex';
        
        button.addEventListener('click', function() {
            const hiddenDays = this.parentElement.querySelector('.hidden-days');
            const isShowingMore = this.getAttribute('data-state') === 'more';
            
            if (isShowingMore) {
                // Show hidden days
                hiddenDays.style.display = 'block';
                this.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
                this.setAttribute('data-state', 'less');
            } else {
                // Hide days
                hiddenDays.style.display = 'none';
                this.innerHTML = '<i class="fas fa-chevron-down"></i> Show More Days';
                this.setAttribute('data-state', 'more');
            }
        });
    });
    
    // Hide buttons that shouldn't be visible (for tours with 3 or fewer days)
    const itinerarySections = document.querySelectorAll('.itinerary-section');
    itinerarySections.forEach(section => {
        const days = section.querySelectorAll('.itinerary-day');
        const button = section.querySelector('.show-more-less');
        if (days.length <= 3 && button) {
            button.style.display = 'none';
        }
    });
}
}

// Make it available globally
window.TourDetailsManager = TourDetailsManager;
console.log('TourDetailsManager registered globally');

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing TourDetailsManager...');
    const tourManager = new TourDetailsManager();
    tourManager.loadTourDetails();
});