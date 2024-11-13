import React, { useEffect, useState, useRef } from 'react';
import networkIcon from '../../files/icons/networkIcon.svg';
import languageIcon from '../../files/icons/languageIcon.svg';
import layoutIcon from '../../files/icons/layoutIcon.svg';
import settingsIcon from '../../files/icons/settings.svg';
import logo from '../../files/icons/logo.svg';
import dorrVideo1 from './../../files/media/dorr-video.mp4'; // Import your first image
import dorrImage2 from './../../files/media/dorr2.png'; // Import your second image
import dorrVideo2 from './../../files/media/dorr.mp4'; // Import your video
import { FiEdit } from 'react-icons/fi'; // Change this line
import { MdSettings } from 'react-icons/md'; // Settings icon
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5'; // Close (X) icon
import './Header.css';
import { useLocalization } from '../toolkit/LocalizationContext';
import { MdDashboard, MdPerson, MdNightlight, MdWbSunny, MdAccountBalanceWallet, MdPeople, MdLock, MdSos, MdNotifications, MdDelete, MdLayersClear } from 'react-icons/md';
import { MdOutlineVisibilityOff } from 'react-icons/md';


const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'fa', name: 'Persian', native: 'فارسی' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe' },
  { code: 'he', name: 'Hebrew', native: 'עברית' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'th', name: 'Thai', native: 'ภาษาไทย' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'tl', name: 'Filipino', native: 'Filipino' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' }
];



const networks = [
  { name: 'Local' },
  { name: 'Bluetooth' },
  { name: 'WebRTC' },
  { name: 'Centralised A' },
  { name: 'Centralised B' },
  { name: 'Torrent' },
  { name: 'Tracker A' },
  { name: 'Torr' },
  { name: 'IPFS' },
  { name: 'LoRa' },
  { name: 'Blockchain' },
  { name: 'Proxy B' },
];

const layouts = [
  { name: 'Wall' },
  { name: 'Circle' },
  { name: 'X' },
  { name: 'Browse' },
];

