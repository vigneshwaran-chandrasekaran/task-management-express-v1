
const Joi = require("joi");
const mongoose = require("mongoose");


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


  module.exports.Customer = Customer;
  module.exports.validate = validateCustomer;