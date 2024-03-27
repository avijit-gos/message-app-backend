/** @format */

const mongoose = require("mongoose");

const TimelineSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    cat: { type: Number, default: 0 },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Timeline", TimelineSchema);
