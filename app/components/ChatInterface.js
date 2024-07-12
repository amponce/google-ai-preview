"use client";

import React, { useState, useEffect } from 'react';
import {ChatArea} from './ChatArea';
import {MessageInput} from './MessageInput';
import AIStatus from './AIStatus';

const DEFAULT_CONFIG = {
  temperature: 0.7,
  topK: 20
};

const ChatInterface = ({ config = DEFAULT_CONFIG }) => {
  const [messages, setMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiSession, setAiSession] = useState(null);

  useEffect(() => {
    initAISession();
    return () => {
      if (aiSession) {
        aiSession.destroy();
      }
    };
  }, []);

  const initAISession = async () => {
    if (window.ai) {
      try {
        const session = await window.ai.createTextSession({
          temperature: parseFloat(config.temperature),
          topK: parseInt(config.topK),
        });
        setAiSession(session);
      } catch (error) {
        console.error('Error initializing AI session:', error);
      }
    }
  };

  const handleSendMessage = async (message) => {
    setMessages((prev) => [...prev, { type: 'user', content: message }]);
    setIsAiTyping(true);

    if (aiSession) {
      try {
        console.log('Sending prompt to AI:', message);
        
        const aiMessageId = Date.now();
        setMessages((prev) => [...prev, { type: 'ai', content: '', id: aiMessageId }]);
        
        const stream = aiSession.promptStreaming(message);
        let fullResponse = '';
        
        for await (const chunk of stream) {
          const newContent = chunk.slice(fullResponse.length);
          fullResponse += newContent;
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, content: fullResponse } : msg
            )
          );
        }

        console.log('Received full AI response:', fullResponse);
      } catch (error) {
        console.error("Error in AI interaction:", error);
        setMessages((prev) => [
          ...prev,
          { type: 'ai', content: `Error: ${error.message || 'Unknown error occurred'}` },
        ]);
      }
    } else {
      console.warn('AI session is not available');
      setMessages((prev) => [
        ...prev,
        { type: 'ai', content: "AI session is not available." },
      ]);
    }

    setIsAiTyping(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      <AIStatus />
      <ChatArea messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} isAiTyping={isAiTyping} />
    </div>
  );
};

export default ChatInterface;