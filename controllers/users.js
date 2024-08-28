const User = require("../models/user.js"); //require user model

//Register User Controller
module.exports.renderSignUpForm = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (error) => {
      if (error) {
        return next(error);
      } else {
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      }
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

//Show Login Controller
module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

//Login Route Controller
module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust! You are logged in!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//Logout Route Controller
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // If there’s an error during logout, pass it to the error handler
    }
  });
  req.flash("success", "You are logged out!");
  res.redirect("/listings");
};
