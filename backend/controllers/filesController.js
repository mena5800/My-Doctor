const File = require("../models/file");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../utils/s3");

class FilesController {
  static async getAllUserFiles(req, res) {
    await File.find({ userId: req.session.user.userId })
      .then((files) => res.status(200).send(files))
      .catch(() => res.status(500).json({ error: "Internal Error" }));
  }

  static async getAllUserImages(req, res) {
    await File.find({ userId: req.session.user.userId, type: "image" })
      .then((files) => res.status(200).send(files))
      .catch(() => res.status(500).json({ error: "Internal Error" }));
  }

  static async getAllUserPdfs(req, res) {
    await File.find({ userId: req.session.user.userId, type: "pdf" })
      .then((files) => res.status(200).send(files))
      .catch(() => res.status(500).json({ error: "Internal Error" }));
  }

  static async getAllUserOthers(req, res) {
    await File.find({ userId: req.session.user.userId, type: "other" })
      .then((files) => res.status(200).send(files))
      .catch(() => res.status(500).json({ error: "Internal Error" }));
  }

  static async postFile(req, res) {
    try {
      // const user = await User.findById(req.params.userId);
      // if (!user) return res.status(404).send('User not found');
      let fileName = req.file.originalname;
      let extension = fileName.split(".").pop().toLowerCase();
      const imageExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "tiff",
        "tif",
        "svg",
        "webp",
        "ico",
        "heic",
        "heif",
        "raw",
        "psd",
        "eps",
        "ai",
        "indd",
      ];

      let type = "";

      if (imageExtensions.includes(extension)) {
        type = "image";
      } else if (extension === "pdf") {
        type = "pdf";
      } else {
        type = "other";
      }

      const file = new File({
        userId: req.session.user.userId,
        s3Key: req.file.key,
        fileName: req.file.originalname,
        url: `${process.env.S3_URL}/${req.file.key}`,
        type: type,
      });

      await file.save();
      res.status(200).json({ message: "File uploaded successfully", file });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteFile(req, res) {
    try {
      const file = await File.findById(req.params.fileId);
      if (!file) return res.status(404).send("File not found");
      const userId = req.session.user.userId;

      if (userId != file.userId){
        return res.status(403).json({ error: "You are not authorized to delete this file" });

      }
      // Create the DeleteObjectCommand
      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.s3Key,
      };
      const command = new DeleteObjectCommand(deleteParams);

      // Send the command to S3
      await s3.send(command);

      // Delete file record from MongoDB
      await file.deleteOne();

      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async searchFiles(req, res) {
    try {
      const { name } = req.query;

      // Build the search query
      const query = {
        userId: req.session.user.userId,
        ...(name && { fileName: new RegExp(name, "i") }), // Search by partial name (case-insensitive)
      };

      const files = await File.find(query);

      if (files.length === 0) {
        return res.status(404).json({ message: "No files found matching the criteria" });
      }

      res.status(200).json(files);
    } catch (error) {
      res.status(500).json({ error: "Internal Error" });
    }
  }

}

module.exports = FilesController;
