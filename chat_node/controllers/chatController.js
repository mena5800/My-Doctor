const Chat = require('../models/chat');

// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const { participants } = req.body;

    // Ensure participants is an array and has at least two users
    if (!Array.isArray(participants) || participants.length < 2) {
      return res.status(400).send('Invalid participants list');
    }

    // Create a new chat document
    const chat = new Chat({ participants });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get a chat by ID
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate('messages.sender');
    if (!chat) return res.status(404).send('Chat not found');
    res.json(chat);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get all chats by user ID
exports.getChatsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate user ID
    if (!userId) {
      return res.status(400).send('User ID is required');
    }

    // Find all chats where the user is a participant
    const chats = await Chat.find({ participants: userId });
    res.json(chats);
  } catch (error) {
    res.status(400).send(error.message);
  }
};