import React, { useState, useEffect } from 'react';
import './POVSelector.css';
import povTree from '../../files/json/povTree.json';

import AddIcon from '../../files/icons/AddIcon.js';
import SearchIcon from '../../files/icons/SearchIcon.js';
import { FaStar } from 'react-icons/fa'; // Import favorite icon
import { useLocalization } from '../toolkit/LocalizationContext';


const C2POVSelector = () => {
  const [currentLevel, setCurrentLevel] = useState(povTree.pov); // Start from the root
  const [povPath, setPovPath] = useState([]); // Breadcrumb path
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item for highlighting
  const [doubleClick, setDoubleClick] = useState(false); // Track double-clicks
  const { translate } = useLocalization();
  const translationMap = {
    'self': translate('31', 'Self'),
    'peers': translate('32', 'Peers'),
    'public': translate('33', 'Public')
  };

  // Update the query string in the URL for POV (for top-level items only)
  const updateQueryParams = (params) => {
    const queryParams = new URLSearchParams(window.location.search);

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        queryParams.set(key, params[key]);
      } else {
        queryParams.delete(key); // Remove param if value is null
      }
    });

    window.history.replaceState({}, '', `${window.location.pathname}?${queryParams.toString()}`);
    window.location.reload(); // Reload the page after setting params for first-level items (self, peers, public)
  };

  // Log current query params for debugging and highlight based on the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Normalize the query key to lowercase (handling case insensitivity)
    const selectedPov = params.get('POV') || params.get('pov'); // Check both lowercase and uppercase

    if (selectedPov && (selectedPov.toLowerCase() === 'self' || selectedPov.toLowerCase() === 'peers' || selectedPov.toLowerCase() === 'public')) {
      setSelectedItem(selectedPov.toLowerCase()); // Highlight based on URL params
    }
  }, []);

  // Single click action: Select item, highlight it, and update params only for Self/Peers/Public
  const handleSingleClick = (key, item) => {
    setSelectedItem(item.label.toLowerCase()); // Highlight the selected item

    if (item.label.toLowerCase() === 'self' || item.label.toLowerCase() === 'peers' || item.label.toLowerCase() === 'public') {
      // Update the query params and reload for top-level items
      updateQueryParams({ pov: item.label });
    }
  };

  // Double click action: Go deeper for Peers/Public children without refreshing the page
  const handleDoubleClick = (key, item) => {
    clearTimeout(doubleClick); // Cancel the single-click timeout

    if (item.children) {
      // Go deeper for child nodes
      const newPath = [...povPath, { icon: item.icon, label: item.label }];
      setCurrentLevel(item.children);
      setPovPath(newPath);
    }
  };

  // Handle click with single/double click distinction
  const handleClick = (key, item) => {
    if (!doubleClick) {
      setDoubleClick(true);
      const timeout = setTimeout(() => {
        handleSingleClick(key, item); // Handle single click for top-level items
        setDoubleClick(false); // Reset double-click tracking
      }, 200); // Time window for double-click detection

      setDoubleClick(timeout); // Save the timeout ID
    } else {
      handleDoubleClick(key, item); // If it's a double-click
      setDoubleClick(false); // Reset after the double-click action
    }
  };

  // Go back in the hierarchy
  const goBack = () => {
    const newPath = povPath.slice(0, -1); // Remove the last item from the breadcrumb
    setPovPath(newPath);

    if (newPath.length > 0) {
      let level = povTree.pov;
      newPath.forEach((pathItem) => {
        level = Object.values(level).find(item => item.label === pathItem.label)?.children || level;
      });
      setCurrentLevel(level);
    } else {
      setCurrentLevel(povTree.pov); // Reset to root
    }
  };

  return (
    <div className="selector-container pov-container">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        <div className="breadcrumb-actions">
          {/* Favorite icon */}
          <FaStar className="favorite-icon" selectedColor="gray" />
          {/* Always show SearchIcon */}
          <SearchIcon selectedColor="gray" />

          {/* Conditionally show AddIcon after SearchIcon if povPath has values */}
          {povPath.length > 0 && <AddIcon selectedColor="gray" />}

          {/* Breadcrumb showing the path when povPath has values */}
          {povPath.length > 0 ? (
            <span onClick={goBack} className="breadcrumb-item">
              {povPath.map(item => `${item.icon} ${item.label}`).join(' > ')}
            </span>
          ) : (
            <span className="breadcrumb-item"></span>
          )}
        </div>
      </div>

      {/* Render current level items */}
      {currentLevel && (
        <div className="pov-options">
          {Object.entries(currentLevel).map(([key, item]) => (
            <div
              key={key}
              className={`pov-item ${selectedItem === item.label.toLowerCase() ? 'selected' : ''}`} // Highlight selected item
              onClick={() => handleClick(key, item)} // Handle single/double click
            >
              <span>{item.icon}</span>
              <span className="pov-item-label">
  {translationMap[item.label.toLowerCase()] || item.label}
</span>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default C2POVSelector;
