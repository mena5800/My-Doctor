const express = require("express");
const Router = express.Router();
const messageController = require("../controllers/messageController");
const AuthMiddleware = require("../middlewares/authentication");

// Send a new message
Router.post("/:chatId", AuthMiddleware.isAuthenticated, messageController.sendMessage);

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

// get a message
Router.get(
  "/:messageId",
  AuthMiddleware.isAuthenticated,
  messageController.getMessage
);

module.exports = Router;
