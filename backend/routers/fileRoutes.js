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

// Router.get(
//   "/files",
//   AuthMiddleware.isAuthenticated,
//   FilesController.getAllUserFiles
// );

// Router.get(
//   "/files/images",
//   AuthMiddleware.isAuthenticated,
//   FilesController.getAllUserImages
// );

// Router.get(
//   "/files/pdfs",
//   AuthMiddleware.isAuthenticated,
//   FilesController.getAllUserPdfs
// );

// Router.get(
//   "/files/others",
//   AuthMiddleware.isAuthenticated,
//   FilesController.getAllUserOthers
// );

// fileRouter.get('/files/:fileName', AuthMiddleware.isAuthenticated, FilesController.getFile)

// fileRouter.get('/userfiles/:userEmail', AuthMiddleware.isAuthenticated, FilesController.getUserFile);

// Router.post(
//   "/uploadFiles",
//   AuthMiddleware.isAuthenticated,
//   upload.single("file"),
//   FilesController.postFile
// );

// Router.get(
//   "/files",
//   AuthMiddleware.isAuthenticated,
//   FilesController.getAllUserFiles
// );

// Router.delete(
//   "/files/:fileId",
//   AuthMiddleware.isAuthenticated,
//   FilesController.deleteFile
// );

module.exports = Router;
