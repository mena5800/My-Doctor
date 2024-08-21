const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid')
const { User } = require('../controllers/Schema')
const AuthController = require('../controllers/AuthController')
const UserController = require('../controllers/UserController');


// Set-up multer's Configuration
const storage = multer.diskStorage({
  destination: async(req, file, cb) => {
    await User.findOne({ email: req.session.user.email })
    .catch((err) => new Error(`Error: ${err}`))
    .then(async (doc) => {
      if (!doc.medicalRecordUploads) {
        const parentFolder = path.dirname(__dirname)
        const uploadPath = path.join(parentFolder, 'medicalHistoryUploads', uuidv4())
        fs.mkdirSync(uploadPath, { recursive: true })
        doc.medicalRecordUploads = uploadPath
        await doc.save()
      }
      cb(null, doc.medicalRecordUploads)
    })
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + ' - ' + file.originalname)
  }
});

// Initialize multer with the custom storage configuration
const upload = multer({ storage });

const userRouter = express.Router();


userRouter.post('/user/register', UserController.newUser);

userRouter.get('/userDocs', AuthController.isAuthenticated, UserController.getMyDoctors)

userRouter.post('/addDocs/', AuthController.isAuthenticated, UserController.addDoctor);

userRouter.get('/user/me', AuthController.isAuthenticated, UserController.currentUser)

// For Administrative Use Only
userRouter.get('/allusers', AuthController.isAuthenticated, UserController.getAllUsers);

userRouter.get('/userProfile', AuthController.isAuthenticated, UserController.getUserProfile)

userRouter.post('/updateUserProfile', AuthController.isAuthenticated, upload.array('files', 10), UserController.updateUserProfile)

userRouter.get('/userMedicalRecords', AuthController.isAuthenticated, UserController.userMedicalRecordUploads)


module.exports = userRouter;
