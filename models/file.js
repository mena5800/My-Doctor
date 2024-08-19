// File's Schema
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  s3Key: { type: String, required: true },
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  url: { type: String, required: true },
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