function Header({ setLanguageSelected, setNetworkSelected, setLayoutSelected, toggleNotificationCenter }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedNetworks, setSelectedNetworks] = useState(new Set());
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [dropdownType, setDropdownType] = useState(null); // Track which dropdown is open
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // State for InfoModal visibility
  const [currentSlide, setCurrentSlide] = useState(0); // Track the current slide for image slider
  const dropdownRefs = useRef([]);
  const infoModalContentRef = useRef(null); // Reference for InfoModal content (only the content, not the modal container)
  const { translate } = useLocalization();
  const [isNightMode, setIsNightMode] = useState(false);
  const [isNotificationCenterActive, setIsNotificationCenterActive] = useState(false); // New state for Notification Center


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedLanguage(params.get('language'));
    const networks = params.get('network') ? new Set(params.get('network').split(',')) : new Set();
    setSelectedNetworks(networks);
    setSelectedLayout(params.get('layout'));
  }, []);

  const handleClick = (type, isEnabled) => {
    if (isEnabled) {
      setDropdownType(prevType => (prevType === type ? null : type)); // Toggle dropdown visibility
    }
  };

  const toggleNightMode = () => {
    const newMode = !isNightMode;
    setIsNightMode(newMode);
    localStorage.setItem('isNightMode', JSON.stringify(newMode));
    document.body.classList.toggle('night-mode', newMode);
  };

  // Load preference on component mount
  useEffect(() => {
    const savedMode = JSON.parse(localStorage.getItem('isNightMode'));
    if (savedMode) {
      setIsNightMode(savedMode);
      document.body.classList.add('night-mode');
    }
  }, []);


  const handleSelectionChange = (key, value) => {
    const params = new URLSearchParams(window.location.search);
    if (key === 'network') {
      if (selectedNetworks.has(value)) {
        selectedNetworks.delete(value);
      } else {
        selectedNetworks.add(value);
      }
      params.set(key, Array.from(selectedNetworks).join(','));
      setSelectedNetworks(new Set(selectedNetworks));
    } else {
      params.set(key, value);
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    window.location.reload(); // Reload page after selection
  };

  const handleEdit = (item) => {
    // console.log(`Edit ${item}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRefs.current.every(ref => ref && !ref.contains(event.target))) {
        setDropdownType(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close InfoModal when clicking outside of modal content
  useEffect(() => {
    const handleClickOutsideInfoModal = (event) => {
      if (isInfoModalOpen && infoModalContentRef.current && !infoModalContentRef.current.contains(event.target)) {
        setIsInfoModalOpen(false);
      }
    };

    if (isInfoModalOpen) {
      document.addEventListener('mousedown', handleClickOutsideInfoModal);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideInfoModal);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideInfoModal);
    };
  }, [isInfoModalOpen, infoModalContentRef]);

  // Move to the next or previous slide in the image slider
  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 3); // Cycle through 3 items (2 images + 1 video)
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + 3) % 3); // Cycle through 3 items (2 images + 1 video)
  };

  const clearCache = () => {
    localStorage.clear();
    // console.log("All cache and local memory cleared.");

    // Remove specific URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.delete("pov");
    queryParams.delete("time");
    queryParams.delete("what");

    // Update the URL without reloading the page
    window.history.replaceState({}, '', `${window.location.pathname}?${queryParams.toString()}`);

    // Reload the page to reset any loaded data from local storage
    window.location.reload();
  };

  const toggleNotificationCenterDisplay = () => {
    setIsNotificationCenterActive(!isNotificationCenterActive);
    toggleNotificationCenter();
    setDropdownType(null); // Close the settings dropdown when toggling notifications
  };

  // InfoModal to display the dorr images, video, and controls
  const InfoModal = () => {
    const media = [
      { type: 'video/mp4', src: dorrVideo1 },
      { type: 'image', src: dorrImage2 },
      { type: 'video/mp4', src: dorrVideo2 }, // Include video as third media item
    ];

    return (
      <div className="infomodal">
        <div className="infomodal-content" ref={infoModalContentRef}>
          {media[currentSlide].type === 'image' ? (
            <img src={media[currentSlide].src} alt={`DORR Media ${currentSlide + 1}`} />
          ) : (
            <video controls>
              <source src={media[currentSlide].src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <div className="slide-controls">
            <IoChevronBack className="slide-icon" onClick={handlePrevSlide} />
            <span className="slide-number">
              {currentSlide + 1} / {media.length} {/* Slide number starts from 1, not 0 */}
            </span>
            <IoChevronForward className="slide-icon" onClick={handleNextSlide} />
          </div>
        </div>
      </div>
    );
  };



  return (
    <header className="App-header">
      <div className="header-icon-container" ref={el => (dropdownRefs.current[0] = el)}>
        <img
          src={languageIcon}
          alt={translate('1', 'Language')} // Use translation for "Language"
          onClick={() => handleClick('Language', true)}
          className="App-icon"
        />
        <p className="icon-label" onClick={() => handleClick('Language', true)}>
          {selectedLanguage ? languages.find(lang => lang.code === selectedLanguage).native : translate('1', 'Language')}
        </p>
        {dropdownType === 'Language' && (
          <div className="dropdown-content show">
            <div className="language-dropdown">
              {languages.map(lang => (
                <div
                  className={`language-row ${selectedLanguage === lang.code ? 'selected' : ''}`}
                  key={lang.code}
                  style={{
                    backgroundColor: selectedLanguage === lang.code ? '#f1f1f1' : 'transparent',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <p onClick={() => handleSelectionChange('language', lang.code)}>{lang.native}</p>
                  <FiEdit onClick={() => handleEdit(lang.name)} className="hsettings-icon" />
                </div>
              ))}
            </div>
            <p onClick={() => handleSelectionChange('language', 'AddNew')}>{translate('14', '+ Add New')}</p>
          </div>
        )}

      </div>

      {/* Network Dropdown */}
      <div className="header-icon-container" ref={el => (dropdownRefs.current[1] = el)}>
        <img
          src={networkIcon}
          alt={translate('2', 'Network')}
          onClick={() => handleClick('Network', !!selectedLanguage)} // Only enable if language is selected
          className={`App-icon ${!selectedLanguage ? 'disabled' : ''}`} // Grayscale if language not selected
        />
        <p className="icon-label" onClick={() => handleClick('Network', true)}>
          {selectedNetworks.size > 1
            ? translate('3', 'Multiple')
            : (selectedNetworks.size
              ? Array.from(selectedNetworks).join(', ')
              : translate('2', 'Network'))}
        </p>
        {dropdownType === 'Network' && (
          <div className="dropdown-content show">
            {networks.map(network => (
              <div
                className={`network-row ${selectedNetworks.has(network.name) ? 'selected' : ''}`}
                key={network.name}
                style={{
                  backgroundColor: selectedNetworks.has(network.name) ? '#f1f1f1' : 'transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedNetworks.has(network.name)}
                  onChange={() => handleSelectionChange('network', network.name)}
                  id={network.name}
                  style={{ marginRight: '8px' }}
                />
                <label htmlFor={network.name} style={{ cursor: 'pointer', padding: '8px 16px', display: 'inline-block' }}>
                  {network.name}
                </label>
                <MdSettings onClick={() => handleEdit(network.name)} className="hsettings-icon" />
              </div>
            ))}
            <p onClick={() => handleSelectionChange('network', 'AddN')}>{translate('14', '+ Add New')}</p>
          </div>
        )}
      </div>

      <div className="App-logo-container" onClick={() => setIsInfoModalOpen(true)}>
        <img src={logo} className="App-logo" alt="logo" />
      </div>

      {/* Updated Layout Dropdown */}
      <div className="header-icon-container" ref={el => (dropdownRefs.current[2] = el)}>
        <img
          src={layoutIcon}
          alt={translate('4', 'Layout')}
          onClick={() => handleClick('Layout', !!selectedLanguage)}
          className={`App-icon ${!selectedLanguage ? 'disabled' : ''}`} // Grayscale if language not selected
        />
        <p className="icon-label" onClick={() => handleClick('Layout', !!selectedLanguage)}>
          {selectedLayout ? translate(selectedLayout === 'Wall' ? '16' : selectedLayout === 'Circle' ? '17' : selectedLayout === 'X' ? '18' : '19') : translate('4', 'Layout')}
        </p>
        {dropdownType === 'Layout' && (
          <div className="dropdown-content show">
            {layouts.map(layout => (
              <div className="language-row" key={layout.name} style={{ backgroundColor: selectedLayout === layout.name ? '#f1f1f1' : 'transparent', whiteSpace: 'nowrap' }}>
                <p onClick={() => handleSelectionChange('layout', layout.name)}>
                  {translate(layout.name === 'Wall' ? '16' : layout.name === 'Circle' ? '17' : layout.name === 'X' ? '18' : '19', layout.name)}
                </p>
                <FiEdit onClick={() => handleEdit(layout.name)} className="hsettings-icon" />
              </div>
            ))}
            <p onClick={() => handleSelectionChange('layout', 'AddNew')}>{translate('14', '+ Add New')}</p> {/* Use ID for "+ Add New" */}
          </div>
        )}
      </div>

      <div className="header-icon-container" ref={el => (dropdownRefs.current[3] = el)}>
        <img
          src={settingsIcon}
          alt={translate('5', 'Settings')}
          onClick={() => handleClick('Settings', !!selectedLanguage)}
          className={`App-icon ${!selectedLanguage ? 'disabled' : ''}`} // Grayscale if language not selected
        />
        <p className="icon-label" onClick={() => handleClick('Settings', !!selectedLanguage)}>{translate('5', 'Settings')}</p>
        {dropdownType === 'Settings' && (
          <div className="dropdown-content show">
            <p><MdLock className="hsettings-icon" /> {translate('10', 'Lock')}</p>
            <div onClick={toggleNotificationCenterDisplay}>
              <p>
                {isNotificationCenterActive ? <MdDashboard className="hsettings-icon" /> : <MdNotifications className="hsettings-icon" />}
                {translate(isNotificationCenterActive ? '195' : '12', isNotificationCenterActive ? 'Dashboard' : 'Notifications')}
              </p>
            </div>
            <p><MdPerson className="hsettings-icon" /> {translate('6', 'Profile')}</p>
            <p><MdPeople className="hsettings-icon" /> {translate('8', 'Social Medias')}</p>
            <p><MdAccountBalanceWallet className="hsettings-icon" /> {translate('7', 'Wallets')}</p>
            <p><MdPeople className="hsettings-icon" /> {translate('11', 'Peers')}</p>
            <p><MdSos className="hsettings-icon" /> {translate('9', 'SOS')}</p>

            <p onClick={toggleNightMode}>
              {isNightMode ? <MdWbSunny className="hsettings-icon" /> : <MdNightlight className="hsettings-icon" />}
              {isNightMode ? translate('193', 'Day Mode') : translate('194', 'Night Mode')}
            </p>
            <p onClick={clearCache}><MdLayersClear className="hsettings-icon" /> {translate('142', 'Clear Cache')}</p>
            <p><MdOutlineVisibilityOff className="hsettings-icon" /> {translate('199', 'Incognito')}</p>

            <p onClick={() => console.log('Logout Clicked')}><MdDelete className="hsettings-icon" /> {translate('13', 'Delete Account')}</p>
          </div>
        )}

      </div>

      {/* Render the InfoModal if it is open */}
      {isInfoModalOpen && <InfoModal />}
    </header>
  );
}

export default Header;
