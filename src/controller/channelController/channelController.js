/** @format */

const {
  handleCreateChannel,
  handleGetChannels,
  handleGetChannel,
  handleGetAllChannels,
  handleUpdateChannelInfo,
  handleUploadImage,
  handleFollowChannel,
  handleDeleteChannel,
  handleGetFollowers,
} = require("../../model/channel/channel");

const createError = require("http-errors");

class ChannelController {
  constructor() {}

  async createChannel(req, res, next) {
    try {
      const result = await handleCreateChannel(req.body, req.user);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getChannels(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const result = await handleGetChannels(page, limit, req.user);
      return res.status(200).json(result);
    } catch (error) {
      throw next(error);
    }
  }

  async getChannelDetails(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest({ msg: "Invalid channel id" });
      } else {
        const result = await handleGetChannel(req.params.id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllChannels(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const sortType = req.query.sortType || "all";
      const result = await handleGetAllChannels(
        page,
        limit,
        sortType,
        req.user
      );
      return res.status(200).json(result);
    } catch (error) {
      throw next(error);
    }
  }

  async updateChannelName(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest({ msg: "Channel id is not defined" });
      } else {
        const result = await handleUpdateChannelInfo(
          "name",
          req.params.id,
          req.body.name
        );
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateChannelBio(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest({ msg: "Channel id is not defined" });
      } else {
        const result = await handleUpdateChannelInfo(
          "bio",
          req.params.id,
          req.body.bio
        );
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async updateChannelProfileImage(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Channel id is not present");
      } else {
        const result = await handleUploadImage(req.files.image, req.params.id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async followChannel(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Channel id is not present");
      } else {
        const result = await handleFollowChannel(req.user, req.params.id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteChannel(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Channel id is not present");
      } else {
        const result = await handleDeleteChannel(req.params.id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async getFollowers(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Channel id is not present");
      } else {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const result = await handleGetFollowers(req.params.id, page, limit);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new ChannelController();
