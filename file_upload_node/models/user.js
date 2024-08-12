// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  // other user fields...
});

const User = mongoose.model('User', userSchema);
module.exports = User;
