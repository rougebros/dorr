import React, { useState, useEffect } from 'react';
import { useLocalization } from '../toolkit/LocalizationContext';
import './FSection.css';

const FSection = ({ type, color, logo }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalRating, setTotalRating] = useState(0);
  const [pov, setPov] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [whatPresent, setWhatPresent] = useState(false);
  const { translate } = useLocalization();

  useEffect(() => {
    const loadFData = () => {
      // Get the "what" parameter, sanitize it for consistent file naming
      const params = new URLSearchParams(window.location.search);
      const what = decodeURIComponent(params.get('what') || '')
        .replace(/#/g, '')         // Remove `#`
        .replace(/\s+/g, '_')       // Replace spaces with underscores
        .toLowerCase();

      if (!what) {
        setWhatPresent(false);
        setFilteredData([]);
        return;
      }

      setWhatPresent(true);

      // Load data from local storage using the sanitized key
      const storedData = localStorage.getItem(`${what}.json`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const targetData = type === 'gods' ? parsedData.dorr_rates.find(rate => rate.type === '#godly') : parsedData.dorr_rates.find(rate => rate.type === '#foe');
        setData(targetData ? [targetData] : []);
        console.log(`Loaded ${what}.json from local storage.`);
      } else {
        console.warn(`Data file for ${what} not found in local storage.`);
        setData([]);
      }
    };

    loadFData();
  }, [type]);

  useEffect(() => {
    const handleParamsChange = () => {
      const params = new URLSearchParams(window.location.search);
      const povParam = params.get('pov')?.toLowerCase();
      const timeParam = params.get('time')?.toLowerCase();

      setPov(povParam);

      // Filter data based on parameters
      const filtered = data.filter(item => {
        return (
          item.filters.pov.includes(povParam) &&
          item.filters.time.includes(timeParam)
        );
      });

      setFilteredData(filtered);

      // Calculate total rating (if ratings are relevant here)
      const ratingSum = filtered.reduce((sum, item) => sum + (item.rating || 0), 0);
      setTotalRating(ratingSum);
    };

    handleParamsChange();
    window.addEventListener('popstate', handleParamsChange);

    return () => window.removeEventListener('popstate', handleParamsChange);
  }, [data]);

  const handleRatingChange = (id, newRating) => {
    const item = filteredData.find(item => item.id === id);
    if (totalRating - item.rating + newRating <= 100) {
      const updatedData = filteredData.map(item =>
        item.id === id ? { ...item, rating: newRating } : item
      );
      setFilteredData(updatedData);

      const newTotalRating = updatedData.reduce((sum, item) => sum + item.rating, 0);
      setTotalRating(newTotalRating);
    } else {
      alert('Total rating cannot exceed 100');
    }
  };

  const handleMouseEnter = (item, event) => {
    setHoveredItem(item);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className={`f-section ${!whatPresent ? 'grayed-out' : ''}`} style={{ backgroundColor: color }}>
      {pov === 'self' && whatPresent && (
        <p className="total-rating">Total Rating: {totalRating} / 100</p>
      )}

      <div className="f-section-header">
        <span className="logo">{logo}</span>
        <span className="title">{type === 'gods' ? translate('27', 'Hall of Fame' ): translate('28', 'Hall of Shame' )}</span>
      </div>

      {!whatPresent ? (
        <p>{translate('29', 'Please select a 🌱 #WHAT')} </p>
      ) : filteredData.length > 0 ? (
        <ul className="f-section-list">
          {filteredData.map((item, index) => (
            <li key={index} className="f-section-item">
              <span 
                className="name"
                onMouseEnter={(e) => handleMouseEnter(item, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                {item.meta.entity_name}
              </span>
              {pov === 'self' ? (
                <input
                  type="number"
                  value={item.rating || 0}
                  onChange={e => handleRatingChange(item.id, parseInt(e.target.value))}
                  className="rating-input"
                />
              ) : (
                <span className="rating">{item.rating || 0}%</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No {type === 'gods' ? 'Fame' : 'Shame'} found for the selected filters.</p>
      )}

      {hoveredItem && (
        <div
          className="tooltip"
          style={{
            top: mousePosition.y + 15 + 'px',
            left: mousePosition.x + 15 + 'px',
          }}
        >
          <p>Contact: {hoveredItem.meta.contact_info}</p>
          <p>Location: {hoveredItem.meta.location}</p>
          <p>Details: {hoveredItem.meta.details}</p>
        </div>
      )}
    </div>
  );
};

export default FSection;
