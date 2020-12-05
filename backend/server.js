const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const pcRoutes = express.Router();
const bodyParser = require("body-parser");
const {spawn} = require('child_process')
const path = require('path')

var fs = require("fs");

const app = express();
const port = 4000;

const DATABASE_NAME = "sample_analytics";


const { collection } = require('./user.model');
const { stringify } = require('querystring');

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));




app.listen(port, () => {
    const uri = "mongodb+srv://user:OkfGMkxHXu1FouKu@cluster0.jtm8k.mongodb.net/proconnect?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  var db = mongoose.connection
  console.log("MongoDB Connected…")
  usercol = db.collection("users");

  function runSearcEngineScript() {
    return spawn('python', [
      "-u",
      path.join(__dirname, "search_engine.py"),
      uri
    ]);
  }

})
.catch(err => console.log(err))
    console.log('server is running')
    pcRoutes.route('/get');
})

app.post('/users', function (req, res) {
  console.log(req.body);
  res.status(200).send(req.body);
});



/*Routes for getting user information*/

/*Gets a single user from the database by email.
Requires email to be passed as a parameter */
app.get('/api/getOneUserByEmail', (req, res) => {

  console.log("email: " + req.query.Email)
  usercol.findOne({Email: req.query.Email}, function(err, log) {
    if (!log) {
        res.status(404).send("User not found");
    }
    else {
        res.status(200).send(log);

    }
})

})


/*comphrensiveSearch covers all search functionality. Will perform a search based on whatever is passed in the parameters 
(FirstName,LastName, Title, maxHourlyRate, minHourlyRate and skills)*/
app.get('/api/comphrensiveSearch', (req, res) => {

    var str = '{';
    console.log("length: " + str.length)
    if(req.query.FirstName != null)
      str= str + "\"FirstName\": \"" + req.query.FirstName + "\"";
    
    if(req.query.LastName != null)
    {
      if(str.length > 1)
        str = str +",";
      str= str + "\"LastName\": \"" + req.query.LastName + "\"";
    }

    if(req.query.Title != null)
    {
      if(str.length > 1)
        str = str +",";
      str= str + "\"Title\": \"" + req.query.Title + "\"";
    }

    str = str + "}";
  
    console.log(req.query.FirstName);
    usercol.find(JSON.parse(str), {HourlyRate: {$gte: parseFloat(req.query.MinHourlyRate), $lte: parseFloat(req.query.MaxHourlyRate)}}
                  , {Skills: {$all: [req.query.Skills]}}).toArray(function(err, result) {
      if (err) throw err;
      res.status(200).send(result);
      
    });

})

/*Gets an array of users from the database by FirstName.
Requires FirstName to be passed as a parameter */
app.get('/api/getUsersByFirstName', (req, res) => {
  console.log(req.query.FirstName);
  usercol.find({FirstName: req.query.FirstName}).toArray(function(err, result) {
    if (err) throw err;
    res.status(200).send(result);
    console.log(result);
  });
})

/*Gets an array of users from the database by LastName.
Requires LastName to be passed as a parameter */
app.get('/api/getUsersByLastName', (req, res) => {

    console.log(req.query.LastName);
    usercol.find({LastName: req.query.LastName}).toArray(function(err, result) {
      if (err) throw err;
      res.status(200).send(result);
      console.log(result);
    });
})

/*Gets an array of users from the database by FirstName and LastName.
Requires FirstName and LastName to be passed as a parameter */
app.get('/api/getUsersByFullName', (req, res) => {
  usercol.find({FirstName: req.query.FirstName, LastName: req.query.LastName}).toArray(function(err, result) {
    if (err) throw err;
    res.status(200).send(result);
    console.log(result);
  });
})

/*Gets an array of users from the database that fall between a miniumum and a maximium hourly rate.
Requires MinHourlyRate and MaxHourlyRate to be passed as a parameter */
app.get('/api/getUsersByHourlyRate', (req, res) => {
  console.log(req.query.MaxHourlyRate);

  usercol.find({HourlyRate: {$gte: parseFloat(req.query.MinHourlyRate), $lte: parseFloat(req.query.MaxHourlyRate)}}).toArray(function(err, result) {
    if (err) throw err;
    res.status(200).send(result);
    console.log(result);
  });
})

