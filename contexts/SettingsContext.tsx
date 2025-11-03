
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Language, Theme } from '../types';

interface SettingsContextProps {
  language: Language | null;
  theme: Theme;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
}

export const SettingsContext = createContext<SettingsContextProps>({} as SettingsContextProps);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language | null>('ar');
  
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('chatzone-theme') as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('chatzone-theme', theme);
  }, [theme]);

  const setLanguage = (lang: Language) => {
    // No-op. Language is always Arabic.
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <SettingsContext.Provider value={{ language, theme, setLanguage, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};
