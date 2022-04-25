const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const router = express.Router();

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

const genres = [
  { id: 1, name: "MERN" },
  { id: 2, name: "React Native" },
  { id: 3, name: "React" },
];

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).required(),
  });

  return schema.validate(genre);
}

router.get("/", async (req, res) => {
  const genres = await Genre.find({}).sort("name");
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return res.status(404).json({ error: "Genre not found" });
  }
  res.send(genre);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  try {
    const genre = new Genre({
      name: req.body.name,
    });

    const result = await genre.save();
    res.send(result);
  } catch (er) {
    for (field in er.errors) {
      console.log(er.errors[field].message);
    }
  }
});

router.put("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send("Genre not found");
  }

  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send("Genre not found");
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

module.exports = router;
