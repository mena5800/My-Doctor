const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required:[true, "chat should have doctor"]},
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:[true, "chat should have patient"]},
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

// chatSchema.index({ doctor: 1, patient: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
