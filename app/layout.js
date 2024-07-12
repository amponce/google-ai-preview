import "./globals.css";
import AIStatus from "./components/AIStatus";

export const metadata = {
  title: "AI Chat App",
  description: "Chat app using Chrome's built-in AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <div className="flex h-screen">
          <aside className="w-64 bg-white border-r border-gray-200 p-5">
            <nav>
              <ul className="space-y-4">
                <li className="text-gray-600 hover:text-gray-900 cursor-pointer">
                  Explore
                </li>
                <li className="text-gray-600 hover:text-gray-900 cursor-pointer">
                  Chatbot
                </li>
                <li className="text-gray-600 hover:text-gray-900 cursor-pointer">
                  Customize
                </li>
              </ul>
            </nav>
          </aside>
          <main className="flex-grow relative">
            <AIStatus />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}