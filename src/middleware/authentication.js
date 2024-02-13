/** @format */

const jwt = require("jsonwebtoken");
const createError = require("http-errors");
module.exports = async (req, res, next) => {
  try {
    const token = req.query.token || req.headers["x-access-token"];
    if (!token) {
      throw createError.BadRequest({ msg: "Invalid token" });
    }
    // eslint-disable-next-line no-undef
    const validate = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = validate;
    next();
  } catch (error) {
    next(error);
  }
};
