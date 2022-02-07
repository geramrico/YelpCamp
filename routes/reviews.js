const express = require("express");
const router = express.Router({ mergeParams: true }); //mergeParams to take id from the index route (first :ID)


const catchAsync = require("../utils/catchAsync");

const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");

const reviews = require("../controllers/reviews");

//Add review to campground
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

//Delete review from campground
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
