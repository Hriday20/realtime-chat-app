import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5002");

function HomePage() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const name = prompt("Enter your username");

    if (name) {
      setUsername(name);

      socket.emit("join_chat", name);
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5002/api/messages"
        );

        setMessageList(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("receive_message", (data) => {
      setMessageList((prev) => [...prev, data]);
    });

    socket.on("show_typing", (data) => {
      setTypingUser(data);
    });

    socket.on("hide_typing", () => {
      setTypingUser("");
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("show_typing");
      socket.off("hide_typing");
      socket.off("online_users");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messageList, typingUser]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const messageData = {
      sender: username,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);

    socket.emit("stop_typing");

    setMessage("");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", username);

    setTimeout(() => {
      socket.emit("stop_typing");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-10">
      <h1 className="text-5xl font-bold mb-8 text-blue-500">
        Real-Time Chat
      </h1>

      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-3xl shadow-2xl border border-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">
              Logged in as
            </p>

            <h2 className="text-xl font-semibold">
              {username}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>

            <span className="text-sm text-gray-300">
              {onlineUsers.length} Online
            </span>
          </div>
        </div>

        <div className="mb-4 bg-gray-950 border border-gray-800 rounded-2xl p-3">
          <p className="text-sm text-gray-400 mb-2">
            Online Users
          </p>

          <div className="flex flex-wrap gap-2">
            {onlineUsers.map((user, index) => (
              <span
                key={index}
                className="bg-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {user}
              </span>
            ))}
          </div>
        </div>

        <div className="h-[500px] overflow-y-auto bg-gray-950 border border-gray-800 rounded-2xl p-4 mb-4">
          {messageList.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.sender === username
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-2xl shadow-md ${
                  msg.sender === username
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                <p className="font-semibold text-sm mb-1">
                  {msg.sender}
                </p>

                <p>{msg.message}</p>

                <span className="text-xs text-gray-200 block mt-1">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {typingUser && (
            <div className="text-sm text-gray-400 italic mb-2">
              {typingUser} is typing...
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
            className="flex-1 p-4 rounded-2xl bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;