const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

//Initialize and define mongoose & main function
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then((res) => {
    console.log("Connection Successful to MongoDB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "66bdd142b93ac9bdf08ee03c",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was Initialized");
};

initDB();
