"use client";

import { useState, useEffect } from "react";
import ChatArea from "./ChatArea";
import MessageInput from "./MessageInput";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [aiSession, setAiSession] = useState(null);

  useEffect(() => {
    async function initAI() {
      if (window.ai) {
        const canCreate = await window.ai.canCreateTextSession();
        if (canCreate !== "no") {
          const session = await window.ai.createTextSession();
          setAiSession(session);
        } else {
          console.error("AI text session cannot be created on this device");
        }
      } else {
        console.error("AI functionality not available");
      }
    }
    initAI();
  }, []);

  const handleSendMessage = async (message) => {
    setMessages((prev) => [...prev, { type: "user", content: message }]);

    if (aiSession) {
      try {
        const response = await aiSession.prompt(message);
        setMessages((prev) => [...prev, { type: "ai", content: response }]);
      } catch (error) {
        console.error("Error getting AI response:", error);
        setMessages((prev) => [
          ...prev,
          { type: "ai", content: "Sorry, I encountered an error." },
        ]);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { type: "ai", content: "AI is not available at the moment." },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatArea messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
