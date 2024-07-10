export default function ChatArea({ messages }) {
  return (
    <div className="flex-grow overflow-y-auto mb-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 p-3 rounded-lg max-w-[75%] ${
            message.type === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
          }`}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
}
