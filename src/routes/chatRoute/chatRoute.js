/** @format */

const router = require("express").Router();
const {
  createChat,
  createGroupChat,
  getChats,
  getFullchat,
  addMember,
  updateGroupName,
  updateGroupBio,
  updateGroupImage,
  joinGroupRequest,
  acceptJoinRequest,
  removeGroup,
  leaveGroup,
  deleteGroup,
  getGroupChats,
  getSortedGroups,
  getMembers,
  addAdmin,
  viewUsers,
  getPendingList,
  blockSingleChat,
} = require("../../controller/chatController/chatController");
const Authentication = require("../../middleware/authentication");
const {
  validatesingleChatInput,
  validateCreateGroupChatInput,
  validateGroupNameInput,
  validateGroupBioInput,
  validateImage,
  validateMongooseId,
} = require("../../validator/validator");

router.get("/sorted-groups", Authentication, getSortedGroups);
router.post("/", Authentication, validatesingleChatInput, createChat);
router.post(
  "/create/group",
  Authentication,
  validateCreateGroupChatInput,
  createGroupChat
);
router.get("/", Authentication, getChats);
router.get("/:id", Authentication, getFullchat);
router.put("/add-member/:id", Authentication, addMember);
router.put(
  "/update-name/:id",
  Authentication,
  validateGroupNameInput,
  updateGroupName
);
router.put(
  "/update-bio/:id",
  Authentication,
  validateGroupBioInput,
  updateGroupBio
);
router.put(
  "/update-profile-image/:id",
  Authentication,
  validateImage,
  updateGroupImage
);
router.put(
  "/join-request/:id",
  validateMongooseId,
  Authentication,
  joinGroupRequest
);
router.put(
  "/accept-join-request/:id",
  validateMongooseId,
  Authentication,
  acceptJoinRequest
);
router.put(
  "/remove-group/:id",
  validateMongooseId,
  Authentication,
  removeGroup
);
router.put("/leave-group/:id", validateMongooseId, Authentication, leaveGroup);
router.delete(
  "/delete-group/:id",
  validateMongooseId,
  Authentication,
  deleteGroup
);
router.put("/my-groups", Authentication, getGroupChats);
router.get("/members/:id", Authentication, getMembers);
router.put("/add/admin/:id", validateMongooseId, Authentication, addAdmin);
router.get("/list-users/:id", validateMongooseId, Authentication, viewUsers);
router.get("/pending/:id", validateMongooseId, Authentication, getPendingList);
router.put(
  "/block/singleChat/:id",
  validateMongooseId,
  Authentication,
  blockSingleChat
);
module.exports = router;
