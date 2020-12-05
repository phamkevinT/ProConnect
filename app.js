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

var cookieParser = require('cookie-parser');


const session = require('express-session')

const {spawn} = require('child_process')
const path = require('path')
var sys = require('util')



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
app.use(session({
  'secret': '343ji43j4n3jn4jk3n'
}))

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
  res.locals = req.session;
  res.render("index");
});

// Login Route
app.get("/login", function (req, res) {
  res.locals = req.session;
  res.render("login");
});

// Register Route
app.get("/register", function (req, res) {
  res.locals = req.session;
  res.render("register");
});

// Profile Route
app.get("/home", function (req, res) {
  res.locals = req.session;

  res.render("home");
});



// Profile Route
app.get("/profile", function (req, res) {
  console.log(req.session.name)
  /*
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
              */

             req.session.EditFirstName =   req.session.FirstName
             req.session.EditLastName = req.session.LastName
             req.session.EditDescription = req.session.Description;
             req.session.EditEmail = req.session.Email;
             req.session.EditPhoneNumber = req.session.PhoneNumber;
             req.session.EditResume = req.session.Resume;
             req.session.EditTitle = req.session.Title;
             req.session.EditLinks = req.session.Links;
             req.session.EditSkills = req.session.Skills;
             req.session.EditExperience = req.session.Experience;
             req.session.EditHourlyRate = req.session.HourlyRate;
             req.session.EditTotalProjects = req.session.TotalProjects;
             req.session.EditEnglishLevel = req.session.EnglishLevel;
             req.session.EditAvailability = req.session.Availability;
             req.session.EditBio = req.session.Bio;
             req.session.EditDetailedDescription = req.session.DetailedDescription;
             req.session.EditImage = req.session.Image;

             req.session.Editnumskills = req.session.numskills;
             
             req.session.Editnumlinks = req.session.numlinks;
             
             req.session.EditLinkarr = req.session.Linkarr;
             req.session.EditSkillarr = req.session.Skillarr;

             res.locals = req.session;

  

              
  res.render("profile");
});


app.get("/viewPost", function (req, res) {
  console.log("postTitle is:" + req.query.postTitle)
  console.log("postContent is:" + req.query.postContent)
  
  
  axios
  .get("http://localhost:3000/api/getComments", {
    params: {
      ParentPost: req.query.postTitle
    },
  })
  .then(
    (response) => {
      res.locals.PostTitle = req.query.postTitle;
      res.locals.postContent = req.query.postContent
      res.locals.posterName = req.query.posterName
      res.locals.postDate = req.query.postDate

      res.locals.comments = response.data;
  
      console.log("Got here")
      res.render("viewPost");
    },
    (error) => {
      console.log(error);
    }
  );


  /*res.locals = req.session;*/

});

app.post("/postComment", function (req, res) {
  res.locals = req.session;
  console.log("post contents" + req.body.postContent)

    axios
      .post("http://localhost:3000/api/createComment", {
        ParentPost: req.body.postTitle,
        Email: req.session.Email,
        Name: req.session.FirstName + " " + req.session.LastName,
        CommentContent: req.body.CommentText
      })
      .then(
        (response) => {
          

          
        },
        (error) => {
          console.log(error);
        }
      );

      axios
      .post("http://localhost:2000/api/updatePost", {
        PostTitle: req.body.postTitle,
      })
      .then(
        (response) => {  
        },
        (error) => {
          console.log(error);
        }
      );

      axios
      .get("http://localhost:3000/api/getComments", {
        params: {
          ParentPost: req.body.postTitle
        },
      })
      .then(
        (response) => {
          res.locals.comments = response.data;

          console.log("Here before the redirect")
          res.redirect("/viewPost?postTitle=" + req.body.postTitle +"&postContent=" + req.body.postContent+"&posterName=" + req.body.posterName +"&postDate=" + req.body.postDate);
        },
        (error) => {
          console.log(error);
        }
      );

  
});

