import React, { useState, useEffect } from 'react';
import { useLocalization } from '../toolkit/LocalizationContext';
import { FaEye, FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import './FSection.css';
import hashtree from '../../files/json/hashTree.json';

const FSection = ({ type, color, logo }) => {
  const [data, setData] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ entity_name: '', rating: 0 });
  const { translate } = useLocalization();

  const params = new URLSearchParams(window.location.search);
  const pov = params.get('pov')?.toLowerCase();
  const timeParam = params.get('time')?.toLowerCase();

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
    const decodedParam = decodeURIComponent(whatParam).toLowerCase();
    const tags = decodedParam.split(' ').map(tag => tag.replace(/^#/, '').trim());
    let currentLevel = hashtree.hashtree;
    let fileName = null;

    for (const tag of tags) {
      const node = findNodeByLabelOrKey(tag, currentLevel);
      if (node) {
        if (node.file) {
          fileName = node.file;
          break;
        } else if (node.children) {
          currentLevel = node.children;
        }
      } else {
        console.warn(`No NODE found for tag "${tag}". Aborting.`);
        return null;
      }
    }
    return fileName;
  };

  const loadFData = () => {
    const whatParam = params.get('what');
    
    if (!whatParam) {
      console.warn("Missing 'what' parameter in URL.");
      setData([]);
      return;
    }
  
    const fileName = findFileFromWhat(whatParam);
    if (!fileName) {
      console.warn(`No file found for "${whatParam}".`);
      setData([]);
      return;
    }
  
    const storedData = localStorage.getItem(fileName);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const targetData = parsedData.dorr_rates
        .filter(
          (rate) =>
            rate.type === (type === 'gods' ? '#godly' : '#foe') &&
            rate.filters.pov.includes(pov) &&
            rate.filters.time.includes(timeParam) // Ensure time filter matches timeParam
        )
        .sort((a, b) => b.rating - a.rating); // Sort by rating in descending order
  
      // console.log("Loaded, filtered, and sorted data: ", targetData);
      setData(targetData);
    } else {
      console.warn(`No data found in localStorage for file "${fileName}".`);
      setData([]);
    }
  };
  
  useEffect(() => {
    loadFData();
  }, [type, pov, timeParam]); // Make sure timeParam is included here

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleAddNewItem = () => {
    // console.log("handleAddNewItem called");

    const newEntry = {
      colorid: type === 'gods' ? 'G' : 'F',
      type: type === 'gods' ? '#godly' : '#foe',
      tags: [`@${newItem.entity_name}`],
      meta: {
        entity_name: newItem.entity_name,
        details: newItem.details || '',
        contact_info: newItem.contact_info || '',
        location: newItem.location || '',
        social_links: newItem.social_links || [],
      },
      rating: newItem.rating,
      filters: {
        pov: [pov], // Use the POV from URL
        time: [timeParam], // Use timeParam as an array to match existing structure
      },
    };

    // console.log("New entry created for addition:", newEntry);
    saveToLocalStorage(newEntry);
    setNewItem({ entity_name: '', rating: 0 });
    setIsAdding(false);
  };

  const saveToLocalStorage = (newEntry) => {
    // console.log("saveToLocalStorage called with entry:", newEntry);
  
    const whatParam = params.get('what');
    const fileName = findFileFromWhat(whatParam);
    if (!fileName) {
      console.error("File name not found for whatParam:", whatParam);
      return;
    }
  
    const storedData = localStorage.getItem(fileName);
    let parsedData = storedData ? JSON.parse(storedData) : { dorr_rates: [] };
  
    // console.log("Existing data before adding/updating:", JSON.stringify(parsedData.dorr_rates, null, 2));
  
    const existingIndex = parsedData.dorr_rates.findIndex(
      (item) => item.type === newEntry.type && item.meta.entity_name === newEntry.meta.entity_name
    );
  
    if (existingIndex === -1) {
      parsedData.dorr_rates.push(newEntry);
      // console.log("Added new entry:", newEntry);
    } else {
      // console.log(`Updating existing entry at index ${existingIndex} with`, newEntry);
      parsedData.dorr_rates[existingIndex] = newEntry;
    }
  
    localStorage.setItem(fileName, JSON.stringify(parsedData));
    // console.log("New data after adding/updating:", JSON.stringify(parsedData.dorr_rates, null, 2));
  
    const updatedData = parsedData.dorr_rates
      .filter(
        (item) =>
          item.type === newEntry.type &&
          item.filters.pov.includes(pov) &&
          item.filters.time.includes(timeParam) // Apply the time filter to the updated data
      )
      .sort((a, b) => b.rating - a.rating);
      
    setData(updatedData);
    // console.log("Updated component state data after sorting:", updatedData);
  };

  const handleMouseEnter = (item) => setHoveredItem(item);
  const handleMouseLeave = () => setHoveredItem(null);

  const handleDeleteItem = (index) => {
    if (pov !== 'self') return;
    // console.log("Deleting item at index:", index);

    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);

    const whatParam = params.get('what');
    const fileName = findFileFromWhat(whatParam);
    if (!fileName) {
      console.error("File name not found for whatParam:", whatParam);
      return;
    }

    const storedData = localStorage.getItem(fileName);
    let parsedData = storedData ? JSON.parse(storedData) : { dorr_rates: [] };
    let currentType = type === 'gods' ? '#godly' : '#foe';
    let count = -1;

    parsedData.dorr_rates = parsedData.dorr_rates.filter((item) => {
      if (item.type === currentType) {
        count++;
        return count !== index;
      }
      return true;
    });

    localStorage.setItem(fileName, JSON.stringify(parsedData));
    // console.log("Data after deletion:", parsedData.dorr_rates);
  };

  return (
    <div className="f-section" style={{ backgroundColor: color }}>
<div className="f-section-header">
  <span className="logo">{logo}</span>
  <span className="title">
    {type === 'gods' ? translate('27', 'Hall of Fame') : translate('28', 'Hall of Shame')}
  </span>
  {pov === 'self' && (
    <button
      className="add-button"
      onClick={() => {
        if (isAdding) {
          handleAddNewItem();
        }
        setIsAdding(!isAdding);
      }}
    >
      {isAdding ? <FaCheck color="green" /> : <FaPlus color="yellow" />}
    </button>
  )}
</div>

      {isAdding ? (
        <div className="add-item-form">
          <input
            type="text"
            placeholder={translate('181', 'Entity Name')}
            value={newItem.entity_name}
            onChange={(e) => setNewItem({ ...newItem, entity_name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Rating"
            value={newItem.rating}
            onChange={(e) => setNewItem({ ...newItem, rating: parseInt(e.target.value) || 0 })}
          />
        </div>
      ) : data.length > 0 ? (
        <ul className="f-section-list">
          {data.map((item, index) => (
            <li key={index} className="f-section-item">
              <FaEye
                className="eye-icon"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
              />
              <span className="rating">{item.rating || 0}%</span>
              <span className="name">{item.meta?.entity_name || 'Unknown'}</span>
              {pov === 'self' && (
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleDeleteItem(index)}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>{translate('30', 'No data found for the selected parameters.')}</p>
      )}

      {hoveredItem && (
        <div
          className="tooltip"
          style={{
            top: `${mousePosition.y + 15}px`,
            left: `${mousePosition.x + 15}px`,
          }}
        >
          <p>Contact: {hoveredItem.contact_info || 'N/A'}</p>
          <p>Location: {hoveredItem.location || 'N/A'}</p>
          <p>Details: {hoveredItem.details || 'No details available'}</p>
        </div>
      )}
    </div>
  );
};

export default FSection;
