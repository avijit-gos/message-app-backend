/** @format */

const router = require("express").Router();
const {
  createMessage,
  getMessages,
  updateMessage,
  pinnMessage,
  likeMessage,
  deleteMessage,
} = require("../../controller/messageController/messageController");
const Authentication = require("../../middleware/authentication");

router.post("/:id", Authentication, createMessage);
router.get("/:id", Authentication, getMessages);
router.put("/update-message/:id", Authentication, updateMessage);
router.put("/pin-messsage", Authentication, pinnMessage);
router.put("/like-messsage/:id", Authentication, likeMessage);
router.delete("/delete/:id", Authentication, deleteMessage);

module.exports = router;
