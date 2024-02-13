/** @format */

const router = require("express").Router();
const {
  createChat,
  createGroupChat,
} = require("../../controller/chatController/chatController");
const Authentication = require("../../middleware/authentication");

router.post("/", Authentication, createChat);
router.post("/create/group", Authentication, createGroupChat);

module.exports = router;
