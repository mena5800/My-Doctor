// routes/fileRoutes.js
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');
const fileController = require('../controllers/fileController');

const router = express.Router();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

router.post('/upload/:userId', upload.single('file'), fileController.uploadFile);
router.get('/files/:userId', fileController.getFilesByUserId);
router.delete('/file/:fileId', fileController.deleteFile);
router.put('/file/:fileId', upload.single('file'), fileController.editFile);

module.exports = router;
