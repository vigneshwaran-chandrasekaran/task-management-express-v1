module.exports = function (err, req, res, next) {
  res.status(500).send("500 Something Failed");
};
