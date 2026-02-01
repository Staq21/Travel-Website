# 🌍 Wanderlust Journal - 3D Travel Tracker

A stunning, interactive 3D globe-based travel journal that visualizes your past adventures and bucket list destinations with premium glassmorphism UI design.

![Travel Journal Preview](https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800)

## ✨ Features

### Core Functionality
- **Interactive 3D Globe** - Photorealistic Earth with day/night textures, clouds, and atmospheric glow
- **Location Pins** - Glowing green pins for visited locations, pulsing red markers for bucket list
- **Travel Arcs** - Animated bezier curves showing your travel paths between destinations
- **Fly-To Animation** - Smooth camera transitions when selecting locations
- **Auto-Tour Mode** - Globe auto-rotates when idle, perfect for display mode

### UI/UX
- **Glassmorphism Design** - Premium frosted-glass aesthetic with blur effects
- **Location Detail Panel** - Slideout panel with photos, dates, facts, and notes
- **Responsive Layout** - Works beautifully on desktop and mobile
- **Sound Effects** - Subtle UI pings and optional ambient audio

### Admin Features
- **Password-Protected Admin** - Add new locations securely (default: `wanderlust2024`)
- **Auto Geocoding** - Automatically looks up coordinates from city/country names
- **Quick Facts Editor** - Add memorable moments for each location
- **Rating System** - Rate your visited destinations (1-5 stars)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or download the project
cd travel-journal

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
travel-journal/
├── src/
│   ├── components/
│   │   ├── LocationPanel.jsx    # Detail panel for locations
│   │   ├── AdminPanel.jsx       # Add new locations form
│   │   └── SoundManager.jsx     # Audio effects handler
│   ├── data/
│   │   └── travelData.js        # Your travel data (edit this!)
│   ├── styles/
│   │   └── App.css              # All styling with CSS variables
│   ├── App.jsx                  # Main application
│   └── index.jsx                # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🗺️ Customizing Your Data

Edit `src/data/travelData.js` to add your own locations:

```javascript
{
  id: "unique-id",
  city: "Tokyo",
  country: "Japan",
  type: "visited",  // or "bucket-list"
  coordinates: {
    lat: 35.6762,
    lng: 139.6503
  },
  dates: {
    arrival: "2023-03-15",
    departure: "2023-03-28"
  },
  quickFacts: [
    "Explored 23 different ramen shops",
    "Witnessed cherry blossoms at Ueno Park"
  ],
  images: [
    {
      url: "https://your-image-url.jpg",
      caption: "Tokyo Tower at sunset"
    }
  ],
  notes: "Personal memories and tips...",
  rating: 5
}
```

### Location Types
- `visited` - Shows as glowing green pin with travel arcs
- `bucket-list` - Shows as pulsing red marker

## 🎨 Customizing the Design

### CSS Variables
All styling uses CSS custom properties in `src/styles/App.css`:

```css
:root {
  /* Colors */
  --color-accent-primary: #00ff88;    /* Visited locations */
  --color-accent-tertiary: #ff6b6b;   /* Bucket list */
  --color-accent-secondary: #4fc3f7;  /* UI accents */
  
  /* Glassmorphism */
  --glass-blur: blur(20px);
  --color-glass: rgba(255, 255, 255, 0.05);
  
  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Space Grotesk', sans-serif;
}
```

### Changing the Admin Password
In `src/App.jsx`, find and modify:
```javascript
if (adminPassword === 'wanderlust2024') {
```

## 🔧 Technical Notes

### Dependencies
- **React 18** - UI framework
- **Three.js** - 3D rendering engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions
- **Vite** - Build tool and dev server

### Globe Textures
The app uses free textures from `three-globe`:
- Earth Blue Marble (day)
- Earth Night Lights
- Cloud layer
- Topology/normal maps

### Geocoding
Uses the free [Nominatim](https://nominatim.org/) API (OpenStreetMap) for coordinate lookups. No API key required.

## 📱 Mobile Support

The interface is fully responsive:
- Location panel converts to bottom sheet on mobile
- Touch controls for globe rotation and zoom
- Optimized performance for mobile GPUs

## 🎵 Sound System

Audio is handled via Web Audio API with these effects:
- **Ping** - When clicking a location
- **Success** - When adding a new location
- **Ambient** - Optional background atmosphere (toggle with 🔊 button)

## 🛠️ Development

### Hot Module Replacement
Vite provides instant HMR for rapid development. Edit any file and see changes immediately.

### Performance Tips
- Keep image URLs optimized (use `?w=400` for thumbnails)
- Limit to ~50 locations for smooth performance
- Use production build for deployment

## 📄 License

MIT License - Feel free to use for personal projects.

---

Built with ❤️ for travelers who love beautiful interfaces.

**Happy Travels! 🌎✈️**
