const express = require("express");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    return res.status(404).json({ error: "Rental not found" });
  }
  res.send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  console.log("error", error);

  if (error) {
    return res.status(400).send(error.message);
  }

  if (!mongoose.Types.ObjectId.isValid(req.body.movieId)) {
    res.status(400).json({ error: "Invalid Movie" });
  }

  if (!mongoose.Types.ObjectId.isValid(req.body.customerId)) {
    res.status(400).json({ error: "Invalid Customer" });
  }


  const movie = await Movie.findById(req.body.movieId);
  const customer = await Customer.findById(req.body.customerId);

  if (!customer) {
    return res.status(400).json({ error: "Invalid customer" });
  }

  if (!movie) {
    return res.status(400).json({ error: "Invalid movie" });
  }

  if (movie.numberInStock === 0) {
    return res.status(400).json({ error: "Movie Not in stock" });
  }

  // https://stackoverflow.com/a/51238033/3882241

  // const session = await Rental.startSession();
  // session.startTransaction();

  try {
    // const opts = { session };

    let rental = new Rental({
      title: req.body.title,
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    });

    // rental = await rental.save(opts);
    rental = await rental.save();

    movie.numberInStock--;
    // movie.save(opts);
    movie.save();

    // await session.commitTransaction();
    // session.endSession();

    res.send(rental);
  } catch (er) {
    console.log("er", er);

    for (field in er.errors) {
      console.log(er.errors[field].message);
    }

    // await session.abortTransaction();
    // session.endSession();
    res.status(500).send("Something failed.");
  }
});

module.exports = router;
