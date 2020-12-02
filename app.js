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

var fs = require('fs');


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.locals.pressed = 0;
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

              app.locals.EditFirstName =   app.locals.FirstName
              app.locals.EditLastName = app.locals.LastName
              app.locals.EditDescription = app.locals.Description;
              app.locals.EditEmail = app.locals.Email;
              app.locals.EditPhoneNumber = app.locals.PhoneNumber;
              app.locals.EditResume = app.locals.Resume;
              app.locals.EditTitle = app.locals.Title;
              app.locals.EditLinks = app.locals.Links;
              app.locals.EditSkills = app.locals.Skills;
              app.locals.EditExperience = app.locals.Experience;
              app.locals.EditHourlyRate = app.locals.HourlyRate;
              app.locals.EditTotalProjects = app.locals.TotalProjects;
              app.locals.EditEnglishLevel = app.locals.EnglishLevel;
              app.locals.EditAvailability = app.locals.Availability;
              app.locals.EditBio = app.locals.Bio;
              app.locals.EditDetailedDescription = app.locals.DetailedDescription;
              app.locals.EditImage = app.locals.Image;

              app.locals.Editnumskills = app.locals.numskills;
              
              app.locals.Editnumlinks = app.locals.numlinks;
              
              app.locals.EditLinkarr = app.locals.Linkarr;
              app.locals.EditSkillarr = app.locals.Skillarr;

              
  res.render("profile");
});

app.get("/editProfile", function (req, res) {



  res.render("editProfile");
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
          app.locals.FirstName =  req.body.fName;
              app.locals.LastName = req.body.lName;
              app.locals.Description = "Write your short description here";
              app.locals.Email = req.body.username;
              app.locals.PhoneNumber = "";
              app.locals.Resume = "";
              app.locals.Title = "";
              app.locals.Links = [];
              app.locals.Skills = [];
              app.locals.Experience = "";
              app.locals.HourlyRate = "";
              app.locals.TotalProjects = "";
              app.locals.EnglishLevel = "";
              app.locals.Availability = "";
              app.locals.Bio = "";
              app.locals.DetailedDescription = "Write your detailed description here";
              app.locals.Image = "";

              app.locals.Linkarr = [["Add a Link here", "URL goes here"]];
              app.locals.Skillarr = ["Add A skill here"];
              app.locals.numlinks = 1;
              app.locals.numskills = 1;

          res.render("home");
        },
        (error) => {
          console.log(error);
        }
      );
  });
});

