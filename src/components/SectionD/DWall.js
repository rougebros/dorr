import React, { useState, useEffect } from 'react';
import AddIcon from './../../files/icons/AddIcon.js';
import SearchIcon from './../../files/icons/SearchIcon.js';
import './DWall.css';

const DWall = ({ wallType, wallTitle, wallColor }) => {
  const [items, setItems] = useState([]);
  const [activeSection, setActiveSection] = useState(null); // Track active section (pains or needs)
  const [showIconsAsTabs, setShowIconsAsTabs] = useState(false); // Toggle between large icons and tabbed view
  const [iconStates, setIconStates] = useState({}); // Icon toggle states
  const [pov, setPov] = useState(null); // Store POV state

  // Handle the section click and toggle to tab view
  const handleSectionClick = (section) => {
    setActiveSection(section);
    setShowIconsAsTabs(true);
  };

  useEffect(() => {
    if (activeSection === 'pains' || activeSection === 'needs') {
      const fetchItems = async () => {
        // Simulate fetching JSON for selected section
        const files = [
          '/files/json/transport_truck.json',
          '/files/json/cat_stray.json',
          '/files/json/restaurant_sushi.json'
        ];
        const jsonFiles = await Promise.all(files.map(file => fetch(file).then(res => res.json())));

        const params = new URLSearchParams(window.location.search);
        const what = params.get('what')?.replace(/\s+/g, '_').toLowerCase();
        const povQuery = params.get('pov');
        const time = params.get('time');

        const selectedJson = jsonFiles.find(jsonFile =>
          jsonFile.hashtag.replace(/\s+/g, '_').toLowerCase() === what
        );
        const dorrRates = selectedJson?.dorr_rates || [];

        const filteredData = dorrRates.filter(rate => {
          const isWallTypeMatch = (activeSection === 'needs' && rate.type === '#seek') || (activeSection === 'pains' && rate.type === '#pains');
          return isWallTypeMatch && rate.filters.pov.includes(povQuery?.toLowerCase()) && rate.filters.time.includes(time?.toLowerCase());
        });

        setItems(filteredData);
        setPov(povQuery.toLowerCase());

      };

      fetchItems();
    }
  }, [activeSection]);

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

  // Render only 3 icons for each section
  const renderIcons = () => (
    <div className="d-icon-section-stack">
      {wallType === 'seeks' ? (
        <>
          <div
            className={`d-icon-item ${activeSection === 'strengths' ? 'active' : ''}`}
            onClick={() => handleSectionClick('strengths')}
          >
            💪 Strengths
          </div>
          <div
            className={`d-icon-item ${activeSection === 'opportunities' ? 'active' : ''}`}
            onClick={() => handleSectionClick('opportunities')}
          >
            🚀 Opportunity
          </div>
          <div
            className={`d-icon-item ${activeSection === 'needs' ? 'active' : ''}`}
            onClick={() => handleSectionClick('needs')}
          >
            🔆 Needs
          </div>
        </>
      ) : (
        <>
          <div
            className={`d-icon-item ${activeSection === 'weaknesses' ? 'active' : ''}`}
            onClick={() => handleSectionClick('weaknesses')}
          >
            🧩 Weaknesses
          </div>
          <div
            className={`d-icon-item ${activeSection === 'threats' ? 'active' : ''}`}
            onClick={() => handleSectionClick('threats')}
          >
            ⚠️ Threats
          </div>
          <div
            className={`d-icon-item ${activeSection === 'pains' ? 'active' : ''}`}
            onClick={() => handleSectionClick('pains')}
          >
            🩸 Pains
          </div>
        </>
      )}
    </div>
  );

  // Render items for the selected section
  const renderItems = () => (
    <div className="d-item-list">
      {items.length === 0 ? (
        <p class="d-no-item">No items found for this section.</p>
      ) : (
        items.map((item, index) => (
          <div key={index} className="d-child-item">
            <span className="item-text">{item.meta.details}</span>
            <span className="icon-action" onClick={() => handleIconClick(`item-${index}`,  pov === 'self')}>
              {renderIcon(`item-${index}`,  pov === 'self')}
            </span>
            📎 ⋮
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="d-wall-container" style={{ borderColor: wallColor }}>
      {/* Header */}
      <div className="d-header-section">
        <div className="header-left-icons">
          <AddIcon selectedColor={wallColor} />
          <SearchIcon selectedColor={wallColor} />
        </div>
        <h3 className="wall-header" style={{ color: wallColor }}>
          {wallTitle}
        </h3>
      </div>

      {/* Display either large icons or tab view */}
      {!showIconsAsTabs ? (
        renderIcons() // Show large icons initially
      ) : (
        <>
          <div className="d-tab-section">
            {/* Tabs for the 3 icons */}
            {wallType === 'seeks' ? (
              <>
                <div
                  className={`d-tab-item d1 ${activeSection === 'strengths' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('strengths')}
                >
                  💪 Strengths
                </div>
                <div
                  className={`d-tab-item d1 ${activeSection === 'opportunities' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('opportunities')}
                >
                  🚀 Opportunity
                </div>
                <div
                  className={`d-tab-item d1 ${activeSection === 'needs' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('needs')}
                >
                  🔆 Needs
                </div>
              </>
            ) : (
              <>
                <div
                  className={`d-tab-item d2 ${activeSection === 'weaknesses' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('weaknesses')}
                >
                  🧩 Weaknesses
                </div>
                <div
                  className={`d-tab-item d2 ${activeSection === 'threats' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('threats')}
                >
                  ⚠️ Threats
                </div>
                <div
                  className={`d-tab-item d2 ${activeSection === 'pains' ? 'active' : ''}`}
                  onClick={() => handleSectionClick('pains')}
                >
                  🩸 Pains
                </div>
              </>
            )}
          </div>

          {/* Display the list of items when a section is active */}
          {activeSection === 'pains' || activeSection === 'needs' ? renderItems() : <p class="d-no-item">No items to display for this section.</p>}
        </>
      )}
    </div>
  );
};

export default DWall;
