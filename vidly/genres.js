const express = require("express");
const Joi = require("joi");
const res = require("express/lib/response");

const app = express();

app.use(express.json());

const genres = [
  { id: 1, name: "MERN" },
  { id: 2, name: "React Native" },
  { id: 3, name: "React" },
];

function validateCourse(genre) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).required(),
  });

  return schema.validate(genre);
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send("Course not found");
  }
  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const { error } = validateCourse(req.body);

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

app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send("Course not found");
  }

  const { error } = validateCourse(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  genre.name = req.body.name;
  res.send(genre);
});

app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(404).send("Course not found");
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

const port = process.env.PORT || 3100;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