/*Gets an array of users from the database that have a specific skill listed in their skill array.
Requires Skills to be passed as a parameter */
app.get('/api/getUsersBySkill', (req, res) => {
  usercol.find({Skills: {$all: [req.query.Skills]}}).toArray(function(err, result) {
    if (err) throw err;
    res.status(200).send(result);
    console.log(result);
  });
})

/*Gets an array of users from the database that have a specific title.
Requires title to be passed as a parameter */
app.get('/api/getUsersByTitle', (req, res) => {
  console.log(req.query.Title);
  usercol.find({Title: req.query.Title}).toArray(function(err, result) {
    if (err) throw err;
    res.status(200).send(result);
    console.log(result);
  });
})

/*Creates a new user in the database using the information from the registration form. Initializes the non included fields to empty.
Requires FirstName, LastName, Email, Password to be passed as parameters*/
/* */
app.post('/api/createUser', (req, res) => {
     usercol.insertOne( { FirstName: req.body.FirstName,
                          LastName: req.body.LastName,
                          Description: "Write your short description here",
                          Email: req.body.Email,
                          PhoneNumber: "",
                          Resume:"",
                          Title:"",
                          Links:[""],
                          Skills:[""],
                          Experience:"",
                          HourlyRate: 0.00,
                          TotalProjects:"",
                          EnglishLevel:"",
                          Availability:"",
                          Bio:"Write your Bio here",
                          DetailedDescription: "Write your detailed description here",
                          Password: req.body.Password,
                          Image: ""
                        } , function(err, log) {
    if (!log) {
      res.status(400).send("Failed to insert user");
      res.status(400).send(err);

    }
    else {
        res.status(200).send("created user: " + req.body.Email);
    }
}
);


}

)

/*Updates the FirstName field of a user with the given email.
Requires email to be passed as a parameter and FirstName to be passed in body */
app.post('/api/updateFirstName', (req, res) => {
  console.log("Email: " + req.query.Email);
  console.log("first name: " + req.body.FirstName);

  usercol.updateOne({Email: req.query.Email}, {$set: {FirstName: req.body.FirstName}}, function(err, res) {
    if (err) throw err;

    console.log("First name updated");
},
res.status(200).send("First name updated to " + req.body.FirstName))
})

app.post('/api/updateAll', (req, res) => {
  console.log("Email: " + req.body.Email);
  console.log("first name: " + req.body.FirstName);
  

  app.locals.Resume = req.body.resume;
  app.locals.Title = req.body.title;
  app.locals.Experience = req.body.experience;
  app.locals.TotalProjects = req.body.totalprojects;
  app.locals.EnglishLevel = req.body.englishlevel;
  app.locals.Availability = req.body.availability;
  usercol.updateOne({Email: req.body.Email}, {$set: {FirstName: req.body.FirstName, LastName: req.body.LastName, Description: req.body.Description, DetailedDescription: req.body.DetailedDescription, PhoneNumber: req.body.PhoneNumber, Resume: req.body.Resume, Title: req.body.Title, Experience: req.body.Experience, TotalProjects: req.body.TotalProjects, EnglishLevel: req.body.EnglishLevel, Availability: req.body.Availability}}, function(err, res) {
    if (err) throw err;

    console.log("First name updated");
},
res.status(200).send("First name updated to " + req.body.FirstName))
})

/*Updates the LastName field of a user with the given email.


/*Updates the img field of a user with the given Email. 
Requires Email to be passed as a parameter and the image to be passed in body as binary data*/
app.post('/api/updateImage', (req, res) => {
  usercol.updateOne({Email: req.body.Email}, {$set: {Image: req.body.imgData}}, function(err, res) {

  if (err) throw err;

  console.log("img updated");
},
res.status(200).send("image updated"))
})

/*Updates the LastName field of a user with the given email. 
Requires Email to be passed as a parameter and LastName to be passed in body */
app.post('/api/updateLastName', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {LastName: req.body.LastName}}, function(err, res) {
    if (err) throw err;

    console.log("Last name updated");
},
res.status(200).send("Last name updated to " + req.body.LastName))
})

