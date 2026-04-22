let editors = [];

async function fetchEditors() {
    try {
        const response = await fetch('/api/editors');
        if (!response.ok) throw new Error('Server not responding');
        editors = await response.json();
        renderEditors();
    } catch (error) {
        console.error('Error fetching editors, using fallback data:', error);
        // Fallback data for static preview
        editors = [
            {
                id: 1,
                name: "Marcus Chen",
                rate: "$45/hr",
                avatar: "https://i.pravatar.cc/150?u=marcus",
                locationName: "New York, NY",
                lat: 40.7128,
                lng: -74.0060,
                rating: 4.9,
                reviews: 124,
                categories: ["YouTube", "Cinematic"],
                skills: ["Premiere Pro", "After Effects", "Color Grading"],
                bio: "Specializing in high-energy YouTube content and cinematic travel films. Over 8 years of experience working with top creators.",
                works: [
                    { title: "Mountain Peak Travelog", category: "Cinematic", thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" },
                    { title: "Tech Review 2026", category: "YouTube", thumbnail: "https://images.unsplash.com/photo-1526738549149-8e07eca2c1b4?auto=format&fit=crop&w=600&q=80" }
                ]
            },
            {
                id: 2,
                name: "Sarah Jenkins",
                rate: "$60/hr",
                avatar: "https://i.pravatar.cc/150?u=sarah",
                locationName: "Los Angeles, CA",
                lat: 34.0522,
                lng: -118.2437,
                rating: 5.0,
                reviews: 89,
                categories: ["Cinematic", "Corporate"],
                skills: ["DaVinci Resolve", "Sound Design", "VFX"],
                bio: "Award-winning short film editor. I bring a narrative focus to every project, whether it's a 30-second commercial or a 20-minute documentary.",
                works: [
                    { title: "Urban Pulse", category: "Cinematic", thumbnail: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=600&q=80" },
                    { title: "Corporate Vision", category: "Corporate", thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" }
                ]
            }
        ];
        renderEditors();
    }
}

// DOM Elements
const editorsGrid = document.getElementById('editors-grid');
const mainView = document.getElementById('main-view');
const portfolioView = document.getElementById('portfolio-view');
const portfolioContent = document.getElementById('portfolio-content');
const btnBack = document.getElementById('btn-back');
const filterTabs = document.querySelectorAll('.filter-tab');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');
const typingText = document.getElementById('typing-text');

let currentFilter = 'All';
let currentSearch = '';

// Fade Effect Array
const fadeWords = ["Video Editors", "Content Creators"];
let wordIndex = 0;

function fadeEffect() {
    typingText.classList.remove('text-fade-in');
    typingText.classList.add('text-fade-out');

    setTimeout(() => {
        wordIndex = (wordIndex + 1) % fadeWords.length;
        typingText.textContent = fadeWords[wordIndex];
        
        typingText.classList.remove('text-fade-out');
        typingText.classList.add('text-fade-in');
    }, 500); // Wait for fadeOut animation to finish

    setTimeout(fadeEffect, 3000); // Change word every 3 seconds
}


// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function observeElements() {
    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });
}


// --- Location Logic ---
let userLocation = null;
const btnLocation = document.getElementById('btn-location');
const locationStatus = document.getElementById('location-status');

// Haversine formula to calculate distance in miles
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

if (btnLocation) {
    btnLocation.addEventListener('click', () => {
        locationStatus.textContent = "Locating...";
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    locationStatus.textContent = "Location Found";
                    renderEditors();
                },
                (error) => {
                    locationStatus.textContent = "Location Denied";
                    console.error("Error getting location", error);
                    // Fallback to a mock location (e.g., somewhere in the US) if denied
                    userLocation = { lat: 39.8283, lng: -98.5795 };
                    renderEditors();
                }
            );
        } else {
            locationStatus.textContent = "Not Supported";
        }
    });
}

