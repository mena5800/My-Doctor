const mongoose = require('mongoose');
const crypto = require('crypto');

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

//====================== User's Schema ===============================
// Doctor's sub Schema in User's Schema
const doctorSubSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Missing Doctor\'s Name'] },
  email: { type: String, required: [true, 'Missing Email'] },
  medicalLicenceNumber: { type: String, required: [true, 'No medical Licence number'] }
}, { _id: false, versionKey: false, strict: true });


// userProfile's Schema
const usersProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Missing fullName'] },
  email: {type: String, required: true },
  age: { type: Number, required: false },
  gender: { type: String, required: [true, 'Missing Gender'] },
  medicalHistory: { type: String, required: false},
}, { versionKey: false, _id: false, strict: true })


// User's Schema
const usersSchema = new mongoose.Schema({
  email: { type: String, required: [true, 'Missing Email'], unique: true },
  password: { type: String, required: [true, 'No password provided'] },
  doctors: { type: [doctorSubSchema], required: false },
  medicalRecordUploads: { type: String, required: false },
  profile: { type: [usersProfileSchema], required: false },
}, { versionKey: false, strict: true });

// pre-save middleware to hash the password
usersSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = hashedPassword(this.password);
  }
  next();
})

//====================== User's Schema ===============================


//====================== Doctor's Schema ===============================

// doctorProfile's Schema
const doctorsProfileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: [true, 'Missing Gender'] },
  contactInfo: { type: Number, required: [true, 'Provide your Contact Number'] },
  dateOfBirth: { type: Number, required: [false, 'Missing Date of Birth'] },
  medicalLicenceNumber: { type: Number, required: true },
  department: { type: String, required: true },
  specialization: { type: String, required: true },
  yearsOfExperience: { type: Number, required: [true, 'Number of Years of Experience is Required'] },
  medicalHistory: { type: String, required: false},
}, { versionKey: false, _id: false, strict: true })

// Doctor's Schema
const doctorsSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, 'Missing Name'] },
  email: { type: String, required: [true, 'Missing Email'], unique: true },
  password: { type: String, required: [true, 'No password is provided'] },
  medicalLicenceNumber: { type: Number, required: [true, 'No Medical Licence Number is provided'], unique: true },
  department: { type: String, required: [true, 'Select a Department'] },
  specialization: { type: String, required: [true, 'Area of Specialization is required'] },
  medicalRecordUploads: { type: String, required: false },
  profile: { type: [doctorsProfileSchema], required: false },
}, { versionKey: false, strict: true });


// pre-save middleware to hash the password
doctorsSchema.pre('save', function(next) {
  if (this.isModified) {
    this.password = hashedPassword(this.password);
  }
  next();
})

//====================== Doctor's Schema ===============================



//====================== File's Schema ===============================

// File's Schema
const filesSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: [true, 'File user Id is required'] },
  path: { type: String, required: true },
}, { versionKey: false })

//====================== File's Schema ===============================


const User = mongoose.model('users', usersSchema);
const Doctor = mongoose.model('doctors', doctorsSchema);
const File = mongoose.model('files', filesSchema);


module.exports = {
  User,
  Doctor,
  File,
}
