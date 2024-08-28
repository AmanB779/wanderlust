const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route Controller
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

//New Route Controller
module.exports.renderNewForm = async (req, res) => {
  console.log(req.user);
  res.render("./listings/new.ejs");
};

//Show Route Controller
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  } else res.render("./listings/show.ejs", { listing });
};

//Create Route Controller
module.exports.createListing = async (req, res) => {
  //Map Geocoding
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "---", filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { filename, url };
  newListing.geometry = response.body.features[0].geometry;
  let savedlisting = await newListing.save();
  console.log(savedlisting);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//Edit Route Controller
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/r_8,ar_1.2,h_220,w_350,bo_2px_solid_lightcoral"
  );
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

//Update Route Controller
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const updateData = req.body.listing;
  console.log(req.body.listing);
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //set is used to update only specific objects not creating a whole new document and deleting the existing one like ... spread operator
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { filename, url };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

//Delete Route Controller
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect(`/listings`);
};
