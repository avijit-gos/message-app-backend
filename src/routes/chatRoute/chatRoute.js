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
} = require("../../validator/validator");
/***
 * 
 * 



 */
// routes
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
router.put("/join-request/:id", Authentication, joinGroupRequest);
router.put("/accept-join-request/:id", Authentication, acceptJoinRequest);
router.put("/remove-group/:id", Authentication, removeGroup);
router.put("/leave-group/:id", Authentication, leaveGroup);
router.delete("/delete-group/:id", Authentication, deleteGroup);
router.put("/my-groups", Authentication, getGroupChats);
router.get("/members/:id", Authentication, getMembers);
router.put("/add/admin/:id", Authentication, addAdmin);
router.get("/list-users/:id", Authentication, viewUsers);
router.get("/pending/:id", Authentication, getPendingList);
router.put("/block/singleChat/:id", Authentication, blockSingleChat);
module.exports = router;
