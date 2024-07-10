"use client";

import { useState, useEffect } from "react";

export default function AIStatus() {
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

  return (
    <div className="absolute top-2 right-2 p-2 bg-gray-700 rounded-lg text-sm">
      {status}
    </div>
  );
}
