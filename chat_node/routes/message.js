const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Send a new message
router.post('/', messageController.sendMessage);

// Get messages by chat ID
router.get('/chat/:chatId', messageController.getMessagesByChatId);

module.exports = router;
