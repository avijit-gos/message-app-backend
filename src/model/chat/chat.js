/** @format */

const createError = require("http-errors");
const Chat = require("../../schema/chat/chatSchema");
const { default: mongoose } = require("mongoose");
const { uploadImage } = require("../../helper/helper");

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
      })
        .populate({ path: "users", select: "_id name username p_i" })
        .populate({ path: "lastMsg", select: "content" });

      if (!result) {
        const chatObj = Chat({
          _id: new mongoose.Types.ObjectId(),
          creator: userId,
          users: [profileId, userId],
        });
        const result = await chatObj.save();

        const chatData = await Chat.findById(result._id)
          .populate({ path: "users", select: "_id name username p_i" })
          .populate({ path: "lastMsg", select: "content" });
        return chatData;
      } else {
        return result;
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleCreateGroupChat(body, user) {
    try {
      const chatObj = new Chat({
        _id: new mongoose.Types.ObjectId(),
        name: body.name,
        isGroup: body.isGroup,
        creator: user._id,
        bio: body.bio,
        type: body.type,
        users: body.members,
      });
      const groupChat = await chatObj.save();
      const result = await Chat.findById(groupChat._id).populate({
        path: "creator",
        select: "_id name p_i username",
      });
      return { msg: "New group has been created", chat: result };
    } catch (error) {
      console.log(error);
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetChats(user) {
    try {
      const result = await Chat.find({
        $or: [
          { creator: user._id },
          { users: { $elemMatch: { $eq: user._id } } },
        ],
      })
        .populate({ path: "users", select: "_id name username p_i" })
        .populate({ path: "lastMsg", select: "content" });
      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleAddMember(id, body) {
    try {
      const group = await Chat.findById(id);
      const isMember = group.users.includes(body.user);
      const options = isMember ? "$pull" : "$addToSet";

      const result = await Chat.findByIdAndUpdate(
        id,
        {
          [options]: { users: body.user },
        },
        { new: true }
      );
      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetGroups(page, limit, sortType) {
    try {
      let result = await Chat.find({ type: sortType })
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdAt: -1 });
      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleUpdateGroupInfo(key, id, value) {
    try {
      const result = await Chat.findByIdAndUpdate(
        id,
        { [key]: value },
        { new: true }
      );
      return { mag: `Group ${key} has been updated.`, group: result };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleUploadImage(image, id) {
    try {
      const imageURL = await uploadImage(image);
      // console.log(imageURL);
      const result = await Chat.findByIdAndUpdate(
        id,
        { $set: { p_i: imageURL } },
        { new: true }
      );
      return { msg: "Profile image successfully updated", result };
    } catch (error) {
      throw createError.BadRequest(error);
    }
  }

  async handleJoinGroupRequest(groupId, userId) {
    try {
      const group = await Chat.findById(groupId).select("pending");
      const isPending = group.pending && group.pending.includes(userId);
      const options = isPending ? "$pull" : "$addToSet";
      const result = await Chat.findByIdAndUpdate(
        groupId,
        { [options]: { pending: userId } },
        { new: true }
      );
      return { msg: "Your joining request has been sent", chat: result };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleAcceptJoinRequest(groupId, userId) {
    try {
      const group = await Chat.findById(groupId).select("pending");
      const isPending = group.pending && group.pending.includes(userId);
      const options = isPending ? "$pull" : "$addToSet";
      await Chat.findByIdAndUpdate(
        groupId,
        { [options]: { pending: userId } },
        { new: true }
      );
      const result = await Chat.findByIdAndUpdate(
        groupId,
        { $addToSet: { users: userId } },
        { new: true }
      );
      return { msg: "Joining request has been accepted", chat: result };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleRemoveGroup(groupId, userId) {
    try {
      const group = await Chat.findById(groupId).select("admin users");
      if (group.admin.includes(userId)) {
        await Chat.findByIdAndUpdate(
          groupId,
          { $pull: { admin: userId } },
          { new: true }
        );
      }
      const result = await Chat.findByIdAndUpdate(
        groupId,
        { $pull: { users: userId } },
        { new: true }
      );
      return { msg: "User has been removed from  the group", chat: result };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleLeaveGroup(groupId, userId) {
    try {
      const group = await Chat.findById(groupId).select("admin users");
      if (group.admin.includes(userId)) {
        await Chat.findByIdAndUpdate(
          groupId,
          { $pull: { admin: userId } },
          { new: true }
        );
      }
      const result = await Chat.findByIdAndUpdate(
        groupId,
        { $pull: { users: userId } },
        { new: true }
      );
      return { msg: "User has been removed from  the group", chat: result };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleDeleteGroup(groupId, userId) {
    try {
      const group = await Chat.findById(groupId).select("creator");
      if (group.creator.toString() !== userId) {
        throw createError.BadRequest({ msg: "Invalid creator" });
      } else {
        await Chat.findByIdAndDelete(groupId);
        return { msg: "Group has been deleted" };
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }
}

module.exports = new ChatModel();
