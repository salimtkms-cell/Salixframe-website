const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Helper to read data
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { users: [], editors: [] };
    }
}

// Helper to write data
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Initialize data if not exists
async function initData() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        const initialData = {
            users: [],
            editors: [
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
            ]
        };
        await writeData(initialData);
    }
}

// API Routes
app.post('/api/register', async (req, res) => {
    const { username, password, type } = req.body;
    const data = await readData();
    
    if (data.users.find(u => u.username === username)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const newUser = { username, password, type };
    data.users.push(newUser);
    
    if (type === 'editor') {
        const newEditor = {
            id: Date.now(),
            name: username,
            rate: "$25/hr",
            avatar: `https://i.pravatar.cc/150?u=${username}`,
            locationName: "Remote",
            rating: 0,
            reviews: 0,
            categories: [],
            skills: [],
            bio: "New editor on SL-space.",
            works: []
        };
        data.editors.push(newEditor);
    }
    
    await writeData(data);
    res.json({ success: true, user: { username, type } });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const data = await readData();
    
    const user = data.users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    res.json({ success: true, user: { username: user.username, type: user.type } });
});

app.get('/api/editors', async (req, res) => {
    const data = await readData();
    res.json(data.editors);
});

app.get('/api/customer/:username', async (req, res) => {
    const { username } = req.params;
    const data = await readData();
    const user = data.users.find(u => u.username === username && u.type === 'customer');
    if (!user) return res.status(404).json({ message: 'Customer not found' });
    res.json({ username: user.username, projects: [] });
});

app.get('/api/admin/users', async (req, res) => {
    const data = await readData();
    res.json(data.users);
});

initData().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
