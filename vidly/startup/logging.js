const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  process
    .on("unhandledRejection", (reason, p) => {
      console.error(reason, "Unhandled Rejection at Promise", p);
      winston.error(reason.message, reason);
    })
    .on("uncaughtException", (err) => {
      console.error(err, "Uncaught Exception thrown");
      winston.error(err.message, err);
    });

  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      handleExceptions: true,
    })
  );

  winston.add(
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      level: "info",
    })
  );
};
