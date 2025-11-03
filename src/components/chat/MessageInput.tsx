import React, { useState, useContext, useRef } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { useTranslation } from '../../hooks/useTranslation';
import EmojiPicker from './EmojiPicker';
import { useClickAway } from '../../hooks/useClickAway';

const MessageInput: React.FC = () => {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const { sendMessage } = useContext(ChatContext);
  const t = useTranslation();
  
  const emojiPickerRef = useRef(null);
  useClickAway(emojiPickerRef, () => setShowEmojis(false));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(text.trim());
      setText('');
      setShowEmojis(false);
    }
  };

  const onEmojiSelect = (emoji: string) => {
    setText(prev => prev + emoji);
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="relative" ref={emojiPickerRef}>
        {showEmojis && <EmojiPicker onEmojiSelect={onEmojiSelect} />}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="relative flex-1">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('sendMessage')}
                  className="w-full px-12 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                 <button 
                    type="button" 
                    onClick={() => setShowEmojis(!showEmojis)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Toggle emoji picker"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
            </div>
          <button type="submit" className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-transform transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90 rtl:-rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;