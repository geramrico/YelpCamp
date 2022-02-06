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
