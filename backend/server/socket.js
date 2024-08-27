// socket.js
const User = require('../models/user');
const Message = require('../models/message');
const Chat = require('../models/chat');
const express = require("express");
const http = require("http");
const {Server} = require("socket.io")

const onlineUsers = {};  // Object to store online users

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin:["http://localhost:8080"],
    methods: ["GET", "POST", "DELETE", "PUT"]
  }
});

io.on('connection', (socket)=>{
  console.log(`New connection: ${socket.id}`);

  // Handle user connection
  socket.on('userConnected', async (userId) => {
    // console.log(userId)
    onlineUsers[userId] = socket.id;
    console.log(onlineUsers)
    // console.log(`User ${userId} connected with socket ID ${socket.id}`);
    // Fetch and send unread messages
    const user = await User.findById(userId).populate('unreadMessages');
    if (user && user.unreadMessages.length > 0) {
      socket.emit('unreadMessages', user.unreadMessages);

      // Clear unread messages after sending
      user.unreadMessages = [];
      await user.save();
      // console.log(onlineUsers);
    }
  });

  // Handle message sending
  socket.on('sendMessage', async (data) => {
    const { chatId, senderId, content } = data;

    // Validate input
    if (!chatId || !senderId || !content) {
      return socket.emit('errorMessage', 'Chat ID, sender ID, and content are required');
    }

    // Check if chat exists and sender is a participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(senderId)) {
      return socket.emit('errorMessage', 'Sender is not a participant in this chat');
    }

    // Create and save the message
    const message = new Message({ chatId, senderId, content });
    await message.save();

    // Send message to participants
    for (const userId of chat.participants) {
      if (userId.toString() !== senderId) {
        if (onlineUsers[userId]) {
          // Send message in real-time
          io.to(onlineUsers[userId]).emit('newMessage', message);
        } else {
          // Store message as unread
          await User.findByIdAndUpdate(userId, { $push: { unreadMessages: message._id } });
        }
      }
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
    if (userId) {
      delete onlineUsers[userId];
      console.log(`User ${userId} disconnected`);
      console.log(onlineUsers)
    }
  });

})
export {app, io, server};