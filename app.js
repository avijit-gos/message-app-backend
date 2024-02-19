/** @format */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const fileUploader = require("express-fileupload");
const createError = require("http-errors");
const mongoose = require("mongoose");
const cluster = require("cluster");
const os = require("os");
const cpuLength = os.cpus().length;

const app = express();

// Mongoose connection
const mongoURI = process.env.DB_URL;

let mongoConnection;
const basePort = 8000;
if (cluster.isPrimary) {
  // Create Mongoose connection in master process
  mongoose.connect(mongoURI);
  mongoConnection = mongoose.connection;
  for (let i = 0; i < cpuLength; i++) {
    // cluster.fork();
    for (let i = 0; i < cpuLength; i++) {
      const port = basePort + i;
      const worker = cluster.fork();
      worker.send({ port }); // Send the port to the worker process
    }
  }
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    // Respawn a new process to replace the one that died
    cluster.fork();
  });
} else {
  // Use the existing Mongoose connection in child processes
  mongoConnection = mongoose.connection.useDb("your_database_name"); // Use your database name
}

mongoConnection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
mongoConnection.once("open", () => {
  console.log("Connected to MongoDB");
});

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

app.use("/api/user", require("./src/routes/userRoutes/userRoute"));

app.use(async (req, res, next) => {
  next(createError.NotFound("Page not found"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

process.on("message", (message) => {
  const { port } = message;
  app.listen(port, () => {
    console.log(`Server running on ${port} with PID:${process.pid}`);
  });
});

