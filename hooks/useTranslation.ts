
import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { TRANSLATIONS } from '../constants';

export const useTranslation = () => {
  const { language } = useContext(SettingsContext);

  const t = (key: string): string => {
    if (!language) return key;
    return TRANSLATIONS[language][key] || key;
  };

  return t;
};
