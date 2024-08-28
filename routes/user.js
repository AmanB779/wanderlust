const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router(); //using mergeParams to use parent body params from app.js
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//Show Sign Up Route
//Register User Route
router
  .route("/signup")
  .get((req, res) => {
    res.render("./users/signup.ejs");
  })
  .post(wrapAsync(userController.renderSignUpForm));

//Show Login Route
//Login User Route
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );

//Logout User Route
router.get("/logout", userController.logout);

module.exports = router;
