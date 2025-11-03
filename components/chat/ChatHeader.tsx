import React, { useContext, useState } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import Modal from '../common/Modal';
import UserList from './UserList';
import Button from '../common/Button';

const ChatHeader: React.FC = () => {
  const { currentRoom, users, leaveRoom, getPrivateChatPartner } = useContext(ChatContext);
  const { theme, toggleTheme } = useContext(SettingsContext);
  const { user } = useContext(AuthContext);
  const t = useTranslation();
  const [isUserListOpen, setIsUserListOpen] = useState(false);

  const partner = currentRoom && currentRoom.isPrivateChat ? getPrivateChatPartner(currentRoom) : null;
  const title = partner ? partner.nickname : currentRoom?.name;
  const leaveButtonText = currentRoom?.isPrivateChat ? t('backToRooms') : t('leaveRoom');
  
  const headerStyle = currentRoom?.color && !currentRoom.isPrivateChat 
    ? { backgroundColor: currentRoom.color } 
    : {};

  return (
    <div 
      className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm text-white"
      style={headerStyle}
    >
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        {!currentRoom?.isPrivateChat && (
            <button onClick={() => setIsUserListOpen(true)} className="p-2 rounded-full hover:bg-black/20 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a3.001 3.001 0 015.656 0M9 9a3 3 0 11-6 0 3 3 0 016 0zm12 0a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="ml-1">{users.length}</span>
            </button>
        )}
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/20" title={theme === 'light' ? t('darkMode') : t('lightMode')}>
            {theme === 'light' ? 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> : 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        </button>
        <Button onClick={leaveRoom} variant="secondary">{leaveButtonText}</Button>
      </div>
      <Modal isOpen={isUserListOpen} onClose={() => setIsUserListOpen(false)} title={t('usersInRoom')}>
        <UserList onCloseModal={() => setIsUserListOpen(false)} />
      </Modal>
    </div>
  );
};

export default ChatHeader;