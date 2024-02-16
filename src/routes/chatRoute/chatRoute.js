/** @format */

const router = require("express").Router();
const {
  createChat,
  createGroupChat,
  getChats,
  addMember,
  getGroups,
  updateGroupName,
  updateGroupBio,
  updateGroupImage,
  joinGroupRequest,
  acceptJoinRequest,
  removeGroup,
  leaveGroup,
  deleteGroup,
} = require("../../controller/chatController/chatController");
const Authentication = require("../../middleware/authentication");
const {
  validatesingleChatInput,
  validateCreateGroupChatInput,
  validateGroupNameInput,
  validateGroupBioInput,
  validateImage,
} = require("../../validator/validator");

// routes
router.post("/", Authentication, validatesingleChatInput, createChat);
router.post(
  "/create/group",
  Authentication,
  validateCreateGroupChatInput,
  createGroupChat
);
router.get("/", Authentication, getChats);
router.put("/add-member/:id", Authentication, addMember);
router.get("/get-groups", Authentication, getGroups);
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
router.put("/join-request/:id", Authentication, joinGroupRequest);
router.put("/accept-join-request/:id", Authentication, acceptJoinRequest);
router.put("/remove-group/:id", Authentication, removeGroup);
router.put("/leave-group/:id", Authentication, leaveGroup);
router.delete("/delete-group/:id", Authentication, deleteGroup);
module.exports = router;
