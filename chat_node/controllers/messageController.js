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

    // Create a new message
    const message = new Message({ chatId, senderId, content });
    await message.save();

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
