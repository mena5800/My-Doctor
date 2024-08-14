const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const UserController = require('../controllers/UserController')
const FilesController = require('../controllers/FilesController')
const AuthController = require('../controllers/AuthController')
const DocController = require('../controllers/DocController')

// Creates an instance and config it to save files in '~/Downloads/uploads' directory
const uploadPath = path.join(os.homedir(), 'Downloads', 'upload');
const upload = multer({dest: uploadPath })
const router = express.Router();

router.get('/login', FilesController.getLoginForm)

router.post('/login', FilesController.login)

router.post('/user/register', UserController.newUser)

router.post('/doc/register', DocController.newDoc)

router.get('/userDocs', AuthController.isAuthenticated, UserController.getMyDoctors)

router.post('/addDocs/:name/:docemail/:medicalLicenceNumber', AuthController.isAuthenticated, UserController.addDoctor);

router.get('/user/me', AuthController.isAuthenticated, UserController.currentUser)

router.get('/doc/me', AuthController.isAuthenticated, DocController.currentDoc)

router.get('/files', AuthController.isAuthenticated, FilesController.getAllFiles)

router.get('/files/:name', AuthController.isAuthenticated, FilesController.getFile)

router.get('/allusers', AuthController.isAuthenticated, UserController.getAllUsers);

router.get('/userfiles/:userEmail', AuthController.isAuthenticated, FilesController.getUserFile);

router.post('/uploadFiles', AuthController.isAuthenticated, upload.single('file'), FilesController.postFile);

router.get('/doctors/departments', AuthController.isAuthenticated, FilesController.doctorsDepts)

router.get('/alldoctors/:department', AuthController.isAuthenticated, DocController.findDocsByDept)

router.get('/alldoctors', AuthController.isAuthenticated, DocController.findAllDocs)


module.exports = router;
