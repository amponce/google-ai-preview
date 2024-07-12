import ChatInterface from "./components/ChatInterface";

export default function Home({config}) {
  return (
    <div className="chat-container">
      <ChatInterface config={config} />;
    </div>
  );
}
