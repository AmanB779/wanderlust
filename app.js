//.env file require and config
//if not on production use .env file
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//Require node packages express, mongoose, path
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const dbUrl = process.env.ATLASDB_URL;
const path = require("path"); //to set ejs
const methodOverride = require("method-override");
const session = require("express-session"); //require express session
const MongoStore = require("connect-mongo"); //for mongo session after express session
const flash = require("connect-flash"); //require connect flash
const ejsMate = require("ejs-mate"); //to make new layouts and templates
const ExpressError = require("./utils/ExpressError.js"); //Handler for custom async error handling
const listingRouter = require("./routes/listing.js"); //require listing from router
const reviewRouter = require("./routes/review.js"); //require review from router
const passport = require("passport"); //require passport
const LocalStrategy = require("passport-local"); //require passport-statergy
const User = require("./models/user.js"); //require user model
const userRouter = require("./routes/user.js"); //require user from router

// set mongo session and options before any paths
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE ", err);
});

// set express session and options before any paths
const sessionOptions = {
  store, //get mongo session store
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: "/",
    httpOnly: true,
    secure: false,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //From today milisec * sec * min * hour * days
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

//Using public folder for styles and js
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.use(session(sessionOptions)); //use session with session options
app.use(flash()); //use flash
app.use(passport.initialize()); //Initialize passport
app.use(passport.session()); //Initialize passport session
passport.use(new LocalStrategy(User.authenticate())); //Create new local strategy and authenticate users using authenticate menthod
//used to store/unstore(serial/deserial) user related info from session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting up views, engine etc
app.set("views", path.join(__dirname, "views")); //to set and use views folder
app.set("view engine", "ejs"); //to set ejs
app.engine("ejs", ejsMate); //to set ejsMate for boilerplate templating

//Initialize and define mongoose & main function
main()
  .then((res) => {
    console.log("Connection Successful to MongoDB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

//Root directory
// app.get("/", (req, res) => {
//   res.send(`Root is working`);
// });

//Flash messages middleware to access the msgs
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeuser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });
//   let registeredUser = await User.register(fakeuser, "helloworld");
//   res.send(registeredUser);
// });

//Router Routes after the flash
app.use("/listings", listingRouter); //use router for listings
app.use("/listings/:id/reviews", reviewRouter); //use router for reviews
app.use("/", userRouter); //use router for users

//404 Page not found middleware error handler
app.all("*", (req, res, next) => {
  return next(new ExpressError(404, "Page Not Found!"));
});

//Middleware error handeling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Someting Went Wrong!" } = err;
  res.status(statusCode).render("./listings/error.ejs", { err });
  // res.status(statusCode).send(message);
});

//Initialize the server at localhost:8080
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
