//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const Schema = mongoose.Schema;


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Conncting to local mongo database using database named userDB
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema that takes an email and password
const userSchema = new mongoose.Schema({
  fName: { type: String },
  lName: { type: String },
  email: { type: String },
  password: { type: String },
});


// Creating the model using the schema
const User = new mongoose.model("User", userSchema);

// Home Route
app.get("/", function (req, res) {
  res.render("index");
});

// Login Route
app.get("/login", function (req, res) {
  res.render("login");
});

// Register Route
app.get("/register", function (req, res) {
  res.render("register");
});

// Profile Route
app.get("/profile", function (req, res) {
  res.render("profile");
});

// About Route (PAGE NOT IMPLEMENTED YET)
app.get("/about", function (req, res) {
  res.render("about");
});

// Contact Route (PAGE NOT IMPLEMENTED YET)
app.get("/contact", function (req, res) {
  res.render("contact");
});

// Capture from register post request when user submit the register form
app.post("/register", function (req, res) {
  // Creating the new user from user's input in register page
  var newUser = new User({
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.username,
    // Use hash function to hash the password
    password: md5(req.body.password),
  });

  // Save the user to the database
  newUser.save(function (err) {
    // Check for error and print it, else show home page
    if (err) {
      console.log(err);
    } else {
      // Render the homepage
      res.render("home");
    }
  });
});

// Login POST Reqquest
// Take the user's inputs (username and email) and compare against what's in the database
app.post("/login", function (req, res) {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const username = req.body.username;
  // Hash Password 
  const password = md5(req.body.password);

  // See if user's inputted email matches any in the database
  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      // If the user exists in the database, compare to see if the inputted password is matches password in the database
      if (foundUser) {
        // Compare the hased passwords
        if (foundUser.password === password) {
          res.render("home");
        }
      }
    }
  });
});

// Check to see if server is running
app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
