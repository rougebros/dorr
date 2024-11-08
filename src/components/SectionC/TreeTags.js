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
    const { translate, loadTranslations } = useLocalization();
    const [translationsLoaded, setTranslationsLoaded] = useState(false);


    useEffect(() => {
        const initialize = async () => {
            const params = new URLSearchParams(window.location.search);
            const langParam = params.get('language');
            const whatParam = params.get('what');
    
            if (langParam) {
                await loadTranslations(langParam);  // Set the language first
                setTranslationsLoaded(true);
            }
            if (translationsLoaded && whatParam) {
                initializeSelectionFromURL(whatParam);
            }
        };
        initialize();
        setCurrentLevel(hashtree.hashtree);
        setFilteredData(Object.entries(hashtree.hashtree));
    }, [translationsLoaded]);

    const findNodeByLabel = (label, level) => {
        const normalizedLabel = label.replace(/_/g, ' ').toLowerCase();
        for (const [key, node] of Object.entries(level)) {
            const nodeLabel = node.label.replace(/_/g, ' ').toLowerCase();
            if (nodeLabel === normalizedLabel) {
                return node;
            }
            if (node.children) {
                const found = findNodeByLabel(normalizedLabel, node.children);
                if (found) return found;
            }
        }
        return null;
    };



    const initializeSelectionFromURL = async (whatParam) => {
        const decodedParam = decodeURIComponent(whatParam);
        const tags = decodedParam
            .split(' ')
            .map(tag => tag.replace(/^#/, '').trim().toLowerCase());
    
        let level = hashtree.hashtree;
        let foundPath = [];
        let lastMatchedLevel = level;
    
        for (let part of tags) {
            const match = Object.entries(level).find(([_, node]) => {
                const normalizedNodeLabel = node.label.toLowerCase().replace(/_/g, ' ').trim();
                const normalizedNodeHashtag = (node.hashtag || '').toLowerCase().replace(/#/g, '').replace(/_/g, ' ').trim();
                const normalizedPart = part.toLowerCase().replace(/_/g, ' ').trim();
    
                return normalizedNodeLabel === normalizedPart || normalizedNodeHashtag === normalizedPart;
            });
    
            if (match) {
                const [key, node] = match;
                foundPath.push({
                    label: translate(node.localID, node.label),
                    icon: node.icon
                });
                lastMatchedLevel = node.children || null;
    
                if (node.children) {
                    level = node.children;
                } else if (node.file) {
                    try {
                        let data;
                        
                        // Check local storage for the file first
                        const localData = localStorage.getItem(node.file);
                        if (localData) {
                            data = JSON.parse(localData);
                            console.log(`Loaded ${node.file} from local storage.`);
                        } else {
                            // Attempt to fetch from GitHub
                            const response = await fetch(`${BASE_URL}${node.file}`);
                            if (response.ok) {
                                data = await response.json();
                                console.log(`Loaded ${node.file} from GitHub.`);
                                localStorage.setItem(node.file, JSON.stringify(data)); // Save to local storage
                            } else {
                                // If GitHub fetch fails, load from template
                                console.warn(`File "${node.file}" not found on GitHub. Loading template.`);
                                const templateResponse = await fetch(`${BASE_URL}dorr_template.json`);
                                data = await templateResponse.json();
                                localStorage.setItem(node.file, JSON.stringify(data)); // Save template as new file
                            }
                        }
    
                        // Use `data` to set tags and icon
                        const translatedTags = tags
                            .map(tag => {
                                const cleanTag = tag.replace(/^#/, '').toLowerCase();
                                const node = findNodeByLabel(cleanTag, hashtree.hashtree);
                                return node ? `#${translate(node.localID, node.label)}` : `#${tag}`;
                            })
                            .join(' ');
    
                        setSelectedTags([translatedTags]);
                        setSelectedIcon(node.icon);
                    } catch (error) {
                        console.error(`Error loading file or template for node "${node.label}":`, error);
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
        if (!tags || !tags.length) {
            console.warn("No tags provided for URL update");
            return;
        }

        const queryParams = new URLSearchParams(window.location.search);
        const whatValue = tags.map(tag => `#${tag.replace(/^#+/, '')}`).join(' ');
        queryParams.set('what', encodeURIComponent(whatValue).replace(/%23/g, '#'));

        window.history.replaceState({}, '', `${window.location.pathname}?${queryParams.toString()}`);
    };





    const handleNodeClick = async (key, node) => {
        if (node.children) {
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

                let data;
                if (response.ok) {
                    data = await response.json();
                    //console.log(`Loaded ${node.file} into local memory from GitHub`);
                } else {
                    const templateResponse = await fetch(`${BASE_URL}dorr_template.json`);
                    data = templateResponse.ok ? await templateResponse.json() : null;
                    //console.log(`Loaded dorr_template.json as fallback for ${node.file}`);
                }

                if (data) {
                    localStorage.setItem(node.file, JSON.stringify(data));
                    setSelectedTags([node.hashtag
                        .split(' ')
                        .map(tag => {
                            const cleanTag = tag.replace(/^#/, '').toLowerCase();
                            const foundNode = findNodeByLabel(cleanTag, hashtree.hashtree);
                            return foundNode ? `#${translate(foundNode.localID, foundNode.label)}` : `#${tag}`;
                        })
                        .join(' ')
                    ]);
                    setSelectedIcon(node.icon);
                    updateURLParams([node.hashtag]);
                    setIsModalOpen(false); // Close the modal without full page reload
                }
                window.location.reload();

            } catch (error) {
                console.error(`Error loading JSON file or template:`, error);
                setSelectedIcon(node.icon);
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
