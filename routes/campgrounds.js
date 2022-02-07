const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");


const { validateCampground, isLoggedIn, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

//Index route -> shows all camps
router.get("/", catchAsync(campgrounds.index));

// New route ----->
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

//Add campground via POST
router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground));

// Show route ----->
router.get("/:id", catchAsync(campgrounds.showCampground));

// Edit form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground));

//update camp info via POST
router.patch("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

//Delete campground by ID
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
