function MessageBubble({ msg, currentUser }) {
  const isOwnMessage =
    msg.sender === currentUser;

  const formatTime = (time) => {

    if (!time) return "";
    // 12-hour format with AM/PM
    if (time.includes("AM") || time.includes("PM")) {
      const parts = time.split(":");
      if (parts.length >= 2) {
        const suffix = time.includes("AM")
          ? "AM"
          : "PM";
        return `${parts[0]}:${parts[1]} ${suffix}`;
      }
    }
    // 24-hour format
    const parts = time.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return time;
  };

  const formattedTime = formatTime(msg.time);

  return (
    <div
      className={`mb-3 flex ${
        isOwnMessage
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div className="flex items-end gap-3 max-w-2xl">
        {!isOwnMessage && (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center font-bold shadow-md shrink-0">
            {msg.sender?.charAt(0).toUpperCase()}
          </div>
        )}

        <div
          className={`px-4 py-3 shadow-lg border ${
            isOwnMessage
              ? "bg-blue-600 border-blue-500 rounded-3xl rounded-br-md"
              : "bg-gray-800 border-gray-700 rounded-3xl rounded-bl-md"
          }`}
        >
          {!isOwnMessage && (
            <p className="font-semibold text-sm mb-2 text-blue-300">
              {msg.sender}
            </p>
          )}

          <p className="text-[15px] leading-relaxed break-words">
            {msg.message}
          </p>

          <span className="text-[11px] opacity-60 block mt-3 text-right">
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;