const Message = require('../models/message');
const Chat = require('../models/chat');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content } = req.body;

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
    const message = new Message({ chatId, senderId, content });
    await message.save();

    // Send message to participants online and offline
    for (const userId of chat.participants) {
      if (userId !== senderId) {
        if (onlineUsers[userId]) {
          // Send message in real-time
          io.to(onlineUsers[userId]).emit('newMessage', message);
        } else {
          // Store message as unread
          await User.findByIdAndUpdate(userId, { $push: { unreadMessages: message._id } });
        }
      }
    }
    // Update chat with the new message
    await Chat.findByIdAndUpdate(chatId, { $push: { messages: message._id } });

    res.status(201).json(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get messages by chat ID
exports.getMessagesByChatId = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    // Validate chat ID
    if (!chatId) {
      return res.status(400).send('Chat ID is required');
    }

    // Find messages for the chat
    const messages = await Message.find({ chatId }).populate('senderId', 'username');
    res.json(messages);
  } catch (error) {
    res.status(400).send(error.message);
  }
};


// Edit a message
exports.editMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const { content } = req.body;

    // Validate input
    if (!messageId || !content) {
      return res.status(400).send('Message ID and new content are required');
    }

    // Find and update the message
    const message = await Message.findByIdAndUpdate(messageId, { content: content }, { new: true });
    if (!message) {
      return res.status(404).send('Message not found');
    }

    res.json(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;

    // Validate message ID
    if (!messageId) {
      return res.status(400).send('Message ID is required');
    }

    // Find and delete the message
    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
      return res.status(404).send('Message not found');
    }

    // Remove the message reference from the chat
    await Chat.updateOne({ messages: messageId }, { $pull: { messages: messageId } });

    res.status(204).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
};