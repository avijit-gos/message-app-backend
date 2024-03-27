/** @format */

const createError = require("http-errors");
const { handleGetTimeline } = require("../../model/timeline/timeline");
class TimelineController {
  async getTimeline(req, res, next) {
    try {
      if (!req.params.id) {
        throw createError.BadRequest({ msg: "chat id is not valid" });
      } else {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const result = await handleGetTimeline(req.params.id, page, limit);
        return res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TimelineController();
