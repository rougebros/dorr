import React, { useState, useEffect, useRef } from 'react';
import Header from './components/SectionA/Header';
import Footer from './components/SectionG/Footer';
import TreeTags from './components/SectionC/TreeTags';
import POVSelector from './components/SectionB/POVSelector';
import TimeSelector from './components/SectionB/TimeSelector';
import CircleLayout from './components/layouts/CircleLayout';
import DWall from './components/SectionD/DWall';
import FSection from './components/SectionF/FSection';
import ESection from './components/SectionE/ESection';
import { LocalizationProvider, useLocalization } from './components/toolkit/LocalizationContext';

import './App.css';

function App() {
  const [dropdownType, setDropdownType] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#C81D11');
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);
  const [isNetworkSelected, setIsNetworkSelected] = useState(false);
  const [isLayoutSelected, setIsLayoutSelected] = useState(false);
  const [isSettingsSelected, setIsSettingsSelected] = useState(false);
  const [selectedWhat, setSelectedWhat] = useState(null);
  const [layoutType, setLayoutType] = useState('Default');

  const dropdownRef = useRef(null);

  // Use localization context
  const { translate } = useLocalization();

  // Function to parse query string and update states
  const parseQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    setIsLanguageSelected(!!params.get('language'));
    setIsNetworkSelected(!!params.get('network'));
    setIsLayoutSelected(!!params.get('layout'));
    setIsSettingsSelected(!!params.get('profile'));
    setSelectedWhat(params.get('what'));
    setLayoutType(params.get('layout') || 'Default');
  };

  useEffect(() => {
    parseQueryParams();

    const handleUrlChange = () => {
      parseQueryParams();
    };

    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownType(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAllSelected = isLanguageSelected && isNetworkSelected && isLayoutSelected && isSettingsSelected;

  const shouldHideSections = !selectedWhat;

  return (
    <div className="App">
      <header className="App-header">
        <Header
          setDropdownType={setDropdownType}
          isLanguageSelected={isLanguageSelected}
          isNetworkSelected={isNetworkSelected}
          isLayoutSelected={isLayoutSelected}
          isSettingsSelected={isSettingsSelected}
        />
      </header>

      <main className="App-body">
        {layoutType === 'Circle' ? (
          <CircleLayout selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        ) : (
          <>
            <div className={`pov-time-holder ${!isLanguageSelected ? 'disabled-section' : ''}`}>
              <POVSelector />
              <div className="divider"></div>
              <TimeSelector />
            </div>
            <div className={`tree-tags-container ${!isLanguageSelected ? 'disabled-section' : ''}`}>
              <TreeTags />
            </div>
            {selectedWhat && (
              <>
                <div className="row small">
                  <DWall
                    wallType="seeks"
                    wallTitle={translate('21', "Wall of #Seeks")}
                    wallColor="#FAC710"
                    textColor="#FAC710"
                  />
                  <DWall
                    wallType="pains"
                    wallTitle={translate('22', "Wall of #Pains")}
                    wallColor="#C81D11"
                    textColor="#C81D11"
                  />
                </div>
                <ESection />
                <div className="f-sections-container">
                  <FSection type="gods" color="#FF6500" logo="👑" />
                  <FSection type="foes" color="#C81D11" logo="👹" />
                </div>
              </>
            )}
          </>
        )}
      </main>
      {!shouldHideSections && (
        <footer className="App-footer">
          <Footer />
        </footer>
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <LocalizationProvider>
      <App />
    </LocalizationProvider>
  );
}