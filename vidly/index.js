const express = require("express");
const res = require("express/lib/response");

const app = express();

const courses = [
  { id: 1, name: "MERN" },
  { id: 2, name: "React Native" },
  { id: 3, name: "React" },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("Course not found");
  }
  res.send(course);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
