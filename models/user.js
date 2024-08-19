// User's Schema
const mongoose = require("mongoose");
const hashedPassword = require("../utils/hash");

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Missing name"] },
    email: { type: String, required: [true, "Missing Email"], unique: true },
    password: { type: String, required: [true, "No password provided"] },
    gender: {
      type: String,
      required: [true, "Missing Gender"],
      enum: ["male", "female"],
    },
    contactInfo: {
      type: String,
      required: [true, "Provide your Contact Number"],
    },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    unreadMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]  // Unread messages for the user

  },

  { versionKey: false }
);

// pre-save middleware to hash the password
usersSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hashedPassword(this.password);
  }
  next();
});

const User = mongoose.model("User", usersSchema);

module.exports = User;
