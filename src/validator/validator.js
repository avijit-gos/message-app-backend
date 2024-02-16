/** @format */
const path = require("node:path");
// validation.js
const { validationResult, body, query } = require("express-validator");
const createError = require("http-errors");
const mongoose = require("mongoose");

// Function to validate user input for creating a user
exports.validateRegisterInput = [
  body("name", { msg: "User name is required" }).trim().isLength({ min: 3 }),
  body("username", { msg: "Username is required" }).trim().isLength({ min: 3 }),
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("password", { msg: "Password is required" }).trim().isLength({ min: 3 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.Conflict({ errors: errors.array()[0] });
    }
    next(); // Call the next middleware if validation passes
  },
];

exports.validateLoginInput = [
  body("userInfo", { msg: "Username or Email is required" })
    .trim()
    .isLength({ min: 3 }),
  body("password", { msg: "Password is required" }).trim().isLength({ min: 3 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.Conflict({ errors: errors.array()[0] });
    }
    next(); // Call the next middleware if validation passes
  },
];

exports.validateImage = [
  // Custom validation to check the file type
  body("image").custom((value, { req, res, next }) => {
    const allowedExtensions = [".gif"];
    const ext = path.extname(req.files.image.name).toLowerCase();
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    // console.log(">>>> ", req.files);

    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "Image file is required" });
    } else if (!allowedExtensions.includes(ext)) {
      throw createError.BadRequest({
        msg: "Only JPG, JPEG, PNG, and GIF files are allowed",
      });
    } else if (req.files.image.size > maxSizeInBytes) {
      throw createError.BadRequest({
        msg: "File size exceeds the limit of 5MB",
      });
    }
    next();
  }),
];

exports.validateSearchInput = [
  query("search", "Minimum 3 characters are required")
    .trim()
    .isLength({ min: 3 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.Conflict({ errors: errors.array()[0] });
    }
    next(); // Call the next middleware if validation passes
  },
];

exports.validatesingleChatInput = [
  // eslint-disable-next-line no-unused-vars
  body("user").custom((value, { req, res, next }) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.user)) {
      throw createError.BadRequest({
        msg: "Invalid object id",
      });
    } else {
      console.log("In else block");
    }
    next();
  }),
];

exports.validateCreateGroupChatInput = [
  body("name", { msg: "Group name is needed" }).trim().isLength({ min: 3 }),
  body("bio", { msg: "Group bio is needed" }).trim().isLength({ min: 3 }),
  body("type", { msg: "Group type is needed" }).trim().isLength({ min: 3 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.Conflict({ errors: errors.array()[0] });
    }
    next(); // Call the next middleware if validation passes
  },
];

exports.validateGroupNameInput = [
  body("name", { msg: "Group name is needed" }).trim().isLength({ min: 3 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.Conflict({ errors: errors.array()[0] });
    }
    next(); // Call the next middleware if validation passes
  },
];

exports.validateGroupBioInput = [
  body("bio", { msg: "Group bio is needed" }).trim().isLength({ min: 3 }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError.Conflict({ errors: errors.array()[0] });
    }
    next(); // Call the next middleware if validation passes
  },
];