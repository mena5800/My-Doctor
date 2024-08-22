const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

// chatSchema.index({ doctor: 1, patient: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
