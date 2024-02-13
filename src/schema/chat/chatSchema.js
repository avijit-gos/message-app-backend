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
    type: { type: String, trim: true, default: "" },
    admin: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    block: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    lastMsg: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
