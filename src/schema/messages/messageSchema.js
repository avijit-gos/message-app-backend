/** @format */

const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    image: { type: String, default: "" },
    content: { type: String, trim: true },
    gif: { type: String, default: "" },
    chat: { type: mongoose.Types.ObjectId, ref: "Chat" },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    book: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    pin: { type: Boolean, default: false },
    replyTo: {
      isReply: { type: Boolean, default: false },
      messageId: { type: mongoose.Types.ObjectId, ref: "Message" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
