import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
import { useTranslation } from '../../hooks/useTranslation';
import { User, Role } from '../../types';
import Button from '../common/Button';

type AdminTab = 'moderators' | 'reports' | 'gallery' | 'settings' | 'bannedUsers';

const AdminPanel: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<AdminTab>(user?.role === Role.ADMIN ? 'moderators' : 'reports');
  const t = useTranslation();

  const renderContent = () => {
    switch (activeTab) {
      case 'moderators': return user?.role === Role.ADMIN ? <ModeratorManager /> : null;
      case 'reports': return <ReportManager />;
      case 'gallery': return user?.role === Role.ADMIN ? <GalleryManager /> : null;
      case 'settings': return user?.role === Role.ADMIN ? <AdminSettingsManager /> : null;
      case 'bannedUsers': return <BannedUserManager />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col" style={{minHeight: '400px'}}>
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {user?.role === Role.ADMIN && <TabButton id="moderators" activeTab={activeTab} setActiveTab={setActiveTab}>{t('manageModerators')}</TabButton>}
        <TabButton id="reports" activeTab={activeTab} setActiveTab={setActiveTab}>{t('reports')}</TabButton>
        <TabButton id="bannedUsers" activeTab={activeTab} setActiveTab={setActiveTab}>{t('bannedUsers')}</TabButton>
        {user?.role === Role.ADMIN && <TabButton id="gallery" activeTab={activeTab} setActiveTab={setActiveTab}>{t('gallery')}</TabButton>}
        {user?.role === Role.ADMIN && <TabButton id="settings" activeTab={activeTab} setActiveTab={setActiveTab}>{t('settings')}</TabButton>}
      </div>
      <div className="py-4 flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};

interface TabButtonProps {
    id: AdminTab;
    activeTab: AdminTab;
    setActiveTab: (id: AdminTab) => void;
    children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ id, activeTab, setActiveTab, children }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 -mb-px font-semibold border-b-2 transition-colors whitespace-nowrap ${
        activeTab === id
          ? 'text-blue-500 border-blue-500'
          : 'text-gray-500 border-transparent hover:text-blue-500 hover:border-blue-500'
      }`}
    >
      {children}
    </button>
)

const ModeratorManager: React.FC = () => {
    const { moderators, addModerator, removeModerator } = useContext(AuthContext);
    const t = useTranslation();

    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [color, setColor] = useState('#3b82f6');

    const handleAddModerator = (e: React.FormEvent) => {
        e.preventDefault();
        if (nickname.trim() && password.trim()) {
        const newMod: User = {
            id: `mod-${Date.now()}`,
            nickname: nickname.trim(),
            role: Role.MODERATOR,
            password: password.trim(),
            color,
            profilePicture: '', // Mods will select on login
        };
        addModerator(newMod);
        setNickname('');
        setPassword('');
        setColor('#3b82f6');
        }
    };

    return (
        <div className="space-y-6">
        <div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
            {moderators.map(mod => (
                <div key={mod.id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <div><span className="font-bold" style={{ color: mod.color }}>{mod.nickname}</span></div>
                <Button onClick={() => removeModerator(mod.id)} variant="danger" className="px-2 py-1 text-xs">{t('remove')}</Button>
                </div>
            ))}
            {moderators.length === 0 && <p className="text-gray-500 dark:text-gray-400">No moderators yet.</p>}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold mb-2">{t('addModerator')}</h3>
            <form onSubmit={handleAddModerator} className="space-y-3">
            <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder={t('moderatorName')} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t('moderatorPassword')} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
            <div className="flex items-center gap-3"><label htmlFor="modColor">{t('moderatorColor')}:</label><input type="color" id="modColor" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded-full" /></div>
            <div className="text-right"><Button type="submit">{t('addModerator')}</Button></div>
            </form>
        </div>
        </div>
    );
};

const ReportManager: React.FC = () => {
    const { reports, resolveReport } = useContext(ChatContext);
    const t = useTranslation();

    return (
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {reports.filter(r => r.status === 'pending').length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">{t('noReports')}</p>
            )}
            {reports.filter(r => r.status === 'pending').map(report => (
                <div key={report.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('reportedBy')}: <span className="font-semibold">{report.reportedBy.nickname}</span>
                    </p>
                    <div className="my-2 p-2 bg-white dark:bg-gray-800 rounded">
                        <p className="font-semibold">{report.message.user.nickname}:</p>
                        <p>{report.message.text}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => resolveReport(report.id, 'dismiss')} variant="secondary" className="text-xs px-2 py-1">{t('dismiss')}</Button>
                        <Button onClick={() => resolveReport(report.id, 'delete')} variant="danger" className="text-xs px-2 py-1">{t('deleteMessage')}</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

const GalleryManager: React.FC = () => {
    const { pictureGallery, addPictureToGallery, removePictureFromGallery } = useContext(AuthContext);
    const t = useTranslation();
    const [imageUrl, setImageUrl] = useState('');

    const handleAddImage = (e: React.FormEvent) => {
        e.preventDefault();
        if (imageUrl.trim()) {
            addPictureToGallery(imageUrl.trim());
            setImageUrl('');
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <form onSubmit={handleAddImage} className="flex gap-2">
                    <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder={t('imageUrl')} required className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" />
                    <Button type="submit">{t('add')}</Button>
                </form>
            </div>
            <div className="grid grid-cols-4 gap-4 max-h-72 overflow-y-auto">
                {pictureGallery.map(url => (
                    <div key={url} className="relative group">
                        <img src={url} alt="gallery avatar" className="w-full h-full object-cover rounded-lg aspect-square" />
                        <button onClick={() => removePictureFromGallery(url)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
                 {pictureGallery.length === 0 && <p className="col-span-4 text-gray-500 dark:text-gray-400">{t('noImages')}</p>}
            </div>
        </div>
    )
}

const AdminSettingsManager: React.FC = () => {
    const { updateAdminPassword } = useContext(AuthContext);
    const t = useTranslation();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword.length < 4) {
            setError(t('passwordTooShort'));
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(t('passwordsDoNotMatch'));
            return;
        }

        updateAdminPassword(newPassword);
        setSuccess(t('passwordChangedSuccessfully'));
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
         <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('changeAdminPassword')}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder={t('newPassword')} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" 
                />
                <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    placeholder={t('confirmNewPassword')} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700" 
                />
                <div className="text-right">
                    <Button type="submit">{t('submit')}</Button>
                </div>
            </form>
        </div>
    );
};

const BannedUserManager: React.FC = () => {
    const { bannedUsers, unbanUser } = useContext(AuthContext);
    const t = useTranslation();

    const getRemainingTime = (expiry: number) => {
        const remaining = expiry - Date.now();
        if (remaining <= 0) return 'Expired';
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m remaining`;
    };

    const bannedUsersList = Object.entries(bannedUsers);

    return (
        <div className="space-y-2 max-h-96 overflow-y-auto">
            {bannedUsersList.length === 0 && <p className="text-gray-500 dark:text-gray-400">{t('noBannedUsers')}</p>}
            {bannedUsersList.map(([nickname, expiry]) => (
                <div key={nickname} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <div>
                        <span className="font-bold">{nickname}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{getRemainingTime(expiry)}</p>
                    </div>
                    <Button onClick={() => unbanUser(nickname)} variant="secondary" className="px-2 py-1 text-xs">{t('unban')}</Button>
                </div>
            ))}
        </div>
    );
};

export default AdminPanel;