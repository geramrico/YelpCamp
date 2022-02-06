const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const User = require("../models/user");
const passport = require("passport");

router.get(
  "/register",
  catchAsync((req, res) => {
    res.render("users/register");
  })
);

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      //Example
      //req.body = {"username":"gmr23","email":"gera23mr@gmail.com","password":"nju765rtghjnbvd345rtghn"}
      const { username, email, password } = req.body;
      const user = new User({ email, username }); //PASSPORT
      const registeredUser = await User.register(user, password); //creates salts and hashes password
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message); //"User already registered" for example..
      res.redirect("register");
    }
  })
);

router.get(
  "/login",
  catchAsync((req, res) => {
    res.render("users/login");
  })
);

router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), //Passport middleware for auth
  catchAsync(async (req, res) => {
    //Maybe shouldnt be async?
    req.flash("success", "welcome back!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
