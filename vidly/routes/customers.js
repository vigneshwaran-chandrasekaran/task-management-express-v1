const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const router = express.Router();

const customerSchema = new mongoose.Schema({
  isGold: Boolean,
  name: String,
  phone: String,
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).required(),
    isGold: Joi.string().alphanum().min(3).required(),
    phone: Joi.string().alphanum().min(3).required(),
  });

  return schema.validate(customer);
}

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
  const { error } = validateCustomer(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  try {
    const customer = new Customer({
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    });

    const result = await customer.save();
    res.send(result);
  } catch (er) {
    for (field in er.errors) {
      console.log(er.errors[field].message);
    }
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);

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
