import React, { useContext, useState } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Role, User } from '../../types';
import { ROLES } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../common/Button';
import Modal from '../common/Modal';

interface UserListProps {
  onCloseModal: () => void;
}

const UserList: React.FC<UserListProps> = ({ onCloseModal }) => {
  const { users, kickUser, startPrivateChat } = useContext(ChatContext);
  const { user: currentUser, banUser } = useContext(AuthContext);
  const t = useTranslation();
  
  const [userToBan, setUserToBan] = useState<User | null>(null);

  const canModerate = currentUser?.role === Role.ADMIN || currentUser?.role === Role.MODERATOR;

  const handleStartChat = (user: any) => {
    startPrivateChat(user);
    onCloseModal();
  };

  const handleBan = (durationMinutes: number) => {
    if (userToBan) {
      banUser(userToBan.nickname, durationMinutes);
      kickUser(userToBan.id);
      setUserToBan(null);
    }
  };

  const BanDurations = [
    { label: t('15m'), minutes: 15 },
    { label: t('30m'), minutes: 30 },
    { label: t('12h'), minutes: 12 * 60 },
  ];

  return (
    <>
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {users.map(user => (
        <div key={user.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <button onClick={() => handleStartChat(user)} disabled={currentUser?.id === user.id} className="text-left disabled:cursor-not-allowed">
            <span 
              className={`font-bold ${user.role !== Role.MODERATOR ? `${ROLES[user.role].color} ${ROLES[user.role].darkColor}` : ''}`}
              style={user.role === Role.MODERATOR ? { color: user.color } : {}}
            >
              {user.nickname}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ltr:ml-2 rtl:mr-2">
              ({ROLES[user.role].name})
            </span>
          </button>
          {canModerate && currentUser.id !== user.id && user.role !== Role.ADMIN && user.id !== 'bot-user' && (
            <div className="flex space-x-1 rtl:space-x-reverse">
              <Button onClick={() => kickUser(user.id)} variant="secondary" className="px-2 py-1 text-xs">{t('kick')}</Button>
              <Button onClick={() => setUserToBan(user)} variant="danger" className="px-2 py-1 text-xs">{t('ban')}</Button>
            </div>
          )}
        </div>
      ))}
    </div>
    <Modal isOpen={!!userToBan} onClose={() => setUserToBan(null)} title={`${t('banUser')}: ${userToBan?.nickname}`}>
      <div className="flex flex-col space-y-3">
        <p>{t('banDuration')}:</p>
        <div className="flex justify-around">
          {BanDurations.map(duration => (
            <Button key={duration.minutes} onClick={() => handleBan(duration.minutes)}>
              {duration.label}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
    </>
  );
};

export default UserList;