/*Updates the Description field of a user with the given email.
Requires Email to be passed as a parameter and Description to be passed in body */
app.post('/api/updateDescription', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {Description: req.body.Description}}, function(err, res) {
    if (err) throw err;

    console.log("Description updated");
},
res.status(200).send("Description updated to " + req.body.Description))
})

/*Updates the PhoneNumber field of a user with the given email.
Requires Email to be passed as a parameter and PhoneNumber to be passed in body */
app.post('/api/updatePhoneNumber', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {PhoneNumber: req.body.PhoneNumber}}, function(err, res) {
    if (err) throw err;

    console.log("PhoneNumber updated");
},
res.status(200).send("PhoneNumber updated to " + req.body.PhoneNumber))
})

/*Updates the Resume field of a user with the given email.
Requires Email to be passed as a parameter and Resume to be passed in body */
app.post('/api/updateResume', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {Resume: req.body.Resume}}, function(err, res) {
    if (err) throw err;

    console.log("Resume updated");
},
res.status(200).send("Resume updated to " + req.body.Resume))
})

/*Updates the Title field of a user with the given email.
Requires Email to be passed as a parameter and Title to be passed in body */
app.post('/api/updateTitle', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {Title: req.body.Title}}, function(err, res) {
    if (err) throw err;

    console.log("Title updated");
},
res.status(200).send("Title updated to " + req.body.Title))
})

/*Updates a given link in the Links array field of a user with the given Email.
Requires Email and the original link entry to be passed as a parameter and the new link entry to be passed in body */
app.post('/api/UpdateLinks', (req, res) => {

  console.log("link in update Links: " + req.body.OriginalLink)
  console.log;
  usercol.updateOne(
    { Email: req.body.Email, Links: req.body.OriginalLink},
    { $set: { "Links.$" : req.body.NewLink }},function(err, res) {
  if (err) throw err;

    console.log("Links updated");
},
res.status(200).send("Email: " + req.query.Email + " " + "changing " +req.query.OriginalLink + " to" + req.body.NewLink ))
})

/*Appends a given link to the Links array field of a user with the given Email.
Requires Email to be passed as a parameter and the new link entry to be passed in body */
app.post('/api/AppendLinks', (req, res) => {


  
  console.log;
  usercol.updateOne(
    { Email: req.body.Email},
    { $push: { Links : req.body.NewLink }},function(err, res) {
  if (err) throw err;

    console.log("Links updated");
},
res.status(200).send("Added " + req.body.NewLink ))
})

/*Removes a given link in the Links array field of a user with the given Email.
Requires Email to be passed as a parameter and the link entry to be removed to be passed in body */
app.post('/api/DeleteLink', (req, res) => {


  console.log("reched deletelink");
  usercol.updateOne(
    { Email: req.body.Email},
    { $pull: { Links : req.body.RemoveLink }},function(err, res) {
  if (err) throw err;

    console.log("Links updated");
},
res.status(200).send("Removed " + req.body.RemoveLink ))
})

/*Updates a given skill in the Skills array field of a user with the given Email.
Requires Email and the original skill entry to be passed as a parameter and the new skill entry to be passed in body */
app.post('/api/UpdateSkill', (req, res) => {


  console.log("here in skill: " + req.body.NewSkill);
  usercol.updateOne(
    { Email: req.body.Email, Skills: req.body.OriginalSkill},
    { $set: { "Skills.$" : req.body.NewSkill }},function(err, res) {
  if (err) throw err;

    console.log("Skills updated");
},
res.status(200).send("Email: " + req.query.Email + " " + "changing " +req.query.OriginalSkill + " to" + req.body.NewSkill ))
})

/*Appends a given skill to the Skills array field of a user with the given Email.
Requires Email to be passed as a parameter and the new skill entry to be passed in body */
app.post('/api/AppendSkills', (req, res) => {


  console.log;
  usercol.updateOne(
    { Email: req.body.Email},
    { $push: { Skills : req.body.NewSkill }},function(err, res) {
  if (err) throw err;

    console.log("Skills updated");
},
res.status(200).send("Added " + req.body.NewSkill ))
})

