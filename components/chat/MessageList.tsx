
import React, { useContext, useEffect, useRef } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import ChatMessage from './ChatMessage';

const MessageList: React.FC = () => {
  const { messages } = useContext(ChatContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
