const mongoose = require('mongoose');
const crypto = require('crypto');
const {v4: uuidv4 } = require('uuid');

function hashedPassword(pwd) {
  const hashed = crypto.createHash('sha256').update(pwd)
  return hashed.digest('hex');
}

// Connect mongoose to MongoDB
const uri = 'mongodb://localhost:27017/myDoctor';
// const uri = 'mongodb+srv://bass3fas:2581994@mydoctor.xwqpvzp.mongodb.net/?retryWrites=true&w=majority&appName=MyDoctor';
(async () => {
  mongoose.connect(uri)
  .then(() => console.log('Mongoose Running'))
  .catch(() => console.log('Unable to Connect Mongoose'))
})();

const doctorSubSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: [true, 'Missing Email'], unique: true },
  medicalLicenceNumber: { type: String, required: [true, 'No medical Licence number'] }
}, { _id: false, versionKey: false });

// User's Schema
const usersSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: [true, 'Missing Email'], unique: true },
  password: { type: String, required: [true, 'No password provided'] },
  doctors: { type: [doctorSubSchema], required: false }
}, { versionKey: false });

// pre-save middleware to hash the password
usersSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = hashedPassword(this.password);
  }
  next();
})



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

// File's Schema
const filesSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: [true, 'File user Id is required'] },
  path: { type: String, default: uuidv4, required: true, unique: true },
}, { versionKey: false })

// Profile's Schema
const patientProfileSchema = new mongoose.Schema({
  email: { type: String, required: true }
})


const User = mongoose.model('users', usersSchema);
const Doctor = mongoose.model('doctors', doctorsSchema);
const File = mongoose.model('files', filesSchema);
const Profile = mongoose.model('patientProfile', patientProfileSchema)

module.exports = {
  User,
  Doctor,
  File,
  Profile
}
