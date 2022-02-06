const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundJoiSchema } = require("../schemas.js");

const { isLoggedIn } = require("../middleware");

//Validation function using JOI
const validateCampground = (req, res, next) => {
  const { error } = campgroundJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//Index route -> shows all camps
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//Add campground via POST
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Camp Data", 400); //Handled by the catchAsync (catches errors and sends it to next)
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    req.flash("success", "Created a new campground!"); //Midleware in index.js will show it
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

// New route ----->
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// Show route ----->
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");

    // FLASH ERROR IF CAMP DOESNT EXIST
    if (!campground) {
      req.flash("error", "Can't find Campground");
      res.redirect("/campgrounds");
    }

    res.render("campgrounds/show", { campground });
  })
);

// Edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    // FLASH ERROR IF CAMP DOESNT EXIST
    if (!campground) {
      req.flash("error", "Can't find Campground");
      res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);

//update camp info via POST
router.patch(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Successfully updated the campground!"); //Midleware in index.js will show it
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//Delete campground by ID
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const deletedCamp = await Campground.findByIdAndDelete(req.params.id);
    req.flash("deleted", `Successfully deleted ${deletedCamp.title}`);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