app.post("/newPost", function (req, res) {
  res.locals = req.session;

    axios
      .post("http://localhost:2000/api/createPost", {
        PostTitle: req.body.newpostTitle,
        Email: req.session.Email,
        Name: req.session.FirstName + " " + req.session.LastName,
        PostContent: req.body.postText

      })
      .then(
        (response1) => {

          axios
          .get("http://localhost:2000/api/getPosts", {
            params: {
            },
          })
          .then(
            (response2) => {
              
              res.locals.posts = response2.data;
        
              res.render("messageboard");
            },
            (error) => {
              console.log(error);
            }
          );
          

          
        },
        (error) => {
          console.log(error);
        }
      );



  
});


// Profile Route
app.get("/viewprofile", function (req, res) {
  console.log("email is:" + req.query.email)
  
  axios
  .get("http://localhost:4000/api/getOneUserByEmail", {
    params: {
      Email: req.query.email
    },
  })
  .then(
    (response) => {
      
      res.locals.viewPage = response.data;

      res.render("viewProfile");
    },
    (error) => {
      console.log(error);
    }
  );


  /*res.locals = req.session;*/

});

app.get("/editProfile", function (req, res) {


  res.locals = req.session;
  res.render("editProfile");
});


// About Route
app.get("/about", function (req, res) {
  res.locals = req.session;
  res.render("about");
});

app.get("/messageboard", function (req, res) {
  axios
  .get("http://localhost:2000/api/getPosts", {
    params: {
    },
  })
  .then(
    (response) => {
      
      res.locals.posts = response.data;

      res.render("messageboard");
    },
    (error) => {
      console.log(error);
    }
  );
  res.locals = req.session;
});

// Contact Route
app.get("/contact", function (req, res) {
  res.locals = req.session;
  res.render("contact");
});

// Forgot Password Route
app.get("/forgotPassword", function (req, res) {
  res.locals = req.session;
  res.render("forgotPassword");
});

