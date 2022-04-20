require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.log("Error to MongoDB...", err);
  });

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "MERN",
    author: "Vigneshwaran",
    tags: ["Javascript", "Node", "CSS"],
    isPublished: true,
  });

  const result = await course.save();
  console.log("result", result);
}

async function getCourses() {
  const courses = await Course.find({ name: "MERN" })
    .limit(2)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log("courses", courses);
}

// createCourse();
getCourses();