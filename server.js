// BASE SETUP
// ==================================

var User = require('./app/models/user');

// CALL PACKAGES --------------------
var express = require('express'); // call express
var app = express(); // define the app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // get morgan - allows logging requests to console
var mongoose = require('mongoose'); // ODM to communicate with MongoDB
var port = process.env.PORT || 8080; // set the port

// APP CONFIGURATION ----------------
// body-parser to grab information from POST requests

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use( function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 
    'X-Requested-With,content-type, \Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// DATABASE -------------------------
// connect to database (hosted on modulus.io)

// mongoose.connect('mongodb://<user>:<pass>@apollo.modulusmongo.net:27017/ne8haqaZ')
// *** what is 27017 ???
mongoose.connect('mongodb://localhost:27017/mean-crm-api-db')


// ROUTES FOR OUR API
// ==================================

// basic route for the home page
app.get('/', function(req, res){
  res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res){
  res.json({ message: 'welcome to the api'});
});

// insert more routes HERE

// REGISTER ROUTES ----------------
// all routes will be prefixed with /api

app.use('/api', apiRouter);

// START THE SERVER
// ==================================

app.listen(port);
console.log('magic happens on port ' + port);