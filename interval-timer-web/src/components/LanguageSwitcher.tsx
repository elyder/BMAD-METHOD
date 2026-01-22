
'use client';

import { useLanguage } from './LanguageProvider';
import { NorwegianFlagIcon } from './icons/NorwegianFlagIcon';
import { UKFlagIcon } from './icons/UKFlagIcon';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: 'en' | 'no') => {
    setLanguage(lang);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handleLanguageChange('no')} className={`p-2 rounded-lg ${language === 'no' ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`} title="Norwegian language">
        <NorwegianFlagIcon className="w-8 h-auto" />
      </button>
      <button onClick={() => handleLanguageChange('en')} className={`p-2 rounded-lg ${language === 'en' ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`} title="English language">
        <UKFlagIcon className="w-8 h-auto" />
      </button>
    </div>
  );
};
