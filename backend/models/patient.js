const mongoose = require("mongoose");
const User = require("./user");

const patientSchema = new mongoose.Schema(
  {
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
