const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const AuthController = require("../controllers/AuthController");

// Send a new message
router.post('/', AuthController.isAuthenticated ,messageController.sendMessage);

// Get messages by chat ID
router.get('/chat/:chatId', AuthController.isAuthenticated, messageController.getMessagesByChatId);

// Edit a message
router.put('/:messageId', AuthController.isAuthenticated, messageController.editMessage);

// Delete a message
router.delete('/:messageId', AuthController.isAuthenticated, messageController.deleteMessage);

module.exports = router;