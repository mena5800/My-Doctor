const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const AuthController = require('../controllers/AuthController')
const FilesController = require('../controllers/FilesController')


// Set-up multer's Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(os.homedir(), 'Downloads', 'upload'))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now + '-' + file.originalname)
  }
});

// Initialize multer with the custom storage configuration
const upload = multer({ storage });

// create a Router
const fileRouter = express.Router();


fileRouter.get('/files', AuthController.isAuthenticated, FilesController.getAllUserFiles)

fileRouter.get('/files/:fileName', AuthController.isAuthenticated, FilesController.getFile)

fileRouter.get('/userfiles/:userEmail', AuthController.isAuthenticated, FilesController.getUserFile);

fileRouter.post('/uploadFiles', AuthController.isAuthenticated, upload.single('file'), FilesController.postFile);

fileRouter.get('/doctors/departments', AuthController.isAuthenticated, FilesController.doctorsDepts)



module.exports = fileRouter;
