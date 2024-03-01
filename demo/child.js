/** @format */

const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const fileUploader = require("express-fileupload");
const createError = require("http-errors");
const mongoose = require("mongoose");
// const db = mongoose.connection;
mongoose.connect(process.env.DB_URL);
mongoose.connection.on("connection", () => console.log("DB connected")); // Corrected event name

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(
  fileUploader({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(logger("dev"));

app.use("/api/user", require("../src/routes/userRoutes/userRoute"));

app.use(async (req, res, next) => {
  next(createError.NotFound("Page not found"));
});
// Error message
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const port = 8000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-undef
  console.log(`Server running on ${port} with PID:${process.pid}`);
});

module.exports = { server };
