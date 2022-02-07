const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validateCampground, isLoggedIn, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router
    .route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground));

// New route ----->
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground)) //Show route
  .patch(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground)) //Update
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); //Delete campground

// Edit form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground));

module.exports = router;
