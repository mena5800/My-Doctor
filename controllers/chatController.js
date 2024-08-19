const Chat = require('../models/chat');
const Doctor = require("../models/doctor");
const User = require("../models/user");
// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const {receiver} = req.body;
    const user = req.session.user.userId;

    // Ensure participants is an array and has at least two users
    if (!user && !receiver) {
      return res.status(400).send('Invalid participants list');
    }
    // Check if receiver is a valid Doctor
    const checkDoctor = await Doctor.findById(receiver);
    const checkPatient = await User.findById(receiver);

    if (!checkDoctor || !checkDoctor) {
      return res.status(404).send('Receiver not found');
    }

    let chat;
    // Create a new chat document
    if (req.session.user.type === "Doctor"){
      chat = new Chat({doctor: user,  patient: receiver});
    }
    else{
      chat = new Chat({doctor: receiver,  patient: user});
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
      return res.status(400).send('User ID is required');
    }

    // Find all chats where the user is a participant
    let chats;
    if (req.session.user.type == "Doctor")
      chats = await Chat.find({ doctor: userId });
    else
      chats = await Chat.find({ patient: userId});
    res.json(chats);
  } catch (error) {
    res.status(400).send(error.message);
  }
};