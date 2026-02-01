import React, { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  Html,
  useTexture,
  Sphere,
  Line,
  shaderMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { travelData } from './travelData';
import LocationPanel from './LocationPanel';
import AdminPanel from './AdminPanel';
import SoundManager from './SoundManager';
import './App.css';

// Custom shader for atmospheric glow
const AtmosphereMaterial = shaderMaterial(
  { color: new THREE.Color('#4fc3f7'), coefficient: 0.5, power: 3.0 },
  // Vertex shader
  `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 color;
    uniform float coefficient;
    uniform float power;
    varying vec3 vNormal;
    void main() {
      float intensity = pow(coefficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power);
      gl_FragColor = vec4(color, 1.0) * intensity;
    }
  `
);

extend({ AtmosphereMaterial });

// Convert lat/lng to 3D coordinates
const latLngToVector3 = (lat, lng, radius = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Generate bezier curve points between two locations
const generateArcPoints = (start, end, radius = 2, segments = 50) => {
  const startVec = latLngToVector3(start.lat, start.lng, radius);
  const endVec = latLngToVector3(end.lat, end.lng, radius);
  
  const midPoint = new THREE.Vector3()
    .addVectors(startVec, endVec)
    .multiplyScalar(0.5);
  
  const distance = startVec.distanceTo(endVec);
  midPoint.normalize().multiplyScalar(radius + distance * 0.3);
  
  const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
  return curve.getPoints(segments);
};

// Animated pin component for visited locations
function VisitedPin({ position, location, onClick, isSelected }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(
        isSelected ? 1.5 : hovered ? 1.3 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      );
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
      </mesh>
      
      {/* Main pin */}
      <mesh 
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(location); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial 
          color={isSelected ? "#ffffff" : "#00ff88"} 
          emissive={isSelected ? "#00ff88" : "#00aa55"}
          emissiveIntensity={isSelected ? 2 : 1}
        />
      </mesh>
      
      {/* City label on hover */}
      {(hovered || isSelected) && (
        <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div className="city-label">
            {location.city}
          </div>
        </Html>
      )}
    </group>
  );
}

// Pulsing marker for bucket list locations
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
      {/* Pulsing ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.08, 32]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Center dot */}
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(location); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial 
          color={isSelected ? "#ffffff" : "#ff6b6b"} 
          emissive="#ff4444"
          emissiveIntensity={1.5}
        />
      </mesh>
      
      {(hovered || isSelected) && (
        <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div className="city-label bucket-list">
            {location.city} ✨
          </div>
        </Html>
      )}
    </group>
  );
}

// Travel arc between locations
function TravelArc({ start, end, color = "#00ff88", animated = true }) {
  const lineRef = useRef();
  const points = generateArcPoints(start, end, 2);
  const [drawRange, setDrawRange] = useState(0);
  
  useFrame((state) => {
    if (animated && lineRef.current) {
      const progress = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2;
      setDrawRange(Math.floor(progress * points.length));
    }
  });

  return (
    <Line
      ref={lineRef}
      points={animated ? points.slice(0, drawRange) : points}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={0.6}
    />
  );
}

// Main Earth globe component
function Earth({ locations, selectedLocation, onSelectLocation, isAutoRotating }) {
  const earthRef = useRef();
  const { camera } = useThree();
  
  // Load textures
  const [dayMap, nightMap, normalMap, specularMap] = useTexture([
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg',
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png',
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png'
  ]);

  useFrame((state, delta) => {
    if (isAutoRotating && earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });

  // Camera fly-to animation
  useEffect(() => {
    if (selectedLocation) {
      const targetPos = latLngToVector3(
        selectedLocation.coordinates.lat,
        selectedLocation.coordinates.lng,
        5
      );
      // Smooth camera transition would be handled by GSAP or similar
    }
  }, [selectedLocation, camera]);

  // Get visited and bucket list locations
  const visitedLocations = locations.filter(loc => loc.type === 'visited');
  const bucketListLocations = locations.filter(loc => loc.type === 'bucket-list');

  // Generate arcs between consecutive visited locations
  const travelArcs = [];
  for (let i = 0; i < visitedLocations.length - 1; i++) {
    travelArcs.push({
      start: visitedLocations[i].coordinates,
      end: visitedLocations[i + 1].coordinates,
      id: `arc-${i}`
    });
  }

  return (
    <group ref={earthRef}>
      {/* Earth sphere with day texture */}
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          map={dayMap}
          normalMap={normalMap}
          specularMap={specularMap}
          shininess={5}
        />
      </Sphere>

      {/* Night lights layer */}
      <Sphere args={[2.001, 64, 64]}>
        <meshBasicMaterial
          map={nightMap}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Atmospheric glow */}
      <Sphere args={[2.15, 64, 64]}>
        <atmosphereMaterial
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Travel arcs */}
      {travelArcs.map((arc) => (
        <TravelArc
          key={arc.id}
          start={arc.start}
          end={arc.end}
          color="#00ff88"
        />
      ))}

      {/* Visited location pins */}
      {visitedLocations.map((location) => (
        <VisitedPin
          key={location.id}
          position={latLngToVector3(location.coordinates.lat, location.coordinates.lng, 2.05)}
          location={location}
          onClick={onSelectLocation}
          isSelected={selectedLocation?.id === location.id}
        />
      ))}

      {/* Bucket list pulses */}
      {bucketListLocations.map((location) => (
        <BucketListPulse
          key={location.id}
          position={latLngToVector3(location.coordinates.lat, location.coordinates.lng, 2.05)}
          location={location}
          onClick={onSelectLocation}
          isSelected={selectedLocation?.id === location.id}
        />
      ))}
    </group>
  );
}

