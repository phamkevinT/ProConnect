//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const axios = require("axios");
// bcrypt password hash hunction
const bcrypt = require("bcryptjs");
const saltRounds = 10;

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
app.get("/home", function (req, res) {
  res.render("home");
});

// Profile Route
app.get("/profile", function (req, res) {
  res.render("profile");
});

// About Route
app.get("/about", function (req, res) {
  res.render("about");
});

// Contact Route
app.get("/contact", function (req, res) {
  res.render("contact");
});

// Forgot Password Route
app.get("/forgotPassword", function (req, res) {
  res.render("forgotPassword");
});

// Capture from register post request when user submit the register form
app.post("/register", function (req, res) {
  console.log("got here");

  // bcrypt hashes the password
  // saltRounds is the number of time the password is hashed

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Creating the new user from user's input in register page

    axios
      .post("http://localhost:4000/api/createUser", {
        FirstName: req.body.fName,
        LastName: req.body.lName,
        Email: req.body.username,
        Password: hash,
      })
      .then(
        (response) => {
          console.log(response);
          res.render("home");
        },
        (error) => {
          console.log(error);
        }
      );
  });
});

// Login POST Reqquest
// Take the user's inputs (username and email) and compare against what's in the database
app.post("/login", function (req, res) {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const username = req.body.username;
  const password = req.body.password;

  axios
    .get("http://localhost:4000/api/getOneUserByEmail", {
      params: {
        Email: req.body.username,
      },
    })
    .then(
      (response) => {
        bcrypt.compare(
          password,
          response.data.Password,
          function (err, result) {
            // If true, log the user in and display the home page
            if (result === true) {
              res.render("home");
            }
            // Not true, redirect back to login page
            else {
              res.render("login");
            }
          }
        );
      },
      (error) => {
        res.render("login");
        console.log("user not found");
      }
    );
});

// Check to see if server is running
app.listen(8081, function () {
  console.log("Server started on port 8081.");
});