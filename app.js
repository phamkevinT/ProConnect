//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const axios = require("axios");
// bcrypt password hash hunction
const bcrypt = require("bcrypt");
const saltRounds = 10;

//to run Python file for search engine and dealing with it
const {spawn} = require('child_process')
const path = require('path')
var sys = require('util')

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
        Username: req.body.username,
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
    .get("http://localhost:4000/api/getOneUserByUsername", {
      params: {
        Username: req.body.username,
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

app.get("/results", function (req, res) {

  console.log(`Searching for ${req.query.search}`);


  //run Python script containing the search engine

  let pyProcess = spawn('python', [path.join(__dirname, "./backend/search_engine.py"),
    req.query.search]);

  pyProcess.stdin.setEncoding('utf8');

  pyProcess.stdout.on('data', function(data){

    if(data === undefined){
      console.log(`${req.query.search} not found!`);
      res.render("no-results");
    }
    else{
      console.log(`${req.query.search} found!`);
      res.locals.results = data;
      res.render("results");
    }
  });

    //close the child_process stream used
  pyProcess.on('close', (code) => {
    console.log(`Closing child process for Python with code ${code}`);
  });

 /* For backup
  axios
    .get("http://localhost:4000/api/comphrensiveSearch", {
        params: {
          SearchQuery: req.body.search,
        },
    })
    .then(
      (response) => {
        res.locals.results = response;
        console.log(typeof res.locals.results)
        res.render("results");
      },
      (error) => {
        console.log("No results");
      }
    );
  */

});

// Check to see if server is running
app.listen(3000, function () {
  console.log("Server started on port 3000.");
});
