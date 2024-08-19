const express = require('express');
const PatientProfileController = require('../controllers/PatientProfileController');

const profileRouter = express.Router();

profileRouter.get('/patientprofile', PatientProfileController.getPatientProfile);
profileRouter.post('/patientprofile', PatientProfileController.savePatientProfile);


module.exports = profileRouter
