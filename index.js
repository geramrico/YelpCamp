// Package requirements imports
const path = require("path"); //for the views directory
const express = require("express"); //Framework
const mongoose = require("mongoose"); //Database
const methodOverride = require("method-override"); //Override POST for Delete, patch, put methods
const ejsMate = require("ejs-mate"); //Templating
const session = require("express-session"); //For flash messages, cookies
const flash = require("connect-flash");

//AUTHENTICATION
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//Utils imports
const ExpressError = require("./utils/ExpressError"); //I made this in another file, to catch errors.

//Import Routes
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const usersRoutes = require("./routes/users");

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
app.use(session(sessionConfig)); //Use session - cookies (489)
app.use(flash());

// Part 508
app.use(passport.initialize()); // Read passport Docs
app.use(passport.session()); //
passport.use(new LocalStrategy(User.authenticate())); // We'd like to use the local strategy.  Auth method will be on user model
passport.serializeUser(User.serializeUser()); // How do we store a user in the session
passport.deserializeUser(User.deserializeUser()); //How to get a user out of the session

// Middleware to log the request, runs on every request
app.use((req, res, next) => {
  console.log(req.method.toUpperCase(), req.path);
  next();
});

//Flash messages using middleware. Each flash message is on the route where I need to use it.
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.deleted = req.flash("deleted");
  next();
});

// ROUTES
app.get("/fakeUser", async (req, res) => {
  const user = new User({ email: "gm@gmail.com", username: "gmr" });
  //Register a User
  const newUser = await User.register(user,'chicken');  //Passport
  res.send(newUser)
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

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
