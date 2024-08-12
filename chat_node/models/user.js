const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hash passwords in real app
  unreadMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]  // Unread messages for the user
});

module.exports = mongoose.model('User', userSchema);
