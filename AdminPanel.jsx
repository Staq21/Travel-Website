import React, { useState } from 'react';

export default function AdminPanel({ onAddLocation }) {
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    type: 'bucket-list',
    lat: '',
    lng: '',
    arrival: '',
    departure: '',
    quickFacts: ['', '', '', ''],
    imageUrl: '',
    imageCaption: '',
    notes: '',
    rating: 5
  });
  
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupStatus, setLookupStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFactChange = (index, value) => {
    setFormData(prev => {
      const newFacts = [...prev.quickFacts];
      newFacts[index] = value;
      return { ...prev, quickFacts: newFacts };
    });
  };

  // Auto-lookup coordinates using free Nominatim API
  const lookupCoordinates = async () => {
    if (!formData.city || !formData.country) {
      setLookupStatus('Please enter city and country first');
      return;
    }

    setIsLookingUp(true);
    setLookupStatus('Looking up coordinates...');

    try {
      const query = encodeURIComponent(`${formData.city}, ${formData.country}`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
        {
          headers: {
            'User-Agent': 'TravelJournalApp/1.0'
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          lat: parseFloat(data[0].lat).toFixed(4),
          lng: parseFloat(data[0].lon).toFixed(4)
        }));
        setLookupStatus('✓ Coordinates found!');
      } else {
        setLookupStatus('Location not found. Please enter manually.');
      }
    } catch (error) {
      setLookupStatus('Lookup failed. Please enter coordinates manually.');
      console.error('Geocoding error:', error);
    }

    setIsLookingUp(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.city || !formData.country || !formData.lat || !formData.lng) {
      alert('Please fill in city, country, and coordinates');
      return;
    }

    const newLocation = {
      city: formData.city,
      country: formData.country,
      type: formData.type,
      coordinates: {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      },
      dates: formData.type === 'visited' ? {
        arrival: formData.arrival,
        departure: formData.departure
      } : null,
      quickFacts: formData.quickFacts.filter(f => f.trim() !== ''),
      images: formData.imageUrl ? [{
        url: formData.imageUrl,
        caption: formData.imageCaption || formData.city
      }] : [],
      notes: formData.notes,
      rating: formData.type === 'visited' ? formData.rating : null
    };

    onAddLocation(newLocation);
    
    // Reset form
    setFormData({
      city: '',
      country: '',
      type: 'bucket-list',
      lat: '',
      lng: '',
      arrival: '',
      departure: '',
      quickFacts: ['', '', '', ''],
      imageUrl: '',
      imageCaption: '',
      notes: '',
      rating: 5
    });
    setLookupStatus('');
  };

  return (
    <div className="admin-panel">
      <h2>✈️ Add New Location</h2>
      
      <form onSubmit={handleSubmit} className="admin-form">
        {/* Location Type Toggle */}
        <div className="form-group type-toggle">
          <label>Location Type</label>
          <div className="toggle-buttons">
            <button
              type="button"
              className={`toggle-btn ${formData.type === 'visited' ? 'active visited' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'visited' }))}
            >
              ✓ Visited
            </button>
            <button
              type="button"
              className={`toggle-btn ${formData.type === 'bucket-list' ? 'active bucket' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'bucket-list' }))}
            >
              ✨ Bucket List
            </button>
          </div>
        </div>

        {/* City & Country */}
        <div className="form-row">
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Tokyo"
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label>Country *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Japan"
              className="input"
              required
            />
          </div>
        </div>

        {/* Coordinates with auto-lookup */}
        <div className="form-group coordinates-group">
          <label>Coordinates *</label>
          <div className="coords-row">
            <input
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              placeholder="Latitude"
              className="input"
              required
            />
            <input
              type="text"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              placeholder="Longitude"
              className="input"
              required
            />
            <button
              type="button"
              onClick={lookupCoordinates}
              disabled={isLookingUp}
              className="btn lookup-btn"
            >
              {isLookingUp ? '...' : '🔍'}
            </button>
          </div>
          {lookupStatus && (
            <span className="lookup-status">{lookupStatus}</span>
          )}
        </div>

        {/* Dates (only for visited) */}
        {formData.type === 'visited' && (
          <div className="form-row">
            <div className="form-group">
              <label>Arrival Date</label>
              <input
                type="date"
                name="arrival"
                value={formData.arrival}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="form-group">
              <label>Departure Date</label>
              <input
                type="date"
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>
        )}

        {/* Rating (only for visited) */}
        {formData.type === 'visited' && (
          <div className="form-group">
            <label>Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${formData.rating >= star ? 'filled' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Facts */}
        <div className="form-group">
          <label>Quick Facts</label>
          {formData.quickFacts.map((fact, idx) => (
            <input
              key={idx}
              type="text"
              value={fact}
              onChange={(e) => handleFactChange(idx, e.target.value)}
              placeholder={`Fun fact #${idx + 1}`}
              className="input fact-input"
            />
          ))}
        </div>

        {/* Image */}
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
            className="input"
          />
          <input
            type="text"
            name="imageCaption"
            value={formData.imageCaption}
            onChange={handleChange}
            placeholder="Image caption"
            className="input"
            style={{ marginTop: '0.5rem' }}
          />
        </div>

        {/* Notes */}
        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Personal memories, tips, things to remember..."
            className="input textarea"
            rows={3}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn primary submit-btn">
          Add to {formData.type === 'visited' ? 'Journal' : 'Bucket List'}
        </button>
      </form>
    </div>
  );
}
