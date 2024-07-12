"use client"
import React, { useState } from 'react';
import { Settings, MessageSquare, Moon, Sun, Plus, Trash2 } from 'lucide-react';

const ConfigOption = ({ label, value, onChange, options }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const SliderOption = ({ label, value, onChange, min, max, step }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}: {value}
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full"
    />
  </div>
);

const ToggleOption = ({ label, value, onChange, icon: Icon }) => (
  <div className="mb-4 flex items-center justify-between">
    <div className="flex items-center">
      <Icon size={20} className="mr-2 text-gray-600 dark:text-gray-400" />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 ${
        value ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        } rounded-full bg-white shadow-lg`}
      />
    </button>
  </div>
);

const Sidebar = ({ onConfigChange, config, threads, onSelectThread, onDeleteThread, onNewChat, onClearChats }) => {
    const [activeTab, setActiveTab] = useState('chat');
  
    const handleConfigChange = (key, value) => {
      onConfigChange({ [key]: value });
    };
  
    return (
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-5 flex flex-col h-full">
        <nav className="mb-6">
          <ul className="flex space-x-4">
            <li>
              <button
                onClick={() => setActiveTab('chat')}
                className={`p-2 rounded-md ${
                  activeTab === 'chat' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <MessageSquare size={20} />
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('config')}
                className={`p-2 rounded-md ${
                  activeTab === 'config' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Settings size={20} />
              </button>
            </li>
          </ul>
        </nav>
  
        {activeTab === 'chat' && (
          <div className="flex-grow overflow-y-auto">
            <button 
              onClick={onNewChat}
              className="w-full mb-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Plus size={16} className="mr-2" />
              New Chat
            </button>
            {threads.map((thread) => (
              <div 
                key={thread.id} 
                className="flex items-center justify-between p-2 mb-2 bg-white dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={() => onSelectThread(thread.id)}
              >
                <span className="truncate flex-grow text-black">{thread.name}</span>
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
        )}
  
        {activeTab === 'config' && (
          <div className="flex-grow">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Chatbot Configuration</h2>
            <SliderOption
              label="Temperature"
              value={config.temperature}
              onChange={(value) => handleConfigChange('temperature', value)}
              min={0}
              max={1}
              step={0.1}
            />
            <ConfigOption
              label="Top-k"
              value={config.topK.toString()}
              onChange={(value) => handleConfigChange('topK', parseInt(value))}
              options={[
                { value: '5', label: '5 (Focused)' },
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: '40', label: '40 (Diverse)' },
              ]}
            />
            <ToggleOption
              label="Store Chats Locally"
              value={config.storeChats}
              onChange={(value) => handleConfigChange('storeChats', value)}
              icon={MessageSquare}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleConfigChange('theme', 'light')}
                  className={`p-2 rounded-md ${
                    config.theme === 'light' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Sun size={20} />
                </button>
                <button
                  onClick={() => handleConfigChange('theme', 'dark')}
                  className={`p-2 rounded-md ${
                    config.theme === 'dark' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Moon size={20} />
                </button>
              </div>
            </div>
            <button
              onClick={onClearChats}
              className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <Trash2 size={16} className="mr-2" />
              Clear All Chats
            </button>
          </div>
        )}
      </aside>
    );
  };

export default Sidebar;