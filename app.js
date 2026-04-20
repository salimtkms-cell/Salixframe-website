// Dummy data
const editors = [
    {
        id: 1,
        name: "Alex Mercer",
        rate: "$45/hr",
        avatar: "https://i.pravatar.cc/150?u=alex",
        rating: 4.9,
        reviews: 124,
        categories: ["YouTube", "Cinematic"],
        skills: ["Premiere Pro", "After Effects", "Color Grading"],
        bio: "Specializing in cinematic edits and fast-paced YouTube content. Let's make your vision a reality. I've worked with top creators to deliver engaging stories that hold retention.",
        works: [
            { title: "Cyberpunk Cinematic Short", category: "Cinematic", thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80" },
            { title: "Tech Review Vlog", category: "YouTube", thumbnail: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=600&q=80" },
            { title: "Music Video: Neon Nights", category: "Music Video", thumbnail: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80" }
        ]
    },
    {
        id: 2,
        name: "Sarah Chen",
        rate: "$60/hr",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        rating: 5.0,
        reviews: 89,
        categories: ["Cinematic", "Corporate"],
        skills: ["DaVinci Resolve", "Motion Graphics", "Documentary"],
        bio: "Award-winning documentary editor with a keen eye for storytelling and pristine color work. Bringing a professional touch to your narrative projects.",
        works: [
            { title: "The Last Glacier", category: "Documentary", thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" },
            { title: "Corporate Brand Anthem", category: "Commercial", thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80" }
        ]
    },
    {
        id: 3,
        name: "Marcus Johnson",
        rate: "$35/hr",
        avatar: "https://i.pravatar.cc/150?u=marcus",
        rating: 4.8,
        reviews: 210,
        categories: ["TikTok", "YouTube"],
        skills: ["Final Cut Pro", "TikTok", "Gaming"],
        bio: "Viral content creator and editor. I know exactly what keeps viewers hooked in the first 3 seconds. Let's make your next short-form video go viral.",
        works: [
            { title: "Gaming Montage #45", category: "Gaming", thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
            { title: "Viral TikTok Compilation", category: "TikTok", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80" },
            { title: "Esports Tournament Highlights", category: "Gaming", thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80" }
        ]
    },
    {
        id: 4,
        name: "Elena Rodriguez",
        rate: "$50/hr",
        avatar: "https://i.pravatar.cc/150?u=elena",
        rating: 4.9,
        reviews: 156,
        categories: ["Corporate"],
        skills: ["Premiere Pro", "Animation", "Corporate"],
        bio: "Expert in transforming dull corporate footage into engaging, dynamic presentations. Over 5 years of experience with top Fortune 500 companies.",
        works: [
            { title: "Product Launch 2026", category: "Corporate", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" },
            { title: "Explainer Animation", category: "Animation", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80" },
            { title: "Event Recap", category: "Event", thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" }
        ]
    }
];

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

// Typing Effect Array
const typingWords = ["Video Editors", "VFX Artists", "Content Creators", "Visual Storytellers"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = typingWords[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % typingWords.length;
        typeSpeed = 500; // Pause before new word
    }

    setTimeout(typeEffect, typeSpeed);
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


// Render Editor Cards
function renderEditors() {
    editorsGrid.innerHTML = '';
    
    // Filter and Search Logic
    const filteredEditors = editors.filter(editor => {
        const matchesFilter = currentFilter === 'All' || editor.categories.includes(currentFilter) || editor.categories.includes(currentFilter.split(' ')[0]);
        const searchLower = currentSearch.toLowerCase();
        const matchesSearch = editor.name.toLowerCase().includes(searchLower) || 
                              editor.skills.some(skill => skill.toLowerCase().includes(searchLower));
        return matchesFilter && matchesSearch;
    });

    if (filteredEditors.length === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        
        filteredEditors.forEach((editor, index) => {
            const card = document.createElement('div');
            card.className = `editor-card fade-up`;
            // Add slight stagger for grid items
            card.style.transitionDelay = `${(index % 4) * 0.1}s`;
            
            card.innerHTML = `
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
    renderEditors();
    observeElements();
    setTimeout(typeEffect, 1000); // Start typing effect
});
