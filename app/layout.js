import "./globals.css";
import AIStatus from "./components/AIStatus";

export const metadata = {
  title: "AI Chat App",
  description: "Chat app using Chrome's built-in AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <div className="flex h-screen">
          <aside className="w-64 bg-gray-800 p-5">
            <nav>
              <ul className="space-y-4">
                <li className="text-gray-300 hover:text-white cursor-pointer">
                  Explore
                </li>
                <li className="text-gray-300 hover:text-white cursor-pointer">
                  Chatbot
                </li>
                <li className="text-gray-300 hover:text-white cursor-pointer">
                  Customize
                </li>
              </ul>
            </nav>
          </aside>
          <main className="flex-grow p-5 relative">
            <AIStatus />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
