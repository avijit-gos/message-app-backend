/** @format */

const createError = require("http-errors");
const Message = require("../../schema/messages/messageSchema");
const Chat = require("../../schema/chat/chatSchema");
const { uploadImage } = require("../../helper/helper");
const {
  encryptMessage,
  decryptMessage,
} = require("../../encrypt-decrypt/encrypt");
const { default: mongoose } = require("mongoose");

class MessageModel {
  constructor() {}

  async handleCreateMessage(id, body, files, userId) {
    try {
      let url = "";
      let encryptMessageData = "";
      // if message containes image file then "uploadImage()" function should call
      if (files) {
        url = await uploadImage(files.image);
      }
      // if message containes text message then "encryptMessage()" function should call
      if (body.message.trim()) {
        encryptMessageData = await encryptMessage(body.message);
      }

      const newMessage = Message({
        _id: new mongoose.Types.ObjectId(),
        image: url,
        content: encryptMessageData,
        chat: id,
        user: userId,
      });
      const result = await newMessage.save();
      await result.populate({ path: "user", select: "_id name p_i" });
      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetMessage(id, page, limit) {
    try {
      const messages = await Message.find({ chat: { $eq: id } })
        .populate({ path: "user", select: "_id name username p_i" })
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdAt: -1 });
      return messages;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleUpdateMessage(id, message) {
    try {
      const encryptMessageData = await encryptMessage(message);
      const update = await Message.findByIdAndUpdate(
        id,
        { $set: { message: encryptMessageData } },
        { new: true }
      );
      // const decryptData = await decryptMessage(update.content);
      // update.content = decryptData;
      return { msg: "Message has been updated", message: update };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handlePinMessage(body) {
    try {
      const chatData = await Chat.findById(body.chatId).select("pin");
      const isPinned = chatData.pin && chatData.pin.includes(body.messageId);
      const option = isPinned ? "$pull" : "$addToSet";
      await Chat.findByIdAndUpdate(
        body.chatId,
        {
          [option]: { pin: body.messageId },
        },
        { new: true }
      );
      const result = await Message.findByIdAndUpdate(
        body.messageId,
        { $set: { pin: !isPinned } },
        { new: true }
      );
      return {
        msg: isPinned ? "Unpinned this message" : "Pinned this message",
        message: result,
      };
    } catch (error) {
      throw createError.BadRequest({ msg: error.message });
    }
  }
}

module.exports = new MessageModel();
