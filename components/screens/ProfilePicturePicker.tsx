import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import Button from '../common/Button';

interface ProfilePicturePickerProps {
    onSelect: (picture: string) => void;
    onBack: () => void;
}

const ProfilePicturePicker: React.FC<ProfilePicturePickerProps> = ({ onSelect, onBack }) => {
    const { pictureGallery } = useContext(AuthContext);
    const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
    const t = useTranslation();

    const handleSelect = () => {
        if(selectedPicture) {
            onSelect(selectedPicture);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
            <div className="w-full max-w-lg text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
                <h1 className="text-2xl font-bold mb-6">{t('selectAvatar')}</h1>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mb-6 max-h-80 overflow-y-auto p-2">
                    {pictureGallery.map((pic, index) => (
                        <button 
                            key={index} 
                            onClick={() => setSelectedPicture(pic)}
                            className={`rounded-full aspect-square overflow-hidden border-4 transition-all ${selectedPicture === pic ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                        >
                            <img src={pic} alt={`avatar ${index+1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
                <div className="flex justify-between items-center">
                    <Button onClick={onBack} variant="secondary">{t('back')}</Button>
                    <Button onClick={handleSelect} disabled={!selectedPicture}>{t('join')}</Button>
                </div>
            </div>
        </div>
    )
}

export default ProfilePicturePicker;