/** @format */
const Timeline = require("../../schema/Timeline/TimelineSchema");
const createError = require("http-errors");

class TimelineModel {
  constructor() {}

  async handleGetTimeline(id, page, limit) {
    try {
      const result = await Timeline.find({ chat: id })
        .sort({ createdAt: 1 })
        .limit(limit)
        .skip(limit * (page - 1))
        .populate({ path: "user", select: "name" });

      return result;
    } catch (error) {
      throw createError.BadRequest(error.message);
    }
  }
}

module.exports = new TimelineModel();
