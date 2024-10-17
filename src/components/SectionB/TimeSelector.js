import React, { useState, useEffect } from 'react';
import './TimeSelector.css';
import timeTree from '../../files/json/timeTree.json';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddIcon from '../../files/icons/AddIcon.js';
import SearchIcon from '../../files/icons/SearchIcon.js';
import { FaStar } from 'react-icons/fa'; // Import favorite icon
import { useLocalization } from '../toolkit/LocalizationContext';


const C2TimeSelector = () => {
  const [currentLevel, setCurrentLevel] = useState(timeTree.time); // Start from the root
  const [timePath, setTimePath] = useState([]); // Breadcrumb path
  const [selectedDate, setSelectedDate] = useState(null); // Track selected date
  const [showModal, setShowModal] = useState(false); // For showing/hiding the modal
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item for highlighting
  const [doubleClick, setDoubleClick] = useState(false); // Track double-clicks
  const [showHourglass, setShowHourglass] = useState(false); // Track showing hourglass option
  const [hideChildren, setHideChildren] = useState(false); // Track whether to hide children of This Day
  const { translate } = useLocalization();

  const [minDate, setMinDate] = useState(null); // For disabling past dates
  const [maxDate, setMaxDate] = useState(null); // For disabling future dates
  const translationMap = {
    'PAST': translate('34', 'PAST'),
    'NOW': translate('35', 'NOW'),
    'FUTURE': translate('36', 'FUTURE'),
  };
  // Update the query string in the URL for time, timeA, timeB (for top-level items)
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
    window.location.reload(); // Reload the page after setting params for first-level items
  };

  // Log current query params for debugging
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedTime = params.get('time');
    if (selectedTime === 'PAST' || selectedTime === 'FUTURE' || selectedTime === 'NOW') {
      setSelectedItem(selectedTime); // Highlight based on URL params
    }
  }, []);

  // Single click action: Select item, highlight it, and update params only for PAST/FUTURE/NOW
  const handleSingleClick = (key, item) => {
    setSelectedItem(item.label); // Highlight the selected item

    if (item.label === 'PAST' || item.label === 'FUTURE' || item.label === 'NOW') {
      updateQueryParams({ time: item.label });
      setTimeout(() => {
        window.location.reload(); // Reload the page to refresh FSection (only on single click)
      }, 250);
    } else {
      setSelectedItem(item.label); // No page reload or query param update for child items
    }
  };

  // Double click action: Go deeper for NOW or open calendar for PAST/FUTURE
  const handleDoubleClick = (key, item) => {
    clearTimeout(doubleClick); // Cancel single-click timeout

    if (item.children) {
      const newPath = [...timePath, { icon: item.icon, label: item.label }];
      setCurrentLevel(item.children);
      setTimePath(newPath);

      setShowHourglass(false);
      setHideChildren(false); // Show child nodes when navigating inside
    } else if (key === 'past') {
      setShowModal(true);
      setMinDate(null); // Allow all past dates
      setMaxDate(new Date()); // Disable future dates
    } else if (key === 'future') {
      setShowModal(true);
      setMinDate(new Date()); // Disable past dates
      setMaxDate(null); // Allow all future dates
    } else if (timePath.length > 0 && timePath[timePath.length - 1].label === 'This Day') {
      setShowHourglass(true);
      setHideChildren(true); // Hide children after double-clicking on them
    }
  };

  const handleClick = (key, item) => {
    if (!doubleClick) {
      setDoubleClick(true);
      const timeout = setTimeout(() => {
        handleSingleClick(key, item);
        setDoubleClick(false);
      }, 200);
      setDoubleClick(timeout); // Save the timeout ID
    } else {
      handleDoubleClick(key, item);
      setDoubleClick(false);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setShowModal(false); // Close modal
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowModal(false); // Close modal after date is selected
  };

  const goBack = () => {
    const newPath = timePath.slice(0, -1); // Remove the last item from the breadcrumb
    setTimePath(newPath);
    setShowHourglass(false);
    setHideChildren(false);

    if (newPath.length > 0) {
      let level = timeTree.time;
      newPath.forEach((pathItem) => {
        level = Object.values(level).find(item => item.label === pathItem.label)?.children || level;
      });
      setCurrentLevel(level);
    } else {
      setCurrentLevel(timeTree.time); // Reset to root
    }
  };

  return (
    <div className="selector-container c2-time-container">
      {/* Breadcrumb navigation */}
      <div className="breadcrumb">
        <div className="breadcrumb-actions">
          {/* Favorite icon */}
          <FaStar className="favorite-icon" selectedColor="gray" />

          {/* Search icon */}
          <SearchIcon selectedColor="gray" />

          {/* Conditionally show AddIcon after SearchIcon if timePath has values */}
          {timePath.length > 0 && <AddIcon selectedColor="gray" />}

          {/* Breadcrumb showing the path when timePath has values */}
          {timePath.length > 0 ? (
            <span onClick={goBack} className="breadcrumb-item">
              {timePath.map(item => `${item.icon} ${item.label}`).join(' > ')}
            </span>
          ) : (
            <span className="breadcrumb-item"></span>
          )}
        </div>
      </div>

      {/* Render current level items */}
      {currentLevel && !hideChildren && (
        <div className="time-options">
          {Object.entries(currentLevel).map(([key, item]) => (
            <div
              key={key}
              className={`time-item ${selectedItem === item.label ? 'selected' : ''}`} // Highlight selected item
              onClick={() => handleClick(key, item)} // Handle single/double click
            >
              <span>{item.icon}</span>
              <span className="time-item-label">
                {translationMap[item.label] || item.label}
              </span>            </div>
          ))}
        </div>
      )}

      {/* Modal for DatePicker */}
      {showModal && (
        <div className="modal-overlay" onClick={handleOutsideClick}>
          <div className="modal">
            <h3>Select a Date</h3>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              dateFormat="Pp"
              inline
              minDate={minDate}
              maxDate={maxDate}
            />
            <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Show hourglass creation only for a child of "This Day" */}
      {showHourglass && (
        <div className="add-end">
          <button className="add-btn">+ Add ⏳ for {timePath[timePath.length - 1]?.icon}</button>
        </div>
      )}
    </div>
  );
};

export default C2TimeSelector;
