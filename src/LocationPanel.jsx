import React, { useState } from 'react';

export default function LocationPanel({ location, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const isVisited = location.type === 'visited';
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDuration = () => {
    if (!location.dates?.arrival || !location.dates?.departure) return null;
    const start = new Date(location.dates.arrival);
    const end = new Date(location.dates.departure);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  return (
    <div className="location-panel glass">
      {/* Close button */}
      <button className="close-btn" onClick={onClose}>×</button>
      
      {/* Header */}
      <div className="panel-header">
        <div className="location-type-badge" data-type={location.type}>
          {isVisited ? '✓ Visited' : '✨ Bucket List'}
        </div>
        <h2 className="city-name">{location.city}</h2>
        <p className="country-name">{location.country}</p>
        
        {/* Rating stars for visited locations */}
        {isVisited && location.rating && (
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < location.rating ? 'filled' : ''}`}>
                ★
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Date info */}
      {isVisited && location.dates && (
        <div className="dates-section">
          <div className="date-card">
            <span className="date-label">📅 Trip Dates</span>
            <span className="date-value">
              {formatDate(location.dates.arrival)} — {formatDate(location.dates.departure)}
            </span>
            {getDuration() && (
              <span className="duration">{getDuration()}</span>
            )}
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {location.images && location.images.length > 0 && (
        <div className="gallery-section">
          <div className="main-image">
            <img 
              src={location.images[activeImageIndex]?.url} 
              alt={location.images[activeImageIndex]?.caption}
            />
            {location.images[activeImageIndex]?.caption && (
              <p className="image-caption">{location.images[activeImageIndex].caption}</p>
            )}
          </div>
          
          {location.images.length > 1 && (
            <div className="thumbnail-strip">
              {location.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${idx === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img.url} alt={img.caption} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Facts */}
      {location.quickFacts && location.quickFacts.length > 0 && (
        <div className="facts-section">
          <h3>⚡ Quick Facts</h3>
          <ul className="facts-list">
            {location.quickFacts.map((fact, idx) => (
              <li key={idx}>{fact}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {location.notes && (
        <div className="notes-section">
          <h3>📝 Notes</h3>
          <p className="notes-text">{location.notes}</p>
        </div>
      )}

      {/* Coordinates (for fellow travelers) */}
      <div className="coordinates-section">
        <span className="coords">
          📍 {location.coordinates.lat.toFixed(4)}°, {location.coordinates.lng.toFixed(4)}°
        </span>
      </div>
    </div>
  );
}
