import React, { useState, useEffect } from 'react';
import BellIcon from '../../files/icons/BellIcon';
import ColorSelector from './ColorSelector';
import TreeTags from '../SectionC/TreeTags';
import C2TimeSelector from '../SectionB/TimeSelector';
import C2POVSelector from '../SectionB/POVSelector';
import './CircleLayout.css';
import {
  FaMapMarkerAlt,
  FaPercent,
  FaComments,
  FaTasks,
  FaRobot,
  FaCalendarAlt,
  FaGlobe,
  FaUserFriends,
  FaBell,
  FaHashtag,
  FaAt,
  FaHourglass,       // Hourglass icon
  FaDollarSign,      // Dollar sign icon
  FaWallet,          // Wallet icon
  FaThumbtack,        // Pin icon (substitute for 📌)
  FaRetweet,         // Repost (retweet) icon
  FaQuestionCircle   // Question mark icon
} from 'react-icons/fa';

import { useLocalization } from './../toolkit/LocalizationContext'; // Import your localization


const CircleLayout = ({ selectedColor, setSelectedColor }) => {
  const [selectedIcon, setSelectedIcon] = useState(null); // Track clicked icon
  const [selectedIconDescription, setSelectedIconDescription] = useState(''); // Track description
  // Use localization context
  const { translate } = useLocalization();

  const colors = {
    PAINs: '#C81D11',
    GAINs: '#FAC710',
    GODs: '#FF6500',
    THOUGHTs: '#9510AC',
    PROMISEs: '#1C39BB',
    DEEDs: '#8FD14F',
  };
  const rateText = {
    PAINs: [
      { icon: <FaAt />, description: translate('37', '@Voiceless') },
      { icon: <FaHashtag />, description: translate('38', '#Pains') },
      { icon: '👹@', description: translate('39', 'Foe') },
      { icon: <FaMapMarkerAlt />, description: translate('40', 'Location') },
      { icon: <FaPercent />, description: translate('41', 'Percentage') },
      { icon: <FaComments />, description: translate('42', 'Comments') },
      { icon: <FaTasks />, description: translate('43', 'Tasks') },
      { icon: <FaRobot />, description: translate('44', 'AI') },
      { icon: <FaThumbtack />, description: translate('63', 'Pin') },         // New
    ],
    GAINs: [
      { icon: <FaAt />, description: translate('45', '@Seeker') },
      { icon: <FaHashtag />, description: translate('46', '#Seeks') },
      { icon: <FaMapMarkerAlt />, description: translate('40', 'Location') },
      { icon: <FaPercent />, description: translate('41', 'Percentage') },
      { icon: <FaComments />, description: translate('42', 'Comments') },
      { icon: <FaTasks />, description: translate('43', 'Tasks') },
      { icon: <FaRobot />, description: translate('44', 'AI') },
      { icon: <FaThumbtack />, description: translate('63', 'Pin') },         // New
    ],
    GODs: [
      { icon: '👑@', description: translate('47', 'God/Goddess') },
      { icon: <FaMapMarkerAlt />, description: translate('40', 'Location') },
      { icon: <FaComments />, description: translate('42', 'Comments') },
      { icon: <FaTasks />, description: translate('43', 'Tasks') },
      { icon: <FaRobot />, description: translate('44', 'AI') },
      { icon: <FaThumbtack />, description: translate('0', 'Pin') },         // New
    ],
    THOUGHTs: [
      { icon: '💜', description: translate('48', '#Thoughts (to-do)') },
      { icon: '❌', description: translate('49', '#Thoughts (not-to-do)') },
      { icon: <FaHashtag />, description: translate('50', '#Hashtags') },
      { icon: <FaMapMarkerAlt />, description: translate('40', 'Location') },
      { icon: <FaComments />, description: translate('42', 'Comments') },
      { icon: <FaTasks />, description: translate('43', 'Tasks') },
      { icon:  <FaRobot />, description: translate('44', 'AI') },
      { icon: <FaDollarSign />, description: translate('0', 'Price') },    // New
      { icon: <FaWallet />, description: translate('0', 'Wallet') },        // New
      { icon: <FaHourglass />, description: translate('0', 'Digital') },  // New
      { icon: <FaThumbtack />, description: translate('0', 'Pin') },         // 
      { icon: <FaRetweet />, description: translate('64', 'Dispute') },       // New
      { icon: <FaQuestionCircle />, description: translate('65', 'Unknowns') }  // New
    ],
    PROMISEs: [
      { icon: '💙', description: translate('51', '@Doer') },
      { icon: <FaAt />, description: translate('50', '#Hashtags') },
      { icon: <FaHashtag />, description: translate('52', '#Promises') },
      { icon: <FaMapMarkerAlt />, description: translate('40', 'Location') },
      { icon: <FaPercent />, description: translate('41', 'Percentage') },
      { icon: <FaComments />, description: translate('42', 'Comments') },
      { icon: <FaTasks />, description: translate('43', 'Tasks') },
      { icon: <FaRobot />, description: translate('44', 'AI') },
      { icon: <FaDollarSign />, description: translate('0', 'Price') },    // New
      { icon: <FaWallet />, description: translate('0', 'Wallet') },        // New
      { icon: <FaHourglass />, description: translate('0', 'Digital') },  // New
      { icon: <FaThumbtack />, description: translate('0', 'Pin') },         // New
    ],
    DEEDs: [
      { icon: <FaHashtag />, description: translate('53', '#Rates') },
      { icon: '💚', description: translate('54', 'Relief') },
      { icon: '❌', description: translate('55', 'Regret') },
      { icon: <FaMapMarkerAlt />, description: translate('40', 'Location') },
      { icon: <FaPercent />, description: translate('41', 'Percentage') },
      { icon: <FaComments />, description: translate('42', 'Comments') },
      { icon: <FaTasks />, description: translate('43', 'Tasks') },
      { icon: <FaRobot />, description: translate('44', 'AI') },
      { icon: <FaDollarSign />, description: translate('0', 'Price') },    // New
      { icon: <FaWallet />, description: translate('0', 'Wallet') },        // New
      { icon: <FaHourglass />, description: translate('0', 'Digital') },  // New
      { icon: <FaThumbtack />, description: translate('0', 'Pin') },         // New
    ],
  };
  
  const selectedRate = Object.keys(colors).find(
    (key) => colors[key] === selectedColor
  );

  const iconSets = rateText[selectedRate];

  // Clear selected icon when color is changed
  useEffect(() => {
    setSelectedIcon(null);
    setSelectedIconDescription('');
  }, [selectedColor]);

  const getIconPosition = (index, totalIcons) => {
    const angle = (90 * (index % 8)); // Fixed 60-degree increment
    const radius = Math.floor(index / 8) * 50 + 66; // Adjust radius every 6 icons
    const x = radius * Math.cos((angle * Math.PI) / 360);
    const y = radius * Math.sin((angle * Math.PI) / 360);
    return { transform: `translate(${x}px, ${y}px)` };
  };

  const handleIconClick = (icon, description) => {
    setSelectedIcon(icon);
    setSelectedIconDescription(description); // Set description on click
  };

  return (
    <div className="circle-layout">
      <div className="pov-time-holder">
        <C2POVSelector />
        <C2TimeSelector />
      </div>
      <TreeTags />

      <div className="circle-filter row small">
        <div
          className="column column-centered color-circle"
          style={{ backgroundColor: selectedColor }}
        >
          <p className="bold-header">{translate('57', 'RATES')}</p>
          <ColorSelector
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
          />
        </div>

        <div className="icons-wrapper">
          {/* Icons distributed around Bell */}
          <div className="circle-icons">
            {iconSets.map((item, index) => (
              <div
                key={index}
                className="icon-item"
                style={getIconPosition(index, iconSets.length)}
                onClick={() => handleIconClick(item.icon, item.description)}
              >
                <span style={{ color: selectedColor }}>{item.icon}</span>
              </div>
            ))}
            <div onClick={() => handleIconClick(<FaBell />, translate('56', 'Notification'))}>
              <FaBell  style={{ color: selectedColor }} className="icon-item centered-bell" />
            </div>
          </div>
        </div>
      </div>

      {selectedIcon && (
        <div
          className="selected-icon-display"
          style={{
            border: `2px solid ${selectedColor}`,
            backgroundColor: '#f9f9f9',
            minHeight: '480px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ color: selectedColor }}>{selectedIconDescription}</h3>
          <div className="selected-icon" style={{ color: selectedColor }}>
            {selectedIcon}
          </div>
        </div>
      )}
    </div>
  );
};

export default CircleLayout;
