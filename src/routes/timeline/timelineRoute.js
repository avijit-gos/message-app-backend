/** @format */

const router = require("express").Router();
const {
  getTimeline,
} = require("../../controller/timelineController/timelineController");
const Authentication = require("../../middleware/authentication");

router.get("/:id", Authentication, getTimeline);
module.exports = router;
