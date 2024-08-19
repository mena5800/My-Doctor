const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const AuthController = require('../controllers/AuthController')
const FilesController = require('../controllers/FilesController')
const multerS3 = require('multer-s3');
const s3 = require('../utils/s3');


// Set-up multer's Configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

// Initialize multer with the custom storage configuration

// create a Router
const fileRouter = express.Router();


fileRouter.get('/files', AuthController.isAuthenticated, FilesController.getAllUserFiles)

// fileRouter.get('/files/:fileName', AuthController.isAuthenticated, FilesController.getFile)

// fileRouter.get('/userfiles/:userEmail', AuthController.isAuthenticated, FilesController.getUserFile);

fileRouter.post('/uploadFiles', AuthController.isAuthenticated, upload.single('file'), FilesController.postFile);
fileRouter.delete('/files/:fileId', AuthController.isAuthenticated, FilesController.deleteFile);
fileRouter.put('/files/:fileId', AuthController.isAuthenticated, upload.single('file'), FilesController.editFile);


module.exports = fileRouter;
