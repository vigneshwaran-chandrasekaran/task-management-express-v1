const express = require("express");
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  const genres = await Genre.find({}).sort("name");
  throw new Error("Whoops!");
  res.send(genres);
});

router.get("/:id", auth, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return res.status(404).json({ error: "Genre not found" });
  }
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  try {
    const genre = new Genre({
      name: req.body.name,
    });

    await genre.save();
    res.send(genre);
  } catch (er) {
    for (field in er.errors) {
      console.log(er.errors[field].message);
    }
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) {
    return res.status(404).json({ error: "Genre not found" });
  }

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
    return res.status(404).json({ error: "Genre not found" });
  }

  res.send(genre);
});

module.exports = router;
