const Chat = require("../models/chat");
const Doctor = require("../models/doctor");
const User = require("../models/user");
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
    let chats = await Chat.find({ participants: userId });

    res.json(chats);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get a chat by ID
exports.getChatById = async (req, res) => {
  try {
    // Check if receiver is a valid Doctor
    const userId = req.session.user.userId;
    const chatId = req.params.chatId;

    // check if this chat belongs to this user
    let check = await Chat.find({ participants: userId, _id: chatId });

    if (!check) {
      return res.status(404).send("not allowed");
    }
    const chat = await Chat.findById(req.params.chatId).populate(
      "messages.sender"
    );
    if (!chat) return res.status(404).send("Chat not found");
    res.json(chat);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
