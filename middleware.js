const { campgroundJoiSchema, reviewJoiSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");

const Review = require("./models/review");
const Campground = require("./models/campground");

//Checks if user is logged in

module.exports.isLoggedIn = (req, res, next) => {
  // console.log("REQ.USER....", req.user);
  if (!req.isAuthenticated()) {
    //Store in session the URL that user was trying to get when not logged in
    req.session.returnTo = req.originalUrl;

    //Check if is authenticated, if not, redirect to login. Only the form
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login"); //return so the next piece of code doesnt run
  }
  next();
};

//Validation function using JOI
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
