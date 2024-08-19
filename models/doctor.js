const mongoose = require('mongoose');
const crypto = require('crypto');
const {v4: uuidv4 } = require('uuid');


// Doctor's Schema
const doctorsSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: [true, 'Missing Email'], unique: true },
  password: { type: String, required: [true, 'No password is provided'] },
  gender: { type: String, required: [true, 'Missing Gender'] },
  contactInfo: { type: String, required: [true, 'Provide your Contact Number'] },
  medicalLicenceNumber: { type: Number, required: [true, 'No Medical Licence Number is provided'] },
  specialization: { type: String, required: [true, 'Area of Specialization is required'] },
  yearsOfExperience: { type: Number, required: [true, 'Number of Years of Experience is Required'] },
  department: { type: String, required: [true, 'Select a Department'] }
}, { versionKey: false });

// pre-save middleware to hash the password
doctorsSchema.pre('save', function(next) {
  if (this.isModified) {
    this.password = hashedPassword(this.password);
  }
  next();
})

const Doctor = mongoose.model('Doctor', doctorsSchema);


module.exports = Doctor
