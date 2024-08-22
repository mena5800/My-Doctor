const express = require("express");
const Router = express.Router();
const messageController = require("../controllers/messageController");
const AuthMiddleware = require("../middlewares/authentication");

// Send a new message
Router.post("/", AuthMiddleware.isAuthenticated, messageController.sendMessage);

// Get messages by chat ID
Router.get(
  "/chat/:chatId",
  AuthMiddleware.isAuthenticated,
  messageController.getMessagesByChatId
);

// Edit a message
Router.put(
  "/:messageId",
  AuthMiddleware.isAuthenticated,
  messageController.editMessage
);

// Delete a message
Router.delete(
  "/:messageId",
  AuthMiddleware.isAuthenticated,
  messageController.deleteMessage
);

module.exports = Router;
