import React, { useState, useEffect, useRef } from 'react';
import './TreeTags.css';
import { useLocalization } from '../toolkit/LocalizationContext';

// Mock function to simulate fetching JSON files for each hashtag
const fetchHashtagFiles = async () => {
  const files = [
    '/files/json/transport_truck.json',
    '/files/json/cat_stray.json',
    '/files/json/restaurant_sushi.json'
  ];

  const jsonFiles = await Promise.all(files.map(file => fetch(file).then(res => res.json())));
  return jsonFiles;
};

function TreeTags() {
  const [tags, setTags] = useState([]); // For storing selected hashtags
  const [treeData, setTreeData] = useState([]); // Store combined tree data
  const [filteredData, setFilteredData] = useState([]); // Store filtered tree data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(''); // For displaying the correct icon
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null); // Reference to the input field for focus control
  const modalRef = useRef(null);
  const { translate } = useLocalization();

  // Load and combine data from all JSON files
  useEffect(() => {
    const loadData = async () => {
      const allTreeData = await fetchHashtagFiles();
      const combinedData = allTreeData.map(data => ({
        name: data.hashtag, // Keep clean tag without #
        icon: data.icon,
        painsCount: data.dorr_rates.filter(rate => rate.colorid === "🩸").length,
        gainsCount: data.dorr_rates.filter(rate => rate.colorid === "🔆").length,
        totalCount: data.dorr_rates.filter(rate => rate.colorid === "🩸").length + data.dorr_rates.filter(rate => rate.colorid === "🔆").length // Total pains + gains
      }));

      // Sort based on total number of pains and gains
      const sortedData = combinedData.sort((a, b) => b.totalCount - a.totalCount);
      setTreeData(sortedData);
      setFilteredData(sortedData);
    };

    loadData();
  }, []);

  // Read the selected hashtags and find the correct icon on page reload
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const what = params.get('what');
    if (what) {
      const selectedTags = what.split('+').filter(Boolean); // Split by '+' instead of '##'
      setTags(selectedTags);

      // Find the icon from the loaded data
      const tagData = treeData.find(node => node.name.toLowerCase().includes(what));
      if (tagData) {
        setSelectedIcon(tagData.icon); // Set the correct icon
      }
    }
  }, [window.location.search, treeData]);

  // Update the URL when a hashtag is selected
  const updateURLParams = (whatValue) => {
    const params = new URLSearchParams(window.location.search);
    params.set('what', whatValue.join('+')); // Join the tags with '+'
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    window.location.reload(); // Forces a full page refresh
  };

  // Handle node click and update URL with selected hashtags, clearing previous selection
  const handleNodeClick = (targetNode, event) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    const selectedTags = [targetNode.name]; // Replace previous selection with new hashtag
    setTags(selectedTags);
    updateURLParams(selectedTags);
    setIsModalOpen(false); // Close the modal when a hashtag is selected
  };

  // Handle search query changes
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = treeData.filter(node => node.name.toLowerCase().includes(query));
    setFilteredData(filtered);
  };

// Function to render the mind map with the search bar spanning three columns
const renderMindMap = (nodes) => {
  // Split the nodes into three parts to display in three columns
  const thirdLength = Math.ceil(nodes.length / 3);
  const firstColumnNodes = nodes.slice(0, thirdLength);
  const secondColumnNodes = nodes.slice(thirdLength, 2 * thirdLength);
  const thirdColumnNodes = nodes.slice(2 * thirdLength);

  return (
    <div className="mind-map-grid">

      {/* First Column */}
      <div className="mind-map-column">
        {firstColumnNodes.map((node) => (
          <div className="tree-node" key={node.name} onClick={(event) => handleNodeClick(node, event)}>
            <div className="tree-node-content">
              <span className="icon">{node.icon}</span>
              <span className="hashtag">{node.name}</span>
              <span className="counts">
                {node.painsCount > 0 && <span className="pain-count">🩸 {node.painsCount}</span>}
                {node.gainsCount > 0 && <span className="gain-count">🔆 {node.gainsCount}</span>}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Second Column */}
      <div className="mind-map-column">
        {secondColumnNodes.map((node) => (
          <div className="tree-node" key={node.name} onClick={(event) => handleNodeClick(node, event)}>
            <div className="tree-node-content">
              <span className="icon">{node.icon}</span>
              <span className="hashtag">{node.name}</span>
              <span className="counts">
                {node.painsCount > 0 && <span className="pain-count">🩸 {node.painsCount}</span>}
                {node.gainsCount > 0 && <span className="gain-count">🔆 {node.gainsCount}</span>}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Third Column */}
      <div className="mind-map-column">
        {thirdColumnNodes.map((node) => (
          <div className="tree-node" key={node.name} onClick={(event) => handleNodeClick(node, event)}>
            <div className="tree-node-content">
              <span className="icon">{node.icon}</span>
              <span className="hashtag">{node.name}</span>
              <span className="counts">
                {node.painsCount > 0 && <span className="pain-count">🩸 {node.painsCount}</span>}
                {node.gainsCount > 0 && <span className="gain-count">🔆 {node.gainsCount}</span>}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};




  // Function to handle input click to show modal like dropdown
  const handleInputClick = () => {
    setIsModalOpen(true); // Open the modal when the input is clicked
    inputRef.current?.focus(); // Focus on the input for immediate typing
  };

  return (
    <div className="tree-tags-container">
      <div className="tags-input" onClick={handleInputClick}>
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <div className="tag-item" key={index}>
              <span className="icon">{selectedIcon}</span> {/* Show the correct icon */}
              {tag} <span className="tag-remove" onClick={() => {
                setTags([]); // Clear all selected tags when one is removed
                updateURLParams([]); // Clear the URL when tag is removed
              }}>x</span>
            </div>
          ))
        ) : (
          <div className="empty-what-message" ref={inputRef}>{translate('20', 'WHAT IS YOUR #WHAT?')}</div>
        )}
      </div>

      {/* Tree icon for opening the mind map */}
      <div className="tree-icon" onClick={() => setIsModalOpen(true)}>
        <span role="img" aria-label="tree">🌱</span>
      </div>

      {/* Modal for displaying mind map as a dropdown */}
      {isModalOpen && (
        <div className="modal" style={{ top: '100px', left: '10px' }}> {/* Adjusted to show below input */}
          <div className="modal-content" ref={modalRef}>
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
            <input
              type="text"
              placeholder="Search hashtags..."
              className="search-input"
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
            />
            <div className="mind-map">
              {renderMindMap(filteredData)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TreeTags;
