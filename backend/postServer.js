const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const pcRoutes = express.Router();
const bodyParser = require("body-parser");
const {spawn} = require('child_process')
const path = require('path')

var fs = require("fs");

const app = express();
const port = 2000;

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
  usercol = db.collection("posts");



})
.catch(err => console.log(err))
    console.log('server is running on ' + port)
    pcRoutes.route('/get');
})

app.post('/users', function (req, res) {
  console.log(req.body);
  res.status(200).send(req.body);
});

app.post('/api/createPost', (req, res) => {
  usercol.insertOne( {
                          PostTitle: req.body.PostTitle,
                          PostTime: new Date(),
                          PosterEmail:req.body.Email,
                          PosterName: req.body.Name,
                          PostContent: req.body.PostContent,
                          NumberComments:0
                     } , function(err, log) {
 if (!log) {
   res.status(400).send("create post");
   res.status(400).send(err);

 }
 else {
     res.status(200).send("created user: " + req.body.Email);
 }
}
);


}

)

app.get('/api/getPosts', (req, res) => {
  usercol.find({}).toArray(function(err, result) {
    if (err) throw err;
    res.status(200).send(result);
    console.log(result);
  });
})



app.get('/api/getPosts', (req, res) => {
  usercol.find({}).toArray(function(err, result) {
    if (err) throw err;
    res.status(200).send(result);
    console.log(result);
  });
})

app.post('/api/updatePost', (req, res) => {


  usercol.updateOne({PostTitle: req.body.PostTitle}, {$inc: {NumberComments: 1}}, function(err, res) {
    if (err) throw err;

    console.log("First name updated");
},
res.status(200).send("First name updated to " + req.body.PostTitle))
})


app.use('/', pcRoutes);