// Capture from register post request when user submit the register form
app.post("/register", function (req, res) {
  res.locals = req.session;
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
          
              req.session.FirstName =  req.body.fName;
              req.session.LastName = req.body.lName;
              req.session.Description = "Write your short description here";
              req.session.Email = req.body.username;
              req.session.PhoneNumber = "";
              req.session.Resume = "";
              req.session.Title = "";
              req.session.Links = [];
              req.session.Skills = [];
              req.session.Experience = "";
              req.session.HourlyRate = "";
              req.session.TotalProjects = "";
              req.session.EnglishLevel = "";
              req.session.Availability = "";
              req.session.Bio = "";
              req.session.DetailedDescription = "Write your detailed description here";
              req.session.Image = "";

              req.session.Linkarr = [["Add a Link here", "URL goes here"]];
              req.session.Skillarr = ["Add A skill here"];
              req.session.numlinks = 1;
              req.session.numskills = 1;
          
          res.locals = req.session;

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

    req.session.EditImage = rawImage[1];
  }



  if(req.body.addskill == "no" && req.body.removeskill == "no" && req.body.addlink == "no" && req.body.removelink == "no" && req.body.uploadimage == "no")
  {

    if(req.session.Image != req.session.EditImage)
    {
      axios
      .post("http://localhost:4000/api/updateImage", {
        Email: req.session.Email,
        imgData: req.session.EditImage
      })

      req.session.Image = req.session.EditImage;
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

        Email: req.session.Email
      })
      var i = 0;

      for(; i < req.session.Editnumskills; i++)
      {
        var skill = eval("req.body.skill" + i); //really would like to change this, but unsure of better alternative right now. skills must be capped to prevent incursions to database
        if(i < req.session.Skills.length)
        {
          axios
          .post("http://localhost:4000/api/updateSkill", {

            Email: req.session.Email,
            OriginalSkill: req.session.Skills[i],
            NewSkill: skill 
          })
        }
        else
        {
          axios
          .post("http://localhost:4000/api/AppendSkills", {

            Email: req.session.Email,
            NewSkill: skill 
          })
        }
        req.session.EditSkillarr[i] = skill;
        req.session.Skillarr[i] = skill;
        req.session.Skills[i] = skill;
      
      }
      if(i < req.session.Skills.length)
      {
        for(; i <req.session.Skills.length; i++)
        {
          console.log("deleted skill: " + req.session.Skills[i] )
          axios
          .post("http://localhost:4000/api/DeleteSkill", {

            Email: req.session.Email,
            RemoveSkill: req.session.Skills[i] 
          })

          req.session.Skills[i] = "";
        }
      }

      //linkupdates
      var i = 0;

      for(; i < req.session.Editnumlinks; i++)
      {
        var str1 = eval("req.body.linkname" + i);
        var str2 = eval("req.body.linkurl" + i)
        var link = str1.concat("|", str2); //really would like to change this, but unsure of better alternative right now. skills must be capped to prevent incursions to database
        console.log("link: " + link);
        if(i < req.session.Links.length)
        {
          axios
          .post("http://localhost:4000/api/updateLinks", {

            Email: req.session.Email,
            OriginalLink: req.session.Links[i],
            NewLink: link 
          })
        }
        else
        {
          axios
          .post("http://localhost:4000/api/AppendLinks", {

            Email: req.session.Email,
            NewLink: link 
          })
        }

        console.log("I: " + i)
        console.log(req.session.Linkarr.length);
        if(i < req.session.Linkarr.length)
        {
          req.session.Linkarr[i][0] = str1;
          req.session.Linkarr[i][1] = str2;
        }
        else
        {
          req.session.Linkarr.push([str1,str2]);

        }
      
      }
      if(i < req.session.Links.length)
      {
        for(; i <req.session.Links.length; i++)
        {
          console.log("deleted skill: " + req.session.Links[i] )
          axios
          .post("http://localhost:4000/api/DeleteLink", {

            Email: req.session.Email,
            RemoveLink: req.session.Links[i]
          })

          req.session.Links[i] = "";
        }
      }

      req.session.FirstName = req.body.fname;
      req.session.LastName = req.body.lname;
      req.session.Description = req.body.Description;
      req.session.Email;
      req.session.PhoneNumber = req.body.phonenumber;
      req.session.Resume = req.body.resume;
      req.session.Title = req.body.title;
      req.session.Experience = req.body.experience;
      req.session.TotalProjects = req.body.totalprojects;
      req.session.EnglishLevel = req.body.englishlevel;
      req.session.Availability = req.body.availability;
      req.session.DetailedDescription = req.body.DetailedDescriptionText;

      req.session.numskills = req.session.Editnumskills;
      req.session.numlinks = req.session.Editnumlinks;
    
      res.locals = req.session;
      res.redirect("/profile");
  }
  else
  {
    req.session.EditFirstName = req.body.fname;
    req.session.EditLastName = req.body.lname;
    req.session.EditDescription = req.body.Description;
    req.session.EditEmail;
    req.session.EditPhoneNumber = req.body.phonenumber;
    req.session.EditResume = req.body.resume;
    req.session.EditTitle = req.body.title;
    req.session.EditExperience = req.body.experience;
    req.session.EditTotalProjects = req.body.totalprojects;
    req.session.EditEnglishLevel = req.body.englishlevel;
    req.session.EditAvailability = req.body.availability;
    req.session.EditDetailedDescription = req.body.DetailedDescriptionText;


        for(var i = 0; i < req.session.EditLinkarr.length; i++)
        {
          console.log("here in the loop");
          req.session.EditLinkarr[i][0] = eval("req.body.linkname" + i);
          req.session.EditLinkarr[i][1] = eval("req.body.linkurl" + i)
        }

        for(var i = 0; i < req.session.Editnumskills; i++)
        {
          console.log("here in the loop skill is: " + eval("req.body.skill" + i));
          req.session.EditSkillarr[i] = eval("req.body.skill" + i);
        }


        if(req.body.uploadimage == "no")
        {
          console.log("into the conditional");
          console.log(req.session.Editnumlinks);
        if(req.body.addskill == "yes" || req.body.removeskill == "yes")
        {

          if(req.body.removeskill == "no" && req.session.numskills < 30)
            req.session.Editnumskills = req.session.Editnumskills + 1;
          else if(req.session.Editnumskills > 0)
            req.session.Editnumskills = req.session.Editnumskills - 1;
        }
        else
        {
        if(req.body.removelink == "no"  && req.session.Editnumlinks < 30)
        {
          req.session.Editnumlinks = req.session.Editnumlinks + 1;
          req.session.EditLinkarr.push(["",""]);

        }
        else if(req.session.Editnumlinks > 0)
          req.session.Editnumlinks = req.session.Editnumlinks - 1;
        }
      }

      

      res.locals = req.session;

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
              req.session.FirstName = response.data.FirstName;
              req.session.LastName = response.data.LastName;
              req.session.Description = response.data.Description;
              req.session.Email = response.data.Email;
              req.session.PhoneNumber = response.data.PhoneNumber;
              req.session.Resume = response.data.Resume;
              req.session.Title = response.data.Title;
              req.session.Links = response.data.Links;
              req.session.Skills = response.data.Skills;
              req.session.Experience = response.data.Experience;
              req.session.HourlyRate = response.data.HourlyRate;
              req.session.TotalProjects = response.data.TotalProjects;
              req.session.EnglishLevel = response.data.EnglishLevel;
              req.session.Availability = response.data.Availability;
              req.session.Bio = response.data.Bio;
              req.session.DetailedDescription = response.data.DetailedDescription;
              req.session.Image = response.data.Image;

              





              req.session.numskills = response.data.Skills.length;
              
              req.session.numlinks = req.session.Links.length;

              req.session.Linkarr = [];
              
              console.log(req.session.Linkarr.length);
              for(var i = 0; i < req.session.Links.length; i++)
              {
                req.session.Linkarr[i] = req.session.Links[i].split("|");
              }

              req.session.Skillarr = [];
              for(var i = 0; i < req.session.Skills.length; i++)
              {
                req.session.Skillarr[i] = req.session.Skills[i];
              }
               

              req.session.Editnumskills = response.data.Skills.length;
              
              req.session.Editnumlinks = req.session.Links.length;
              
              req.session.EditLinkarr = [];
           
              for(var i = 0; i < req.session.Links.length; i++)
              {
                req.session.EditLinkarr[i] = req.session.Links[i].split("|");
              }

              req.session.EditSkillarr = [];
              for(var i = 0; i < req.session.Skills.length; i++)
              {
                req.session.EditSkillarr[i] = req.session.Skills[i];
              }
             
              
              req.session.name = req.body.username;
              console.log(req.session.name) 


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

  console.log('Searching for ' + req.query.search);
  nameArr =  req.query.search.split(" ");
  console.log("test field: " + req.query.Description);

  console.log(`Searching for ${req.query.search}`);
  const query = req.body.search;


  /** run Python script containing the search engine; issue with data sent is still apparent; once fixed comprehensiveSearch will be replaced,
   * and search_engine.py will be enhanced to perform more efficiently
   */
/*
  let pyProcess = spawn('python', [path.join(__dirname, "./search_engine.py"),
    query]);

    pyProcess.stdin.setEncoding('utf8');

    pyProcess.stdout.on('data', function(data){
      console.log(`Got result from ${result}: ${data}`);
      res.locals.results = data;
    });

    //close the child_process stream used
    pyProcess.on('close', (code) => {
      console.log(`Closing child process for Python with code ${code}`);
      
    });

    */

  axios
    .get("http://localhost:4000/api/comphrensiveSearch", {
        params: {
          FirstName: nameArr[0],
          LastName: nameArr[1]
        },
    })
    .then(
      (response) => {
        console.log(response.data[0])
        res.locals.results = response;
        res.render("results");
      },
      (error) => {
        console.log("No results");
      }
    );
  
});
// Check to see if server is running
app.listen(8081, function () {
  console.log("Server started on port 8081.");
});
