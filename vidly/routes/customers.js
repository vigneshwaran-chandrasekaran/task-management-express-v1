const express = require("express");
const { Customer, validate } = require("../models/customer");

const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find({}).sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }
  res.send(customer);
});

router.post("/", async (req, res) => {
  console.log("req.body", req.body);
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  try {
    const customer = new Customer({
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    });

    await customer.save();
    res.send(customer);
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

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { isGold: req.body.isGold, name: req.body.name, phone: req.body.phone },
    { new: true }
  );

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  res.send(customer);
});

module.exports = router;
