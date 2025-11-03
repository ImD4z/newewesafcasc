import React from 'react';

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

const EMOJIS = [
    '😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '🚀', '🎉', '👋', '🙏', '👀', '😎', '😢', '🤯'
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
    return (
        <div className="absolute bottom-full mb-2 w-full max-w-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 animate-fade-in">
            <div className="grid grid-cols-4 gap-2">
                {EMOJIS.map(emoji => (
                    <button
                        key={emoji}
                        onClick={() => onEmojiSelect(emoji)}
                        className="text-2xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label={`Select emoji ${emoji}`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmojiPicker;