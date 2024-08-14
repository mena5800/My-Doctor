const express = require('express');
const UserController = require('../controllers/UserController');
const FilesController = require('../controllers/FilesController');
const AuthController = require('../controllers/AuthController');
const PatientProfileController = require('../controllers/PatientProfileController'); // Import the controller

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the My Doctor API!');
});

router.get('/users', UserController.getUserByEmailAndPassword);
router.post('/login', FilesController.login);
router.post('/user/register', UserController.newUser);
router.get('/userDoctors', AuthController.isAuthenticated, FilesController.getMyDoctors);
router.post('/addDoctor', AuthController.isAuthenticated, FilesController.addDoctor);
router.get('/user', AuthController.isAuthenticated, UserController.currentUser);
router.get('/files', AuthController.isAuthenticated, FilesController.getAllFiles);
router.get('/files:name', AuthController.isAuthenticated, FilesController.getFile);
router.get('/userfiles:userEmail', AuthController.isAuthenticated, FilesController.getUserFile);
router.post('/files:data', AuthController.isAuthenticated, FilesController.postFile);

router.get('/patientprofile', PatientProfileController.getPatientProfile);
router.post('/patientprofile', PatientProfileController.savePatientProfile);

module.exports = router;
