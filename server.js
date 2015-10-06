// BASE SETUP
// ==================================

// CALL PACKAGES --------------------
var express = require('express'); // call express
var app = express(); // define the app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // get morgan - allows logging requests to console
var mongoose = require('mongoose'); // ODM to communicate with MongoDB
var path = require('path');


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

// gives access to variables passed through module.exports() (in config.js)
var config = require('./config')

// DATABASE -------------------------
// connect to database (hosted on modulus.io)

// mongoose.connect('mongodb://<user>:<pass>@apollo.modulusmongo.net:27017/ne8haqaZ')
// *** what is 27017 ???
mongoose.connect(config.database);

// REGISTER ROUTES ------------------
// all routes will be prefixed with /api

var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE
// SEND USERS TO FRONTEND
// has to be registered after API routes, since it should only catch routes not handled by Node
app.get('*', function(req, res){
  console.log("got it");
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ==================================

app.listen(config.port);
console.log('magic happens on port ' + config.port);