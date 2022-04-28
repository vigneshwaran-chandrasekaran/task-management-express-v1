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
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["web", "html", "css", "js"],
    lowercase: true,
    // uppercase: true,
    trim: true,
  },
  author: String,
  tags: [String],
  tags: {
    type: Array,
    validate: {
      validator: function (v) {
        return v?.length > 0;
      },
      message: "couse should have atlead one tags",
    },
  },
  places: {
    type: Array,
    validate: {
      validator: function (v) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const result = v && v.length > 0;
            resolve(result);
          }, 4000);
        });
      },
      message: "places should have atlead one place",
    },
    required: [true, "places is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "MERN JS",
    category: "HTML",
    author: "Vigneshwaran",
    tags: ["Javascript", "Node", "CSS"],
    category: "web",
    places: ["india"],
    isPublished: false,
    price: 11.22,
  });

  try {
    const result = await course.save();
    // const result = await course.validate();
    console.log("result", result);
  } catch (er) {
    for (field in er.errors) {
      console.log(er.errors[field].message);
    }
  }
}

async function getCourses() {
  const courses = await Course.find({ name: "MERN" })
    .limit(2)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });
  console.log("courses", courses);
}

async function updateCoursesQueryFirst(id) {
  // 1. Query First
  // findById()
  // Modify its properties
  // save()

  const course = await Course.findById(id);

  if (!course) {
    console.log("Course not found");
    return;
  }

  // first approach
  course.isPublished = false;

  // second approach
  course.set({
    author: "Vigneshwaran Chandrasekaran",
  });

  const result = await course.save();

  console.log("course result", result);
}

async function updateCoursesUpdateFirst(id) {
  // 2. Update First
  // Update directly
  // Optionally: get the updated document
  const result = await Course.updateOne(
    { _id: id },
    {
      $set: {
        author: "Vigneshwaran India 123",
      },
    }
  );

  console.log("course result", result);
}

async function updateCoursesUpdateFirst(id) {
  // 2. Update First
  // Update directly
  // Optionally: get the updated document
  const result = await Course.updateOne(
    { _id: id },
    {
      $set: {
        author: "Vigneshwaran India 123",
      },
    }
  );

  console.log("course result", result);
}

async function updateCoursesUpdateFirstReturn(id) {
  // 2. Update First
  // Update directly
  // Optionally: get the updated document
  const result = await Course.findOneAndUpdate(
    id,
    {
      $set: {
        author: "Vigneshwaran Change",
      },
    },
    { new: true }
  );

  console.log("course result", result);
}

async function removeCourse(id) {
  // const course = await Course.deleteOne({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log("course result", course);
}

createCourse();
// getCourses();
// updateCoursesQueryFirst("6260529a899da5851fea7122");
// updateCoursesUpdateFirst("6260529a899da5851fea7122");
// updateCoursesUpdateFirstReturn("6260529a899da5851fea7122");
// removeCourse("6260529a899da5851fea7122");
