import React, { useState, useEffect } from 'react';
import AddIcon from './../../files/icons/AddIcon.js';
import SearchIcon from './../../files/icons/SearchIcon.js';
import { FaTrash, FaPaperclip, FaEllipsisV } from 'react-icons/fa'; // Import icons
import hashtree from '../../files/json/hashTree.json';
import './DWall.css';
import { useLocalization } from '../toolkit/LocalizationContext';

const DWall = ({ wallType, wallTitle, wallColor }) => {
  const [items, setItems] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [showIconsAsTabs, setShowIconsAsTabs] = useState(false);
  const [iconStates, setIconStates] = useState({});
  const [pov, setPov] = useState(null);
  const { translate, loadTranslations } = useLocalization();

  const params = new URLSearchParams(window.location.search);
  const what = params.get('what')?.replace(/\s+/g, '_').toLowerCase();
  const povQuery = params.get('pov')?.toLowerCase();
  const time = params.get('time')?.toLowerCase();

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

  const handleAddNewItem = () => {
    console.log("Add button clicked.");

    const tabNameMap = {
      strengths: "Strength",
      needs: "Needs",
      opportunities: "Opportunity",
      weaknesses: "Weakness",
      threats: "Threat",
      pains: "Pain"
    };
    const tabName = tabNameMap[activeSection] || "Item";
    const detailsText = `New ${tabName} for ${time}`;

    const newItem = {
      colorid: wallType === 'seeks' ? '🔆' : '🩸',
      type: `#${activeSection}`, // ensure correct `type` with #
      filters: {
        pov: [povQuery],
        time: [time]
      },
      meta: {
        details: detailsText
      }
    };

    saveToLocalStorage(newItem);
    setItems((prevItems) => [...prevItems, newItem]); // Update UI state without reload
  };


  const saveToLocalStorage = (newEntry) => {
    console.log("Saving new entry to localStorage:", newEntry);

    const fileName = findFileFromWhat(params.get('what'));
    if (!fileName) {
      console.error("File name not found for 'what' parameter.");
      return;
    }

    const storedData = localStorage.getItem(fileName);
    let parsedData = storedData ? JSON.parse(storedData) : { dorr_rates: [] };


    parsedData.dorr_rates.push(newEntry);
    console.log("Added new entry:", newEntry);

    localStorage.setItem(fileName, JSON.stringify(parsedData));
  };





  const loadDData = () => {
    console.log("Starting loadDData function...");

    const fileName = findFileFromWhat(params.get('what'));
    if (!fileName) {
      console.warn("No file name determined from 'what' parameter.");
      return;
    }

    const storedData = localStorage.getItem(fileName);
    if (!storedData) {
      console.warn(`No data found in localStorage for file "${fileName}".`);
      return;
    }

    const parsedData = JSON.parse(storedData);
    console.log("Loaded dorr_rates from data:", parsedData.dorr_rates);

    // Filter for the specific section and conditions to ensure no duplicates
    const filteredData = parsedData.dorr_rates.filter(item => {
      const isColorMatch = (wallType === 'seeks' && item.colorid === '🔆') || (wallType === 'pains' && item.colorid === '🩸');
      const isTypeMatch = item.type === `#${activeSection}`;
      const isPovMatch = item.filters?.pov.includes(povQuery);
      const isTimeMatch = item.filters?.time.includes(time);

      return isColorMatch && isTypeMatch && isPovMatch && isTimeMatch;
    });

    console.log("Filtered data based on wallType, activeSection, time, and povQuery:", filteredData);
    setItems(filteredData);
    setPov(povQuery);
  };


  // Call `loadDData` whenever `activeSection` changes
  useEffect(() => {
    loadDData();
  }, [activeSection, povQuery, wallType]);


  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);

    const fileName = findFileFromWhat(what);
    if (!fileName) {
      console.error("File name not found.");
      return;
    }

    const storedData = localStorage.getItem(fileName);
    let parsedData = storedData ? JSON.parse(storedData) : { dorr_rates: [] };

    parsedData.dorr_rates.forEach(rate => {
      rate.sub_categories = rate.sub_categories.filter((_, i) => i !== index);
    });

    localStorage.setItem(fileName, JSON.stringify(parsedData));
  };

  const handleIconClick = (itemId, isSelf) => {
    setIconStates(prevState => {
      const newState = { ...prevState };
      newState[itemId] = isSelf ? (newState[itemId] === '🔇' ? '🔉' : '🔇') : (newState[itemId] === '🔕' ? '🔔' : '🔕');
      return newState;
    });
  };

  const renderIcon = (itemId, isSelf) => iconStates[itemId] || (isSelf ? '🔇' : '🔕');

  const renderIcons = () => (
    <div className="d-icon-section-stack">
      {wallType === 'seeks' ? (
        <>
          <div className={`d-icon-item ${activeSection === 'strengths' ? 'active' : ''}`} onClick={() => { setActiveSection('strengths'); setShowIconsAsTabs(true); }}>
            💪 {translate(182, "Strengths")}
          </div>
          <div className={`d-icon-item ${activeSection === 'opportunities' ? 'active' : ''}`} onClick={() => { setActiveSection('opportunities'); setShowIconsAsTabs(true); }}>
            🚀 {translate(183, "Opportunity")}
          </div>
          <div className={`d-icon-item ${activeSection === 'needs' ? 'active' : ''}`} onClick={() => { setActiveSection('needs'); setShowIconsAsTabs(true); }}>
            🔆 {translate(184, "Needs")}
          </div>
        </>
      ) : (
        <>
          <div className={`d-icon-item ${activeSection === 'weaknesses' ? 'active' : ''}`} onClick={() => { setActiveSection('weaknesses'); setShowIconsAsTabs(true); }}>
            🧩 {translate(187, "Weaknesses")}
          </div>
          <div className={`d-icon-item ${activeSection === 'threats' ? 'active' : ''}`} onClick={() => { setActiveSection('threats'); setShowIconsAsTabs(true); }}>
            ⚠️ {translate(186, "Threats")}
          </div>
          <div className={`d-icon-item ${activeSection === 'pains' ? 'active' : ''}`} onClick={() => { setActiveSection('pains'); setShowIconsAsTabs(true); }}>
            🩸 {translate(185, "Pains")}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="d-wall-container" style={{ borderColor: wallColor }}>
      <div className="d-header-section">
        <div className="header-left-icons">
          {povQuery === 'self' && (
            <div onClick={handleAddNewItem} style={{ cursor: 'pointer' }}>
              <AddIcon selectedColor={wallColor} />
            </div>
          )}
          <SearchIcon selectedColor={wallColor} />
        </div>
        <h3 className="wall-header" style={{ color: wallColor }}>{wallTitle}</h3>
      </div>

      {!showIconsAsTabs ? (
        renderIcons()
      ) : (
        <>
          <div className="d-tab-section">
            {wallType === 'seeks' ? (
              <>
                <div className={`d-tab-item d1 ${activeSection === 'strengths' ? 'active' : ''}`} onClick={() => setActiveSection('strengths')}>💪 {translate(182, "Strengths")}</div>
                <div className={`d-tab-item d1 ${activeSection === 'opportunities' ? 'active' : ''}`} onClick={() => setActiveSection('opportunities')}>🚀  {translate(183, "Opportunity")}</div>
                <div className={`d-tab-item d1 ${activeSection === 'needs' ? 'active' : ''}`} onClick={() => setActiveSection('needs')}>🔆 {translate(184, "Needs")}</div>
              </>
            ) : (
              <>
                <div className={`d-tab-item d2 ${activeSection === 'weaknesses' ? 'active' : ''}`} onClick={() => setActiveSection('weaknesses')}>🧩 {translate(187, "Weaknesses")}</div>
                <div className={`d-tab-item d2 ${activeSection === 'threats' ? 'active' : ''}`} onClick={() => setActiveSection('threats')}>⚠️ {translate(186, "Threats")}</div>
                <div className={`d-tab-item d2 ${activeSection === 'pains' ? 'active' : ''}`} onClick={() => setActiveSection('pains')}>🩸 {translate(185, "Pains")}</div>
              </>
            )}
          </div>

          <div className="d-item-list">
            {items.length === 0 ? (
              <p className="d-no-item">{translate(30, "No items found for this section.")}</p>
            ) : (
              items.map((item, index) => (
                <div key={index} className="d-child-item">
                  <span className="item-text">{item.meta.details}</span>

                  {povQuery === 'self' && (
                    <FaTrash className="delete-icon" onClick={() => handleDeleteItem(index)} />
                  )}
                  <div className="icon-group">
                  <span className="icon-action" onClick={() => handleIconClick(`item-${index}`, pov === 'self')}>
                    {renderIcon(`item-${index}`, pov === 'self')}
                  </span>
                    <FaPaperclip title={translate(188, "Attachment")} />
                    <FaEllipsisV title={translate(189, "Options")} />
                  </div>
                </div>

              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DWall;
