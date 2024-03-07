/** @format */

const createError = require("http-errors");
const Chat = require("../../schema/chat/chatSchema");
const User = require("../../schema/user/userSchema");
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
        cat: body.type,
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
        .populate({ path: "lastMsg", select: "content" })
        .sort({ createdAt: -1 });
      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetFullChat(id) {
    try {
      const chat = await Chat.findById(id);
      if (!chat.isGroup) {
        const fullData = await chat.populate({
          path: "users",
          select: "_id name username p_i",
        });
        return fullData;
      } else {
        const fullData = await chat.populate({
          path: "creator",
          select: "_id name username email p_i",
        });
        return fullData;
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleAddMember(id, body) {
    try {
      const usersId = body.user;
      await Chat.findByIdAndUpdate(
        id,
        {
          $addToSet: { users: { $each: usersId } },
        },
        { new: true }
      );
      return { msg: "Users are added" };
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
      return { msg: `Group ${key} has been updated.`, group: result };
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

  async handleAcceptJoinRequest(groupId, userId, isAccept) {
    try {
      const group = await Chat.findById(groupId).select("pending");
      const isPending = group.pending && group.pending.includes(userId);
      const options = isPending ? "$pull" : "$addToSet";
      await Chat.findByIdAndUpdate(
        groupId,
        { [options]: { pending: userId } },
        { new: true }
      );
      console.log(isAccept, typeof isAccept);
      if (isAccept === "true") {
        const result = await Chat.findByIdAndUpdate(
          groupId,
          { $addToSet: { users: userId } },
          { new: true }
        );
        return { msg: "Joining request has been accepted", chat: result };
      }
      return { msg: "Joining request has not been accepted" };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleRemoveGroup(groupId, userId) {
    try {
      await Chat.findByIdAndUpdate(
        groupId,
        { $pull: { users: userId } },
        { new: true }
      );
      await Chat.findByIdAndUpdate(
        groupId,
        { $pull: { admin: userId } },
        { new: true }
      );
      return { msg: "User has been removed from group" };
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
        const result = await Chat.findByIdAndDelete(groupId);
        return { msg: "Group has been deleted", chat: result };
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetGroupChats(userId, page, limit) {
    try {
      const groups = await Chat.find({
        $and: [
          { isGroup: true },
          { creator: { $ne: userId } },
          { users: { $ne: userId } },
        ],
      })
        .populate({ path: "creator", select: "_id name username p_i" })
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdAt: -1 });
      return groups;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetSortedGroups(page, limit, sorttype, userId) {
    try {
      console.log(page, limit, sorttype, userId);
      const groups = await Chat.find({
        $and: [{ creator: { $ne: userId } }, { users: { $ne: userId } }],
      })
        .find({ cat: { $eq: sorttype } })
        .populate({ path: "creator", select: "_id name username p_i" })
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdAt: -1 });

      return groups;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetMembers(id, page, limit) {
    try {
      const group = await Chat.findById(id);
      // console.log(group);
      const members = group.users;
      const startIndex = limit * (page - 1);
      const lastIndex = limit * page;
      const temp = members.splice(startIndex, lastIndex);
      const users = await User.find({ _id: { $in: temp } }).select({
        name: 1,
        _id: 1,
        username: 1,
        p_i: 1,
      });
      return users;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleAddAdmin(chatId, userId) {
    try {
      const chat = await Chat.findById(chatId).select("admin");
      const isAdmin = chat.admin && chat.admin.includes(userId);
      const option = isAdmin ? "$pull" : "$addToSet";

      const update = await Chat.findByIdAndUpdate(
        chatId,
        {
          [option]: { admin: userId },
        },
        { new: true }
      );
      return {
        msg: isAdmin ? "Remove from  admin" : "Add as an admin",
        chat: update,
      };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleViewsUsers(chatId, body, page, limit, user) {
    try {
      const searchTerm = body.search
        ? {
            $or: [
              { name: { $regex: body.search, $options: "i" } },
              { username: { $regex: body.search, $options: "i" } },
            ],
          }
        : {};

      // Fetch the group members
      const groupMembers = await Chat.findById(chatId).select("users");
      const memberIds = groupMembers.users;
      //  // Exclude users who are members of the group

      // Find users excluding the group members
      const users = await User.find({ ...searchTerm, _id: { $nin: memberIds } })
        .find({ _id: { $ne: user._id } })
        .select({ _id: 1, name: 1, p_i: 1, username: 1 })
        .sort({ createdAt: -1 })
        .skip(limit * (page - 1))
        .limit(limit);

      return users;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetPendingList(id, page, limit) {
    try {
      const group = await Chat.findById(id);
      console.log(group);
      const members = group.pending;
      const startIndex = limit * (page - 1);
      const lastIndex = limit * page;
      const temp = members.splice(startIndex, lastIndex);
      const users = await User.find({ _id: { $in: temp } }).select({
        name: 1,
        _id: 1,
        username: 1,
        p_i: 1,
      });
      return users;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }
}

module.exports = new ChatModel();
