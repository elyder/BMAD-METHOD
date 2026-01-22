
import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../../translations.json';
import no from '../../no.json';

const translations = { en, no };

type Language = 'en' | 'no';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, options?: { [key: string]: string | number }) => string;
};


type TranslationKey = keyof typeof en;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('no');

  const t = (key: TranslationKey, options?: { [key: string]: string | number }) => {
    const translationSet = translations[language] || translations.en;
    let translation = translationSet[key] || key;

    if (options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};


export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
