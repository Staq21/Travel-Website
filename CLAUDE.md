# CLAUDE.md - AI Assistant Guide for Travel-Website

This document provides essential context for AI assistants working on the Wanderlust Journal - 3D Travel Tracker codebase.

## Project Overview

**What it is:** An interactive 3D globe-based travel journal application built with React and Three.js. It visualizes travel destinations with a photorealistic Earth, location pins, animated travel paths, and features a glassmorphism UI design.

**Live deployment:** Hosted on Netlify with automated builds on git push.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| Three.js | 0.160.0 | 3D graphics/rendering |
| @react-three/fiber | 8.15.12 | React renderer for Three.js |
| @react-three/drei | 9.92.7 | Reusable 3D components |
| Vite | 7.3.1 | Build tool and dev server |
| TailwindCSS | 3.4.0 | Utility CSS (configured, CSS vars used) |

## Project Structure

```
Travel-Website/
├── index.html              # HTML entry point (loads src/main.jsx)
├── package.json            # Dependencies and scripts
├── netlify.toml            # Netlify deployment config
├── README.md               # User-facing documentation
└── src/
    ├── main.jsx            # React root entry point
    ├── App.jsx             # Main app - 3D globe, state, components
    ├── App.css             # All styling with CSS variables
    ├── travelData.js       # Travel locations dataset
    ├── LocationPanel.jsx   # Location detail side panel
    ├── AdminPanel.jsx      # Admin form for adding locations
    ├── SoundManager.jsx    # Web Audio API sound effects
    └── TravelJournal.jsx   # Legacy monolithic version (UNUSED)
```

## Key Files and Their Responsibilities

### `src/App.jsx` (528 lines)
Main application containing:
- State management (locations, selectedLocation, admin state)
- 3D components: `Earth`, `VisitedPin`, `BucketListPulse`, `TravelArc`, `Scene`
- Custom shader for atmospheric glow
- `latLngToVector3()` - converts coordinates to 3D space
- `generateArcPoints()` - creates bezier curves for travel paths
- Admin authentication logic (hardcoded password)

### `src/travelData.js` (399 lines)
Location data with structure:
```javascript
{
  id: "unique-id",
  city: "City Name",
  country: "Country Name",
  type: "visited" | "bucket-list",
  coordinates: { lat: number, lng: number },
  dates: { arrival: "YYYY-MM-DD", departure: "YYYY-MM-DD" } | null,
  quickFacts: ["fact1", "fact2"],
  images: [{ url: "https://...", caption: "..." }],
  notes: "Personal notes",
  rating: 1-5 | null
}
```
Also exports `createNewLocation()` factory function.

### `src/App.css` (969 lines)
Complete styling with:
- CSS custom properties for theming (colors, spacing, typography)
- Glassmorphism design patterns
- Mobile breakpoint at 768px
- Custom animations: float, pulse, slideIn, modalSlideIn, fadeIn, glow, shimmer
- Font imports: Playfair Display, Space Grotesk, JetBrains Mono

### `src/AdminPanel.jsx` (318 lines)
Admin form features:
- Geocoding via Nominatim API (OpenStreetMap, no key needed)
- Form validation
- Different fields for visited vs bucket-list locations

### `src/SoundManager.jsx` (166 lines)
Web Audio API wrapper exposing:
- `playPing()` - location selection sound
- `playSuccess()` - confirmation sound
- `startAmbient()` / `stopAmbient()` / `toggleAmbient()` - background audio

### `src/LocationPanel.jsx` (123 lines)
Slideout panel displaying location details, images, facts, dates, and coordinates.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server with HMR
npm run build        # Create production build in dist/
npm run preview      # Preview production build locally
```

## Important Conventions

### Code Style
- ES modules (`"type": "module"` in package.json)
- JSX for React components (`.jsx` extension)
- Plain JS for data files (`.js` extension)
- CSS custom properties for all theming values
- No TypeScript (types available via @types packages)

### Component Patterns
- React hooks: `useState`, `useRef`, `useCallback`, `useEffect`
- Three.js hooks: `useFrame`, `useThree`, `useTexture`
- `useImperativeHandle` for exposing imperative APIs (SoundManager)
- Suspense for async texture loading

### Styling Conventions
- All styles in `App.css` (no CSS modules or styled-components)
- CSS variables defined in `:root`
- Key colors:
  - `--color-accent-primary: #00ff88` (visited/green)
  - `--color-accent-tertiary: #ff6b6b` (bucket-list/red)
  - `--color-accent-secondary: #4fc3f7` (UI accent/blue)
