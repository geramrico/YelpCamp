const User = require("../models/user");

module.exports.renderNewUserForm = (req, res) => {
  res.render("users/register");
};

module.exports.createUser = async (req, res) => {
  try {
    //Example
    //req.body = {"username":"gmr23","email":"gera23mr@gmail.com","password":"nju765rtghjnbvd345rtghn"}
    const { username, email, password } = req.body;
    const user = new User({ email, username }); //PASSPORT
    const registeredUser = await User.register(user, password); //creates salts and hashes password

    //login after user registers
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message); //"User already registered" for example..
    res.redirect("register");
  }
};

module.exports.loginUser = async (req, res) => {
  //Maybe shouldnt be async?
  req.flash("success", "welcome back!");
  const redirectURL = req.session.returnTo || "/campgrounds"; //Get the url that the user originally wanted
  delete req.session.returnTo;
  res.redirect(redirectURL);
};


module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
};
