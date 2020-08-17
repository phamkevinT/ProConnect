const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
// app.use('/users', [ROUTER_NAME]); variable ROUTER_NAME must contain value "express.Router()" 

//Done so to not get DeprecationWarnings
mongoose.connect('mongodb://127.0.0.1:27017/todos', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const connection = mongoose.connection;

// once() ensures that an event will be called only once
// on() ensures that an event will be called every time that it occurs <-- might be something to use
connection.once('open', function() {
  console.log("MongoDB database connection established successfully");
});

/*
 Any Rest CRUD operations will be implemented using the route() and get()/post()/add()/delete() functions subsequently
 Ex: [expressRouterName].route([some URL]).get(function(req, res) { 
    statements... 
  });
*/

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