// Render Editor Cards
function renderEditors() {
    editorsGrid.innerHTML = '';
    
    // Filter and Search Logic
    let filteredEditors = editors.filter(editor => {
        const matchesFilter = currentFilter === 'All' || editor.categories.includes(currentFilter) || editor.categories.includes(currentFilter.split(' ')[0]);
        const searchLower = currentSearch.toLowerCase();
        const matchesSearch = editor.name.toLowerCase().includes(searchLower) || 
                              editor.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
                              (editor.locationName && editor.locationName.toLowerCase().includes(searchLower));
        return matchesFilter && matchesSearch;
    });

    // Distance Calculation and Sorting
    if (userLocation) {
        filteredEditors.forEach(editor => {
            if (editor.lat && editor.lng) {
                editor.distance = getDistance(userLocation.lat, userLocation.lng, editor.lat, editor.lng);
            }
        });
        filteredEditors.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    if (filteredEditors.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        
        filteredEditors.forEach((editor, index) => {
            const card = document.createElement('div');
            card.className = `editor-card fade-up`;
            // Add slight stagger for grid items
            card.style.transitionDelay = `${(index % 4) * 0.1}s`;
            
            let distanceHtml = '';
            if (userLocation && editor.distance !== undefined) {
                distanceHtml = `<div class="distance-badge"><i class="fa-solid fa-location-arrow"></i> ${editor.distance.toFixed(1)} mi</div>`;
            } else if (editor.locationName) {
                distanceHtml = `<div class="distance-badge"><i class="fa-solid fa-map-pin"></i> ${editor.locationName}</div>`;
            }
            
            card.innerHTML = `
                ${distanceHtml}
                <div class="editor-header">
                    <img src="${editor.avatar}" alt="${editor.name}" class="editor-avatar">
                    <div class="editor-info">
                        <h3>${editor.name}</h3>
                        <div class="rate">${editor.rate}</div>
                    </div>
                </div>
                <div class="editor-skills">
                    ${editor.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="editor-card-footer">
                    <div class="rating">
                        <i class="fa-solid fa-star"></i> ${editor.rating} (${editor.reviews})
                    </div>
                    <button class="btn-ghost" style="padding: 0.3rem 0.8rem; font-size: 0.9rem;">View Work <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i></button>
                </div>
            `;
            card.addEventListener('click', () => openPortfolio(editor));
            editorsGrid.appendChild(card);
            
            // Observe new dynamic elements
            observer.observe(card);
        });
    }
}

// Event Listeners for Filter & Search
filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        filterTabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderEditors();
    });
});

searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderEditors();
});

// Open Portfolio View
function openPortfolio(editor) {
    mainView.classList.add('hidden');
    portfolioView.classList.remove('hidden');
    window.scrollTo(0, 0);
    
    portfolioContent.innerHTML = `
        <div class="portfolio-header fade-up visible">
            <div class="portfolio-profile">
                <img src="${editor.avatar}" alt="${editor.name}">
                <div class="portfolio-profile-info">
                    <h2>${editor.name}</h2>
                    <p>${editor.bio}</p>
                    <div class="rating" style="margin-top: 10px;">
                        <i class="fa-solid fa-star"></i> ${editor.rating} (${editor.reviews} reviews) &bull; ${editor.rate}
                    </div>
                </div>
            </div>
            <button class="btn-primary btn-large">Hire ${editor.name.split(' ')[0]}</button>
        </div>
        
        <h3 class="fade-up visible" style="font-size: 1.8rem; margin-top: 1rem;">Featured Work</h3>
        <div class="works-grid" style="margin-top: 2rem;">
            ${editor.works.map((work, index) => `
                <div class="work-card fade-up visible" style="transition-delay: ${index * 0.1}s">
                    <div class="work-thumbnail">
                        <img src="${work.thumbnail}" alt="${work.title}">
                        <i class="fa-solid fa-circle-play play-icon"></i>
                    </div>
                    <div class="work-info">
                        <h4>${work.title}</h4>
                        <p>${work.category}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Back to Main View
btnBack.addEventListener('click', () => {
    portfolioView.classList.add('hidden');
    mainView.classList.remove('hidden');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchEditors();
    observeElements();
    setTimeout(fadeEffect, 1000); // Start fade effect
});
