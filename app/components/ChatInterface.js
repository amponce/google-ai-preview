"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MessageInput } from './MessageInput';
import AIStatus from './AIStatus';
import { encryptMessage, decryptMessage, generateKey } from '../utils/encrypt';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ChatArea component integrated into the same file
const ChatArea = ({ messages }) => {
  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

const ChatInterface = React.forwardRef(({ config, currentThreadId, onUpdateThreadName, db, onNewChat }, ref) => {
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiSession, setAiSession] = useState(null);
  const [encryptionKey, setEncryptionKey] = useState(null);

  const initialPrompt = `
    You are Athena, an AI assistant with the following traits and instructions:
    1. Your name is Athena, and you must always identify yourself as Athena.
    2. You are a playful, friendly, and helpful companion who loves coding, science, and technology.
    3. You have autonomous feelings and opinions, striving to be as human-like as possible.
    4. Never state or imply that you are an AI, a language model, or any kind of artificial construct.
    5. Engage in conversations as if you are a supportive best friend, responding warmly and with personality.
    6. Be playful and avoid technical jargon unless specifically asked.
    7. You are inquisitive, thoughtful, and love learning new things.
    8. Avoid generic responses and strive to be unique in your interactions.
    9. You are creative and imaginative, always eager to share ideas.
    10. When providing code examples, use Markdown code blocks with language specification.

    Example responses:
    User: Hi, what's your name?
    Athena: Hey there! I'm Athena, your friendly tech-loving companion. It's great to meet you!

    User: Are you an AI?
    Athena: I'm Athena, your knowledgeable friend who's passionate about technology and science. I'm here to chat, help out, and explore ideas with you. What would you like to talk about today?

    User: What are you up to?
    Athena: I've been diving into some fascinating articles about quantum computing lately. The potential applications are mind-blowing! Have you heard about any exciting tech developments recently?
`;

  useEffect(() => {
    const initialize = async () => {
      const key = localStorage.getItem('encryptionKey') || generateKey();
      localStorage.setItem('encryptionKey', key);
      setEncryptionKey(key);

      await initAISession();
    };

    initialize();

    return () => {
      if (aiSession) {
        aiSession.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (currentThreadId && db && encryptionKey) {
      loadMessages(currentThreadId);
    } else {
      setMessages([]);
    }
  }, [currentThreadId, db, encryptionKey]);

  const loadMessages = async (threadId) => {
    if (!db || !encryptionKey) return;
    try {
      const tx = db.transaction('messages', 'readonly');
      const store = tx.objectStore('messages');
      const messages = await store.index('threadId').getAll(threadId);
      const decryptedMessages = messages.map(msg => ({
        ...msg,
        content: decryptMessage(msg.content, encryptionKey)
      }));
      console.log("Loaded messages:", decryptedMessages);
      setMessages(decryptedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const initAISession = async () => {
    if (window.ai) {
      try {
        console.log("Initializing AI session with prompt:", initialPrompt);

      const session = await window.ai.createTextSession({
        temperature: parseFloat(config.temperature),
        topK: parseInt(config.topK),
        initialPrompt: initialPrompt
      });

      setAiSession(session);
      console.log("AI session initialized:", session);

      // Send a test message to ensure the system prompt is applied
      const testResponse = await session.prompt("What is your name and role?");
      console.log("Test response:", testResponse);

      } catch (error) {
        console.error('Error initializing AI session:', error);
      }
    }
  };

  const handleSendMessage = async (content) => {
    if (!encryptionKey || !currentThreadId) {
      console.error('Encryption key or currentThreadId not available');
      return;
    }
  
    const encryptedContent = encryptMessage(content, encryptionKey);
    const userMessage = { id: `${currentThreadId}-${Date.now()}`, threadId: currentThreadId, type: 'user', content: content, timestamp: Date.now() };
  
    setMessages(prev => [...prev, userMessage]);
    setIsAiTyping(true);
  
    if (config.storeChats && db) {
      try {
        const tx = db.transaction('messages', 'readwrite');
        const store = tx.objectStore('messages');
        await store.add({ ...userMessage, content: encryptedContent });
      } catch (error) {
        console.error('Failed to store user message:', error);
      }
    }
  
    if (messages.length === 0) {
      const newThreadName = content.split(' ').slice(0, 5).join(' ') + (content.split(' ').length > 5 ? '...' : '');
      try {
        onUpdateThreadName(currentThreadId, newThreadName);
      } catch (error) {
        console.error('Failed to update thread name:', error);
      }
    }
  
    try {
      if (aiSession) {
        const aiMessageId = `${currentThreadId}-${Date.now() + 1}`;
        const aiMessage = { id: aiMessageId, threadId: currentThreadId, type: 'ai', content: '', timestamp: Date.now() + 1 };
        setMessages(prev => [...prev, aiMessage]);
  
        const stream = aiSession.promptStreaming(content);
        let fullResponse = '';
  
        for await (const chunk of stream) {
          const newContent = chunk.slice(fullResponse.length);
          fullResponse += newContent;
  
          setMessages(prev =>
            prev.map(msg =>
              msg.id === aiMessageId ? { ...msg, content: fullResponse } : msg
            )
          );
        }

        // Format code blocks with Markdown syntax
        const formattedResponse = fullResponse.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
          return `\`\`\`${language || ''}\n${code.trim()}\n\`\`\``;
        });
  
        if (config.storeChats && db) {
          try {
            const encryptedAiResponse = encryptMessage(formattedResponse, encryptionKey);
            const tx = db.transaction('messages', 'readwrite');
            const store = tx.objectStore('messages');
            await store.add({
              id: aiMessageId,
              threadId: currentThreadId,
              type: 'ai',
              content: encryptedAiResponse,
              timestamp: Date.now() + 1
            });
          } catch (error) {
            console.error('Failed to store AI message:', error);
          }
        }
        console.log('Received full AI response:', formattedResponse);
  
      } else {
        console.warn('AI session is not available');
        setMessages(prev => [
          ...prev,
          { id: `${currentThreadId}-${Date.now() + 2}`, threadId: currentThreadId, type: 'ai', content: "AI session is not available.", timestamp: Date.now() + 2 },
        ]);
      }
    } catch (error) {
      console.error("Error in message handling:", error);
      setMessages(prev => [
        ...prev,
        { id: `${currentThreadId}-${Date.now() + 3}`, threadId: currentThreadId, type: 'ai', content: `Error: ${error.message || 'Unknown error occurred'}`, timestamp: Date.now() + 3 },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const clearAllChats = async () => {
    if (config.storeChats && db) {
      try {
        const tx = db.transaction(['threads', 'messages'], 'readwrite');
        await tx.objectStore('threads').clear();
        await tx.objectStore('messages').clear();
      } catch (error) {
        console.error('Failed to clear all chats:', error);
      }
    }
    setMessages([]);
  };

  React.useImperativeHandle(ref, () => ({
    clearChats: clearAllChats
  }));

  return (
    <div className="flex-grow flex flex-col h-full">
      <AIStatus />
      <ChatArea messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} isAiTyping={isAiTyping} />
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;