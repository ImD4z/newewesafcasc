
import React, { useContext, useEffect } from 'react';
import { SettingsContext } from './contexts/SettingsContext';
import { AuthContext } from './contexts/AuthContext';
import { ChatContext } from './contexts/ChatContext';
import LanguageSelectionScreen from './components/screens/LanguageSelectionScreen';
import LoginScreen from './components/screens/LoginScreen';
import RoomList from './components/screens/RoomList';
import ChatRoom from './components/screens/ChatRoom';

const App: React.FC = () => {
  const { language, theme } = useContext(SettingsContext);
  const { user } = useContext(AuthContext);
  const { currentRoom } = useContext(ChatContext);

  useEffect(() => {
    const html = document.documentElement;
    if (language) {
      html.lang = language;
    }
    html.dir = 'rtl';
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [language, theme]);

  const renderContent = () => {
    if (!language) {
      return <LanguageSelectionScreen />;
    }
    if (!user) {
      return <LoginScreen />;
    }
    if (!currentRoom) {
      return <RoomList />;
    }
    return <ChatRoom />;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
