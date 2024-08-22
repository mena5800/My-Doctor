const express = require("express");
const AuthMiddleware = require("../middlewares/authentication");
const DoctorController = require("../controllers/doctorController");

const Router = express.Router();

// Router.post("/doctor/register", DoctorController.newDoc);
// // doctorRouter.post("/doctor/login", DocController.login);

// Router.get(
//   "/doctor/logout",
//   AuthMiddleware.isAuthenticated,
//   AuthMiddleware.deleteToken
// );

// Router.get(
//   "/doctor/me",
//   AuthMiddleware.isAuthenticated,
//   DocController.currentDoc
// );

// Router.get(
//   "/alldoctors/:department",
//   AuthMiddleware.isAuthenticated,
//   DocController.findDocsByDept
// );

// Router.get(
//   "/alldoctors",
//   AuthMiddleware.isAuthenticated,
//   DocController.findAllDocs
// );
// Router.get(
//   "/doctors/departments",
//   AuthMiddleware.isAuthenticated,
//   DocController.doctorsDepts
// );

module.exports = Router;
