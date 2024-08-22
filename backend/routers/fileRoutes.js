const express = require("express");
const multer = require("multer");
const AuthMiddleware = require("../middlewares/authentication");
const FilesController = require("../controllers/filesController");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3");

// Set-up multer's Configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

// Initialize multer with the custom storage configuration

// create a Router
const Router = express.Router();

Router.get(
  "/",
  AuthMiddleware.isAuthenticated,
  FilesController.getAllUserFiles
);

Router.post(
  "/",
  AuthMiddleware.isAuthenticated,
  upload.single("file"),
  FilesController.postFile
);

Router.delete(
  "/:fileId",
  AuthMiddleware.isAuthenticated,
  FilesController.deleteFile
);

Router.get(
  "/images",
  AuthMiddleware.isAuthenticated,
  FilesController.getAllUserImages
);

Router.get(
  "/pdfs",
  AuthMiddleware.isAuthenticated,
  FilesController.getAllUserPdfs
);

Router.get(
  "/others",
  AuthMiddleware.isAuthenticated,
  FilesController.getAllUserOthers
);

module.exports = Router;
