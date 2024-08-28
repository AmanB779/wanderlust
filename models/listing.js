const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); //require for listing middleware

//Listing Schema
const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: {
    filename: String,
    url: String,
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: { type: [Number], required: true },
  },
});

//Listings Middleware for deletion
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

//Listings Collection
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
