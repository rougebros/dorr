import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context for localization
const LocalizationContext = createContext();

// Language data structure
const languageFiles = {
  en: require('../../files/locales/en.json'), // English
  fa: require('../../files/locales/fa.json'), // Persian
  uk: require('../../files/locales/uk.json'), // Ukrainian
  ru: require('../../files/locales/ru.json'), // Russian
  ja: require('../../files/locales/ja.json'), // Japanese
  zh: require('../../files/locales/zh.json'), // Chinese
  sw: require('../../files/locales/sw.json'), // Swahili
  tr: require('../../files/locales/tr.json'), // Turkish
  he: require('../../files/locales/he.json'), // Hebrew
  ar: require('../../files/locales/ar.json'), // Arabic
  fr: require('../../files/locales/fr.json'), // French
  es: require('../../files/locales/es.json'), // Spanish
  pt: require('../../files/locales/pt.json'), // Portuguese
  id: require('../../files/locales/id.json'), // Indonesian
  vi: require('../../files/locales/vi.json'), // Vietnamese
  it: require('../../files/locales/it.json'), // Italian
  th: require('../../files/locales/th.json'), // Thai
  nl: require('../../files/locales/nl.json'), // Dutch
  tl: require('../../files/locales/tl.json'), // Filipino
  de: require('../../files/locales/de.json'), // German
  ko: require('../../files/locales/ko.json'), // Korean
  bn: require('../../files/locales/bn.json'), // Bengali
};


export const LocalizationProvider = ({ children }) => {
  const [translations, setTranslations] = useState({});
  const [language, setLanguage] = useState('en'); // Default to English

  // Function to load translations based on the selected language
  const loadTranslations = (lang) => {
    const langFile = languageFiles[lang] || languageFiles['en']; // Fallback to English if language not found
    setTranslations(langFile);
    setLanguage(lang);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('language') || 'en'; // Default to English if language is not provided
    loadTranslations(lang);
  }, []);

  // Function to get translation by ID
  const translate = (id, defaultText) => {
    return translations[id] || defaultText; // Return the default text if translation not found
  };

  return (
    <LocalizationContext.Provider value={{ translate, language }}>
      {children}
    </LocalizationContext.Provider>
  );
};

// Custom hook to use localization
export const useLocalization = () => {
  return useContext(LocalizationContext);
};

// Export the LocalizationContext and useLocalization
export const LocalizationConsumer = LocalizationContext.Consumer;