const express = require("express");
const AuthMiddleware = require("../middlewares/authentication");
const PatientController = require("../controllers/patientController");

const Router = express.Router();

// Router.post("/doctor", AuthMiddleware.isAuthenticated, patientController.addDoctor);


// userRouter.get(
//   "/userDocs",
//   AuthMiddleware.isAuthenticated,
//   UserController.getMyDoctors
// );

// userRouter.get(
//   "/allusers",
//   AuthMiddleware.isAuthenticated,
//   UserController.getAllUsers
// );

Router.post("/adddoctor/:doctorId", AuthMiddleware.isAuthenticated, PatientController.addDoctor);
Router.delete("/removedoctor/:doctorId", AuthMiddleware.isAuthenticated, PatientController.removeDoctor);

module.exports = Router;
