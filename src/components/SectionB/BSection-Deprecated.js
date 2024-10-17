import React, { useState, useEffect } from 'react';
import './BSection-Deprecated.css'; // Rename this to CSection.css later

const CSection = () => {
  const [selectedPOV, setSelectedPOV] = useState(null); // Track selected POV
  const [selectedTime, setSelectedTime] = useState(null); // Track selected time

  // Function to handle POV click and reload page
  const handlePOVClick = (pov) => {
    if (selectedPOV !== pov) {
      setSelectedPOV(pov);
      updateQueryParams('pov', pov);
      window.location.reload(); // Reload the page when POV is changed
    }
  };

  // Function to handle Time click and reload page
  const handleTimeClick = (time) => {
    if (selectedTime !== time) {
      setSelectedTime(time);
      updateQueryParams('time', time);
      window.location.reload(); // Reload the page when Time is changed
    }
  };

  // Function to update query params
  const updateQueryParams = (key, value) => {
    const params = new URLSearchParams(window.location.search);
    params.set(key, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  useEffect(() => {
    // Initialize values from URL on load
    const params = new URLSearchParams(window.location.search);
    const pov = params.get('pov');
    const time = params.get('time');

    if (pov) setSelectedPOV(pov);
    if (time) setSelectedTime(time);
  }, []);

  return (
    <div className="pov-time-selector">
      {/* POV Section */}
      <div className="pov-options">
        <div
          className={`pov-item ${selectedPOV === 'self' ? 'selected' : ''}`}
          onClick={() => handlePOVClick('self')}
        >
          <span role="img" aria-label="self">👁️</span> Self
        </div>
        <div
          className={`pov-item ${selectedPOV === 'peers' ? 'selected' : ''}`}
          onClick={() => handlePOVClick('peers')}
        >
          <span role="img" aria-label="peers">🫂</span> Peers
        </div>
        <div
          className={`pov-item ${selectedPOV === 'public' ? 'selected' : ''}`}
          onClick={() => handlePOVClick('public')}
        >
          <span role="img" aria-label="public">🌍</span> Public
        </div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Time Section */}
      <div className="time-options">
        <div
          className={`time-item ${selectedTime === 'past' ? 'selected' : ''}`}
          onClick={() => handleTimeClick('past')}
        >
          <span role="img" aria-label="past">⏳</span> Past
        </div>
        <div
          className={`time-item ${selectedTime === 'NOW' ? 'selected' : ''}`}
          onClick={() => handleTimeClick('NOW')}
        >
          <span role="img" aria-label="now">⌛</span> NOW
        </div>
        <div
          className={`time-item ${selectedTime === 'future' ? 'selected' : ''}`}
          onClick={() => handleTimeClick('future')}
        >
          <span role="img" aria-label="future">🔮</span> Future
        </div>
      </div>
    </div>
  );
};

export default CSection;
