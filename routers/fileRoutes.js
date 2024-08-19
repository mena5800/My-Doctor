const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const AuthController = require('../controllers/AuthController')
const FilesController = require('../controllers/FilesController')
const { File } = require('../controllers/Schema')

// Create upload files directory if it doesn't exists
const uploadPath = path.join(os.homedir(), 'Downloads', 'upload')
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

// Set-up multer's Configuration
const storage = multer.diskStorage({
  destination: async(req, file, cb) => {
    let fullUploadPath = '';
    let folder = '';
    if (file.mimetype.startsWith('image/')) {
      folder = 'images';
    } else if (file.mimetype.startsWith('audio/')) {
      folder = 'audios';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'videos';
    } else if (file.mimetype.startsWith('application/zip') || file.mimetype.startsWith('application/x-rar-compressed')) {
      folder = 'archives';
    } else if (file.mimetype.startsWith('application/') || file.mimetype.startsWith('text/')) {
      folder = 'documents';
    } else {
      folder = 'others';
    }
    await File.findOne({ userId: req.session.user.userId })
    .catch((err) => new Error(`Error: ${err}`))
    .then((file) => {
      (async () => {
        if (!file) {
          file = new File({ userId: req.session.user.userId, path: path.join(uploadPath, uuidv4()) })
          await file.save()
          .catch((err) => new Error(`Error while creating File ${err}`))
        }
        const filePath = await file.path
        fullUploadPath = path.join(filePath, folder);
        if (!fs.existsSync(fullUploadPath)) {
          fs.mkdirSync(fullUploadPath, { recursive: true });
        }
        cb(null, fullUploadPath)
      })();
    })
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + ' - ' + file.originalname)
  }
});

// Initialize multer with the custom storage configuration
const upload = multer({ storage });

// create a Router
const fileRouter = express.Router();

fileRouter.post('/login', FilesController.login)

fileRouter.get('/files', AuthController.isAuthenticated, FilesController.getAllUserFiles)

fileRouter.get('/files/:fileName', AuthController.isAuthenticated, FilesController.getFile)

fileRouter.get('/userfiles/:userEmail', AuthController.isAuthenticated, FilesController.getUserFile);

fileRouter.post('/uploadFiles', AuthController.isAuthenticated, upload.single('file'), FilesController.postFile);

fileRouter.get('/doctors/departments', AuthController.isAuthenticated, FilesController.doctorsDepts)

fileRouter.get('/logout', AuthController.isAuthenticated, AuthController.deleteToken)


module.exports = fileRouter;
