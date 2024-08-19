const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const AuthController = require("../controllers/AuthController");


// router.get('/:chatId', chatController.getChatById);
router.post('/chat', AuthController.isAuthenticated, chatController.createChat);

// Get all chats by user ID
router.get('/chats', AuthController.isAuthenticated ,chatController.getChatsByUserId);

// get chat by ID
router.get('/chats/:chatId', AuthController.isAuthenticated ,chatController.getChatById);

module.exports = router;