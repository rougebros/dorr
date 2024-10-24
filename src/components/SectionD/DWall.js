import React, { useState, useEffect } from 'react';
import AddIcon from './../../files/icons/AddIcon.js';
import SearchIcon from './../../files/icons/SearchIcon.js';
import './DWall.css';

const DWall = ({ wallType, wallTitle, wallColor }) => {
  const [items, setItems] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [iconStates, setIconStates] = useState({}); // Icon toggle states
  const [selectedItem, setSelectedItem] = useState(null); // Track the selected item

  // Handle row click to select and highlight the item
  const handleRowClick = (itemId) => {
    setSelectedItem((prevItem) => (prevItem === itemId ? null : itemId)); // Toggle selected state
  };
  
  useEffect(() => {
    const fetchHashtagFiles = async () => {
      const files = [
        '/files/json/transport_truck.json',
        '/files/json/cat_stray.json',
        '/files/json/restaurant_sushi.json'
      ];

      const jsonFiles = await Promise.all(files.map(file => fetch(file).then(res => res.json())));
      
      const params = new URLSearchParams(window.location.search);
      let what = params.get('what');
      const povQuery = params.get('pov');
      const time = params.get('time');

      if (!what) {
        console.error('No "what" parameter found in URL.');
        return;
      }

      what = decodeURIComponent(what).replace(/\s+/g, '_').toLowerCase();
      
      const selectedJson = jsonFiles.find(jsonFile =>
        jsonFile.hashtag.replace(/\s+/g, '_').toLowerCase() === what
      );

      if (!selectedJson) {
        console.error(`No matching JSON file found for the selected hashtag: ${what}`);
        return;
      }

      const dorrRates = selectedJson.dorr_rates || [];

      // Filter the items based on wallType: 'seeks' or 'pains'
      const filteredData = dorrRates
        .filter(rate => {
          const isWallTypeMatch = (wallType === 'seeks' && rate.type === '#seek') || (wallType === 'pains' && rate.type === '#pains');
          return isWallTypeMatch && rate.filters.pov.includes(povQuery.toLowerCase()) && rate.filters.time.includes(time.toLowerCase());
        })
        .map(rate => ({
          ...rate,
          sub_rates: rate.sub_rates || []
        }));

      setItems(filteredData);
    };

    fetchHashtagFiles();
  }, [wallType]);

  const toggleExpand = (itemId) => {
    setExpandedItem(prevState => (prevState === itemId ? null : itemId));
  };

  // Function to handle icon click and toggle state
  const handleIconClick = (itemId, isSelf) => {
    setIconStates(prevState => {
      const newState = { ...prevState };
      if (isSelf) {
        // Cycle through 🔉 -> 🔇 -> 🔊
        newState[itemId] = newState[itemId] === '🔇' ? '🔉' : newState[itemId] === '🔉' ? '🔊' : '🔇';
      } else {
        // Toggle between 🔕 and 🔔
        newState[itemId] = newState[itemId] === '🔕' ? '🔔' : '🔕';
      }
      return newState;
    });
  };

  // Function to render the appropriate icon based on POV
  const renderIcon = (itemId, isSelf) => {
    const currentState = iconStates[itemId];
    if (isSelf) {
      return currentState || '🔇'; // Start with 🔉 for self
    } else {
      return currentState || '🔕'; // Start with 🔕 for others
    }
  };

  // Render D1 (Seeks/Gains) sections
  const renderD1 = (pov) => (
    <>
      <div className="parent-item d1">
        Strengths 📌
      </div>
      <div className="parent-item d1">
        Opportunities 
      </div>
      <div className="parent-item d1" onClick={() => toggleExpand('needs')}>
        Needs {expandedItem === 'needs' ? '▼' : '►'}
      </div>
      {expandedItem === 'needs' && items.map((item, index) => (
        <div key={index} className="child-item d1" title={item.meta.details}>
          <span className="item-text">{item.meta.details}</span> 
          <span className="icon-action" onClick={() => handleIconClick(`needs-${index}`, pov === 'self')}>
            {renderIcon(`needs-${index}`, pov === 'self')}
          </span>
          📎 ⋮
        </div>
      ))}
    </>
  );

  // Render D2 (Pains) sections
  const renderD2 = (pov) => (
    <>
      <div className="parent-item d2">
        Threats 📌
      </div>
      <div className="parent-item d2">
        Weaknesses
      </div>
      <div className="parent-item d2" onClick={() => toggleExpand('pains')}>
        Pains {expandedItem === 'pains' ? '▼' : '►'}
      </div>
      {expandedItem === 'pains' && items.map((item, index) => (
        <div key={index} className="child-item d2" title={item.meta.details}>
          <span className="item-text">{item.meta.details}</span> 
          <span className="icon-action" onClick={() => handleIconClick(`pains-${index}`, pov === 'self')}>
            {renderIcon(`pains-${index}`, pov === 'self')}
          </span>
          📎 ⋮
        </div>
      ))}
    </>
  );

  const pov = new URLSearchParams(window.location.search).get('pov')?.toLowerCase();

  return (
    <div className="d-wall-container" style={{ borderColor: wallColor }}>
      {/* Header */}
      <div className="header-section">
        <div className="header-left-icons">
          {pov === 'self' && (
            <AddIcon selectedColor={wallColor} />
          )}
          <SearchIcon selectedColor={wallColor} />
        </div>
        <h3 className="wall-header" style={{ color: wallColor }}>
          {wallTitle}
        </h3>
      </div>

      {/* Render D1 (Seeks) or D2 (Pains) */}
      <div className="wall-list">
        {wallType === 'seeks' ? renderD1(pov) : renderD2(pov)}
      </div>
    </div>
  );
};

export default DWall;
