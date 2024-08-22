const express = require("express");
const AuthMiddleware = require("../middlewares/authentication");
const patientController = require("../controllers/patientController");

const Router = express.Router();

// Router.post("/doctor", AuthMiddleware.isAuthenticated, patientController.addDoctor);
// Router.post("/doctor", AuthMiddleware.isAuthenticated, patientController.addDoctor);


// userRouter.get(
//   "/logout",
//   AuthMiddleware.isAuthenticated,
//   AuthMiddleware.deleteToken
// );

// userRouter.get(
//   "/userDocs",
//   AuthMiddleware.isAuthenticated,
//   UserController.getMyDoctors
// );

// userRouter.post(
//   "/addDocs/",
//   AuthMiddleware.isAuthenticated,
//   UserController.addDoctor
// );

// userRouter.get(
//   "/user/me",
//   AuthMiddleware.isAuthenticated,
//   UserController.currentUser
// );

// userRouter.get(
//   "/allusers",
//   AuthMiddleware.isAuthenticated,
//   UserController.getAllUsers
// );

// userRouter.get("/checkSession", UserController.checkSession);

// userRouter.get(
//   "/patientprofile",
//   AuthMiddleware.isAuthenticated,
//   UserController.getPatientProfile
// );

module.exports = Router;
