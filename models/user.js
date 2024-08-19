// User's Schema
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: [true, 'Missing Email'], unique: true },
  password: { type: String, required: [true, 'No password provided'] },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    }
  ],
}, { versionKey: false });

// pre-save middleware to hash the password
usersSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = hashedPassword(this.password);
  }
  next();
})


const User = mongoose.model('User', usersSchema);

module.exports = User;
