const express = require("express");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find({}).sort("name");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({ error: "movie not found" });
  }
  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const genre = await Genre.findById(req.body.genreId);
  console.log('genre', genre);
  if (!genre) {
    return res.status(400).json({ error: "Invalid genre" });
  }

  console.log("genre", genre);

  try {
    const movie = new Movie({
      title: req.body.title,
      genre: {
        id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    const result = await movie.save();
    res.send(result);
  } catch (er) {
    for (field in er.errors) {
      console.log(er.errors[field].message);
    }
  }
});

module.exports = router;