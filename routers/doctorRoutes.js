const express = require('express');
const AuthController = require('../controllers/AuthController')
const DocController = require('../controllers/DocController')


const doctorRouter = express.Router();
/*
doctorRouter.post('/doc/register', DocController.newDoc)
doctorRouter.get('/doc/me', AuthController.isAuthenticated, DocController.currentDoc)
doctorRouter.get('/alldoctors/:department', AuthController.isAuthenticated, DocController.findDocsByDept)
doctorRouter.get('/alldoctors', AuthController.isAuthenticated, DocController.findAllDocs)*/

doctorRouter.post('/doctor/register', DocController.newDoc);
doctorRouter.get('/doctor/current', AuthController.isAuthenticated, DocController.currentDoc);
doctorRouter.get('/doctors', AuthController.isAuthenticated, DocController.findAllDocs);
doctorRouter.get('/doctors/department/:department', AuthController.isAuthenticated, DocController.findDocsByDept);
doctorRouter.post('/doctor/profile', DocController.updateDoctorProfile);

module.exports = doctorRouter;