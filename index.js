const winston = require("winston");
const express = require("express");
require("dotenv").config();

const app = express();

// import error from "./middleware/error";

// app.use(error);

const port = process.env.PORT;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);

console.log(process.env.jwtPrivateKey);
console.log(process.env.DB);
console.log(process.env.PORT);

module.exports = server;
