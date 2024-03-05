/** @format */

const router = require("express").Router();
const {
  createMessage,
  getMessages,
  updateMessage,
  pinnMessage,
} = require("../../controller/messageController/messageController");
const Authentication = require("../../middleware/authentication");

router.post("/:id", Authentication, createMessage);
router.get("/:id", Authentication, getMessages);
router.put("/update-message/:id", Authentication, updateMessage);
router.put("/pin-messsage", Authentication, pinnMessage);

module.exports = router;