// Scene component with effects
function Scene({ locations, selectedLocation, onSelectLocation, isAutoRotating }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4fc3f7" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Earth
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={onSelectLocation}
        isAutoRotating={isAutoRotating}
      />
      
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        autoRotate={isAutoRotating}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Main App component
export default function App() {
  const [locations, setLocations] = useState(travelData);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundManagerRef = useRef();
  
  // Stop auto-rotation when a location is selected
  const handleSelectLocation = useCallback((location) => {
    setSelectedLocation(location);
    setIsAutoRotating(false);
    if (soundEnabled && soundManagerRef.current) {
      soundManagerRef.current.playPing();
    }
  }, [soundEnabled]);

  const handleClosePanel = useCallback(() => {
    setSelectedLocation(null);
    setIsAutoRotating(true);
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Simple password check - in production, use proper auth
    if (adminPassword === 'wanderlust2024') {
      setIsAdminAuthenticated(true);
    }
  };

  const handleAddLocation = (newLocation) => {
    setLocations(prev => [...prev, { ...newLocation, id: `loc-${Date.now()}` }]);
    if (soundEnabled && soundManagerRef.current) {
      soundManagerRef.current.playSuccess();
    }
  };

  // Auto-tour idle detection
  useEffect(() => {
    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!selectedLocation) {
          setIsAutoRotating(true);
        }
      }, 10000); // 10 seconds of idle
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);
    
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, [selectedLocation]);

  return (
    <div className="app">
      {/* Sound Manager */}
      <SoundManager ref={soundManagerRef} enabled={soundEnabled} />
      
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🌍</span>
          <h1>Wanderlust Journal</h1>
        </div>
        <nav className="nav">
          <button 
            className={`nav-btn ${soundEnabled ? 'active' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button 
            className="nav-btn"
            onClick={() => setShowAdmin(!showAdmin)}
          >
            ⚙️
          </button>
        </nav>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-value">{locations.filter(l => l.type === 'visited').length}</span>
          <span className="stat-label">Places Visited</span>
        </div>
        <div className="stat">
          <span className="stat-value">{locations.filter(l => l.type === 'bucket-list').length}</span>
          <span className="stat-label">Bucket List</span>
        </div>
        <div className="stat">
          <span className="stat-value">
            {[...new Set(locations.filter(l => l.type === 'visited').map(l => l.country))].length}
          </span>
          <span className="stat-label">Countries</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
            isAutoRotating={isAutoRotating}
          />
        </Suspense>
      </Canvas>

      {/* Legend */}
      <div className="legend">
        <div className="legend-item">
          <span className="legend-dot visited"></span>
          <span>Visited</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot bucket-list"></span>
          <span>Bucket List</span>
        </div>
      </div>

      {/* Location Panel */}
      {selectedLocation && (
        <LocationPanel
          location={selectedLocation}
          onClose={handleClosePanel}
        />
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <div className="admin-overlay">
          <div className="admin-modal glass">
            <button className="close-btn" onClick={() => setShowAdmin(false)}>×</button>
            
            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminLogin} className="admin-login">
                <h2>🔐 Admin Access</h2>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="input"
                />
                <button type="submit" className="btn primary">Unlock</button>
              </form>
            ) : (
              <AdminPanel onAddLocation={handleAddLocation} />
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="instructions">
        <p>🖱️ Drag to rotate • Scroll to zoom • Click pins to explore</p>
      </div>
    </div>
  );
}
