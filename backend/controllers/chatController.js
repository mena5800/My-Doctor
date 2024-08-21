const Chat = require("../models/chat");
const Doctor = require("../models/doctor");
const User = require("../models/user");
// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const { receiver } = req.body;
    const user = req.session.user.userId;

    // Ensure participants is an array and has at least two users
    if (!user && !receiver) {
      return res.status(400).send("Invalid participants list");
    }
    // Check if receiver is a valid Doctor
    let check;
    // Create a new chat document
    if (req.session.user.type === "Doctor") {
      check = await User.findById(receiver);
    } else {
      check = await Doctor.findById(receiver);
    }

    if (!check) {
      return res.status(404).send("Receiver not found");
    }

    // Check if a chat between these participants already exists
    const existingChat = await Chat.findOne({
      $or: [
        { doctor: user, patient: receiver },
        { doctor: receiver, patient: user },
      ],
    });

    if (existingChat) {
      return res.status(400).send("Chat already exists");
    }

    let chat;

    // Create a new chat document
    if (req.session.user.type === "Doctor") {
      chat = new Chat({ doctor: user, patient: receiver });
    } else {
      chat = new Chat({ doctor: receiver, patient: user });
    }
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
    let chats;
    if (req.session.user.type == "Doctor")
      chats = await Chat.find({ doctor: userId });
    else chats = await Chat.find({ patient: userId });
    res.json(chats);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Get a chat by ID
exports.getChatById = async (req, res) => {
  try {
    // Check if receiver is a valid Doctor
    let check;
    const userId = req.session.user.userId;
    // Create a new chat document
    if (req.session.user.type === "Doctor") {
      check = await Chat.findOne({doctor : userId});
    } else {
      check = await chat.findOne({patient : userId});
    }

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
