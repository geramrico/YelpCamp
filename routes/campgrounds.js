const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");

const { validateCampground, isLoggedIn, isAuthor } = require("../middleware");

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
    newCamp.author = req.user._id; //Add author to campground (Section 52)
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
    const campground = await Campground.findById(id)
      .populate({
        path: "reviews",   //1 populate all the reviews from the array in campground
        populate: {       //then populate on each one of them the author
          path: "author",
        },
      })
      .populate("author"); //separetly populate the one author in the campground

    console.log(campground);
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
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Can't find Campground"); // FLASH ERROR IF CAMP DOESNT EXIST
      res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);

//update camp info via POST

router.patch(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    //Original
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Successfully updated the campground!"); //Midleware in index.js will show it
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

//Delete campground by ID
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const deletedCamp = await Campground.findByIdAndDelete(req.params.id);
    req.flash("deleted", `Successfully deleted ${deletedCamp.title}`);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
