const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const User = require("../models/user");
const passport = require("passport");
const { del } = require("express/lib/application");

const users = require("../controllers/users");

router.get("/register", catchAsync(users.renderNewUserForm));

router.post("/register", catchAsync(users.createUser));

router.get(
  "/login",
  catchAsync((req, res) => {
    res.render("users/login");
  })
);

router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), //Passport middleware for auth
  catchAsync(users.loginUser)
);

router.get("/logout", users.logoutUser);

module.exports = router;
