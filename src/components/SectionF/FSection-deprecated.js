import React, { useState, useEffect } from 'react';
import { useLocalization } from '../toolkit/LocalizationContext';
import './FSection.css';

const FSection = ({ type, color, logo }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalRating, setTotalRating] = useState(0);
  const [pov, setPov] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null); // Track the hovered item
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Track mouse position
  const [whatPresent, setWhatPresent] = useState(false); // Check if "WHAT" is present
  const { translate } = useLocalization();

  useEffect(() => {
    const loadFData = async () => {
      try {
        const response = await fetch('/f-data.json'); // Adjust the path as needed
        const json = await response.json();
        setData(type === 'gods' ? json.gods : json.foes);
      } catch (error) {
        console.error('Failed to load F-data:', error);
      }
    };

    loadFData();
  }, [type]);

  useEffect(() => {
    const handleParamsChange = () => {
      const params = new URLSearchParams(window.location.search);
      const what = params.get('what') || '';
      const pov = params.get('pov')?.toLowerCase(); // Convert POV to lowercase
      const time = params.get('time')?.toLowerCase(); // Convert time to lowercase
      const category = type === 'gods' ? 'gains' : 'pains';
  
      setPov(pov);
  
      // If "what" is empty, show the message to select a seed first
      if (!what) {
        setWhatPresent(false);
        setFilteredData([]);
        return;
      }
  
      setWhatPresent(true);
  
      const cleanedWhat = what.replace(/[#]+/g, '#').trim();
  
      const filtered = data.filter(item => 
        item.filters.what === cleanedWhat &&
        item.filters.time.toLowerCase() === time && // Convert data time to lowercase
        item.filters.category === category
      ).sort((a, b) => b.rating - a.rating);
  
      setFilteredData(filtered);
  
      const ratingSum = filtered.reduce((sum, item) => sum + item.rating, 0);
      setTotalRating(ratingSum);
    };
  
    handleParamsChange();
    window.addEventListener('popstate', handleParamsChange);
  
    return () => window.removeEventListener('popstate', handleParamsChange);
  }, [data, type]);
  

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
        <p>{translate('29', 'Please select a 🌱 #WHAT')} </p> // If "WHAT" is not present
      ) : filteredData.length > 0 ? (
        <ul className="f-section-list">
          {filteredData.map(item => (
            <li key={item.id} className="f-section-item">
            <span 
              className="name"
              onMouseEnter={(e) => handleMouseEnter(item, e)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              {item.name}
            </span>
            {pov === 'self' ? (
              <input
                type="number"
                value={item.rating}
                onChange={e => handleRatingChange(item.id, parseInt(e.target.value))}
                className="rating-input"
              />
            ) : (
              <span className="rating">{item.rating}%</span>
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
          <p>Contact: {hoveredItem.metadata.contact}</p>
          <p>Location: {hoveredItem.metadata.location}</p>
          <p>Details: {hoveredItem.metadata.details}</p>
        </div>
      )}

      {/* {pov === 'self' && whatPresent && (
        <div className="add-new">
          <a href="#" className="add-new-link">+ Add</a>
        </div>
      )} */}
    </div>
  );
};

export default FSection;
