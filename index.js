// Package requirements imports
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//Utils imports
const ExpressError = require("./utils/ExpressError");


//Import Routes
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

// Middleware to log the request, runs on every request
app.use((req, res, next) => {
  console.log(req.method.toUpperCase(), req.path);
  next();
});

// ROUTES
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.send("home");
});

//If routes before where not found
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

//Error catching
app.use((err, req, res, next) => {
  const { status = 500 } = err; //Destructure from ExpressError Util
  if (!err.msg) err.msg = "Oh no! Something went wrong";
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("On port 3000");
});
