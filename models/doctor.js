// Doctor's Schema
const mongoose = require("mongoose");
const hashedPassword = require("../utils/hash");

// Doctor's Schema
const doctorsSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Missing Name"] },
    email: { type: String, required: [true, "Missing Email"], unique: true },
    password: { type: String, required: [true, "No password is provided"] },
    gender: { type: String, required: [true, "Missing Gender"] },
    contactInfo: {
      type: String,
      required: [true, "Provide your Contact Number"],
    },
    medicalLicenceNumber: {
      type: Number,
      required: [true, "No Medical Licence Number is provided"],
    },
    yearsOfExperience: {
      type: Number,
      required: [true, "Number of Years of Experience is Required"],
    },
    department: {
      type: String,
      required: [true, "Select a Department"],
      enum: [
        "Emergency Department (ED)",
        "Cardiology",
        "Oncology",
        "Pediatrics",
        "Orthopedics",
        "Radiology",
        "Neurology",
        "Gynecology and Obstetrics",
        "Gastroenterology",
        "Dentistry",
      ],
    },
    patients: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
    ]
  },
  { versionKey: false }
);

// pre-save middleware to hash the password
doctorsSchema.pre("save", function (next) {
  if (this.isModified) {
    this.password = hashedPassword(this.password);
  }
  next();
});

const Doctor = mongoose.model("Doctor", doctorsSchema);

module.exports = Doctor;
