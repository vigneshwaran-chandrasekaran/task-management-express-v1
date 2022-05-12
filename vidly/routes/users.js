const express = require("express");
const { pick } = require("lodash");
const bcrypt = require("bcrypt");
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
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, salt),
    });

    await user.save();

    user = pick(user, ["_id", "name", "email"]);

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
