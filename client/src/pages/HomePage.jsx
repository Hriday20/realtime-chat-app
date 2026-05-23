import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5002");

function HomePage() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

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

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const messageData = {
      sender: "Hriday",
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", messageData);

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-8">
        Real-Time Chat
      </h1>

      <div className="w-full max-w-xl bg-gray-900 p-6 rounded-xl shadow-lg">
        <div className="h-96 overflow-y-auto border border-gray-700 rounded-lg p-4 mb-4">
          {messageList.map((msg, index) => (
            <div
              key={index}
              className="bg-blue-600 p-3 rounded-lg mb-3"
            >
              <p className="font-semibold">
                {msg.sender}
              </p>

              <p>{msg.message}</p>

              <span className="text-xs text-gray-200">
                {msg.time}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;