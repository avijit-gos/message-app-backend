/**
 * eslint-disable no-undef
 *
 * @format
 */

/**
 * eslint-disable no-undef
 *
 * @format
 */

/** @format */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const fileUploader = require("express-fileupload");
const createError = require("http-errors");
require("./src/database/mongoDB");

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
// app.use(logger("dev"));

// user route
app.use("/api/user", require("./src/routes/userRoutes/userRoute"));
// chat route
app.use("/api/chat", require("./src/routes/chatRoute/chatRoute"));
// channel route
app.use("/api/channel", require("./src/routes/channelRoute/channelRoute"));

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

const io = require("socket.io")(server, {
  transports: ["websocket"],
  pingTimeout: 360000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected with socket.io");

  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connection");
  });

  socket.on("join chat", (room) => {
    console.log("Room ID:", room);
    socket.join(room);
  });

  socket.on("update chat", (chat) => {
    console.log("Update chat");
    socket.emit("updated chat", chat);
  });
});

module.exports = server;
