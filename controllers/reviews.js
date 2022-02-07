const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  const review = new Review(req.body.review);

  review.author = req.user._id; //associate review with a user

  camp.reviews.push(review);
  await review.save();
  await camp.save();
  req.flash("success", "Created new review");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  //pull anything with that reviewId from reviews
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId); //Still have a ref in the camp

  req.flash("deleted", "Deleted review");
  res.redirect(`/campgrounds/${id}`);
};
