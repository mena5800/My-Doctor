const uuid = require('uuid');
const sha256 = require('js-sha256');
const fs = require('fs');
const mime = require('mime-types')
const path = require('path');
const mongoose = require('mongoose')
const File = require('../models/file')
const User = require('../models/user')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../utils/s3');

class FilesController {

  static async getAllUserFiles(req, res) {
    await File.find({ userId: req.session.user._id })
    .then ((files) => res.status(200).send(files))
    .catch(() => res.status(500).json({ error: 'Internal Error' }))
  }

  static async postFile(req, res) {
    try {
      // const user = await User.findById(req.params.userId);
      // if (!user) return res.status(404).send('User not found');
      
      const file = new File({
        userId: req.session.user._id,
        s3Key: req.file.key,
        fileName: req.file.originalname,
        url: `${process.env.S3_URL}/${req.file.key}`
      });
  
      await file.save();
      res.status(200).json({ message: 'File uploaded successfully', file });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteFile(req, res){
    try {
      const file = await File.findById(req.params.fileId);
      if (!file) return res.status(404).send('File not found');
  
      // Create the DeleteObjectCommand
      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.s3Key
      };
      const command = new DeleteObjectCommand(deleteParams);
  
      // Send the command to S3
      await s3.send(command);
  
      // Delete file record from MongoDB
      await file.deleteOne();
  
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Edit (replace) a file
  static async editFile(req, res){
    try {
      const file = await File.findById(req.params.fileId);
      if (!file) return res.status(404).send('File not found');
  
      // Delete the old file from S3
      const deleteParams = { Bucket: process.env.S3_BUCKET_NAME, Key: file.s3Key };
      const command = new DeleteObjectCommand(deleteParams);
  
      // Send the command to S3
      await s3.send(command);
      
      // Upload the new file
      file.s3Key = req.file.key;
      file.fileName = req.file.originalname;
      await file.save();
  
      res.status(200).json({ message: 'File edited successfully', file });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

}

module.exports = FilesController;
