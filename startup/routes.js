const express = require("express");
const customers = require("../routes/customers");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/customers", customers);
  app.use(error);
};
