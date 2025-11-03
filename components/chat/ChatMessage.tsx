import React, { useContext } from 'react';
import { Message, Role } from '../../types';
import { ROLES } from '../../constants';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
import { useTranslation } from '../../hooks/useTranslation';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user: currentUser } = useContext(AuthContext);
  const { deleteMessage, reportMessage, currentRoom } = useContext(ChatContext);
  const t = useTranslation();
  const { user, text, timestamp, id } = message;
  
  const roleInfo = ROLES[user.role];
  const isCurrentUser = currentUser?.id === user.id;
  const canDelete = currentUser?.role === Role.ADMIN || currentUser?.role === Role.MODERATOR;
  
  const alignment = isCurrentUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isCurrentUser 
    ? 'bg-blue-500 text-white' 
    : user.role === Role.ADMIN 
      ? 'bg-amber-400 text-black' 
      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200';
  
  const moderatorNameStyle = user.role === Role.MODERATOR && user.color ? { color: user.color } : {};
  const nameColorClass = user.role !== Role.MODERATOR ? `${roleInfo.color} ${roleInfo.darkColor}` : '';

  const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const ActionButtons = () => (
    <div className={`flex items-center opacity-0 group-hover:opacity-100 transition-opacity self-center mx-1 space-x-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
      {!isCurrentUser && user.id !== 'bot-user' && (
         <button
            onClick={() => reportMessage(message)}
            className="text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-500"
            title={t('report')}
            aria-label={t('report')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 01-1-1V6z" clipRule="evenodd" /></svg>
        </button>
      )}
      {canDelete && (
         <button
            onClick={() => currentRoom && deleteMessage(currentRoom.id, id)}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-500"
            title={t('delete')}
            aria-label={t('delete')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
        </button>
      )}
    </div>
  );

  return (
    <div className={`group flex items-end gap-2 ${alignment} animate-fade-in`}>
      {isCurrentUser && <ActionButtons />}

      {!isCurrentUser && (
        <img src={user.profilePicture} alt={user.nickname} className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 object-cover" />
      )}
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2">
            {!isCurrentUser && <span className={`text-sm font-bold ${nameColorClass}`} style={moderatorNameStyle}>{user.nickname}</span>}
        </div>
        <div className={`px-4 py-2 rounded-xl max-w-xs md:max-w-md ${bubbleColor}`}>
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{time}</span>
      </div>

      {!isCurrentUser && <ActionButtons />}
    </div>
  );
};

export default ChatMessage;