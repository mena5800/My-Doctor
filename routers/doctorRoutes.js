const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AuthController = require('../controllers/AuthController')
const DocController = require('../controllers/DocController')
const { Doctor } = require('../controllers/Schema')


// Set-up multer's Configuration
const storage = multer.diskStorage({
  destination: async(req, file, cb) => {
    await Doctor.findOne({ email: req.session.user.email })
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

const doctorRouter = express.Router();

doctorRouter.post('/doc/register', DocController.newDoc)
doctorRouter.get('/doc/me', AuthController.isAuthenticated, DocController.currentDoc)
doctorRouter.get('/alldoctors/:department', AuthController.isAuthenticated, DocController.findDocsByDept)
doctorRouter.get('/alldoctors', AuthController.isAuthenticated, DocController.findAllDocs)
doctorRouter.get('/docProfile', AuthController.isAuthenticated, DocController.getDocProfile)
doctorRouter.post('/updateDocProfile', AuthController.isAuthenticated, upload.array('files', 10), DocController.updateDocProfile)
doctorRouter.get('/docMedicalRecord', AuthController.isAuthenticated, DocController.docMedicalRecordUploads)

module.exports = doctorRouter;
