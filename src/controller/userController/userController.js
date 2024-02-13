/** @format */

const {
  handleUserRegister,
  handleLoginUser,
  handleGetUserProfile,
  handleUploadImage,
  handleUpdateProfile,
  handleSearchUsers,
} = require("../../model/user/user");
const createError = require("http-errors");

class UserController {
  constructor() {}

  async userRegister(req, res, next) {
    try {
      const result = await handleUserRegister(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async userLogin(req, res, next) {
    try {
      const result = await handleLoginUser(req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Parameter is not present");
      } else {
        const result = await handleGetUserProfile(req.params.id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async uploadProfileImage(req, res, next) {
    try {
      const result = await handleUploadImage(req.files.image, req.user._id);
      return res.status(200).json(result);
    } catch (error) {
      next(error.message);
    }
  }

  async updateProfileBio(req, res, next) {
    try {
      const result = await handleUpdateProfile(
        "bio",
        req.body.bio,
        req.user._id
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateProfileName(req, res, next) {
    try {
      const result = await handleUpdateProfile(
        "name",
        req.body.name,
        req.user._id
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateProfileInterest(req, res, next) {
    try {
      const result = await handleUpdateProfile(
        "hobbies",
        req.body.hobbies,
        req.user._id
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async searchProfile(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const result = await handleSearchUsers(req.query, req.user, page, limit);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
