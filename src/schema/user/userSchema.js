/** @format */

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    type: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, trim: true, required: true },
    username: { type: String, trim: true, unique: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String },
    p_i: { type: String, default: "" },
    bio: { type: String, default: "" },
    gender: { type: String },
    hobbies: { type: [String] }, // interest
    details: {
      city: { type: String },
      country: { type: String },
      ip: { type: String },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
