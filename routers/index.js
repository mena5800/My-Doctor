const express = require('express');
const UserController = require('../controllers/UserController')
const FilesController = require('../controllers/FilesController')
const AuthController = require('../controllers/AuthController')

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the My Doctor API!');
});

router.post('/login', FilesController.login)

router.post('/user/register', UserController.newUser)

router.get('/userDoctors', AuthController.isAuthenticated, FilesController.getMyDoctors)

router.post('/addDoctor', AuthController.isAuthenticated, FilesController.addDoctor);

router.get('/user', AuthController.isAuthenticated, UserController.currentUser)

router.get('/files', AuthController.isAuthenticated, FilesController.getAllFiles)

router.get('/files:name', AuthController.isAuthenticated, FilesController.getFile)

router.get('/files:name', AuthController.isAuthenticated, FilesController.getFile)

router.get('/allusers', AuthController.isAuthenticated, UserController.getAllUsers);

router.get('/userfiles:userEmail', AuthController.isAuthenticated, FilesController.getUserFile);

router.post('/files:data', AuthController.isAuthenticated, FilesController.postFile);

module.exports = router;
