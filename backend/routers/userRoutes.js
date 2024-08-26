const express = require("express");
const AuthMiddleware = require("../middlewares/authentication");
const UserController = require("../controllers/userController");

const Router = express.Router();

Router.post("/register", UserController.registerUser);
Router.post("/login", UserController.logInUser);
Router.get("/current", AuthMiddleware.isAuthenticated, UserController.currentUser);
Router.get("/profile", AuthMiddleware.isAuthenticated, UserController.getProfile);
Router.put('/profile', AuthMiddleware.isAuthenticated, UserController.updateProfile);
Router.get("/session", AuthMiddleware.isAuthenticated, UserController.checkSession);
Router.delete("/delete",AuthMiddleware.isAuthenticated, UserController.deleteUser);
Router.get('/unreadMessages', AuthMiddleware.isAuthenticated, UserController.getUnreadMessages);
Router.get("/logout",AuthMiddleware.isAuthenticated, AuthMiddleware.deleteToken);

module.exports = Router;
