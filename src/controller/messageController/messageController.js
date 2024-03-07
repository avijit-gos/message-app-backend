/** @format */

const createError = require("http-errors");
const {
  handleCreateMessage,
  handleGetMessage,
  handleUpdateMessage,
  handlePinMessage,
  handleLikeMessage,
  handleDeleteMessage,
} = require("../../model/message/message");

class MessageController {
  constructor() {}

  async createMessage(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Chat id is not present");
      } else {
        const result = await handleCreateMessage(
          req.params.id,
          req.body,
          req.files,
          req.user._id
        );
        return res.status(201).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Chat id is not present");
      } else {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const result = await handleGetMessage(req.params.id, page, limit);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateMessage(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Message id is not defined");
      } else if (!req.body.message.trim()) {
        throw createError.BadRequest("Message cann't be an empty string");
      } else {
        const result = await handleUpdateMessage(
          req.params.id,
          req.body.message
        );
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async pinnMessage(req, res, next) {
    try {
      if (!req.body.chatId.trim()) {
        throw createError.BadRequest({ msg: "Invalid chat id" });
      } else if (!req.body.messageId.trim()) {
        throw createError.BadRequest({ msg: "Invalid message id" });
      } else {
        const result = await handlePinMessage(req.body);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async likeMessage(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest({ msg: "Message id is invalid" });
      } else {
        const result = await handleLikeMessage(req.params.id, req.user);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest({ msg: "Message id is invalid" });
      } else {
        const result = await handleDeleteMessage(req.params.id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MessageController();
