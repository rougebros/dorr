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
        // console.log(`Looking for exact match of label: "${label}", normalized: "${normalizedLabel}"`);

        for (const [key, node] of Object.entries(level)) {
            // Check if key name matches normalized label directly
            if (key.toLowerCase() === normalizedLabel) {
                // console.log(`Match found for key "${key}":`, node);
                return node;
            }

            // If not, fallback to checking the label property
            const nodeLabel = node.label.replace(/_/g, ' ').toLowerCase();
            // console.log(`Checking node label: "${node.label}" (normalized: "${nodeLabel}") against "${normalizedLabel}"`);

            if (nodeLabel === normalizedLabel) {
                // console.log(`Match found for label "${label}":`, node);
                return node;
            }

            // Recursive search in children
            if (node.children) {
                const found = findNodeByLabel(normalizedLabel, node.children);
                if (found) return found;
            }
        }

        // console.warn(`No match found for label: "${label}" - normalizedLabel: "${normalizedLabel}"`);
        return null;
    };




    const initializeSelectionFromURL = async (whatParam) => {
        const decodedParam = decodeURIComponent(whatParam);
        const tags = decodedParam
            .split(' ')
            .map(tag => tag.replace(/^#/, '').trim().toLowerCase());

        // console.log("Extracted tags from URL:", tags);


        let level = hashtree.hashtree;
        let foundPath = [];
        let lastMatchedLevel = level;

        for (let part of tags) {
            // console.log("Looking for tag part:", part);

            const match = Object.entries(level).find(([_, node]) => {
                // console.log(`Checking node label: "${node.label}", hashtag: "${node.hashtag}"`);
                // console.log(`Comparing with part: "${part}"`);

                // Split hashtag into individual tags and check against part
                const hashtagParts = (node.hashtag || '').toLowerCase().replace(/#/g, '').split(' ');

                const labelMatch = node.label.toLowerCase() === part;
                const hashtagMatch = hashtagParts.includes(part); // Check if part exists in split hashtag parts

                // if (labelMatch) {
                //     console.log(`Label match found for part: "${part}"`);
                // }
                // if (hashtagMatch) {
                //     console.log(`Hashtag match found for part: "${part}" in ${hashtagParts}`);
                // }

                return labelMatch || hashtagMatch;
            });


            if (match) {
                const [key, node] = match;
                // console.log("Match found:", key, node);


                foundPath.push({
                    label: translate(node.localID, node.label),
                    icon: node.icon
                });
                lastMatchedLevel = node.children || null;

                if (node.children) {
                    //  console.log(`Children of '${node.label}' node:`, Object.keys(node.children)); // Confirm children include laborkids

                    level = node.children;
                } else if (node.file) {
                    // console.log("Final node file detected:", node.file);

                    try {
                        // Load data based on the `file` attribute
                        const fileName = node.file;
                        let data;

                        // Check local storage first
                        const localData = localStorage.getItem(fileName);
                        if (localData) {
                            data = JSON.parse(localData);
                            // console.log(`Loaded ${fileName} from local storage.`);
                        } else {
                            // If not in local storage, attempt to fetch from GitHub
                            const response = await fetch(`${BASE_URL}${fileName}`);
                            if (response.ok) {
                                data = await response.json();
                                // console.log(`Loaded ${fileName} from GitHub.`);
                                localStorage.setItem(fileName, JSON.stringify(data)); // Cache locally
                            } else {
                                // If GitHub fetch fails, fall back to template
                                console.warn(`File "${fileName}" not found on GitHub. Loading template.`);
                                const templateResponse = await fetch(`${BASE_URL}dorr_template.json`);
                                data = await templateResponse.json();
                                localStorage.setItem(fileName, JSON.stringify(data)); // Save template as a new file
                            }
                        }

                        // Use `data` to set tags and icon
                        const translatedTags = tags
                            .map(tag => {
                                // console.log(`tag ${tag} uncleaned.`);

                                const cleanTag = tag.replace(/^#/, '').toLowerCase();
                                // console.log(`tag ${cleanTag} cleaned.`);

                                const node = findNodeByLabel(cleanTag, hashtree.hashtree);
                                // console.log(`node found ${node.label}.`);
                                // console.log(`node found ${node.label} + ${node.localID}`);


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
                console.warn(`Tag part "${part}" not found. Aborting initialization.`);
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
        // console.log("Node clicked:", node.label);

        if (node.children) {
            // console.log("Navigating to children of:", node.label);

            setPath([...path, { label: translate(node.localID, node.label), icon: node.icon }]);
            setCurrentLevel(node.children);
            setSearchQuery('');
            setFilteredData(Object.entries(node.children).map(([k, n]) => [
                k, { ...n, label: translate(n.localID, n.label) }
            ]));
        } else if (node.file) {
            try {
                const fileUrl = `${BASE_URL}${node.file}`;
                let data;
            
                // Step 1: Attempt to fetch the file from GitHub
                const response = await fetch(fileUrl);
            
                if (response.ok) {
                    data = await response.json();
                    // console.log(`File ${node.file} loaded into memory from GitHub.`);
                } else {
                    console.warn(`File ${node.file} not found on GitHub.`);
            
                    // Step 2: Check if the file already exists in localStorage
                    const existingData = localStorage.getItem(node.file);
                    if (existingData) {
                        data = JSON.parse(existingData);
                        // console.log(`File ${node.file} loaded from localStorage.`);
                    } else {
                        // Step 3: Load the template if not found on GitHub or in localStorage
                        const templateResponse = await fetch(`${BASE_URL}dorr_template.json`);
                        if (templateResponse.ok) {
                            data = await templateResponse.json();
                            localStorage.setItem(node.file, JSON.stringify(data));
                            // console.log(`File ${node.file} created from template and saved to localStorage.`);
                        } else {
                            console.error("Template file not found. Cannot create new file.");
                            return; // Exit if template is also unavailable
                        }
                    }
                }
            
                // Set tags, icon, URL parameters, and close the modal
                if (data) {
                    setSelectedTags([
                        node.hashtag
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
            
                window.location.reload(); // Reload to reflect any new data
            
            } catch (error) {
                console.error("Error loading or saving file:", error);
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
                            placeholder={translate('179', 'Search hashtags ...')}
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearch}
                            autoFocus
                        />
                        {path.length > 0 && (
                            <div className="breadcrumb-tree-item" onClick={goBack}>
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
