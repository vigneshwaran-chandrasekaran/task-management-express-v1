const express = require("express");
const { User, validate } = require("../models/user");

const router = express.Router();

router.get("/", async (req, res) => {
  const user = await User.find({}).sort("name");
  res.send(user);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).json({ error: "User Already registered" });
  }

  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();
    res.send(user);
  } catch (er) {
    console.log("er", er);
    for (field in er.errors) {
      console.log(er.errors[field].message);
    }
    return res.status(400).send(er);
  }
});

module.exports = router;
