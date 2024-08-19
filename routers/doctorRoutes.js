const express = require("express");
const AuthController = require("../controllers/AuthController");
const DocController = require("../controllers/DocController");

const doctorRouter = express.Router();

doctorRouter.post("/doc/register", DocController.newDoc);
doctorRouter.post("/doc/login", DocController.login);

doctorRouter.get(
  "/doc/logout",
  AuthController.isAuthenticated,
  AuthController.deleteToken
);

doctorRouter.get(
  "/doc/me",
  AuthController.isAuthenticated,
  DocController.currentDoc
);

doctorRouter.get(
  "/alldoctors/:department",
  AuthController.isAuthenticated,
  DocController.findDocsByDept
);

doctorRouter.get(
  "/alldoctors",
  AuthController.isAuthenticated,
  DocController.findAllDocs
);
doctorRouter.get(
  "/doctors/departments",
  AuthController.isAuthenticated,
  DocController.doctorsDepts
);

module.exports = doctorRouter;
