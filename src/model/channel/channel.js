/** @format */

const createError = require("http-errors");
const Channel = require("../../schema/channel/channelSchema");
const { default: mongoose } = require("mongoose");
const { uploadImage } = require("../../helper/helper");

class ChannelModel {
  constructor() {}

  async handleCreateChannel(body, user) {
    try {
      const newChannel = Channel({
        _id: new mongoose.Types.ObjectId(),
        name: body.name,
        creator: user._id,
        bio: body.bio,
        type: body.type,
      });
      const channelData = await newChannel.save();
      return { msg: "New channel has been created", channel: channelData };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetChannels(page, limit, user) {
    try {
      const result = await Channel.find({
        $or: [
          { creator: user._id },
          { followers: { $elemMatch: { $eq: user._id } } },
        ],
      })
        .populate({ path: "lastMsg", select: "content" })
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdAt: -1 });
      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleGetAllChannels(page, limit, sortType, user) {
    try {
      if (
        sortType === "Cricket" ||
        sortType === "Football" ||
        sortType === "Education" ||
        sortType === "Technology"
      ) {
        console.log("Others");
      } else {
        const result = await Channel.find({
          $nor: [{ creator: user._id }, { followers: user._id }],
        })
          .populate({ path: "lastMsg", select: "content" })
          .limit(limit)
          .skip(limit * (page - 1))
          .sort({ createdAt: -1 })
          .catch((error) => {
            throw createError.BadRequest(error.message);
          });
        return result;
      }
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleUpdateChannelInfo(key, id, value) {
    try {
      const result = await Channel.findByIdAndUpdate(
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
      const result = await Channel.findByIdAndUpdate(
        id,
        { $set: { p_i: imageURL } },
        { new: true }
      );
      return { msg: "Profile image successfully updated", result };
    } catch (error) {
      throw createError.BadRequest(error);
    }
  }

  async handleFollowChannel(user, id) {
    try {
      const channel = await Channel.findById(id);
      const isFollowed =
        channel.followers && channel.followers.includes(user._id);
      const options = isFollowed ? "$pull" : "$addToSet";
      console.log(options);
      await Channel.findByIdAndUpdate(
        id,
        { [options]: { followers: user._id } },
        { new: true }
      );
      return {
        msg: isFollowed
          ? "You unfollow this channel"
          : "You follow this channel",
      };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }

  async handleDeleteChannel(id) {
    try {
      const channel = await Channel.findByIdAndDelete(id);
      return { msg: "Channel has been deleted", channel };
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }
}
module.exports = new ChannelModel();
