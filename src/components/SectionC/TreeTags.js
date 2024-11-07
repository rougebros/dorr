import React, { useState, useEffect } from 'react';
import './TreeTags.css';
import hashtree from '../../files/json/hashTree.json';
import { useLocalization } from '../toolkit/LocalizationContext';


const BASE_URL = 'https://raw.githubusercontent.com/rougebros/dorr/refs/heads/main/public/files/json/';

function TreeTags() {
    const [currentLevel, setCurrentLevel] = useState(null);
    const [path, setPath] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedIcon, setSelectedIcon] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const { translate, loadTranslations  } = useLocalization();
    const [translationsLoaded, setTranslationsLoaded] = useState(false);


    useEffect(() => {
        console.log('Initializing hashtree:', hashtree.hashtree);
        setCurrentLevel(hashtree.hashtree);
        setFilteredData(Object.entries(hashtree.hashtree));
    }, []);


    useEffect(() => {
        if (translationsLoaded) {
            const params = new URLSearchParams(window.location.search);
            const whatParam = params.get('what');
    
            if (whatParam) {
                initializeSelectionFromURL(whatParam);
            }
        }
    }, [translationsLoaded]);
    
    const findNodeByLabel = (label, level) => {
        for (const [key, node] of Object.entries(level)) {
            if (node.label.toLowerCase() === label) {
                return node;
            }
            if (node.children) {
                const found = findNodeByLabel(label, node.children); // Recursive search in children
                if (found) return found;
            }
        }
        return null;
    };
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const langParam = params.get('language');
    
        if (langParam) {
            loadTranslations(langParam);  // Set the language first
            console.log(`Language set to ${langParam}`);
        }
        setTranslationsLoaded(true);  // Mark translations as loaded
    }, []);
    
    
    
    const initializeSelectionFromURL = async (whatParam) => {
        console.log('Initializing selection from URL with param:', whatParam);
    
        const decodedParam = decodeURIComponent(whatParam);
        console.log('Decoded param:', decodedParam);
    
        const tags = decodedParam
            .split(' ')
            .map(tag => tag.replace(/^#/, '').trim().toLowerCase());
        console.log('Parsed tags:', tags);
    
        let level = hashtree.hashtree;
        let foundPath = [];
        let lastMatchedLevel = level;
    
        for (let part of tags) {
            console.log(`Searching for part "${part}" in current level:`, level);
    
            const match = Object.entries(level).find(([_, node]) => node.label.toLowerCase() === part);
    
            if (match) {
                const [key, node] = match;
                foundPath.push({
                    label: translate(node.localID, node.label),  // Use localized label or fallback
                    icon: node.icon
                });
                lastMatchedLevel = node.children || null;
    
                if (node.children) {
                    level = node.children;
                } else if (node.file) {
                    console.log(`Attempting to fetch file for node "${node.label}" with file "${node.file}"`);
                    try {
                        const response = await fetch(`${BASE_URL}${node.file}`);
                        if (!response.ok) throw new Error('File does not exist');
                        const data = await response.json();
    
                        const translatedTags = decodedParam
                            .split(' ')
                            .map(tag => {
                                const cleanTag = tag.replace(/^#/, '').toLowerCase();
                                const node = findNodeByLabel(cleanTag, hashtree.hashtree);
                                return node ? `#${translate(node.localID, node.label)}` : `#${tag}`;
                            })
                            .join(' ');
                        
                        setSelectedTags([translatedTags]);
                        setSelectedIcon(node.icon);
                    } catch (error) {
                        console.error(`File not found for node "${node.label}":`, error);
                        node.isDisabled = true;
                    }
                    return;
                }
            } else {
                console.warn(`Part "${part}" not found. Aborting initialization.`);
                return;
            }
        }
    
        setPath(foundPath);
        setCurrentLevel(lastMatchedLevel);
        setFilteredData(
            lastMatchedLevel
                ? Object.entries(lastMatchedLevel).map(([key, node]) => [
                    key, { ...node, isDisabled: !node.file, label: translate(node.localID, node.label) }
                ])
                : []
        );
    };
    


    const removeWhatParam = () => {
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.delete('what');  // Remove "what" parameter from URL
        window.history.replaceState({}, '', `${window.location.pathname}?${queryParams.toString()}`);
        window.location.reload();  // Reload the page to reset
    };

    const findNodeByHashtag = (hashtag, level = hashtree.hashtree) => {
        for (const [key, node] of Object.entries(level)) {
            if (node.hashtag && node.hashtag.toLowerCase() === hashtag.toLowerCase()) {
                return node;  // Return the found node
            }
            if (node.children) {
                const found = findNodeByHashtag(hashtag, node.children);  // Recursively search in children
                if (found) return found;
            }
        }
        return null;  // Return null if not found
    };

    const updateURLParams = (tags) => {
        const queryParams = new URLSearchParams(window.location.search);

        // Use translated tags for the URL to retain localization
        const whatValue = tags.map(tag => `#${tag.replace(/^#+/, '')}`).join(' ');
        queryParams.set('what', encodeURIComponent(whatValue).replace(/%23/g, '#'));

        window.history.replaceState({}, '', `${window.location.pathname}?${queryParams.toString()}`);
    };


    const handleNodeClick = async (key, node) => {
        if (node.children) {
            // Navigate to children
            setPath([...path, { label: translate(node.localID, node.label), icon: node.icon }]);
            setCurrentLevel(node.children);
            setSearchQuery('');
            setFilteredData(Object.entries(node.children).map(([k, n]) => [
                k, { ...n, label: translate(n.localID, n.label) }
            ]));

        } else if (node.file) {
            try {
                const fileUrl = `${BASE_URL}${node.file}`;
                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error('File not found');

                const data = await response.json();
                // Save to local memory for future use in Section D
                localStorage.setItem(node.file, JSON.stringify(data));
                console.log(`Loaded ${node.file} into local memory`);

                setSelectedTags([node.hashtag
                    .split(' ')
                    .map(tag => {
                        const cleanTag = tag.replace(/^#/, '').toLowerCase();
                        const foundNode = findNodeByLabel(cleanTag, hashtree.hashtree); // Use findNodeByLabel to get node details
                        return foundNode ? `#${translate(foundNode.localID, foundNode.label)}` : `#${tag}`;
                    })
                    .join(' ')
                ]);
                setSelectedIcon(node.icon);
                updateURLParams([data.hashtag]);

                // Optionally refresh the page for full load of new params
                window.location.reload();
            } catch (error) {
                console.error('Error loading JSON file:', error);
                setFilteredData(prevData =>
                    prevData.map(([k, n]) =>
                        k === key ? [k, { ...n, isDisabled: true }] : [k, n]
                    )
                );
            }
        }
    };

    const [localizedMap, setLocalizedMap] = useState({});

    // Initialize localized labels when loading data
    useEffect(() => {
        const buildLocalizedMap = (level) => {
            let map = {};
            for (const [key, node] of Object.entries(level)) {
                map[key] = translate(node.localID, node.label);  // Use translation or default to label
                if (node.children) {
                    map = { ...map, ...buildLocalizedMap(node.children) };
                }
            }
            return map;
        };
        setLocalizedMap(buildLocalizedMap(hashtree.hashtree));
    }, []);


    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
    
        const searchAllNodes = (level) => {
            let results = [];
            Object.entries(level).forEach(([key, node]) => {
                const englishLabel = node.label.toLowerCase();
                const localizedLabel = localizedMap[key]?.toLowerCase() || '';  // Get localized label from map
    
                // Check if the node label matches the search query
                if (englishLabel.includes(query) || localizedLabel.includes(query)) {
                    results.push([key, { ...node, label: translate(node.localID, node.label) }]);
                }
    
                // Recursively search in children, if they exist
                if (node.children) {
                    results = results.concat(searchAllNodes(node.children));
                }
            });
            return results;
        };
    
        const filteredResults = query ? searchAllNodes(hashtree.hashtree) : Object.entries(currentLevel || hashtree.hashtree);
        setFilteredData(filteredResults);
    };
    

    const goBack = () => {
        // console.log("Back button clicked");
        // console.log("Current path before back:", path);
    
        const newPath = path.slice(0, -1); // Remove the last item from the breadcrumb
        setPath(newPath);
    
        if (newPath.length > 0) {
            let level = hashtree.hashtree;
            // console.log("Starting traversal to find new current level:");
    
            for (let index = 0; index < newPath.length; index++) {
                const pathItem = newPath[index];
                const parentLevel = level;
    
                // Try to match by both key and translated label
                const matchedNode = Object.entries(level).find(
                    ([key, node]) => 
                        node.label === pathItem.label || key.toLowerCase() === pathItem.label.toLowerCase()
                )?.[1];
    
                if (matchedNode && matchedNode.children) {
                    level = matchedNode.children; // Move to the matched level's children
                    // console.log(`Step ${index + 1}: Traversing to ${pathItem.label}`);
                    // console.log("Parent level:", parentLevel);
                    // console.log("Found level:", level);
                } else {
                    // console.error(`Traversal error: Level is undefined or missing children at "${pathItem.label}"`);
                    level = parentLevel; // Use last known valid level to avoid root reset
                    break;
                }
            }
    
            // Apply the updated level if found
            if (level) {
                setCurrentLevel(level);
                const newFilteredData = Object.entries(level).map(([key, node]) => [
                    key, { ...node, label: translate(node.localID, node.label) }
                ]);
                setFilteredData(newFilteredData);
    
                // console.log("New path after back:", newPath);
                // console.log("New current level after back:", level);
                // console.log("New filtered data after back:", newFilteredData);
            } else {
                console.error("Could not set the current level: Traversal resulted in undefined level");
            }
        } else {
            // Reset to root if no more parent levels
            setCurrentLevel(hashtree.hashtree);
            setFilteredData(Object.entries(hashtree.hashtree).map(([key, node]) => [
                key, { ...node, label: translate(node.localID, node.label) }
            ]));
            // console.log("Reset to root level");
        }
    
        // console.log("Final path after back:", newPath);
        // console.log("Final current level after back:", currentLevel);
    };
    
    
    
    
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const whatParam = params.get('what');
        if (whatParam) {
            // Delay initialization to ensure translate has the correct language context
            setTimeout(() => initializeSelectionFromURL(whatParam), 0);
        }
    }, []);
    

    return (
        <div className="tree-tags-container">
            <div className="tags-input" onClick={() => setIsModalOpen(true)}>
                {selectedTags.length > 0 ? (
                    selectedTags.map((tag, index) => (
                        <div className="tag-item" key={index}>
                            <span className="icon">{selectedIcon}</span>
                            {tag}
                            <span
                                className="tag-remove"
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent click from propagating to parent
                                    setSelectedTags([]);  // Clear selected tags
                                    setSelectedIcon('');   // Clear selected icon
                                    removeWhatParam();     // Remove the "what" param and refresh
                                }}
                            >
                                x
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="empty-what-message">{translate('20', 'WHAT IS YOUR #WHAT?')}</div>
                )}
            </div>

            <div className="tree-icon" onClick={() => setIsModalOpen(true)}>
                🌱
            </div>

            {isModalOpen && (
                <div className="modal" style={{ top: '120px', left: '50%', transform: 'translate(-50%, 0)' }}>
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <input
                            type="text"
                            placeholder="Search hashtags..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearch}
                            autoFocus
                        />
                        {path.length > 0 && (
                            <div className="breadcrumb-item" onClick={goBack}>
                                {path.map((item) => `${item.icon} ${item.label}`).join(' > ')}
                            </div>
                        )}
                        <div className="mind-map-grid">
                            {filteredData.map(([key, node]) => (
                                <div
                                    key={key}
                                    className={`tree-node-content ${node.isDisabled ? 'disabled' : ''}`}
                                    onClick={() => !node.isDisabled && handleNodeClick(key, node)}
                                >
                                    <span className="icon">{node.icon}</span>
                                    <span>{translate(node.localID, node.label)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



export default TreeTags;
