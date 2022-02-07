const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const passport = require("passport");


const users = require("../controllers/users");

router.get("/register", catchAsync(users.renderNewUserForm));
router.post("/register", catchAsync(users.createUser));

router.get("/login", catchAsync(users.renderLogin));
router.post(
  "/login",
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), //Passport middleware for auth
  catchAsync(users.loginUser)
);

router.get("/logout", users.logoutUser);

module.exports = router;
