const mongoose = require("mongoose");
const hashedPassword = require("../utils/hash");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Missing name"] },
    email: { type: String, required: [true, "Missing Email"], unique: true },
    password: { type: String, required: [true, "No password provided"] },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    contactInfo: {
      type: String,
    },
    role: { type: String, enum: ["Patient", "Doctor"], required: true },
    unreadMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { versionKey: false, discriminatorKey: "role" }
);

// pre-save middleware to hash the password
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hashedPassword(this.password);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