- Glassmorphism: `--glass-blur: blur(20px)`

### 3D Graphics Patterns
- Frame-based animations use `clock.elapsedTime` from useFrame
- Bezier curves for travel arcs
- External textures from unpkg CDN (three-globe package)

## Common Tasks

### Add a New Location Programmatically
Edit `src/travelData.js` and add to the `initialLocations` array.

### Change the Admin Password
In `src/App.jsx`, find line ~381:
```javascript
if (adminPassword === 'wanderlust2024') {
```
Replace `'wanderlust2024'` with new password.

### Modify Theme Colors
Edit CSS variables in `src/App.css` `:root` section.

### Change Globe Textures
Modify texture URLs in `App.jsx` Earth component (~lines 205-210):
```javascript
const [dayMap, nightMap, ...] = useTexture([...urls]);
```

### Add New UI Component
1. Create new `.jsx` file in `src/`
2. Import in `App.jsx`
3. Add styles to `App.css`

## External APIs

### Nominatim (OpenStreetMap)
- **Purpose:** Geocoding city/country to coordinates
- **Endpoint:** `https://nominatim.openstreetmap.org/search?format=json&q={query}`
- **No API key required**
- **User-Agent:** `"TravelJournalApp/1.0"`

### CDN Resources
- **Google Fonts:** Playfair Display, Space Grotesk, JetBrains Mono
- **Globe Textures:** unpkg.com/three-globe@2.31.1

## Security Considerations

1. **Admin password is hardcoded** (`wanderlust2024`) - not suitable for production with real security needs
2. **No backend database** - all data is in-memory and resets on refresh
3. **Images are external URLs** - no upload functionality
4. **No user data collection** - client-side only

## Deployment

- **Platform:** Netlify
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **SPA redirect:** All routes -> `/index.html`
- **Trigger:** Automatic on git push

## Performance Notes

- Recommended limit: ~50 locations for smooth performance
- Canvas DPR optimization: `dpr={[1, 2]}`
- Image thumbnails should use query params like `?w=400`
- Suspense boundary handles async texture loading

## Known Quirks

1. `TravelJournal.jsx` is a legacy monolithic version - **do not use or modify**
2. Cloud layer textures were removed for stability (see recent commits)
3. Idle detection triggers auto-rotation after 10 seconds

## Testing

No test framework is currently configured. To add tests:
1. Install Vitest: `npm install -D vitest`
2. Add test script to package.json
3. Create `.test.jsx` files alongside components

## File Line Counts

| File | Lines | Notes |
|------|-------|-------|
| App.css | 969 | Largest file - all styles |
| App.jsx | 528 | Main app logic |
| TravelJournal.jsx | 427 | UNUSED legacy |
| travelData.js | 399 | Sample data |
| AdminPanel.jsx | 318 | Form component |
| main.jsx | 233 | Entry point |
| SoundManager.jsx | 166 | Audio system |
| LocationPanel.jsx | 123 | Detail panel |

## Quick Reference

```javascript
// Convert lat/lng to 3D position
const position = latLngToVector3(lat, lng, radius);

// Location types
type: "visited"      // Green pin, connects with arcs
type: "bucket-list"  // Red pulsing marker

// State management (in App.jsx)
const [locations, setLocations] = useState(initialLocations);
const [selectedLocation, setSelectedLocation] = useState(null);
const [isAutoRotating, setIsAutoRotating] = useState(true);

// Sound effects (via ref)
soundManagerRef.current.playPing();
soundManagerRef.current.playSuccess();
```

## Git Workflow

- Main branch is the production branch
- Development branches prefixed with `claude/` for AI-assisted work
- Commits should be descriptive and focused
- Build must pass before deployment (Netlify auto-builds)

---

*Last updated: 2026-02-01*
