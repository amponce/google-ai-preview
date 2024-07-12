import React from 'react';
import { Trash2 } from 'lucide-react';

const ChatThreads = ({ threads, onSelectThread, onDeleteThread, onNewChat }) => {
  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
      <button 
        onClick={onNewChat}
        className="w-full mb-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        New Chat
      </button>
      {threads.map((thread) => (
        <div 
          key={thread.id} 
          className="flex items-center justify-between p-2 mb-2 bg-white dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
          onClick={() => onSelectThread(thread.id)}
        >
          <span className="truncate flex-grow">{thread.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteThread(thread.id);
            }}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChatThreads;