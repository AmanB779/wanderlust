const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); //Handler for async error handling
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer"); //require multer for multipart/form data parsing
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //set multer destination for saving files now online storage

//Index Route
//Create Route
router.route("/").get(wrapAsync(listingController.index)).post(
  isLoggedIn,

  upload.single("listing[image]"),
  wrapAsync(listingController.createListing)
);

//New Route
//To be written before to remove conflict with show route(parsing /new as id issue)
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

//Show Route
//Update Route
//Delete Route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
