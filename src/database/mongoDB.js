/** @format */

const mongoose = require("mongoose");
// eslint-disable-next-line no-undef
mongoose.connect(process.env.DB_URL);
mongoose.connection.on("connected", () => console.log("DB is connecetd"));
mongoose.connection.on("error", () => console.log("DB not is connecetd"));
