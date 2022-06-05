const express = require("express");
const helmet = require("helmet");
const winston = require("winston");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const logger = require("./middleware/logger");

const app = express();
require("./startup/config")();
require("./startup/logging")();
require("./startup/db")();
require("./startup/validation")();
require("./startup/routes")(app);

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(logger);

if (app.get("env") === "development") {
  startupDebugger("Morgan enabled...");
  dbDebugger("dbDebugger enabled...");
  app.use(morgan("tiny"));
}

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
  winston.info(`Listening on port ${port}...`)
});