/*Removes a given skill in the Skills array field of a user with the given Email.
Requires Email to be passed as a parameter and the skill entry to be removed to be passed in body */
app.post('/api/DeleteSkill', (req, res) => {


  console.log;
  usercol.updateOne(
    { Email: req.body.Email},
    { $pull: { Skills : req.body.RemoveSkill }},function(err, res) {
  if (err) throw err;

    console.log("Skills updated");
},
res.status(200).send("Removed " + req.body.RemoveSkill ))
})

/*Updates the Experience field of a user with the given email.
Requires Email to be passed as a parameter and Experience to be passed in body */
app.post('/api/updateExperience', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {Experience: req.body.Experience}}, function(err, res) {
    if (err) throw err;

    console.log("Experience updated");
},
res.status(200).send("Experience updated to " + req.body.Experience))
})

/*Updates the HourlyRate field of a user with the given email.
Requires Email to be passed as a parameter and HourlyRate to be passed in body as a string */
app.post('/api/updateHourlyRate', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {HourlyRate: parseFloat(req.body.HourlyRate)}}, function(err, res) {
    if (err) throw err;

    console.log("HourlyRate updated");
},
res.status(200).send("HourlY updated to " + req.body.HourlyRate))
})

/*Updates the TotalProjects field of a user with the given email.
Requires Email to be passed as a parameter and TotalProjects to be passed in body */
app.post('/api/updateTotalProjects', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {TotalProjects: req.body.TotalProjects}}, function(err, res) {
    if (err) throw err;

    console.log("TotalProjects updated");
},
res.status(200).send("TotalProjects updated to " + req.body.TotalProjects))
})

/*Updates the EnglishLevel field of a user with the given email.
Requires Email to be passed as a parameter and EnglishLevel to be passed in body */
app.post('/api/updateEnglishLevel', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {EnglishLevel: req.body.EnglishLevel}}, function(err, res) {
    if (err) throw err;

    console.log("EnglishLevel updated");
},
res.status(200).send("EnglishLevel updated to " + req.body.EnglishLevel))
})

/*Updates the Availability field of a user with the given email.
Requires Email to be passed as a parameter and Availability to be passed in body */
app.post('/api/updateAvailability', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {Availability: req.body.Availability}}, function(err, res) {
    if (err) throw err;

    console.log("Availability updated");
},
res.status(200).send("Availability updated to " + req.body.Availability))
})

/*Updates the Bio field of a user with the given email.
Requires Email to be passed as a parameter and Bio to be passed in body */
app.post('/api/updateBio', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {Bio: req.body.Bio}}, function(err, res) {
    if (err) throw err;

    console.log("Bio updated");
},
res.status(200).send("Bio updated to " + req.body.Bio))
})

/*Updates the DetailedDescription field of a user with the given email.
Requires Email to be passed as a parameter and DetailedDescription to be passed in body */
app.post('/api/updateDetailedDescription', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {DetailedDescription: req.body.DetailedDescription}}, function(err, res) {
    if (err) throw err;

    console.log("DetailedDescription updated");
},
res.status(200).send("DetailedDescription updated to " + req.body.DetailedDescription))
})

/*Updates the Email field of a user with the given email.
Requires the original Email to be passed as a parameter and the new Email to be passed in body */
app.post('/api/updateEmail', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {Email: req.body.Email}}, function(err, res) {
    if (err) throw err;

    console.log("Email updated");
},
res.status(200).send("Email updated to " + req.body.Email))
})

/*Updates the Email field of a user with the given email.
Requires the  Email to be passed as a parameter and the new password to be passed in body */
app.post('/api/updatePassword', (req, res) => {


  usercol.updateOne({Email: req.query.Email}, {$set: {Password: req.body.Password}}, function(err, res) {
    if (err) throw err;

    console.log("Password updated");
},
res.status(200).send("Password updated to " + req.body.Password))
})

app.use('/', pcRoutes);
