/** @format */

const createError = require("http-errors");
const {
  handleCreateChat,
  handleCreateGroupChat,
  handleGetChats,
  handleGetFullChat,
  handleAddMember,
  handleUpdateGroupInfo,
  handleUploadImage,
  handleJoinGroupRequest,
  handleAcceptJoinRequest,
  handleRemoveGroup,
  handleLeaveGroup,
  handleDeleteGroup,
  handleGetGroupChats,
  handleGetSortedGroups,
  handleGetMembers,
  handleAddAdmin,
  handleViewsUsers,
  handleGetPendingList,
  handleBlockSingleChat,
} = require("../../model/chat/chat");

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
      const result = await handleCreateGroupChat(req.body, req.user);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getChats(req, res, next) {
    try {
      const result = await handleGetChats(req.user);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getFullchat(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Chat id is not defined");
      } else {
        const result = await handleGetFullChat(req.params.id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async addMember(req, res, next) {
    try {
      if (!req.params.id && req.body.user) {
        throw createError.BadRequest("Group id is not present");
      } else {
        const result = await handleAddMember(req.params.id, req.body);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async getGroups(req, res, next) {
    try {
      console.log("GET GROUPS");
      // const page = req.query.page || 1;
      // const limit = req.query.limit || 10;
      // const sortType = req.query.sortType || "all";
      // const result = await handleGetGroups(page, limit, sortType);
      // return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateGroupName(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Group id is not present");
      } else {
        console.log(req.params.id, req.body.name);
        const result = await handleUpdateGroupInfo(
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

  async updateGroupBio(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Group id is not present");
      } else {
        const result = await handleUpdateGroupInfo(
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

  async updateGroupImage(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Group id is not present");
      } else {
        const result = await handleUploadImage(req.files.image, req.params.id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async joinGroupRequest(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Group id is invalid");
      } else {
        const result = await handleJoinGroupRequest(
          req.params.id,
          req.user._id
        );
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async acceptJoinRequest(req, res, next) {
    try {
      if (!req.params.id || !req.body.user) {
        throw createError.BadRequest("Group id is invalid");
      } else {
        const result = await handleAcceptJoinRequest(
          req.params.id,
          req.body.user,
          req.query.isAccept
        );
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async removeGroup(req, res, next) {
    try {
      if (!req.params.id || !req.body.user) {
        throw createError.BadRequest("Group or user id is invalid");
      } else {
        const result = await handleRemoveGroup(req.params.id, req.body.user);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async leaveGroup(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Group or user id is invalid");
      } else {
        const result = await handleLeaveGroup(req.params.id, req.user._id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteGroup(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Group id is invalid");
      } else {
        console.log("Came here");
        const result = await handleDeleteGroup(req.params.id, req.user._id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async getGroupChats(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const result = await handleGetGroupChats(req.user._id, page, limit);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSortedGroups(req, res, next) {
    try {
      console.log("CAME");
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const sorttype = req.query.sorttype || "Education";
      const result = await handleGetSortedGroups(
        page,
        limit,
        sorttype,
        req.user._id
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("Group id is not defined");
      } else {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const result = await handleGetMembers(req.params.id, page, limit);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async addAdmin(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("group id is not valid");
      } else {
        const result = await handleAddAdmin(req.params.id, req.body.user);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async viewUsers(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest("group id is not valid");
      } else {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const result = await handleViewsUsers(
          req.params.id,
          req.query,
          page,
          limit,
          req.user
        );
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async getPendingList(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest({ msg: "Chat id is not defined" });
      } else {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const result = await handleGetPendingList(req.params.id, page, limit);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async blockSingleChat(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest({ msg: "Invalid chat id" });
      } else {
        const result = await handleBlockSingleChat(req.params.id, req.user._id);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();
