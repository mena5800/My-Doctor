const express = require('express');
const AuthController = require('../controllers/AuthController')
const UserController = require('../controllers/UserController');

const userRouter = express.Router();

userRouter.post('/user/register', UserController.newUser);

userRouter.post('/login', UserController.login)

userRouter.get('/logout', AuthController.isAuthenticated, AuthController.deleteToken)

userRouter.get('/userDocs', AuthController.isAuthenticated, UserController.getMyDoctors)

userRouter.post('/addDocs/', AuthController.isAuthenticated, UserController.addDoctor);

userRouter.get('/user/me', AuthController.isAuthenticated, UserController.currentUser)

userRouter.get('/allusers', AuthController.isAuthenticated, UserController.getAllUsers);


module.exports = userRouter;
