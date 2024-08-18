// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const os = require('os');
// const UserController = require('../controllers/UserController');
// const FilesController = require('../controllers/FilesController')
// const AuthController = require('../controllers/AuthController')
// const DocController = require('../controllers/DocController')

// // Set-up multer's Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(os.homedir(), 'Downloads', 'upload'))
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now + '-' + file.originalname)
//   }
// });

// // Initialize multer with the custom storage configuration
// const upload = multer({ storage });

// const router = express.Router();

// // router.get('/login', FilesController.getLoginForm)

// router.post('/login', FilesController.login)

// router.post('/user/register', UserController.newUser)

// router.post('/doc/register', DocController.newDoc)

// router.get('/userDocs', AuthController.isAuthenticated, UserController.getMyDoctors)

// router.post('/addDocs/', AuthController.isAuthenticated, UserController.addDoctor);

// router.get('/user/me', AuthController.isAuthenticated, UserController.currentUser)

// router.get('/doc/me', AuthController.isAuthenticated, DocController.currentDoc)

// router.get('/files', AuthController.isAuthenticated, FilesController.getAllUserFiles)

// router.get('/files/:fileName', AuthController.isAuthenticated, FilesController.getFile)

// router.get('/allusers', AuthController.isAuthenticated, UserController.getAllUsers);

// router.get('/userfiles/:userEmail', AuthController.isAuthenticated, FilesController.getUserFile);

// router.post('/uploadFiles', AuthController.isAuthenticated, upload.single('file'), FilesController.postFile);

// router.get('/doctors/departments', AuthController.isAuthenticated, FilesController.doctorsDepts)

// router.get('/alldoctors/:department', AuthController.isAuthenticated, DocController.findDocsByDept)

// router.get('/alldoctors', AuthController.isAuthenticated, DocController.findAllDocs)

// router.get('/logout', AuthController.isAuthenticated, AuthController.deleteToken)

// module.exports = router;
