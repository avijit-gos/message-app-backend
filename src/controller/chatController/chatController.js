/** @format */

const createError = require("http-errors");
const { handleCreateChat } = require("../../model/chat/chat");

class ChatController {
  constructor() {}

  async createChat(req, res, next) {
    try {
      const result = await handleCreateChat(req.body.user, req.user._id);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createGroupChat(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();
