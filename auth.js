// Auth Page Logic
const toggleCustomer = document.getElementById('toggle-customer');
const toggleEditor = document.getElementById('toggle-editor');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const authSubmit = document.getElementById('auth-submit');
const switchAuthText = document.getElementById('switch-auth-text');

// Get parameters from URL if any
const urlParams = new URLSearchParams(window.location.search);
let userType = urlParams.get('type') || 'customer'; // 'customer' or 'editor'
let authMode = urlParams.get('mode') || 'login'; // 'login' or 'signup'

function updateAuthUI() {
    // Update active toggle button
    if (userType === 'customer') {
        toggleCustomer.classList.add('active');
        toggleEditor.classList.remove('active');
    } else {
        toggleEditor.classList.add('active');
        toggleCustomer.classList.remove('active');
    }

    const typeLabel = userType.charAt(0).toUpperCase() + userType.slice(1);

    // Update titles and text based on mode
    if (authMode === 'login') {
        authTitle.textContent = "Welcome Back";
        authSubtitle.textContent = `Login to your ${typeLabel} account`;
        authSubmit.textContent = "Log In";
        switchAuthText.innerHTML = `Don't have an account? <a href="#" id="auth-mode-toggle">Sign Up</a>`;
    } else {
        authTitle.textContent = "Join Salixframe";
        authSubtitle.textContent = `Create your ${typeLabel} account`;
        authSubmit.textContent = "Sign Up";
        switchAuthText.innerHTML = `Already have an account? <a href="#" id="auth-mode-toggle">Log In</a>`;
    }

    // Re-attach toggle link listener
    const toggleLink = document.getElementById('auth-mode-toggle');
    if (toggleLink) {
        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            authMode = authMode === 'login' ? 'signup' : 'login';
            updateAuthUI();
        });
    }
}

// Event Listeners
if (toggleCustomer) toggleCustomer.addEventListener('click', () => {
    userType = 'customer';
    updateAuthUI();
});

if (toggleEditor) toggleEditor.addEventListener('click', () => {
    userType = 'editor';
    updateAuthUI();
});

if (authForm) authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    const payload = { username, password, type: userType };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.user));
            alert(`${authMode === 'login' ? 'Logged in' : 'Account created'} successfully!`);
            window.location.href = 'index.html';
        } else {
            alert(result.message || 'Authentication failed');
        }
    } catch (error) {
        console.error('Auth error:', error);
        alert('Could not connect to the server. Make sure it is running.');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', updateAuthUI);
