/** @format */

const router = require("express").Router();
const {
  createChannel,
  getChannels,
  getAllChannels,
  updateChannelName,
  updateChannelBio,
  updateChannelProfileImage,
  followChannel,
  deleteChannel,
} = require("../../controller/channelController/channelController");
const Authentication = require("../../middleware/authentication");
const {
  validateCreateGroupChatInput,
  validateGroupNameInput,
  validateGroupBioInput,
  validateImage,
} = require("../../validator/validator");

router.post("/", Authentication, validateCreateGroupChatInput, createChannel);
router.get("/", Authentication, getChannels);
router.get("/all", Authentication, getAllChannels);
router.put(
  "/update-name/:id",
  validateGroupNameInput,
  Authentication,
  updateChannelName
);
// update channel bio
router.put(
  "/update-bio/:id",
  validateGroupBioInput,
  Authentication,
  updateChannelBio
);
// update channel profile image
router.put(
  "/update-image/:id",
  validateImage,
  Authentication,
  updateChannelProfileImage
);

// follow-following
router.put("/follow/:id", Authentication, followChannel);
// delete channel
router.delete("/:id", Authentication, deleteChannel);

module.exports = router;
