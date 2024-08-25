const express = require("express");
const AuthMiddleware = require("../middlewares/authentication");
const DoctorController = require("../controllers/doctorController");

const Router = express.Router();


Router.get("", AuthMiddleware.isAuthenticated, DoctorController.findAllDoctors);
Router.get("/:department", AuthMiddleware.isAuthenticated, DoctorController.findDoctorsByDepartment);
Router.get("/departments", AuthMiddleware.isAuthenticated, DoctorController.GetDoctorsDepartments);
Router.post("/:doctorId", AuthMiddleware.isAuthenticated, DoctorController.addDoctorToPatient);

module.exports = Router;
