import React, { useState, useEffect } from 'react';
import AddIcon from './../../files/icons/AddIcon.js';
import SearchIcon from './../../files/icons/SearchIcon.js';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js
import { useLocalization } from '../toolkit/LocalizationContext.js';

import './DWall.css';
import jsonData from './../../files/json/painsAndSeeksCombined.json'; // Path to the new combined file

const DWall = ({ wallType, wallTitle, wallColor, textColor }) => {
  const [items, setItems] = useState([]);
  const [iconStates, setIconStates] = useState({});
  const [expandedItem, setExpandedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPieChart, setIsPieChart] = useState(false);
  const [drilldownData, setDrilldownData] = useState(null); // Track drilldown data for double-click
  const { translate } = useLocalization();

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        let what = params.get('what');
        const povQuery = params.get('pov');
        const time = params.get('time');

        what = what.replace(/##/g, '#').trim().toLowerCase();

        const category = wallType === 'seeks' ? 'gains' : 'pains';

        const filteredData = jsonData.seeds
          .filter(seed => seed.what.replace(/ /g, '').toLowerCase() === what)
          .flatMap(seed => seed.filters.filter(filter => 
            filter.pov.toLowerCase() === povQuery.toLowerCase() &&
            filter.time.toLowerCase() === time.toLowerCase() &&
            filter.category === category
          ).flatMap(filter => filter.items));

        if (filteredData.length === 0) {
          console.log('No items found for the selected filters.');
        }

        setItems(filteredData);
      } catch (error) {
        console.error('Error fetching JSON:', error);
      }
    };

    fetchJsonData();
  }, [wallType]);

  // Generate distinct hues for the pie chart slices based on % values
  const generateHues = (count, baseColor) => {
    const hues = [];
    for (let i = 0; i < count; i++) {
      const lightness = 50 + (i * 50) / count; // Lighter hues for higher percentages
      hues.push(`hsl(${baseColor}, 100%, ${lightness}%)`);
    }
    return hues;
  };

  // Handle icon state toggling
  const handleIconClick = (e, itemId, iconType) => {
    e.stopPropagation(); // Prevent dropdown toggle when clicking on icons
    setIconStates((prevState) => ({
      ...prevState,
      [itemId]: iconType === prevState[itemId] ? null : iconType,
    }));
  };

  // Handle graph icon click to toggle between list and pie chart
  const togglePieChartView = () => {
    setIsPieChart(!isPieChart);
  };

  // Handle drilldown by double-clicking on a pie chart slice
  const handleChartClick = (elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const clickedItem = items[index];
      if (clickedItem && clickedItem.children) {
        setDrilldownData(clickedItem); // Set the clicked parent data for drilldown
      }
    }
  };

  // Prepare data for Pie chart (Parent nodes if no item is selected)
  const pieChartData = {
    labels: items.map(item => item.parent), // Labels will be hidden
    datasets: [
      {
        data: items.map(item => item.rate),
        backgroundColor: generateHues(items.length, wallType === 'seeks' ? 60 : 0), // Yellow for seeks, red for pains
        borderColor: 'silver', // Silver divider line
        borderWidth: 2,
      }
    ],
  };

  // Drilldown Pie chart for child nodes if selected
  const drilldownPieChartData = drilldownData && {
    labels: drilldownData.children.map(child => child.text), // Labels will be hidden
    datasets: [
      {
        data: drilldownData.children.map(child => child.rate),
        backgroundColor: generateHues(drilldownData.children.length, wallType === 'seeks' ? 60 : 0),
        borderColor: 'silver', // Silver divider line
        borderWidth: 2,
      }
    ],
  };

  return (
    <div className="d-wall-container" style={{ borderColor: wallColor }}>
      {/* Header */}
      <div className="header-section">
        <div className="header-left-icons">
          {new URLSearchParams(window.location.search).get('pov')?.toLowerCase() === 'self' && (
            <AddIcon selectedColor={wallColor} />
          )}
          <SearchIcon selectedColor={wallColor} />
        </div>
        <h3 className="wall-header" style={{ color: wallColor }}>
          {wallTitle}
        </h3>
        <div className="header-right-icon">
          <span className="graph-icon" onClick={togglePieChartView}>📊</span> {/* Graph icon */}
          <span className="settings-icon">⚙️</span>
        </div>
      </div>

      {/* Conditional rendering of Pie Chart or List View */}
      {isPieChart ? (
        <div className="pie-chart-container">
          {drilldownData ? (
            <Pie
              data={drilldownPieChartData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${context.raw}%`;
                      },
                    },
                  },
                  legend: {
                    display: false, // Hide the legend and labels
                  },
                },
                onClick: (e, elements) => handleChartClick(elements),
              }}
            />
          ) : (
            <Pie
              data={pieChartData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${context.raw}%`;
                      },
                    },
                  },
                  legend: {
                    display: false, // Hide the legend and labels
                  },
                },
                onClick: (e, elements) => handleChartClick(elements),
              }}
            />
          )}
        </div>
      ) : (
        <div className="wall-list">
          {items.length === 0 && (
            <p>{translate('30', 'No items found for the selected filters.')}</p>
          )}
          {items.map((item) => (
            <div key={item.id}>
              <div
                className={`parent-item ${selectedItem === item.id ? 'selected' : ''}`}
                style={{
                  color: textColor,
                  fontSize: '0.85em', // Adjust font size for parent node
                  backgroundColor:
                    wallType === 'seeks' ? 'rgba(255, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)',
                }}
                onClick={() => {
                  setExpandedItem((prevState) => (prevState === item.id ? null : item.id));
                  setSelectedItem(item.id);
                }}
              >
                <div className="parent-text">
                  {expandedItem === item.id ? '▼' : '►'} {item.parent} ({item.rate}%)
                </div>
                <div className="parent-icons">
                  {new URLSearchParams(window.location.search).get('pov')?.toLowerCase() === 'self' ? (
                    <span
                      className="mute-icon"
                      onClick={(e) => handleIconClick(e, item.id, iconStates[item.id] === 'loud' ? 'mute' : 'loud')}
                    >
                      {iconStates[item.id] === 'mute' ? '🔇' : iconStates[item.id] === 'loud' ? '🔊' : '🔇'}
                    </span>
                  ) : (
                    <span
                      className="bell-icon"
                      onClick={(e) => handleIconClick(e, item.id, iconStates[item.id] === 'buzz' ? 'silent' : 'buzz')}
                    >
                      {iconStates[item.id] === 'silent' ? '🔕' : iconStates[item.id] === 'buzz' ? '🔔' : '🔕'}
                    </span>
                  )}
                  <span className="details-icon">📌</span>
                </div>
              </div>

              {expandedItem === item.id && (
                <div className="child-items">
                  {item.children.map((child) => (
                    <div
                      className={`wall-item ${selectedItem === child.id ? 'selected' : ''}`}
                      key={child.id}
                      onClick={() => setSelectedItem(child.id)}
                      style={{
                        color: child.rate > 40 && wallType === 'pains' ? 'white' : textColor,
                        fontSize: '0.75em', // Adjust font size for child nodes
                        backgroundColor: `rgba(${
                          wallType === 'seeks' ? '255, 255, 0' : '255, 0, 0'
                        }, ${0.1 + child.rate / 100})`,
                      }}
                    >
                      <span className="item-text" title={child.text}>
                        {child.text}
                      </span>
                      <div className="item-icons">
                        {child.isG && <span className="g-icon">👑</span>}
                        <span
                          className="temperature-icon"
                          onMouseEnter={() => setHoveredItem(child.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          🌡️
                          {hoveredItem === child.id && <div className="tooltip">{child.rate}%</div>}
                        </span>
                        {new URLSearchParams(window.location.search).get('pov')?.toLowerCase() === 'self' ? (
                          <span
                            className="mute-icon"
                            onClick={(e) => handleIconClick(e, child.id, iconStates[child.id] === 'loud' ? 'mute' : 'loud')}
                          >
                            {iconStates[child.id] === 'mute' ? '🔇' : iconStates[child.id] === 'loud' ? '🔊' : '🔇'}
                          </span>
                        ) : (
                          <span
                            className="bell-icon"
                            onClick={(e) => handleIconClick(e, child.id, iconStates[child.id] === 'buzz' ? 'silent' : 'buzz')}
                          >
                            {iconStates[child.id] === 'silent' ? '🔕' : iconStates[child.id] === 'buzz' ? '🔔' : '🔕'}
                          </span>
                        )}
                        <span className="details-icon">📌</span>
                        <span className="more-icon">⋮</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DWall;
