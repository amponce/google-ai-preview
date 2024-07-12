"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import { openDB } from 'idb';

export default function RootLayout({ children }) {
  const [config, setConfig] = useState({
    temperature: 0.7,
    topK: '20',
    theme: 'light',
    storeChats: true
  });
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [db, setDb] = useState(null);

  const chatInterfaceRef = useRef(null);

  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    try {
      const database = await openDB('ChatDB', 2, {
        upgrade(db, oldVersion, newVersion, transaction) {
          console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
          if (!db.objectStoreNames.contains('threads')) {
            console.log('Creating threads object store');
            db.createObjectStore('threads', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('messages')) {
            console.log('Creating messages object store');
            const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
            messageStore.createIndex('threadId', 'threadId', { unique: false });
          }
        },
      });
      console.log('Database initialized:', database);
      setDb(database);
      const loadedThreads = await loadThreads(database);
      
      const lastThreadId = localStorage.getItem('lastActiveThreadId');
      if (lastThreadId && loadedThreads.some(thread => thread.id === lastThreadId)) {
        setCurrentThreadId(lastThreadId);
      } else {
        // If no valid last active thread, create a new one
        const newThreadId = await handleNewChat(database);
        setCurrentThreadId(newThreadId);
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  };

  const loadThreads = async (database) => {
    try {
      const tx = database.transaction('threads', 'readonly');
      const store = tx.objectStore('threads');
      const threads = await store.getAll();
      console.log('Loaded threads:', threads);
      setThreads(threads);
      return threads;
    } catch (error) {
      console.error('Failed to load threads:', error);
      return [];
    }
  };

  const handleConfigChange = (newConfig) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  };

  const handleClearChats = useCallback(async () => {
    if (chatInterfaceRef.current) {
      await chatInterfaceRef.current.clearChats();
    }
    setThreads([]);
    setCurrentThreadId(null);
    localStorage.removeItem('lastActiveThreadId');

    if (db) {
      try {
        const tx = db.transaction(['threads', 'messages'], 'readwrite');
        await tx.objectStore('threads').clear();
        await tx.objectStore('messages').clear();
      } catch (error) {
        console.error('Failed to clear database:', error);
      }
    }
    
    // Create a new chat after clearing
    await handleNewChat();
  }, [db]);

  const handleNewChat = useCallback(async (database = null) => {
    const newThreadId = Date.now().toString();
    const newThread = {
      id: newThreadId,
      name: "New Chat",
      createdAt: new Date().toISOString(),
    };
    setThreads(prev => [...prev, newThread]);
    setCurrentThreadId(newThreadId);
    localStorage.setItem('lastActiveThreadId', newThreadId);

    const dbToUse = database || db;
    if (dbToUse) {
      try {
        const tx = dbToUse.transaction('threads', 'readwrite');
        const store = tx.objectStore('threads');
        await store.add(newThread);
      } catch (error) {
        console.error('Failed to add new thread:', error);
      }
    } else {
      console.warn('No database available to store new thread');
    }
    return newThreadId;
  }, [db]);

  const handleSelectThread = useCallback((threadId) => {
    setCurrentThreadId(threadId);
    localStorage.setItem('lastActiveThreadId', threadId);
  }, []);

  const handleDeleteThread = useCallback(async (threadId) => {
    setThreads(prev => prev.filter(thread => thread.id !== threadId));
    if (currentThreadId === threadId) {
      const remainingThreads = threads.filter(thread => thread.id !== threadId);
      if (remainingThreads.length > 0) {
        const newCurrentThread = remainingThreads[remainingThreads.length - 1];
        setCurrentThreadId(newCurrentThread.id);
        localStorage.setItem('lastActiveThreadId', newCurrentThread.id);
      } else {
        // If no threads left, create a new one
        await handleNewChat();
      }
    }

    if (db) {
      try {
        const tx = db.transaction(['threads', 'messages'], 'readwrite');
        await tx.objectStore('threads').delete(threadId);
        const msgStore = tx.objectStore('messages');
        const threadMessages = await msgStore.index('threadId').getAllKeys(threadId);
        await Promise.all(threadMessages.map(key => msgStore.delete(key)));
      } catch (error) {
        console.error('Failed to delete thread:', error);
      }
    }
  }, [currentThreadId, db, threads, handleNewChat]);

  const handleUpdateThreadName = useCallback(async (threadId, newName) => {
    setThreads(prev => prev.map(thread => 
      thread.id === threadId ? { ...thread, name: newName } : thread
    ));

    if (db) {
      try {
        const tx = db.transaction('threads', 'readwrite');
        const store = tx.objectStore('threads');
        const thread = await store.get(threadId);
        if (thread) {
          thread.name = newName;
          await store.put(thread);
        }
      } catch (error) {
        console.error('Failed to update thread name:', error);
      }
    }
  }, [db]);

  return (
    <html lang="en">
      <body className={`${config.theme === 'dark' ? 'dark' : ''}`}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar 
            onConfigChange={handleConfigChange} 
            config={config} 
            threads={threads}
            currentThreadId={currentThreadId}
            onSelectThread={handleSelectThread}
            onDeleteThread={handleDeleteThread}
            onNewChat={() => handleNewChat()}
            onClearChats={handleClearChats}
          />
          <main className="flex-grow">
            {db && currentThreadId && (
              <ChatInterface 
                ref={chatInterfaceRef} 
                config={config} 
                currentThreadId={currentThreadId}
                onUpdateThreadName={handleUpdateThreadName}
                onNewChat={() => handleNewChat()}
                db={db}
              />
            )}
          </main>
        </div>
      </body>
    </html>
  );
}