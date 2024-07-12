"use client";

import { useState } from "react";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import AIStatus from "./components/AIStatus";

export default function RootLayout({ children }) {
  const [config, setConfig] = useState({
    temperature: 0.7,
    topK: '20',
    theme: 'light'
  });

  const handleConfigChange = (newConfig) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  };

  return (
    <html lang="en">
      <body className={`${config.theme === 'dark' ? 'dark' : ''}`}>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Sidebar onConfigChange={handleConfigChange} config={config} />
          <main className="flex-grow relative">
            <AIStatus />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}