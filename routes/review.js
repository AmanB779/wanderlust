const express = require("express");
const router = express.Router({ mergeParams: true }); //using mergeParams to use parent body params from app.js
const wrapAsync = require("../utils/wrapAsync.js"); //Handler for async error handling
const reviewController = require("../controllers/reviews.js");
const {
  isLoggedIn,
  isReviewAuthor,
  validateReview,
} = require("../middleware.js");

//Rewiews Create Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Reviews Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
