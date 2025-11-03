import React, { useContext, useState } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Room, Role } from '../../types';
import Button from '../common/Button';
import Modal from '../common/Modal';
import AdminPanel from '../admin/AdminPanel';
import { ROOM_COLORS } from '../../constants';
import ColorWheelPicker from '../common/ColorWheelPicker';

const RoomList: React.FC = () => {
  const { rooms, joinRoom, createRoom } = useContext(ChatContext);
  const { user, logout } = useContext(AuthContext);
  const t = useTranslation();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [newRoomColor, setNewRoomColor] = useState(ROOM_COLORS[0]);
  
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const publicRooms = rooms.filter(r => !r.isPrivateChat);
  const privateChats = rooms.filter(r => r.isPrivateChat);


  const handleJoin = (room: Room) => {
    if (room.isPrivate && user?.role !== Role.ADMIN) {
      setSelectedRoom(room);
    } else {
      if (!joinRoom(room)) {
        setError(t('roomIsFull'));
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoom && joinRoom(selectedRoom, password)) {
      closePasswordModal();
    } else {
      setError(t('incorrectPassword'));
    }
  };

  const closePasswordModal = () => {
    setSelectedRoom(null);
    setPassword('');
    setError('');
  };

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
        if (isPrivate && !newRoomPassword.trim()) {
            return; 
        }
        createRoom(newRoomName, isPrivate, newRoomPassword, newRoomColor);
        closeCreateModal();
    }
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewRoomName('');
    setIsPrivate(false);
    setNewRoomPassword('');
    setNewRoomColor(ROOM_COLORS[0]);
  }

  const isModerator = user?.role === Role.ADMIN || user?.role === Role.MODERATOR;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-blue-500 dark:text-blue-400">{t('rooms')}</h1>
                    {user?.role === Role.ADMIN && (
                      <Button onClick={() => setIsCreateModalOpen(true)}>{t('createRoom')}</Button>
                    )}
                     {isModerator && (
                        <Button onClick={() => setIsAdminPanelOpen(true)} variant="secondary">
                            {user?.role === Role.ADMIN ? t('adminPanel') : t('moderationPanel')}
                        </Button>
                     )}
                </div>
                <div className="flex items-center gap-2">
                    <p className="font-semibold">{user?.nickname}</p>
                    <img src={user?.profilePicture} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    <button onClick={logout} title={t('logout')} className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {publicRooms.map(room => (
                    <div key={room.id} className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                           <div className="w-3 h-8 rounded" style={{ backgroundColor: room.color }}></div>
                           <div>
                                <h2 className="text-lg font-semibold">{room.name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{room.isPrivate ? 'Private' : 'Public'}</p>
                           </div>
                        </div>
                        <Button onClick={() => handleJoin(room)}>
                          {room.isPrivate ? '🔒 ' : ''}{t('joinRoom')}
                        </Button>
                    </div>
                ))}
            </div>

            {privateChats.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-500 dark:text-blue-400">{t('directMessages')}</h2>
                     <div className="space-y-4">
                        {privateChats.map(room => (
                            <div key={room.id} className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <div><h2 className="text-lg font-semibold">{room.name}</h2></div>
                                <Button onClick={() => handleJoin(room)}>{t('joinRoom')}</Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        <Modal isOpen={!!selectedRoom} onClose={closePasswordModal} title={`${t('enterPassword')} ${selectedRoom?.name}`}>
            <form onSubmit={handlePasswordSubmit}>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password')}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button type="button" variant="secondary" onClick={closePasswordModal}>{t('cancel')}</Button>
                    <Button type="submit">{t('submit')}</Button>
                </div>
            </form>
        </Modal>

        <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal} title={t('newRoom')}>
            <form onSubmit={handleCreateRoomSubmit} className="space-y-4">
                <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder={t('roomName')}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                 <div className="flex flex-col items-center gap-4">
                    <label>{t('roomColor')}:</label>
                    <ColorWheelPicker
                      colors={ROOM_COLORS}
                      selectedColor={newRoomColor}
                      onColorSelect={setNewRoomColor}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isPrivateCheckbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isPrivateCheckbox">{t('privateRoom')}</label>
                </div>
                {isPrivate && (
                    <input
                        type="password"
                        value={newRoomPassword}
                        onChange={(e) => setNewRoomPassword(e.target.value)}
                        placeholder={t('password')}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}
                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button type="button" variant="secondary" onClick={closeCreateModal}>{t('cancel')}</Button>
                    <Button type="submit">{t('create')}</Button>
                </div>
            </form>
        </Modal>

        <Modal isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} title={user?.role === Role.ADMIN ? t('adminPanel') : t('moderationPanel')}>
            <AdminPanel />
        </Modal>
    </div>
  );
};

export default RoomList;