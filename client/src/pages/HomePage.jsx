import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5002");

function HomePage() {
  useEffect(() => {
    console.log("Socket Connected");

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold">
        Real-Time Chat Application
      </h1>
    </div>
  );
}

export default HomePage;