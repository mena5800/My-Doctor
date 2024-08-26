const Message = require('../models/message');
const Chat = require('../models/chat');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.session.user.userId;
    const chatId = req.params.chatId;
    const { content } = req.body;

    // Validate input
    if (!chatId || !senderId || !content) {
      return res.status(400).send('Chat ID, sender ID, and content are required');
    }

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).send('Chat not found');
    }

    // Check if sender is a participant in the chat
    if (!chat.participants.includes(senderId)) {
      return res.status(403).send('Sender is not a participant in this chat');
    }

    // Create a new message
    let message = new Message({ chatId, senderId, content });
    await message.save();    

    message = await message.populate('senderId', 'name');

    // // Send message to participants online and offline
    // for (const userId of chat.participants) {
    //   if (userId !== senderId) {
    //     if (onlineUsers[userId]) {
    //       // Send message in real-time
    //       io.to(onlineUsers[userId]).emit('newMessage', message);
    //     } else {
    //       // Store message as unread
    //       await User.findByIdAndUpdate(userId, { $push: { unreadMessages: message._id } });
    //     }
    //   }
    // }
    // Update chat with the new message
    await Chat.findByIdAndUpdate(chatId, { $push: { messages: message._id } });

    res.status(201).json(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};




// Edit a message
exports.editMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const { content } = req.body;
    const userId = req.session.user.userId;

    // Validate input
    if (!messageId || !content) {
      return res.status(400).send('Message ID and new content are required');
    }

    // Find the message by ID
    const message = await Message.findById(messageId);

    // Check if message exists
    if (!message) {
      return res.status(404).send('Message not found');
    }

    // Ensure the user owns the message
    if (message.senderId.toString() !== userId) {
      return res.status(403).send('You do not have permission to edit this message');
    }

    // Update the message content
    message.content = content;
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.session.user.userId;

    // Find the message by ID
    const message = await Message.findById(messageId);

    // Check if message exists
    if (!message) {
      return res.status(404).send('Message not found');
    }

    // Ensure the user owns the message
    if (message.senderId.toString() !== userId) {
      return res.status(403).send('You do not have permission to delete this message');
    }

    // Delete the message
    await message.deleteOne();

    res.send('Message deleted successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get a message
exports.getMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.session.user.userId;

    // Validate input
    if (!messageId) {
      return res.status(400).send('Message ID is required.');
    }

    // Find the message by ID
    const message = await Message.findById(messageId);

    // Check if the message exists
    if (!message) {
      return res.status(404).send('Message not found');
    }

    // Find the chat containing this message
    const chat = await Chat.findById(message.chatId);

    // Ensure the user is a participant in the chat
    if (!chat.participants.includes(userId)) {
      return res.status(403).send('You do not have permission to view this message');
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};