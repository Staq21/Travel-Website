import React, { useState, useRef, useCallback, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, useTexture, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// ============================================
// TRAVEL DATA - EDIT THIS TO CUSTOMIZE
// ============================================
const travelData = [
  {
    id: "loc-001", city: "Tokyo", country: "Japan", type: "visited",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    dates: { arrival: "2023-03-15", departure: "2023-03-28" },
    quickFacts: ["Explored 23 different ramen shops", "Witnessed cherry blossoms at Ueno Park", "Got lost in Shibuya at 3am"],
    images: [{ url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", caption: "Tokyo Tower" }],
    notes: "Fell in love with Japan. Perfect blend of tradition and technology!", rating: 5
  },
  {
    id: "loc-002", city: "Paris", country: "France", type: "visited",
    coordinates: { lat: 48.8566, lng: 2.3522 },
    dates: { arrival: "2022-06-10", departure: "2022-06-18" },
    quickFacts: ["Climbed all 674 steps of the Eiffel Tower", "Croissants every morning", "6 hours in the Louvre"],
    images: [{ url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400", caption: "Eiffel Tower" }],
    notes: "The city of light truly lives up to its name.", rating: 5
  },
  {
    id: "loc-003", city: "New York City", country: "USA", type: "visited",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    dates: { arrival: "2023-09-05", departure: "2023-09-12" },
    quickFacts: ["Saw 3 Broadway shows", "Pizza at Joe's was life-changing", "Central Park sunrise runs"],
    images: [{ url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400", caption: "Manhattan skyline" }],
    notes: "The energy is unmatched. Exhausting but exhilarating.", rating: 4
  },
  {
    id: "loc-004", city: "Barcelona", country: "Spain", type: "visited",
    coordinates: { lat: 41.3851, lng: 2.1734 },
    dates: { arrival: "2022-08-20", departure: "2022-08-27" },
    quickFacts: ["Gaudí's architecture blew my mind", "Beach days at Barceloneta", "Best paella of my life"],
    images: [{ url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400", caption: "La Sagrada Família" }],
    notes: "Perfect mix of beach, culture, and nightlife.", rating: 5
  },
  {
    id: "loc-005", city: "Reykjavik", country: "Iceland", type: "visited",
    coordinates: { lat: 64.1466, lng: -21.9426 },
    dates: { arrival: "2024-01-08", departure: "2024-01-15" },
    quickFacts: ["Northern Lights on first night!", "Blue Lagoon was magical", "Drove the Golden Circle"],
    images: [{ url: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=400", caption: "Northern Lights" }],
    notes: "Feels like another planet. Otherworldly landscapes.", rating: 5
  },
  {
    id: "loc-006", city: "Sydney", country: "Australia", type: "visited",
    coordinates: { lat: -33.8688, lng: 151.2093 },
    dates: { arrival: "2023-12-20", departure: "2024-01-02" },
    quickFacts: ["NYE fireworks over the Harbour", "Bondi to Coogee coastal walk", "Held a koala"],
    images: [{ url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400", caption: "Opera House" }],
    notes: "Summer Christmas is weird but amazing!", rating: 4
  },
  {
    id: "loc-007", city: "Kyoto", country: "Japan", type: "bucket-list",
    coordinates: { lat: 35.0116, lng: 135.7681 },
    quickFacts: ["Must see: Fushimi Inari Shrine", "Bamboo Grove", "Traditional ryokan stay"],
    images: [{ url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400", caption: "Fushimi Inari" }],
    notes: "Planning for spring 2025 - cherry blossom season!", rating: null
  },
  {
    id: "loc-008", city: "Santorini", country: "Greece", type: "bucket-list",
    coordinates: { lat: 36.3932, lng: 25.4615 },
    quickFacts: ["Watch sunset in Oia", "Wine tasting", "Volcanic hot springs"],
    images: [{ url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400", caption: "Santorini sunset" }],
    notes: "Dream honeymoon destination.", rating: null
  },
  {
    id: "loc-009", city: "Machu Picchu", country: "Peru", type: "bucket-list",
    coordinates: { lat: -13.1631, lng: -72.5450 },
    quickFacts: ["Hike the Inca Trail (4 days)", "Sunrise at the Sun Gate", "Sacred Valley"],
    images: [{ url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400", caption: "Machu Picchu" }],
    notes: "Need to book permits 6 months ahead!", rating: null
  },
  {
    id: "loc-010", city: "Cape Town", country: "South Africa", type: "bucket-list",
    coordinates: { lat: -33.9249, lng: 18.4241 },
    quickFacts: ["Table Mountain cable car", "Safari in nearby reserves", "Penguin colony"],
    images: [{ url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400", caption: "Table Mountain" }],
    notes: "Best time: November to March", rating: null
  }
];

// Utility: Convert lat/lng to 3D coordinates
const latLngToVector3 = (lat, lng, radius = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

// Generate arc points between locations
const generateArcPoints = (start, end, radius = 2, segments = 50) => {
  const startVec = latLngToVector3(start.lat, start.lng, radius);
  const endVec = latLngToVector3(end.lat, end.lng, radius);
  const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  const distance = startVec.distanceTo(endVec);
  midPoint.normalize().multiplyScalar(radius + distance * 0.3);
  const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
  return curve.getPoints(segments);
};

// Visited location pin component
function VisitedPin({ position, location, onClick, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      const scale = isSelected ? 1.5 : hovered ? 1.3 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <mesh><sphereGeometry args={[0.08, 16, 16]} /><meshBasicMaterial color="#00ff88" transparent opacity={0.3} /></mesh>
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(location); }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={isSelected ? "#fff" : "#00ff88"} emissive={isSelected ? "#00ff88" : "#00aa55"} emissiveIntensity={isSelected ? 2 : 1} />
      </mesh>
      {(hovered || isSelected) && (
        <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.8)', borderRadius: '6px', border: '1px solid rgba(0,255,136,0.5)', color: '#fff', fontSize: '12px', whiteSpace: 'nowrap', transform: 'translateY(-20px)' }}>
            {location.city}
          </div>
        </Html>
      )}
    </group>
  );
}

// Bucket list pulsing marker
function BucketListPulse({ position, location, onClick, isSelected }) {
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      ringRef.current.scale.setScalar(scale);
      ringRef.current.material.opacity = 1 - (scale - 1) / 0.3 * 0.7;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.06, 0.08, 32]} /><meshBasicMaterial color="#ff6b6b" transparent opacity={0.8} side={THREE.DoubleSide} /></mesh>
      <mesh onClick={(e) => { e.stopPropagation(); onClick(location); }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.03, 16, 16]} /><meshStandardMaterial color={isSelected ? "#fff" : "#ff6b6b"} emissive="#ff4444" emissiveIntensity={1.5} />
      </mesh>
      {(hovered || isSelected) && (
        <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div style={{ padding: '4px 8px', background: 'rgba(0,0,0,0.8)', borderRadius: '6px', border: '1px solid rgba(255,107,107,0.5)', color: '#fff', fontSize: '12px', whiteSpace: 'nowrap', transform: 'translateY(-20px)' }}>
            {location.city} ✨
          </div>
        </Html>
      )}
    </group>
  );
}

// Travel arc between locations
function TravelArc({ start, end }) {
  const points = useMemo(() => generateArcPoints(start, end, 2), [start, end]);
  return <Line points={points} color="#00ff88" lineWidth={1.5} transparent opacity={0.5} />;
}

// Main Earth component
function Earth({ locations, selectedLocation, onSelectLocation, isAutoRotating }) {
  const earthRef = useRef();
  const cloudsRef = useRef();
  
  const [dayMap, nightMap, cloudsMap] = useTexture([
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg',
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-clouds.png'
  ]);

  useFrame((state, delta) => {
    if (isAutoRotating && earthRef.current) earthRef.current.rotation.y += delta * 0.05;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.02;
  });

  const visitedLocations = locations.filter(loc => loc.type === 'visited');
  const bucketListLocations = locations.filter(loc => loc.type === 'bucket-list');
  const travelArcs = visitedLocations.slice(0, -1).map((loc, i) => ({ start: loc.coordinates, end: visitedLocations[i + 1].coordinates, id: `arc-${i}` }));

  return (
    <group ref={earthRef}>
      <Sphere args={[2, 64, 64]}><meshPhongMaterial map={dayMap} shininess={5} /></Sphere>
      <Sphere args={[2.001, 64, 64]}><meshBasicMaterial map={nightMap} transparent opacity={0.4} blending={THREE.AdditiveBlending} /></Sphere>
      <Sphere ref={cloudsRef} args={[2.02, 64, 64]}><meshPhongMaterial map={cloudsMap} transparent opacity={0.25} depthWrite={false} /></Sphere>
      <Sphere args={[2.1, 64, 64]}><meshBasicMaterial color="#4fc3f7" transparent opacity={0.08} side={THREE.BackSide} /></Sphere>
      {travelArcs.map((arc) => <TravelArc key={arc.id} start={arc.start} end={arc.end} />)}
      {visitedLocations.map((loc) => <VisitedPin key={loc.id} position={latLngToVector3(loc.coordinates.lat, loc.coordinates.lng, 2.05)} location={loc} onClick={onSelectLocation} isSelected={selectedLocation?.id === loc.id} />)}
      {bucketListLocations.map((loc) => <BucketListPulse key={loc.id} position={latLngToVector3(loc.coordinates.lat, loc.coordinates.lng, 2.05)} location={loc} onClick={onSelectLocation} isSelected={selectedLocation?.id === loc.id} />)}
    </group>
  );
}

// Location detail panel
function LocationPanel({ location, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  const isVisited = location.type === 'visited';
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div style={{ position: 'absolute', top: 20, right: 20, bottom: 20, width: 360, background: 'rgba(20,20,30,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, overflowY: 'auto', color: '#fff', fontFamily: "'Space Grotesk', sans-serif", animation: 'slideIn 0.3s ease' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
      <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, background: isVisited ? 'rgba(0,255,136,0.15)' : 'rgba(255,107,107,0.15)', border: `1px solid ${isVisited ? '#00ff88' : '#ff6b6b'}`, color: isVisited ? '#00ff88' : '#ff6b6b' }}>
        {isVisited ? '✓ Visited' : '✨ Bucket List'}
      </div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 4, fontWeight: 500 }}>{location.city}</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>{location.country}</p>
      {isVisited && location.rating && (
        <div style={{ marginBottom: 16 }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: i < location.rating ? '#ffd700' : 'rgba(255,255,255,0.2)', fontSize: 18, textShadow: i < location.rating ? '0 0 10px #ffd700' : 'none' }}>★</span>)}</div>
      )}
      {isVisited && location.dates && (
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>📅 Trip Dates</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, marginTop: 4 }}>{formatDate(location.dates.arrival)} — {formatDate(location.dates.departure)}</div>
        </div>
      )}
      {location.images?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
            <img src={location.images[imgIdx]?.url} alt="" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            {location.images[imgIdx]?.caption && <p style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{location.images[imgIdx].caption}</p>}
          </div>
          {location.images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>{location.images.map((img, i) => <button key={i} onClick={() => setImgIdx(i)} style={{ width: 50, height: 38, padding: 0, border: i === imgIdx ? '2px solid #00ff88' : '2px solid transparent', borderRadius: 6, overflow: 'hidden', cursor: 'pointer', opacity: i === imgIdx ? 1 : 0.5 }}><img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></button>)}</div>
          )}
        </div>
      )}
      {location.quickFacts?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>⚡ Quick Facts</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>{location.quickFacts.map((fact, i) => <li key={i} style={{ paddingLeft: 20, position: 'relative', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 6, lineHeight: 1.5 }}><span style={{ position: 'absolute', left: 0, color: '#00ff88' }}>→</span>{fact}</li>)}</ul>
        </div>
      )}
      {location.notes && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>📝 Notes</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', lineHeight: 1.6 }}>{location.notes}</p>
        </div>
      )}
      <div style={{ paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>📍 {location.coordinates.lat.toFixed(4)}°, {location.coordinates.lng.toFixed(4)}°</span>
      </div>
    </div>
  );
}

// Admin panel for adding locations
function AdminPanel({ onAddLocation, onClose }) {
  const [form, setForm] = useState({ city: '', country: '', type: 'bucket-list', lat: '', lng: '', notes: '' });
  const [looking, setLooking] = useState(false);
  const [status, setStatus] = useState('');

  const lookupCoords = async () => {
    if (!form.city || !form.country) { setStatus('Enter city & country first'); return; }
    setLooking(true); setStatus('Looking up...');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.city + ', ' + form.country)}&limit=1`);
      const data = await res.json();
      if (data?.length) { setForm(f => ({ ...f, lat: parseFloat(data[0].lat).toFixed(4), lng: parseFloat(data[0].lon).toFixed(4) })); setStatus('✓ Found!'); }
      else setStatus('Not found. Enter manually.');
    } catch { setStatus('Lookup failed'); }
    setLooking(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.city || !form.country || !form.lat || !form.lng) { alert('Fill all required fields'); return; }
    onAddLocation({ id: `loc-${Date.now()}`, city: form.city, country: form.country, type: form.type, coordinates: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) }, quickFacts: [], images: [], notes: form.notes, rating: null, dates: null });
    setForm({ city: '', country: '', type: 'bucket-list', lat: '', lng: '', notes: '' }); setStatus('');
  };

  const inputStyle = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: 14, outline: 'none' };
  const labelStyle = { display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ width: '90%', maxWidth: 420, maxHeight: '85vh', overflowY: 'auto', background: 'rgba(20,20,30,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 28, color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', color: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 20, textAlign: 'center' }}>✈️ Add New Location</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['visited', 'bucket-list'].map(t => <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))} style={{ flex: 1, padding: '10px', background: form.type === t ? (t === 'visited' ? 'rgba(0,255,136,0.15)' : 'rgba(255,107,107,0.15)') : 'rgba(255,255,255,0.05)', border: `1px solid ${form.type === t ? (t === 'visited' ? '#00ff88' : '#ff6b6b') : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, color: form.type === t ? (t === 'visited' ? '#00ff88' : '#ff6b6b') : '#fff', cursor: 'pointer', fontSize: 13 }}>{t === 'visited' ? '✓ Visited' : '✨ Bucket List'}</button>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div><label style={labelStyle}>City *</label><input style={inputStyle} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Tokyo" /></div>
            <div><label style={labelStyle}>Country *</label><input style={inputStyle} value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="Japan" /></div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Coordinates *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={form.lat} onChange={e => setForm(f => ({ ...f, lat: e.target.value }))} placeholder="Latitude" />
              <input style={{ ...inputStyle, flex: 1 }} value={form.lng} onChange={e => setForm(f => ({ ...f, lng: e.target.value }))} placeholder="Longitude" />
              <button type="button" onClick={lookupCoords} disabled={looking} style={{ padding: '10px 14px', background: 'rgba(79,195,247,0.2)', border: '1px solid #4fc3f7', borderRadius: 8, color: '#4fc3f7', cursor: 'pointer', fontSize: 14 }}>{looking ? '...' : '🔍'}</button>
            </div>
            {status && <div style={{ fontSize: 12, color: '#00ff88', marginTop: 6 }}>{status}</div>}
          </div>
          <div style={{ marginBottom: 16 }}><label style={labelStyle}>Notes</label><textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Personal memories, tips..." /></div>
          <button type="submit" style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #00ff88, #4fc3f7)', border: 'none', borderRadius: 10, color: '#0a0a0f', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Add to {form.type === 'visited' ? 'Journal' : 'Bucket List'}</button>
        </form>
      </div>
    </div>
  );
}

// Scene component
function Scene({ locations, selectedLocation, onSelectLocation, isAutoRotating }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4fc3f7" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Earth locations={locations} selectedLocation={selectedLocation} onSelectLocation={onSelectLocation} isAutoRotating={isAutoRotating} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={10} autoRotate={isAutoRotating} autoRotateSpeed={0.5} />
    </>
  );
}

// Main App
export default function App() {
  const [locations, setLocations] = useState(travelData);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtx = useRef(null);

  const playPing = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      osc.connect(gain); gain.connect(audioCtx.current.destination);
      osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.current.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, audioCtx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.3);
      osc.start(); osc.stop(audioCtx.current.currentTime + 0.3);
    } catch {}
  }, [soundEnabled]);

  const handleSelectLocation = useCallback((loc) => { setSelectedLocation(loc); setIsAutoRotating(false); playPing(); }, [playPing]);
  const handleClosePanel = useCallback(() => { setSelectedLocation(null); setIsAutoRotating(true); }, []);
  const handleAddLocation = useCallback((loc) => { setLocations(prev => [...prev, loc]); setShowAdmin(false); }, []);

  useEffect(() => {
    let timer;
    const reset = () => { clearTimeout(timer); timer = setTimeout(() => { if (!selectedLocation) setIsAutoRotating(true); }, 10000); };
    window.addEventListener('mousemove', reset); window.addEventListener('click', reset);
    return () => { clearTimeout(timer); window.removeEventListener('mousemove', reset); window.removeEventListener('click', reset); };
  }, [selectedLocation]);

  const visited = locations.filter(l => l.type === 'visited').length;
  const bucket = locations.filter(l => l.type === 'bucket-list').length;
  const countries = [...new Set(locations.filter(l => l.type === 'visited').map(l => l.country))].length;

  return (
    <div style={{ width: '100%', height: '100vh', background: 'radial-gradient(ellipse at 20% 80%, rgba(0,255,136,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(79,195,247,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #12121a 0%, #0a0a0f 100%)', fontFamily: "'Space Grotesk', sans-serif", overflow: 'hidden', position: 'relative' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'); @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } } @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } } @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.2); } }`}</style>
      
      {/* Header */}
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28, filter: 'drop-shadow(0 0 10px #00ff88)', animation: 'float 3s ease-in-out infinite' }}>🌍</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 500, background: 'linear-gradient(135deg, #00ff88, #4fc3f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Wanderlust Journal</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '8px 14px', color: '#fff', fontSize: 18, cursor: 'pointer' }}>{soundEnabled ? '🔊' : '🔇'}</button>
          <button onClick={() => setShowAdmin(true)} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '8px 14px', color: '#fff', fontSize: 18, cursor: 'pointer' }}>➕</button>
        </div>
      </header>

      {/* Stats */}
      <div style={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', gap: 32, padding: '12px 28px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 30 }}>
        {[{ val: visited, label: 'Visited' }, { val: bucket, label: 'Bucket List' }, { val: countries, label: 'Countries' }].map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 600, color: '#00ff88', textShadow: '0 0 20px #00ff88' }}>{s.val}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <Suspense fallback={null}><Scene locations={locations} selectedLocation={selectedLocation} onSelectLocation={handleSelectLocation} isAutoRotating={isAutoRotating} /></Suspense>
      </Canvas>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: 80, left: 24, zIndex: 100, display: 'flex', flexDirection: 'column', gap: 8, padding: 14, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}>
        {[{ color: '#00ff88', label: 'Visited' }, { color: '#ff6b6b', label: 'Bucket List', pulse: true }].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, boxShadow: `0 0 10px ${l.color}`, animation: l.pulse ? 'pulse 2s ease-in-out infinite' : 'none' }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100, padding: '8px 20px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>🖱️ Drag to rotate • Scroll to zoom • Click pins to explore</p>
      </div>

      {/* Location Panel */}
      {selectedLocation && <LocationPanel location={selectedLocation} onClose={handleClosePanel} />}

      {/* Admin Panel */}
      {showAdmin && <AdminPanel onAddLocation={handleAddLocation} onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
