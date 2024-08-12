// controllers/fileController.js
const s3 = require('../config/s3');
const File = require('../models/file');
const User = require('../models/user');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Upload a file
exports.uploadFile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    const file = new File({
      userId: user._id,
      s3Key: req.file.key,
      fileName: req.file.originalname,
      url: `${process.env.S3_URL}/${req.file.key}`
    });

    await file.save();
    res.status(200).json({ message: 'File uploaded successfully', file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get files by user ID
exports.getFilesByUserId = async (req, res) => {
  try {
    const files = await File.find({ userId: req.params.userId });
    if (files.length === 0) return res.status(404).send('No files found for this user');

    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
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
exports.editFile = async (req, res) => {
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
