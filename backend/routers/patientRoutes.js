const express = require("express");
const AuthMiddleware = require("../middlewares/authentication");
const patientController = require("../controllers/patientController");

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


module.exports = Router;
