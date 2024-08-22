const express = require("express");
const chatController = require("../controllers/chatController");
const AuthMiddleware = require("../middlewares/authentication");

const Router = express.Router();

// router.get('/:chatId', chatController.getChatById);
Router.post("/chat", AuthMiddleware.isAuthenticated, chatController.createChat);

// Get all chats by user ID
Router.get(
  "/chats",
  AuthMiddleware.isAuthenticated,
  chatController.getChatsByUserId
);

// get chat by ID
Router.get(
  "/chats/:chatId",
  AuthMiddleware.isAuthenticated,
  chatController.getChatById
);

module.exports = Router;
