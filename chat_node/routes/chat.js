const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/:chatId', chatController.getChatById);
router.post('/', chatController.createChat);

// Get all chats by user ID
router.get('/user/:userId', chatController.getChatsByUserId);

module.exports = router;
