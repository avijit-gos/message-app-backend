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
} = require("../../controller/chatController/chatController");
const Authentication = require("../../middleware/authentication");

router.post("/", Authentication, createChat);
router.post("/create/group", Authentication, createGroupChat);
router.get("/", Authentication, getChats);
router.put("/add-member/:id", Authentication, addMember);
router.get("/get-groups", Authentication, getGroups);
router.put("/update-name/:id", Authentication, updateGroupName);
router.put("/update-bio/:id", Authentication, updateGroupBio);
router.put("/update-profile-image/:id", Authentication, updateGroupImage);

module.exports = router;
