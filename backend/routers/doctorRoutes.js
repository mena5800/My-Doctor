const express = require("express");
const AuthMiddleware = require("../middlewares/authentication");
const DoctorController = require("../controllers/doctorController");

const Router = express.Router();


Router.get("", AuthMiddleware.isAuthenticated, DoctorController.findAllDoctors);
Router.get("/patients", AuthMiddleware.isAuthenticated, DoctorController.getAllPatientsOfDoctor);
Router.get("/departments", AuthMiddleware.isAuthenticated, DoctorController.GetDoctorsDepartments);
Router.get("/:department", AuthMiddleware.isAuthenticated, DoctorController.findDoctorsByDepartment);

module.exports = Router;
