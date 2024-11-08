import React, { useState, useEffect } from 'react';
import { useLocalization } from '../toolkit/LocalizationContext';
import { FaEye, FaPlus } from 'react-icons/fa';
import './FSection.css';
import hashtree from '../../files/json/hashTree.json';

const FSection = ({ type, color, logo }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalRating, setTotalRating] = useState(0);
  const [pov, setPov] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [whatPresent, setWhatPresent] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ entity_name: '', rating: 0 });
  const { translate } = useLocalization();

  // Helper function to locate nodes by both label and key name
  const findNodeByLabelOrKey = (label, level) => {
    const normalizedLabel = label.toLowerCase().replace(/_/g, ' ').trim();

    for (const [key, node] of Object.entries(level)) {
      const nodeLabel = node.label.toLowerCase().replace(/_/g, ' ').trim();
      const nodeHashtag = (node.hashtag || '').toLowerCase().replace(/#/g, '').replace(/_/g, ' ').trim();

      if (key === normalizedLabel || nodeLabel === normalizedLabel || nodeHashtag === normalizedLabel) {
        return node;
      }

      if (node.children) {
        const found = findNodeByLabelOrKey(label, node.children);
        if (found) return found;
      }
    }

    return null;
  };

  const findFileFromWhat = (whatParam) => {
    // console.log("Finding file for whatParam:", whatParam);

    const decodedParam = decodeURIComponent(whatParam).toLowerCase();
    const tags = decodedParam
      .split(' ')
      .map(tag => tag.replace(/^#/, '').trim());

    // console.log("Tags found from params:", tags);

    let currentLevel = hashtree.hashtree;
    let fileName = null;

    for (const tag of tags) {
      const node = findNodeByLabelOrKey(tag, currentLevel);
      
      if (node) {
        // console.log("Node found for tag:", tag, "-> Node:", node);
        if (node.file) {
          fileName = node.file;
          // console.log("File found in hash tree:", fileName);
          break;
        } else if (node.children) {
          currentLevel = node.children;
        }
      } else {
        console.warn(`No NODE found for tag "${tag}". Aborting.`);
        return null;
      }
    }

    if (!fileName) {
      console.warn("No file found after traversing all tags.");
    }

    return fileName;
  };

  const loadFData = () => {
    const params = new URLSearchParams(window.location.search);
    const whatParam = params.get('what');

    if (!whatParam) {
      console.warn("Missing 'what' parameter.");
      setData([]);
      return;
    }

    const fileName = findFileFromWhat(whatParam);
    if (!fileName) {
      console.warn(`No matching file for "${whatParam}". Check node configuration.`);
      setData([]);
      return;
    }

    const storedData = localStorage.getItem(fileName);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const targetData = parsedData.dorr_rates.filter(rate => rate.type === (type === 'gods' ? '#godly' : '#foe'));
      setData(targetData);
    } else {
      console.warn(`Data file for ${fileName} not found in local storage.`);
      setData([]);
    }
  };

  useEffect(() => {
    loadFData();
  }, [type]);

  const handleMouseEnter = (item, event) => {
    setHoveredItem(item);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <div className={`f-section`} style={{ backgroundColor: color }}>
      <div className="f-section-header">
        <span className="logo">{logo}</span>
        <span className="title">{type === 'gods' ? translate('27', 'Hall of Fame') : translate('28', 'Hall of Shame')}</span>
      </div>
      {data.length > 0 ? (
        <ul className="f-section-list">
          {data.map((item, index) => (
            <li key={index} className="f-section-item">
              <FaEye
                className="eye-icon"
                onMouseEnter={(e) => handleMouseEnter(item, e)}
                onMouseLeave={handleMouseLeave}
              />
              <span className="name">{item.meta?.entity_name || 'Unknown'}</span>
              <span className="rating">{item.rating || 0}%</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data found for the selected parameters.</p>
      )}

      {hoveredItem && (
        <div
          className="tooltip"
          style={{
            top: mousePosition.y + 15 + 'px',
            left: mousePosition.x + 15 + 'px',
          }}
        >
          <p>Contact: {hoveredItem.meta?.contact_info || 'N/A'}</p>
          <p>Location: {hoveredItem.meta?.location || 'N/A'}</p>
          <p>Details: {hoveredItem.meta?.details || 'No details available'}</p>
        </div>
      )}
    </div>
  );
};

export default FSection;
