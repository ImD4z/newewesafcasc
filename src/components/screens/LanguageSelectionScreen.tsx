
import React, { useContext } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Language } from '../../types';
import Button from '../common/Button';

const LanguageSelectionScreen: React.FC = () => {
  const { setLanguage } = useContext(SettingsContext);
  const t = useTranslation();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-4 text-blue-500 dark:text-blue-400">ChatZone</h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">{t('selectLanguage')}</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse">
          <Button onClick={() => handleSelect('ar')}>العربية 🇸🇦</Button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;