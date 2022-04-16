module.export = function (err, req, res, next) {
  res.status(500).json({ error: "Something failed" });
};
