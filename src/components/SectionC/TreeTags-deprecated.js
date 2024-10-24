import React, { useState, useEffect, useRef } from 'react';
import './TreeTags.css';
import treeData from '../../files/json/fake-data.json'; // Import the actual data
import { useLocalization } from '../toolkit/LocalizationContext';

function TreeTagsDep() {
  const [tags, setTags] = useState([]); // For storing selected hierarchy
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const { translate } = useLocalization();

  // Helper function to match the tag with its corresponding icon from the tree data
  const attachIconsToTags = (tags = []) => {
    const findIconForTag = (node, targetTag) => {
      if (`#${node.name}` === targetTag) {
        return node.icon;
      }
      if (node.children) {
        for (let child of node.children) {
          const icon = findIconForTag(child, targetTag);
          if (icon) return icon;
        }
      }
      return null;
    };

    const tagsArray = tags.map((tag) => `#${tag}`);
    const tagsWithIcons = tagsArray.map(tag => {
      const icon = treeData.tree.map(root => findIconForTag(root, tag)).filter(Boolean)[0];
      return icon ? `${icon} ${tag}` : tag; // Attach icon if found, else return plain tag
    });

    return tagsWithIcons;
  };

  // Initialize with the 'what' param from the URL and add icons
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const what = params.get('what');
    if (what) {
      const tagsWithIcons = attachIconsToTags(what.split('#').filter(Boolean));
      setTags(tagsWithIcons); // Set the tags with icons if present in the URL
    }
  }, []);

  const updateURLParams = (whatValue) => {
    const params = new URLSearchParams(window.location.search);
    params.set('what', whatValue);
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    window.location.reload(); // This forces a full page refresh
  };

  // Function to get full path of the clicked node and clean out emojis/icons
  const findFullPath = (targetNode) => {
    const stack = []; // Stack to store nodes
    let path = []; // To store the correct path
    let fullPathFound = false; // Stop walking after finding the correct path

    // Initialize stack with tree roots
    treeData.tree.forEach((root) => stack.push({ node: root, path: [] }));

    // Loop through the tree
    while (stack.length > 0 && !fullPathFound) {
      const { node, path: currentPath } = stack.pop();
      const newPath = [...currentPath, `${node.icon} #${node.name}`]; // Build the path with icon and name

      // Check if the current node is the target node
      if (node.name === targetNode.name) {
        path = newPath;
        fullPathFound = true; // Stop further traversal once found
        break;
      }

      // Add children to the stack to continue traversing
      if (node.children) {
        node.children.forEach((child) => {
          stack.push({ node: child, path: newPath });
        });
      }
    }

    return path; // Return the found path
  };

  // Function to clean up emojis/icons for URL
  const cleanPath = (path) => {
    return path
      .map(segment => segment.replace(/[^\w\s#]/g, '').trim()) // Remove icons and trim
      .filter(Boolean)
      .join('#');
  };

  // Function to handle node click
  const handleNodeClick = (targetNode, event) => {
    event.stopPropagation(); // Prevent the event from bubbling up to parent nodes
    const fullPath = findFullPath(targetNode); // Get the full path
    if (fullPath.length > 0) {
      setTags(fullPath); // Set the full path as tags
      setIsModalOpen(false); // Close the modal

      const cleanedPath = cleanPath(fullPath); // Clean path for URL
      updateURLParams(cleanedPath); // Update the URL
    }
  };

  // Function to handle removing a tag and refreshing the page
  const handleTagRemove = (indexToRemove) => {
    const updatedTags = tags.filter((_, i) => i !== indexToRemove);
    setTags(updatedTags); // Update tags state
    const cleanedTags = cleanPath(updatedTags.map(tag => tag.replace(/[^\w\s#]/g, '')));
    updateURLParams(cleanedTags); // Update the URL after tag removal
  };

  // Function to render the tree nodes
  const renderTree = (nodes) => {
    return nodes.map((node) => (
      <div
        className="tree-node"
        key={node.id}
        onClick={(event) => handleNodeClick(node, event)}
      >
        <div className="tree-node-content">
          {node.icon} {node.name}
        </div>
        {node.children && (
          <div className="tree-children">{renderTree(node.children)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="tree-tags-container">
      <div className="tags-input">
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <div className="tag-item" key={index}>
              {tag} <span className="tag-remove" onClick={() => handleTagRemove(index)}>x</span>
            </div>
          ))
        ) : (
          <div className="empty-what-message">{translate('20', 'WHAT IS YOUR #WHAT?')}</div>
        )}
      </div>

      {/* Tree icon for opening the mind map */}
      <div className="tree-icon" onClick={() => setIsModalOpen(true)}>
        <span role="img" aria-label="tree">🌱</span>
      </div>

      {/* Modal for displaying mind map */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content" ref={modalRef}>
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>
            <h2>Mind Map</h2>
            <div className="mind-map">
              {renderTree(treeData.tree)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TreeTagsDep;
