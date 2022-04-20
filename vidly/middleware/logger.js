function log(req, res, next) {
  console.log("Logging...", process.env.NODE_ENV);
  next();
}

module.exports = log;
