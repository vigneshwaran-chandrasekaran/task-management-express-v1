const winston = require("winston");
const mongoose = require("mongoose");
require("dotenv").config();

module.exports = function () {
  const db = process.env.MONGO_URI;
  mongoose.connect(db).then(() => winston.info(`Connected to ${db}...`));
};
