import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../common/Button';
import ProfilePicturePicker from './ProfilePicturePicker';
import Modal from '../common/Modal';

const LoginScreen: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const { login, loginAsAdmin } = useContext(AuthContext);
  const t = useTranslation();
  
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');


  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      setStep(2);
    }
  };
  
  const handlePictureSelect = (picture: string) => {
    const result = login(nickname.trim(), picture, password);
    if (!result.success) {
        if (result.reason === 'banned' && result.expiry) {
            const expiryDate = new Date(result.expiry).toLocaleString();
            setError(`${t('youAreBanned')} ${t('bannedUntil')} ${expiryDate}.`);
        } else {
            setError(t('incorrectPassword'));
        }
        setStep(1); // Go back to nickname step on error
    }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsAdmin(adminPassword)) {
      setIsAdminLoginOpen(false);
      setAdminPassword('');
      setAdminLoginError('');
      // Successful login will trigger rerender via context
    } else {
      setAdminLoginError(t('incorrectAdminPassword'));
    }
  };

  const closeAdminModal = () => {
    setIsAdminLoginOpen(false);
    setAdminPassword('');
    setAdminLoginError('');
  }
  
  if (step === 2) {
      return <ProfilePicturePicker onSelect={handlePictureSelect} onBack={() => setStep(1)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
      <div className="w-full max-w-md text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-blue-500 dark:text-blue-400">{t('welcome')}</h1>
        <p className="text-md mb-6 text-gray-600 dark:text-gray-300">{t('enterNickname')}</p>
        <form onSubmit={handleNicknameSubmit}>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <input
            type="text"
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setError('') }}
            placeholder={t('nickname')}
            required
            className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={`${t('password')} (for moderators)`}
            className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" className="w-full">
            {t('continue')}
          </Button>
        </form>
        <div className="mt-4 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2 rtl:sm:space-x-reverse">
            <Button onClick={() => setIsAdminLoginOpen(true)} variant="secondary" className="w-full sm:w-auto">{t('adminLogin')}</Button>
        </div>
      </div>

      <Modal isOpen={isAdminLoginOpen} onClose={closeAdminModal} title={t('adminLogin')}>
        <form onSubmit={handleAdminLogin}>
          {adminLoginError && <p className="text-red-500 text-sm mb-2">{adminLoginError}</p>}
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => { setAdminPassword(e.target.value); setAdminLoginError(''); }}
            placeholder={t('adminPassword')}
            required
            className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end space-x-2 rtl:space-x-reverse">
            <Button type="button" variant="secondary" onClick={closeAdminModal}>{t('cancel')}</Button>
            <Button type="submit">{t('submit')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoginScreen;