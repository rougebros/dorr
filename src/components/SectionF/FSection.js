import React, { useState, useEffect } from 'react';
import { useLocalization } from '../toolkit/LocalizationContext';
import './FSection.css';
import hashtree from '../../files/json/hashTree.json';

const FSection = ({ type, color, logo }) => {
  const [data, setData] = useState([]);
  const { translate } = useLocalization();

  const findFileFromWhat = (whatParam) => {
    console.log("Finding file for whatParam:", whatParam);

    const decodedParam = decodeURIComponent(whatParam).toLowerCase();
    const tags = decodedParam
      .split(' ')
      .map(tag => tag.replace(/^#/, '').trim());

    console.log("Tags found from params:", tags);

    let currentLevel = hashtree.hashtree;
    let fileName = null;

    for (const tag of tags) {
      const standardizedTag = tag.replace(/_/g, ' ').toLowerCase();
      console.log("Standardized tag is:", standardizedTag);

      const match = Object.entries(currentLevel).find(([_, node]) => {
        const normalizedNodeLabel = node.label.toLowerCase().replace(/_/g, ' ').trim();
        const normalizedNodeHashtag = (node.hashtag || '').toLowerCase().replace(/#/g, '').replace(/_/g, ' ').trim();
        return normalizedNodeLabel === standardizedTag || normalizedNodeHashtag === standardizedTag;
      });

      if (match) {
        const [_, node] = match;
        console.log("Node found for tag:", standardizedTag, "-> Node:", node);

        if (node.file) {
          fileName = node.file;
          console.log("File found in hash tree:", fileName);
          break;
        } else if (node.children) {
          currentLevel = node.children;
        }
      } else {
        console.warn(`No NODE found for tag "${standardizedTag}". Aborting.`);
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

    // console.log("File name for loading data:", fileName);

    const storedData = localStorage.getItem(fileName);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const targetData = parsedData.dorr_rates.filter(rate => rate.type === (type === 'gods' ? '#godly' : '#foe'));
      setData(targetData);
      // console.log(`Loaded ${fileName} from local storage. Data:`, parsedData);
    } else {
      console.warn(`Data file for ${fileName} not found in local storage.`);
      setData([]);
    }
  };

  useEffect(() => {
    loadFData();
  }, [type]);

  return (
    <div className={`f-section`} style={{ backgroundColor: color }}>
      <div className="f-section-header">
        <span className="logo">{logo}</span>
        <span className="title">{type === 'gods' ? translate('27', 'Hall of Fame') : translate('28', 'Hall of Shame')}</span>
      </div>
      {data.length > 0 ? (
        <ul className="f-section-list">
          {data.map((item, index) => (
            <li key={index}>
              <span>{item.meta.entity_name}</span>
              <span>{item.rating || 0}%</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data found for the selected parameters.</p>
      )}
    </div>
  );
};

export default FSection;
