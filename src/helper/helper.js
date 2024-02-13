/* eslint-disable no-undef */
/** @format */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

class Helper {
  constructor() {}

  async hashPassword(password) {
    try {
      const hashPass = await bcrypt.hash(password, 10);
      return hashPass;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async comparePassword(password, user) {
    try {
      const result = await bcrypt.compare(password, user.password);
      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async generateToken(body) {
    try {
      const token = await jwt.sign(
        {
          _id: body._id,
          email: body.email,
          name: body.name,
          username: body.username,
        },
        // eslint-disable-next-line no-undef
        process.env.SECRET_KEY,
        { expiresIn: "30d" }
      );
      return token;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async uploadImage(image) {
    try {
      const result = await cloudinary.uploader.upload(image.tempFilePath);
      return result.url;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }
}

module.exports = new Helper();
