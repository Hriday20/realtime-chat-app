function MessageInput({
  message,
  handleTyping,
  sendMessage,
}) {
  return (
    <div className="flex gap-3">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={handleTyping}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        className="flex-1 p-4 rounded-2xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
      />

      <button
        onClick={sendMessage}
        className="bg-blue-600 hover:bg-blue-700 px-8 rounded-2xl font-semibold transition"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;