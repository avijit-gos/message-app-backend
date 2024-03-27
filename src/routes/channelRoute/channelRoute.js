/** @format */

const router = require("express").Router();
const {
  createChannel,
  getChannels,
  getChannelDetails,
  getAllChannels,
  updateChannelName,
  updateChannelBio,
  updateChannelProfileImage,
  followChannel,
  deleteChannel,
  getFollowers,
} = require("../../controller/channelController/channelController");
const Authentication = require("../../middleware/authentication");
const {
  validateCreateGroupChatInput,
  validateGroupNameInput,
  validateGroupBioInput,
  validateImage,
} = require("../../validator/validator");

router.get("/all", Authentication, getAllChannels);
router.post("/", Authentication, validateCreateGroupChatInput, createChannel);
router.get("/", Authentication, getChannels);
router.get("/:id", Authentication, getChannelDetails);
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
// get followers lists of channel
router.get("/followers-list/:id", Authentication, getFollowers);

module.exports = router;
