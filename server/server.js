import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/messageModel.js";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5002;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_chat", (username) => {
    socket.username = username;

    if (!onlineUsers.includes(username)) {
      onlineUsers.push(username);
    }
    
    io.emit("online_users", onlineUsers);

    console.log(`${username} joined chat`);
  });

  socket.on("send_message", async (data) => {
    console.log("Message Received:", data);

    const newMessage = await Message.create(data);

    io.emit("receive_message", newMessage);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("show_typing", data);
  });

  socket.on("stop_typing", () => {
    socket.broadcast.emit("hide_typing");
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);

    onlineUsers = onlineUsers.filter(
      (user) => user !== socket.username
    );

    io.emit("online_users", onlineUsers);
  });
});


httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});