const Chat = require("../models/chat");
const Doctor = require("../models/doctor");
const User = require("../models/user");
const Message = require("../models/message")
// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const mainUser = req.session.user.userId;
    const secondUser = req.body.secondUser;

    // Ensure participants is an array and has at least two users
    if (!mainUser || !secondUser) {
      return res.status(400).send("Invalid participants list");
    }

    let participants = [mainUser, secondUser];
    // Check if the chat already exists
    let existingChat = await Chat.findOne({
      participants: { $all: participants }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // Create a new chat document
    const chat = new Chat({ participants });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(400).send(error.message);
  }

};

// Get all chats by user ID
exports.getChatsByUserId = async (req, res) => {
  try {
    const userId = req.session.user.userId;
    // Validate user ID
    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    // Find all chats where the user is a participant
    let chats = await Chat.find({ participants: userId })
    .populate('participants', '_id name'); // Populate participants with their id and name

    res.json(chats);
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
    const messages = await Message.find({ chatId }).populate('senderId', 'name');
    res.json(messages);
  } catch (error) {
    res.status(400).send(error.message);
  }
};