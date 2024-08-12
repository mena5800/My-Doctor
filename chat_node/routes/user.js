const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Get a user by ID
router.get('/:userId', userController.getUserById);

// Delete a user by ID
router.delete('/:userId', userController.deleteUserById);

module.exports = router;
