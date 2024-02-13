/** @format */

const createError = require("http-errors");
const Chat = require("../../schema/chat/chatSchema");
const { default: mongoose } = require("mongoose");

class ChatModel {
  constructor() {}

  async handleCreateChat(profileId, userId) {
    try {
      const result = await Chat.findOne({
        isGroup: false,
        $and: [
          { users: { $elemMatch: { $eq: profileId } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      }).populate({ path: "users", select: "_id name username p_i" });

      if (!result) {
        const chatObj = Chat({
          _id: new mongoose.Types.ObjectId(),
          creator: userId,
          users: [profileId, userId],
        });
        const result = await chatObj
          .save()
          .populate({ path: "users", select: "_id name username p_i" })
          .populate({ path: "lastMsg", select: "content" });
        return result;
      } else {
        return result;
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }
}

module.exports = new ChatModel();
