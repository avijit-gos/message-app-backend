/** @format */

const mongoose = require("mongoose");

const ChannelSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, trim: true, default: "" },
    creator: { type: mongoose.Schema.ObjectId, ref: "User" },
    bio: { type: String, trim: true, default: "" },
    p_i: { type: String, default: "" },
    type: { type: String, trim: true, default: "" },
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    lastMsg: { type: String, trim: true, default: "" },
    privacy: {
      msg: { type: String, default: "none" },
      view_mem: { type: String, default: "none" },
      view_grp_details: { type: String, default: "all" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", ChannelSchema);
