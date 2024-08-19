const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const AuthController = require("../controllers/AuthController");

// Send a new message
router.post('/', messageController.sendMessage);

// Get messages by chat ID
router.get('/chat/:chatId', messageController.getMessagesByChatId);

// Edit a message
router.put('/:messageId', messageController.editMessage);

// Delete a message
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;