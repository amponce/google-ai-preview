'use client';
import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';


export const MessageInput = ({ onSendMessage, isAiTyping }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isAiTyping) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white border-t border-gray-200">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow p-2 mr-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
      />
      <button
        type="submit"
        disabled={isAiTyping}
        className={`p-2 rounded-lg ${
          isAiTyping ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        } text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        {isAiTyping ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
      </button>
    </form>
  );
};
