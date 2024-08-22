const mongoose = require("mongoose");
const User = require("./user");

const doctorSchema = new mongoose.Schema(
  {
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
        ref: "Patient",
      },
    ],
  },
  { versionKey: false }
);

const Doctor = User.discriminator("Doctor", doctorSchema);

module.exports = Doctor;
