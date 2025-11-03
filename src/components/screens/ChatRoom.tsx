
import React from 'react';
import ChatHeader from '../chat/ChatHeader';
import MessageList from '../chat/MessageList';
import MessageInput from '../chat/MessageInput';

const ChatRoom: React.FC = () => {
  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-2xl">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatRoom;