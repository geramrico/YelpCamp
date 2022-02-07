const express = require("express");
const router = express.Router({ mergeParams: true }); //mergeParams to take id from the index route (first :ID)

const Review = require("../models/review");
const Campground = require("../models/campground");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const { isLoggedIn,isReviewAuthor, validateReview } = require("../middleware");

//Add review to campground
router.post(
  "/",
  isLoggedIn, //S52
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);

    review.author = req.user._id //associate review with a user

    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success", "Created new review");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

//Delete review from campground
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    //pull anything with that reviewId from reviews
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId); //Still have a ref in the camp

    req.flash("deleted", "Deleted review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
