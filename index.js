// Package requirements imports
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//Utils imports
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundJoiSchema } = require("./schemas.js");

// Model imports
const Campground = require("./models/campground");

// Connect Mongoose
mongoose.connect("mongodb://localhost:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
  console.log("Database connected!");
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

// Middleware
app.use((req, res, next) => {
  console.log(req.method.toUpperCase(), req.path);
  next();
});

const validateCampground = (req, res, next) => {
  const { error } = campgroundJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// ROUTES
app.get("/", (req, res) => {
  res.send("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Camp Data", 400); //Handled by the catchAsync (catches errors and sends it to next)

    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

// New route ----->
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// Show route ----->
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  })
);

// Editing ------>
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

app.patch(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err; //Destructure from ExpressError Util
  if (!err.msg) err.msg = "Oh no! Something went wrong";
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("On port 3000");
});
