require("dotenv").config();
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const logger = require("./middleware/logger");
const error = require("./middleware/error");
const courses = require("./routes/courses");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

const app = express();

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

throw new Error("Node js Error!");

// error
// warn
// info
// verbose
// debug
// silly

winston.add(
  new winston.transports.MongoDB({
    db: process.env.MONGO_URI,
    level: "info",
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.log("Error to MongoDB...", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(logger);

if (app.get("env") === "development") {
  startupDebugger("Morgan enabled...");
  dbDebugger("dbDebugger enabled...");
  app.use(morgan("tiny"));
}

app.use("/api/courses", courses);
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

app.get("/", (req, res) => {
  res.send("Welcome to vidly World");
});

app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

const port = process.env.PORT || 3100;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
