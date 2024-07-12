"use client";

import { useEffect, useRef } from 'react';


const ChatMessage = ({ message }) => (
  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-[70%] p-3 rounded-lg ${
      message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
    }`}>
      {message.content}
    </div>
  </div>
);

export const ChatArea = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto px-4 py-6 mt-8">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};