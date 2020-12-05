const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const pcRoutes = express.Router();
const bodyParser = require("body-parser");
const {spawn} = require('child_process')
const path = require('path')

var fs = require("fs");

const app = express();
const port = 3000;

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
  usercol = db.collection("comments");



})
.catch(err => console.log(err))
    console.log('server is running on ' + port)
    pcRoutes.route('/get');
})


app.post('/api/createComment', (req, res) => {

  usercol.insertOne( {
                          ParentPost: req.body.ParentPost,
                          CommentTime: new Date(),
                          CommenterEmail:req.body.Email,
                          CommenterName: req.body.Name,
                          CommentContent: req.body.CommentContent
                     } , function(err, log) {
 if (!log) {
   res.status(400).send("create comment");
   res.status(400).send(err);

 }
 else {
     res.status(200).send("created comment: " + req.body.Email);
 }
}
);


}

)

app.get('/api/getComments', (req, res) => {

  usercol.find({ParentPost: req.query.ParentPost}).toArray(function(err, result) {
    if (err) throw err;
    res.status(200).send(result);
  });
})




app.use('/', pcRoutes);
