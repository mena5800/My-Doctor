const express = require('express');
const UserController = require('../controllers/UserController');
const FilesController = require('../controllers/FilesController');
const AuthController = require('../controllers/AuthController');
const DocController = require('../controllers/DocController'); // Import the DocController

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


router.post('/doctor/register', DocController.newDoc);
//router.get('/doctor/current', DocController.currentDoc);
router.get('/doctors', DocController.findAllDocs);
router.get('/doctors/department/:department', DocController.findDocsByDept);
router.post('/doctor/profile', DocController.updateDoctorProfile);
router.get('/doctor/current', DocController.getCurrentDoctor);



module.exports = router;
