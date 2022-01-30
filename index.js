// Package requirements imports
const path = require("path"); //for the views directory
const express = require("express"); //Framework
const mongoose = require("mongoose"); //Database
const methodOverride = require("method-override"); //Override POST for Delete, patch, put methods
const ejsMate = require("ejs-mate"); //Templating
const session = require("express-session"); //For flash messages, cookies

//Session configuration, cookies #489
const sessionConfig = {
  secret: "thisisgoingtobearealsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, //security #489
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

//Utils imports
const ExpressError = require("./utils/ExpressError"); //I made this in another file, to catch errors.

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
app.engine("ejs", ejsMate); // For templating
app.set("view engine", "ejs"); //Set view view engine (like handlebars, jinja, etc)
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method")); //To overide post method for deletes, puts, patch, etc
app.use(express.static("public")); // To serve static assets such as JS Scripts, css, images.
app.use(session(sessionConfig)); //Use session - cookies (489)

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