app.post("/editProfile", function (req, res) {


  


  
  console.log("the name: " + req.body.fname);

  if(req.body.uploadimage != "no")
  {
    var imageInput = req.body.uploadimage;
    var rawImage = imageInput.split(",");

    app.locals.EditImage = rawImage[1];
  }



  if(req.body.addskill == "no" && req.body.removeskill == "no" && req.body.addlink == "no" && req.body.removelink == "no" && req.body.uploadimage == "no")
  {

    if(app.locals.Image != app.locals.EditImage)
    {
      axios
      .post("http://localhost:4000/api/updateImage", {
        Email: app.locals.Email,
        imgData: app.locals.EditImage
      })

      app.locals.Image = app.locals.EditImage;
    }

      axios
      .post("http://localhost:4000/api/updateAll", {
        FirstName: req.body.fname,
        LastName: req.body.lname,
        Description: req.body.Description,
        PhoneNumber: req.body.phonenumber,
        Resume: req.body.resume,
        Title: req.body.title,
        Experience: req.body.experience,
        TotalProjects: req.body.totalprojects,
        EnglishLevel: req.body.englishlevel,
        Availability: req.body.availability,
        DetailedDescription: req.body.DetailedDescriptionText,

        Email: app.locals.Email
      })
      var i = 0;

      for(; i < app.locals.Editnumskills; i++)
      {
        var skill = eval("req.body.skill" + i); //really would like to change this, but unsure of better alternative right now. skills must be capped to prevent incursions to database
        if(i < app.locals.Skills.length)
        {
          axios
          .post("http://localhost:4000/api/updateSkill", {

            Email: app.locals.Email,
            OriginalSkill: app.locals.Skills[i],
            NewSkill: skill 
          })
        }
        else
        {
          axios
          .post("http://localhost:4000/api/AppendSkills", {

            Email: app.locals.Email,
            NewSkill: skill 
          })
        }
        app.locals.EditSkillarr[i] = skill;
        app.locals.Skillarr[i] = skill;
        app.locals.Skills[i] = skill;
      
      }
      if(i < app.locals.Skills.length)
      {
        for(; i <app.locals.Skills.length; i++)
        {
          console.log("deleted skill: " + app.locals.Skills[i] )
          axios
          .post("http://localhost:4000/api/DeleteSkill", {

            Email: app.locals.Email,
            RemoveSkill: app.locals.Skills[i] 
          })

          app.locals.Skills[i] = "";
        }
      }

      //linkupdates
      var i = 0;

      for(; i < app.locals.Editnumlinks; i++)
      {
        var str1 = eval("req.body.linkname" + i);
        var str2 = eval("req.body.linkurl" + i)
        var link = str1.concat("|", str2); //really would like to change this, but unsure of better alternative right now. skills must be capped to prevent incursions to database
        console.log("link: " + link);
        if(i < app.locals.Links.length)
        {
          axios
          .post("http://localhost:4000/api/updateLinks", {

            Email: app.locals.Email,
            OriginalLink: app.locals.Links[i],
            NewLink: link 
          })
        }
        else
        {
          axios
          .post("http://localhost:4000/api/AppendLinks", {

            Email: app.locals.Email,
            NewLink: link 
          })
        }

        app.locals.Linkarr[i][0] = str1;
        app.locals.Linkarr[i][1] = str2;
      
      }
      if(i < app.locals.Links.length)
      {
        for(; i <app.locals.Links.length; i++)
        {
          console.log("deleted skill: " + app.locals.Links[i] )
          axios
          .post("http://localhost:4000/api/DeleteLink", {

            Email: app.locals.Email,
            RemoveLink: app.locals.Links[i]
          })

          app.locals.Links[i] = "";
        }
      }

      app.locals.FirstName = req.body.fname;
      app.locals.LastName = req.body.lname;
      app.locals.Description = req.body.Description;
      app.locals.Email;
      app.locals.PhoneNumber = req.body.phonenumber;
      app.locals.Resume = req.body.resume;
      app.locals.Title = req.body.title;
      app.locals.Experience = req.body.experience;
      app.locals.TotalProjects = req.body.totalprojects;
      app.locals.EnglishLevel = req.body.englishlevel;
      app.locals.Availability = req.body.availability;
      app.locals.DetailedDescription = req.body.DetailedDescriptionText;

      app.locals.numskills = app.locals.Editnumskills;
      app.locals.numlinks = app.locals.Editnumlinks;
    
    
      res.redirect("/profile");
  }
  else
  {
    app.locals.EditFirstName = req.body.fname;
    app.locals.EditLastName = req.body.lname;
    app.locals.EditDescription = req.body.Description;
    app.locals.EditEmail;
    app.locals.EditPhoneNumber = req.body.phonenumber;
    app.locals.EditResume = req.body.resume;
    app.locals.EditTitle = req.body.title;
    app.locals.EditExperience = req.body.experience;
    app.locals.EditTotalProjects = req.body.totalprojects;
    app.locals.EditEnglishLevel = req.body.englishlevel;
    app.locals.EditAvailability = req.body.availability;
    app.locals.EditDetailedDescription = req.body.DetailedDescriptionText;


        for(var i = 0; i < app.locals.EditLinkarr.length; i++)
        {
          console.log("here in the loop");
          app.locals.EditLinkarr[i][0] = eval("req.body.linkname" + i);
          app.locals.EditLinkarr[i][1] = eval("req.body.linkurl" + i)
        }

        for(var i = 0; i < app.locals.Editnumskills; i++)
        {
          console.log("here in the loop skill is: " + eval("req.body.skill" + i));
          app.locals.EditSkillarr[i] = eval("req.body.skill" + i);
        }


        if(req.body.uploadimage == "no")
        {
        if(req.body.addskill == "yes" || req.body.removeskill == "yes")
        {

          if(req.body.removeskill == "no" && app.locals.numskills < 30)
            app.locals.Editnumskills = app.locals.Editnumskills + 1;
          else if(app.locals.Editnumskills > 0)
            app.locals.Editnumskills = app.locals.Editnumskills - 1;
        }
        else
        {
        if(req.body.removelink == "no"  && app.locals.Editnumlinks < 30)
        {
          app.locals.Editnumlinks = app.locals.Editnumlinks + 1;
          app.locals.EditLinkarr.push(["",""]);

        }
        else if(app.locals.Editnumlinks > 0)
          app.locals.Editnumlinks = app.locals.Editnumlinks - 1;
        }
      }

    res.redirect("/editProfile");
  }
  


});

app.post("/profile", function (req, res) {
  res.redirect("/editProfile");
  console.log("here");
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
              app.locals.FirstName = response.data.FirstName;
              app.locals.LastName = response.data.LastName;
              app.locals.Description = response.data.Description;
              app.locals.Email = response.data.Email;
              app.locals.PhoneNumber = response.data.PhoneNumber;
              app.locals.Resume = response.data.Resume;
              app.locals.Title = response.data.Title;
              app.locals.Links = response.data.Links;
              app.locals.Skills = response.data.Skills;
              app.locals.Experience = response.data.Experience;
              app.locals.HourlyRate = response.data.HourlyRate;
              app.locals.TotalProjects = response.data.TotalProjects;
              app.locals.EnglishLevel = response.data.EnglishLevel;
              app.locals.Availability = response.data.Availability;
              app.locals.Bio = response.data.Bio;
              app.locals.DetailedDescription = response.data.DetailedDescription;
              app.locals.Image = response.data.Image;

              





              app.locals.numskills = response.data.Skills.length;
              
              app.locals.numlinks = app.locals.Links.length;

              app.locals.Linkarr = [];
              
              for(var i = 0; i < app.locals.Links.length; i++)
              {
                app.locals.Linkarr[i] = app.locals.Links[i].split("|");
              }

              app.locals.Skillarr = [];
              for(var i = 0; i < app.locals.Skills.length; i++)
              {
                app.locals.Skillarr[i] = app.locals.Skills[i];
              }
               

              app.locals.Editnumskills = response.data.Skills.length;
              
              app.locals.Editnumlinks = app.locals.Links.length;
              
              app.locals.EditLinkarr = [];
           
              for(var i = 0; i < app.locals.Links.length; i++)
              {
                app.locals.EditLinkarr[i] = app.locals.Links[i].split("|");
              }

              app.locals.EditSkillarr = [];
              for(var i = 0; i < app.locals.Skills.length; i++)
              {
                app.locals.EditSkillarr[i] = app.locals.Skills[i];
              }
             
              
              

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