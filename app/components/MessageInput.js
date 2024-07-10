"use client";

import { useState } from "react";

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow p-2 rounded-l-lg bg-gray-700 text-white"
      />
      <button type="submit" className="p-2 rounded-r-lg bg-blue-600 text-white">
        Send
      </button>
    </form>
  );
}
