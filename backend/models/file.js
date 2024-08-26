// File's Schema
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  s3Key: { type: String, required: true },
  fileName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  url: { type: String, required: true },
  type: { type: String, required:[true, "file type is required"],enum: [
    "image",
    "pdf",
    "other"
  ]}
});

const File = mongoose.model("File", fileSchema);

module.exports = File;
