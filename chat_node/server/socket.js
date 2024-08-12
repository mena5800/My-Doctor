const socketIo = require('socket.io');
const Chat = require('../models/chat');

module.exports = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', async ({ userId, chatId }) => {
      socket.join(chatId);
      console.log(`User ${userId} joined chat ${chatId}`);
    });

    socket.on('new message', async ({ userId, chatId, message }) => {
      let chat = await Chat.findById(chatId);

      if (!chat) {
        chat = new Chat({
          participants: [userId],
          messages: [{ sender: userId, message }]
        });
        await chat.save();
      } else {
        chat.messages.push({ sender: userId, message });
        await chat.save();
      }

      io.to(chatId).emit('new message', { userId, message });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};
