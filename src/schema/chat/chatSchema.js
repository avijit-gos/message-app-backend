/** @format */

const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, trim: true, default: "" },
    isGroup: { type: Boolean, default: false },
    creator: { type: mongoose.Schema.ObjectId, ref: "User" },
    users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    bio: { type: String, trim: true, default: "" },
    p_i: { type: String, default: "" },
    cat: { type: String, trim: true, default: "" },
    admin: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    pin: [{ type: mongoose.Schema.ObjectId, ref: "Chat" }],
    block: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    pending: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    lastMsg: { type: String, trim: true, default: "" },
    blocked: {
      isBlocked: { type: Boolean, default: false }, // this is only valid for single chat
      blockedBy: { type: Array },
    },
    privacy: {
      timeline_p: { type: String, default: "all" },
      message_p: { type: String, default: "all" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
