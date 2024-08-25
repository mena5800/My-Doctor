const mongoose = require("mongoose");
const User = require("./user");

const patientSchema = new mongoose.Schema(
  {
    age: { type: String, required: [true, "Missing age"] },
    medicalHistory: { type: String, required: [true, "Missing medical record"] },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ]
  },
  { versionKey: false }
);

const Patient = User.discriminator("Patient", patientSchema);

module.exports = Patient;
