// Package requirements imports
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

// ROUTES
app.get("/", (req, res) => {
  res.send("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.post("/campgrounds", async (req, res) => {
  const newCamp = new Campground(req.body.campground);
  await newCamp.save();
  res.redirect(`/campgrounds/${newCamp._id}`);
});

// New route ----->
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// Show route ----->
app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});

// Editing ------>
app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

app.patch("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect("/campgrounds");
});

app.use((req, res) => {
  res.status(404).send("NOT FOUND");
});

app.listen(3000, () => {
  console.log("On port 3000");
});
