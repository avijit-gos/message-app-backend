/** @format */

const mongoose = require("mongoose");
const User = require("../../schema/user/userSchema");
const createError = require("http-errors");
const {
  hashPassword,
  generateToken,
  comparePassword,
  uploadImage,
} = require("../../helper/helper");

class UserController {
  constructor() {}

  async handleUserRegister(body) {
    try {
      const user = await User.findOne({
        $or: [{ email: body.email }, { username: body.username }],
      });
      if (user) {
        throw createError.BadRequest({ msg: "User already exists" });
      } else {
        const hash = await hashPassword(body.password);
        const newUser = User({
          _id: new mongoose.Types.ObjectId(),
          name: body.name,
          email: body.email,
          password: hash,
          username: body.username,
        });
        const userData = await newUser.save();
        // generate token
        const token = await generateToken(userData);
        return { msg: "Successfully registered", user: userData, token };
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleLoginUser(body) {
    try {
      const user = await User.findOne({
        $or: [{ email: body.userInfo }, { username: body.userInfo }],
      });
      if (!user) {
        throw createError.BadRequest({
          msg: "Username or Email does not exists",
        });
      } else {
        const isPasswordCorrect = await comparePassword(body.password, user);
        if (!isPasswordCorrect) {
          throw createError.BadRequest({ msg: "Password is not correct" });
        } else {
          const token = await generateToken(user);
          return { msg: "Login successfull", user, token };
        }
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetUserProfile(id) {
    try {
      const result = await User.findById(id).select("name username email p_i");
      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleUploadImage(image, id) {
    try {
      const imageURL = await uploadImage(image);
      // console.log(imageURL);
      const result = await User.findByIdAndUpdate(
        id,
        { $set: { p_i: imageURL } },
        { new: true }
      );
      return { msg: "Profile image successfully updated", result };
    } catch (error) {
      throw createError.BadRequest(error);
    }
  }

  async handleUpdateProfile(key, value, id) {
    try {
      const result = await User.findByIdAndUpdate(
        id,
        { $set: { [key]: value } },
        { new: true }
      );
      return { msg: `${key} has been updated`, user: result };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleSearchUsers(data, user, page, limit) {
    const searchTerm = data.search
      ? {
          $or: [
            { name: { $regex: data.search, $options: "i" } },
            { username: { $regex: data.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(searchTerm)
      .find({
        _id: { $ne: user._id },
      })
      .select(["_id", "name", "username", "p_i"])
      .limit(page)
      .skip(limit * (page - 1));
    return users;
  }
}

module.exports = new UserController();
