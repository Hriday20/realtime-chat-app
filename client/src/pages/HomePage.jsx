import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import OnlineUsers from "../components/OnlineUsers";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;

const socket = io(BACKEND_URL);

function HomePage() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(
    localStorage.getItem("chatUser")
  );

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!storedUser) {
      navigate("/login");
      return;
    }

    socket.emit("join_chat", storedUser.name);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/messages`
        );

        setMessageList(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
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

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      sender: storedUser.name,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);
    socket.emit("stop_typing");

    setMessage("");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", storedUser.name);

    setTimeout(() => {
      socket.emit("stop_typing");
    }, 1000);
  };

  const logoutHandler = () => {
    localStorage.removeItem("chatUser");
    navigate("/login");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-72 h-screen bg-black/30 backdrop-blur-md border-r border-gray-800 p-5 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              ChatSphere
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Real-time communication
            </p>
          </div>

          <div className="bg-gray-800/80 rounded-2xl p-5 border border-gray-700 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center font-bold text-lg shadow-md">
                {storedUser?.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-gray-400 text-xs">
                  Logged in as
                </p>

                <h3 className="text-lg font-semibold">
                  {storedUser?.name}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={logoutHandler}
          className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </div>

      {/* Main Chat */}
      <div className="flex-1 p-6 flex flex-col overflow-hidden">
        <div className="bg-black/20 backdrop-blur-md border border-gray-800 rounded-3xl p-5 mb-4 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                Global Chat Room
              </h1>

              <p className="text-gray-400 mt-1">
                Chat with everyone online
              </p>
            </div>

            <div className="px-4 py-2 bg-gray-800 rounded-xl text-sm">
              {onlineUsers.length} Online
            </div>
          </div>
        </div>

        <div className="flex-1 bg-black/20 backdrop-blur-md border border-gray-800 rounded-3xl p-5 overflow-y-auto mb-4 min-h-0 shadow-xl">
          {messageList.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-gray-500">
              <div className="text-6xl mb-5">💬</div>

              <h2 className="text-3xl font-bold mb-3">
                No messages yet
              </h2>

              <p className="text-gray-400">
                Be the first one to start chatting.
              </p>
            </div>
          ) : (
            messageList.map((msg, index) => (
              <MessageBubble
                key={index}
                msg={msg}
                currentUser={storedUser?.name}
              />
            ))
          )}

          {typingUser && (
            <div className="text-sm text-blue-300 italic px-2">
              {typingUser} is typing...
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        <MessageInput
          message={message}
          handleTyping={handleTyping}
          sendMessage={sendMessage}
        />
      </div>

      <OnlineUsers onlineUsers={onlineUsers} />
    </div>
  );
}

export default HomePage;