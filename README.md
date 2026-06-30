# ChatSphere — Real-Time Chat Application

A full-stack real-time chat application built using the MERN stack with Socket.IO for instant communication.

## Overview

ChatSphere allows multiple users to communicate instantly in a shared global chat room. It supports authentication, real-time message delivery, online user tracking, typing indicators, and persistent message storage.

This project was built to learn full-stack development concepts including frontend architecture, backend APIs, database integration, authentication, and WebSocket communication.

---

## Features

- User Signup & Login Authentication
- Protected Routes using JWT
- Real-Time Messaging using Socket.IO
- Online User Tracking
- Typing Indicator
- Persistent Message History using MongoDB
- Modern Responsive Chat UI
- Global Chat Room
- Logout Functionality

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- JWT Authentication
- bcryptjs

### Database
- MongoDB Atlas
- Mongoose

---

## Project Structure

```bash
realtime-chat-app/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Hriday20/realtime-chat-app.git
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

---

## Environment Variables

Create `.env` inside server folder:

```env
PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Future Improvements

- Private Messaging
- Message Notifications
- File Sharing
- Voice / Video Calls
- Mobile Optimization

---

## Author

**Hriday Desai**  
Computer Engineering Student
