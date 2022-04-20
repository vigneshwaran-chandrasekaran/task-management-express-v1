const express = require("express");
const Joi = require("joi");

const router = express.Router();

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

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send("Genre not found");
  }
  res.send(genre);
});

router.post("/", (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
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
