"use client";

import React, { useState, useEffect } from 'react';

const AIStatus = () => {
  const [status, setStatus] = useState("Checking AI availability...");

  useEffect(() => {
    async function checkAI() {
      if (window.ai) {
        const canCreate = await window.ai.canCreateTextSession();
        setStatus(
          canCreate === "readily"
            ? "AI Ready"
            : canCreate === "after-download"
            ? "AI Downloading"
            : "AI Not Available"
        );
      } else {
        setStatus("AI Not Available");
      }
    }
    checkAI();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'AI Ready':
        return 'green';
      case 'AI Not Available':
        return 'red';
      case 'AI Downloading':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <div className="absolute top-2 right-2 flex items-center space-x-2 bg-gray-700 p-2 rounded-lg">
      <div className={`glow-${getStatusColor()} w-3 h-3 rounded-full`} />
      <span className="text-white text-sm">{status}</span>
    </div>
  );
};

export default AIStatus;