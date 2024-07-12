"use client"
import React, { useState } from 'react';
import { Settings, MessageSquare, Moon, Sun } from 'lucide-react';

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

const Sidebar = ({ onConfigChange, config }) => {
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
        <div className="flex-grow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Chat History</h2>
          <p className="text-gray-600 dark:text-gray-400">No recent chats</p>
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
        </div>
      )}
    </aside>
  );
};

export default Sidebar;