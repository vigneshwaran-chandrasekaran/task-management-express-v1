require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");

const logger = require("./middleware/logger");
const courses = require("./routes/courses");
const genres = require("./routes/genres");

const app = express();

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
